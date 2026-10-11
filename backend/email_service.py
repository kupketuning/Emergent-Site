"""Transaktionale E-Mails (Rechnung, Versandlabel, Packzettel) über den Emergent-Mail-Proxy."""
import os
import re
import ipaddress
import logging
from html import escape
from html.parser import HTMLParser
from urllib.parse import urlparse

import httpx
from dotenv import load_dotenv
from pathlib import Path

load_dotenv(Path(__file__).parent / '.env')
logger = logging.getLogger(__name__)

EMAIL_BASE_URL = "https://integrations.emergentagent.com"
EMAIL_KEY = os.environ["EMERGENT_EMAIL_KEY"]
EMAIL_FROM_NAME = os.environ["EMAIL_FROM_NAME"]
WAREHOUSE_EMAIL = os.environ.get("WAREHOUSE_EMAIL")
ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL")

_SHORTENERS = ("bit.ly", "tinyurl.com", "t.co", "is.gd", "cutt.ly", "goo.gl", "rebrand.ly")
_CRED_ASK = ("reply with your password", "reply with the code", "send your password", "cvv",
             "send us your password", "enter your password below", "confirm your card number",
             "your full card number", "seed phrase", "recovery phrase", "verify your card",
             "social security number", "confirm your bank details")
_HOSTISH = re.compile(r"\b(?:https?://)?((?:[a-z0-9-]+\.)+[a-z]{2,})", re.I)


def _host_ok(host: str) -> bool:
    if not host or "xn--" in host:
        return False
    try:
        ipaddress.ip_address(host)
        return False
    except ValueError:
        pass
    return not any(host == s or host.endswith("." + s) for s in _SHORTENERS)


def _same_site(shown: str, real: str) -> bool:
    return shown == real or real.endswith("." + shown) or shown.endswith("." + real)


class _EmailScan(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tags, self.urls, self.anchors = set(), [], []
        self._href, self._text = None, []

    def handle_starttag(self, tag, attrs):
        self.tags.add(tag.lower())
        self.urls += [v for k, v in attrs if k.lower() in ("href", "src") and v]
        if tag.lower() == "a":
            self._href = dict((k.lower(), v) for k, v in attrs).get("href")
            self._text = []

    def handle_data(self, data):
        if self._href is not None:
            self._text.append(data)

    def handle_endtag(self, tag):
        if tag.lower() == "a" and self._href is not None:
            self.anchors.append((self._href, "".join(self._text)))
            self._href, self._text = None, []


def _assert_safe_email(subject: str, html: str) -> None:
    scan = _EmailScan(); scan.feed(html)
    if scan.tags & {"form", "input", "textarea", "select"}:
        raise ValueError("Keine Formulare/Eingabefelder in E-Mails erlaubt (G2)")
    body = f"{subject}\n{html}".lower()
    for p in _CRED_ASK:
        if p in body:
            raise ValueError(f"E-Mail fragt nach Zugangsdaten: {p!r} (G2)")
    for url in scan.urls:
        low = url.strip().lower()
        if low.startswith(("mailto:", "tel:", "cid:", "#")):
            continue
        if not low.startswith("https://"):
            raise ValueError(f"Links/Assets müssen absolute https-URLs sein: {url!r} (G3)")
        host = urlparse(low).hostname or ""
        if not _host_ok(host) or urlparse(low).username is not None:
            raise ValueError(f"Ungültige URL: {url!r} (G3)")
    for href, text in scan.anchors:
        real = urlparse(href.strip().lower()).hostname or ""
        if not real:
            continue
        for m in _HOSTISH.finditer(text):
            if not _same_site(m.group(1).lower(), real):
                raise ValueError(f"Linktext {m.group(1)!r} ≠ echter Link-Host {real!r} (G3)")


async def send_email(*, to: str, subject: str, html: str, reply_to: str | None = None) -> str | None:
    _assert_safe_email(subject, html)
    payload = {"to": [to], "subject": subject, "html": html, "from_name": EMAIL_FROM_NAME}
    if reply_to:
        payload["contact_email"] = reply_to
    try:
        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.post(
                f"{EMAIL_BASE_URL}/api/v1/email/send",
                headers={"X-Email-Key": EMAIL_KEY},
                json=payload,
            )
        resp.raise_for_status()
        return resp.json().get("id")
    except httpx.HTTPStatusError as e:
        logger.error(f"E-Mail-Versand fehlgeschlagen: {e.response.status_code} {e.response.text}")
    except Exception as e:
        logger.error(f"E-Mail-Versand-Fehler: {str(e)}")
    return None


def _layout(title_html: str, body_html: str) -> str:
    return (
        '<table role="presentation" width="100%" style="background:#f4f5f7;padding:24px 0">'
        '<tr><td align="center">'
        '<table role="presentation" width="560" style="background:#ffffff;border-radius:8px;overflow:hidden;'
        'font-family:Arial,Helvetica,sans-serif;color:#17191d">'
        '<tr><td style="background:#17191d;padding:20px 28px">'
        '<span style="color:#ffffff;font-size:18px;font-weight:bold;letter-spacing:0.5px">KUPKE TUNING</span></td></tr>'
        f'<tr><td style="padding:28px 28px 8px 28px">{title_html}</td></tr>'
        f'<tr><td style="padding:0 28px 28px 28px;font-size:14px;line-height:1.6">{body_html}</td></tr>'
        '<tr><td style="background:#f4f5f7;padding:16px 28px;font-size:11px;color:#8a8f98">'
        f'Diese E-Mail wurde automatisch von {escape(EMAIL_FROM_NAME)} versendet. '
        'Wir fragen niemals per E-Mail nach Passwörtern oder Zahlungsdaten.</td></tr>'
        '</table></td></tr></table>'
    )


def _button(url: str, label: str) -> str:
    return (f'<a href="{escape(url, quote=True)}" style="display:inline-block;background:#E63946;color:#ffffff;'
            'text-decoration:none;padding:12px 22px;border-radius:6px;font-weight:bold;font-size:14px">'
            f'{escape(label)}</a>')


async def send_invoice_email(*, to: str, customer_name: str, order_number: str,
                              invoice_number: str, pdf_url: str) -> str | None:
    title = '<h2 style="margin:0;font-size:20px">Ihre Rechnung ist da</h2>'
    body = (
        f'<p>Hallo {escape(customer_name) or "liebe Kundin, lieber Kunde"},</p>'
        f'<p>vielen Dank für Ihre Bestellung <strong>{escape(order_number)}</strong> bei Kupke Tuning. '
        f'Ihre Rechnung <strong>{escape(invoice_number)}</strong> steht als PDF zum Download bereit:</p>'
        f'<p style="margin:20px 0">{_button(pdf_url, "Rechnung herunterladen")}</p>'
        '<p>Ihre Bestellung wird nun für den Versand vorbereitet. Sie erhalten eine weitere E-Mail, '
        'sobald das Paket auf den Weg gebracht wurde.</p>'
    )
    return await send_email(to=to, subject=f"Ihre Rechnung {invoice_number} – Kupke Tuning",
                             html=_layout(title, body))


async def send_shipping_label_email(*, to: str, customer_name: str, order_number: str,
                                     label_url: str) -> str | None:
    title = '<h2 style="margin:0;font-size:20px">Ihre Bestellung ist versandbereit</h2>'
    body = (
        f'<p>Hallo {escape(customer_name) or "liebe Kundin, lieber Kunde"},</p>'
        f'<p>Ihre Bestellung <strong>{escape(order_number)}</strong> wurde für den Versand mit Hermes '
        'vorbereitet. Das Versandlabel finden Sie hier zum Nachverfolgen/Archivieren:</p>'
        f'<p style="margin:20px 0">{_button(label_url, "Versandlabel ansehen")}</p>'
        '<p>Vielen Dank für Ihren Einkauf bei Kupke Tuning!</p>'
    )
    return await send_email(to=to, subject=f"Versandbereit: Bestellung {order_number} – Kupke Tuning",
                             html=_layout(title, body))


async def send_packing_slip_email(*, order_number: str, packing_slip_url: str) -> str | None:
    if not WAREHOUSE_EMAIL:
        logger.error("WAREHOUSE_EMAIL nicht konfiguriert – Packzettel-Mail nicht versendet")
        return None
    title = '<h2 style="margin:0;font-size:20px">Neuer Packzettel</h2>'
    body = (
        f'<p>Für Bestellung <strong>{escape(order_number)}</strong> wurde ein Versandlabel erstellt. '
        'Bitte Paket anhand des Packzettels kommissionieren:</p>'
        f'<p style="margin:20px 0">{_button(packing_slip_url, "Packzettel öffnen")}</p>'
    )
    return await send_email(to=WAREHOUSE_EMAIL, subject=f"Packzettel – Bestellung {order_number}",
                             html=_layout(title, body))


async def send_password_reset_email(*, to: str, name: str, reset_link: str) -> str | None:
    title = '<h2 style="margin:0;font-size:20px">Passwort zurücksetzen</h2>'
    body = (
        f'<p>Hallo {escape(name) or ""},</p>'
        '<p>für Ihr Konto bei Kupke Tuning wurde ein neues Passwort angefordert. '
        'Klicken Sie auf den folgenden Link, um ein neues Passwort zu vergeben. '
        'Der Link ist 1 Stunde gültig:</p>'
        f'<p style="margin:20px 0">{_button(reset_link, "Neues Passwort vergeben")}</p>'
        '<p>Falls Sie diese Anfrage nicht gestellt haben, können Sie diese E-Mail ignorieren – '
        'Ihr Passwort bleibt unverändert.</p>'
    )
    return await send_email(to=to, subject="Passwort zurücksetzen – Kupke Tuning", html=_layout(title, body))


async def send_welcome_email(*, to: str, name: str) -> str | None:
    title = '<h2 style="margin:0;font-size:20px">Willkommen bei Kupke Tuning!</h2>'
    body = (
        f'<p>Hallo {escape(name) or ""},</p>'
        '<p>schön, dass Sie sich ein Konto bei Kupke Tuning angelegt haben. '
        'In Ihrem Konto finden Sie ab jetzt Ihre Bestellhistorie, Rechnungen und den Versandstatus '
        'auf einen Blick.</p>'
    )
    return await send_email(to=to, subject="Willkommen bei Kupke Tuning", html=_layout(title, body))


async def send_support_request_admin_email(*, order_number: str, customer_email: str,
                                           category: str, message: str) -> str | None:
    if not ADMIN_EMAIL:
        logger.error("ADMIN_EMAIL nicht konfiguriert – Support-Anfrage-Mail nicht versendet")
        return None
    title = '<h2 style="margin:0;font-size:20px">Neue Support-Anfrage</h2>'
    body = (
        f'<p>Zu Bestellung <strong>{escape(order_number)}</strong> von {escape(customer_email)} '
        f'ist eine neue Anfrage eingegangen (Kategorie: <strong>{escape(category)}</strong>):</p>'
        f'<p style="background:#f4f5f7;border-radius:6px;padding:14px;white-space:pre-line">{escape(message)}</p>'
        '<p>Bitte im Admin-Bereich unter „Support" beantworten.</p>'
    )
    return await send_email(to=ADMIN_EMAIL, subject=f"Support-Anfrage – Bestellung {order_number}",
                             html=_layout(title, body))


async def send_support_reply_email(*, to: str, name: str, order_number: str, reply: str) -> str | None:
    title = '<h2 style="margin:0;font-size:20px">Antwort zu Ihrer Anfrage</h2>'
    body = (
        f'<p>Hallo {escape(name) or ""},</p>'
        f'<p>zu Ihrer Anfrage betreffend Bestellung <strong>{escape(order_number)}</strong> haben wir '
        'geantwortet:</p>'
        f'<p style="background:#f4f5f7;border-radius:6px;padding:14px;white-space:pre-line">{escape(reply)}</p>'
    )
    return await send_email(to=to, subject=f"Antwort zu Ihrer Anfrage – Bestellung {order_number}",
                             html=_layout(title, body))


async def send_cancellation_notice(*, order_number: str, customer_email: str) -> None:
    title = '<h2 style="margin:0;font-size:20px">Widerruf angefordert</h2>'
    body = (
        f'<p>Der Kunde <strong>{escape(customer_email)}</strong> hat die Bestellung '
        f'<strong>{escape(order_number)}</strong> widerrufen. Bitte Rücksendelabel vorbereiten und '
        'im Admin-Bereich hochladen.</p>'
    )
    html = _layout(title, body)
    for to in (ADMIN_EMAIL, WAREHOUSE_EMAIL):
        if to:
            await send_email(to=to, subject=f"Widerruf – Bestellung {order_number}", html=html)


async def send_return_label_email(*, to: str, customer_name: str, order_number: str,
                                   label_url: str) -> str | None:
    title = '<h2 style="margin:0;font-size:20px">Ihr Rücksendelabel</h2>'
    body = (
        f'<p>Hallo {escape(customer_name) or ""},</p>'
        f'<p>für Ihren Widerruf zu Bestellung <strong>{escape(order_number)}</strong> steht das '
        'Hermes-Rücksendelabel bereit:</p>'
        f'<p style="margin:20px 0">{_button(label_url, "Rücksendelabel öffnen")}</p>'
        '<p>Bitte ausdrucken und dem Paket beilegen.</p>'
    )
    return await send_email(to=to, subject=f"Ihr Rücksendelabel – Bestellung {order_number}",
                             html=_layout(title, body))


async def send_phone_order_email(*, to: str, name: str, order_number: str, items_summary: str,
                                  total_gross: float, confirm_link: str, lead_time_text: str = "") -> str | None:
    title = '<h2 style="margin:0;font-size:20px">Ihre Bestellung bei Kupke Tuning</h2>'
    lead_html = (f'<p style="color:#6b7280;font-size:13px">Lieferung: {escape(lead_time_text)}</p>'
                 if lead_time_text else '')
    body = (
        f'<p>Hallo {escape(name) or ""},</p>'
        f'<p>wie telefonisch besprochen haben wir Ihre Bestellung <strong>{escape(order_number)}</strong> '
        'vorbereitet:</p>'
        f'<p style="background:#f4f5f7;border-radius:6px;padding:14px;white-space:pre-line">{escape(items_summary)}</p>'
        f'{lead_html}'
        f'<p><strong>Gesamtbetrag: {total_gross:.2f} €</strong></p>'
        '<p>Bitte bestätigen Sie die Bestellung und schließen Sie die Zahlung ab:</p>'
        f'<p style="margin:20px 0">{_button(confirm_link, "Bestellung bestätigen & bezahlen")}</p>'
    )
    return await send_email(to=to, subject=f"Bitte bestätigen: Bestellung {order_number} – Kupke Tuning",
                             html=_layout(title, body))


async def send_delivery_note_email(*, to: str, customer_name: str, order_number: str,
                                    pdf_url: str) -> str | None:
    title = '<h2 style="margin:0;font-size:20px">Ihre Bestellung ist unterwegs</h2>'
    body = (
        f'<p>Hallo {escape(customer_name) or ""},</p>'
        f'<p>Ihre Bestellung <strong>{escape(order_number)}</strong> wurde versendet. Den Lieferschein mit den '
        'Artikeln und Ihrer Lieferadresse finden Sie hier:</p>'
        f'<p style="margin:20px 0">{_button(pdf_url, "Lieferschein ansehen")}</p>'
        '<p>Vielen Dank für Ihren Einkauf bei Kupke Tuning!</p>'
    )
    return await send_email(to=to, subject=f"Versendet: Bestellung {order_number} – Kupke Tuning",
                             html=_layout(title, body))
