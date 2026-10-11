"""Serverseitige PDF-Rechnungserzeugung (reportlab) für Kupke-Tuning."""
from io import BytesIO
from datetime import datetime

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (SimpleDocTemplate, Table, TableStyle, Paragraph,
                                Spacer, HRFlowable)

# Akzentfarben
RED = colors.HexColor('#E63946')
TEAL = colors.HexColor('#2EC4B6')
DARK = colors.HexColor('#17191d')
GREY = colors.HexColor('#6b7280')
LIGHT = colors.HexColor('#f4f5f7')

# Firmenangaben (Platzhalter werden später ergänzt)
COMPANY = {
    'name': 'Kupke Tuning',
    'owner': 'Nadezhda Kupke',
    'address_lines': ['[Straße & Hausnummer]', '[PLZ Ort]'],
    'phone': '[Telefonnummer]',
    'email': 'shop@kupketuning.de',
    'web': 'www.kupketuning.de',
    'tax_number': '[Steuernummer]',
    'bank': '[Bankverbindung – IBAN / BIC]',
    'logo_url': '',  # Platzhalter – URL wird später eingefügt
}

VEHICLE_LABELS = {'TRABANT': 'Trabant', 'WARTBURG': 'Wartburg', 'B1000': 'Barkas B1000', 'VW': 'VW', 'OPEL': 'Opel'}
TYPE_LABELS = {'ORIGINAL': 'Original', 'TUNING': 'Tuning', 'RENNSPORT': 'Rennsport'}
ASSEMBLY_LABELS = {'MOTOR': 'Motor', 'BREMSE': 'Bremse', 'FAHRWERK': 'Fahrwerk', 'ABGAS': 'Abgas',
                   'ELEKTRIK': 'Elektrik', 'KAROSSERIE': 'Karosserie'}


def build_breadcrumb(vehicle, product_type, assembly_group):
    parts = [VEHICLE_LABELS.get(vehicle, vehicle or ''),
             TYPE_LABELS.get(product_type, product_type or ''),
             ASSEMBLY_LABELS.get(assembly_group, assembly_group or '')]
    return ' / '.join([p for p in parts if p])


def _eur(n):
    return f"{(float(n or 0)):,.2f} €".replace(',', 'X').replace('.', ',').replace('X', '.')


def generate_invoice_pdf(*, invoice_number, order_number, issue_date, customer, items,
                         subtotal_net, tax_total, shipping_gross, total_gross, tax_rate=19):
    """items: list of {sku, name, path, quantity, unit_price_net, line_net}"""
    buf = BytesIO()
    doc = SimpleDocTemplate(buf, pagesize=A4, leftMargin=18 * mm, rightMargin=18 * mm,
                            topMargin=16 * mm, bottomMargin=16 * mm, title=invoice_number)
    styles = getSampleStyleSheet()
    base = ParagraphStyle('base', parent=styles['Normal'], fontName='Helvetica', fontSize=9, leading=12, textColor=DARK)
    small = ParagraphStyle('small', parent=base, fontSize=8, textColor=GREY, leading=11)
    right = ParagraphStyle('right', parent=base, alignment=2)
    right_b = ParagraphStyle('right_b', parent=base, alignment=2, fontName='Helvetica-Bold')
    h_title = ParagraphStyle('h_title', parent=base, fontName='Helvetica-Bold', fontSize=22, textColor=RED)
    cell = ParagraphStyle('cell', parent=base, fontSize=8.5, leading=11)
    cell_r = ParagraphStyle('cell_r', parent=cell, alignment=2)
    story = []

    # ---------- KOPFBEREICH ----------
    logo_box = Table([[Paragraph('LOGO', ParagraphStyle('logo', parent=base, alignment=1, textColor=GREY, fontSize=11))]],
                     colWidths=[45 * mm], rowHeights=[24 * mm])
    logo_box.setStyle(TableStyle([
        ('BOX', (0, 0), (-1, -1), 1, TEAL),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ]))
    company_html = (
        f"<b>{COMPANY['name']}</b><br/>{COMPANY['owner']}<br/>"
        + "<br/>".join(COMPANY['address_lines'])
        + f"<br/>Telefon: {COMPANY['phone']}<br/>E-Mail: {COMPANY['email']}<br/>"
        f"Web: {COMPANY['web']}<br/>Steuernummer: {COMPANY['tax_number']}"
    )
    header = Table([[logo_box, Paragraph(company_html, small)]], colWidths=[70 * mm, 104 * mm])
    header.setStyle(TableStyle([('VALIGN', (0, 0), (-1, -1), 'TOP'), ('ALIGN', (1, 0), (1, 0), 'RIGHT')]))
    story.append(header)
    story.append(Spacer(1, 8 * mm))
    story.append(HRFlowable(width='100%', thickness=2, color=RED))
    story.append(Spacer(1, 6 * mm))

    # ---------- TITEL + RECHNUNGSDETAILS ----------
    d = issue_date.strftime('%d.%m.%Y') if isinstance(issue_date, datetime) else str(issue_date)
    details_html = (
        f"<b>Rechnungsnummer:</b> {invoice_number}<br/>"
        f"<b>Rechnungsdatum:</b> {d}<br/>"
        f"<b>Bestellnummer:</b> B-{order_number}<br/>"
        f"<b>Leistungsdatum:</b> {d}"
    )
    title_row = Table([[Paragraph('RECHNUNG', h_title), Paragraph(details_html, right)]],
                      colWidths=[80 * mm, 94 * mm])
    title_row.setStyle(TableStyle([('VALIGN', (0, 0), (-1, -1), 'TOP')]))
    story.append(title_row)
    story.append(Spacer(1, 7 * mm))

    # ---------- KUNDENADRESSE ----------
    name = ' '.join([customer.get('first_name') or '', customer.get('last_name') or '']).strip()
    addr_lines = [name]
    if customer.get('company'):
        addr_lines.append(customer['company'])
    if customer.get('street'):
        addr_lines.append(customer['street'])
    zc = ' '.join([customer.get('zip') or '', customer.get('city') or '']).strip()
    if zc:
        addr_lines.append(zc)
    if customer.get('country'):
        addr_lines.append(customer['country'])
    story.append(Paragraph('<font color="#6b7280" size="7">RECHNUNGSADRESSE</font>', small))
    story.append(Spacer(1, 1.5 * mm))
    story.append(Paragraph('<br/>'.join([a for a in addr_lines if a]), base))
    story.append(Spacer(1, 8 * mm))

    # ---------- POSITIONSTABELLE ----------
    head = ['Pos', 'Art.-Nr.', 'Bezeichnung', 'Pfad', 'Menge', 'Einzel (netto)', 'Gesamt (netto)']
    data = [[Paragraph(f'<b>{h}</b>', ParagraphStyle('th', parent=cell, textColor=colors.white,
             alignment=(2 if h in ('Menge', 'Einzel (netto)', 'Gesamt (netto)') else 0))) for h in head]]
    for i, it in enumerate(items, start=1):
        data.append([
            Paragraph(str(i), cell),
            Paragraph(it.get('sku') or '', cell),
            Paragraph(it.get('name') or '', cell),
            Paragraph(it.get('path') or '', ParagraphStyle('pathc', parent=cell, textColor=TEAL, fontSize=8)),
            Paragraph(str(it.get('quantity') or 0), cell_r),
            Paragraph(_eur(it.get('unit_price_net')), cell_r),
            Paragraph(_eur(it.get('line_net')), cell_r),
        ])
    tbl = Table(data, colWidths=[10 * mm, 24 * mm, 46 * mm, 34 * mm, 14 * mm, 22 * mm, 24 * mm], repeatRows=1)
    tbl.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), DARK),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, LIGHT]),
        ('LINEBELOW', (0, 0), (-1, -1), 0.4, colors.HexColor('#e5e7eb')),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('LEFTPADDING', (0, 0), (-1, -1), 5),
        ('RIGHTPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(tbl)
    story.append(Spacer(1, 6 * mm))

    # ---------- SUMMENBLOCK ----------
    sums = [
        ['Zwischensumme netto:', _eur(subtotal_net)],
        [f'zzgl. {int(round(float(tax_rate)))}% MwSt.:', _eur(tax_total)],
        ['Versandkosten (brutto):', _eur(shipping_gross)],
        ['Gesamtbetrag:', _eur(total_gross)],
    ]
    sum_rows = []
    for lbl, val in sums:
        is_total = lbl.startswith('Gesamt')
        st = right_b if is_total else right
        sum_rows.append([Paragraph(lbl, st), Paragraph(val, st)])
    sum_tbl = Table(sum_rows, colWidths=[44 * mm, 30 * mm], hAlign='RIGHT')
    sum_tbl.setStyle(TableStyle([
        ('ALIGN', (0, 0), (-1, -1), 'RIGHT'),
        ('TOPPADDING', (0, 0), (-1, -1), 3),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
        ('LINEABOVE', (0, 3), (-1, 3), 1, RED),
        ('BACKGROUND', (0, 3), (-1, 3), colors.HexColor('#fdecec')),
        ('TEXTCOLOR', (0, 3), (-1, 3), RED),
    ]))
    story.append(sum_tbl)
    story.append(Spacer(1, 12 * mm))

    # ---------- FUSSBEREICH ----------
    story.append(HRFlowable(width='100%', thickness=1, color=TEAL))
    story.append(Spacer(1, 4 * mm))
    story.append(Paragraph('<b>Vielen Dank für Ihre Bestellung!</b>', base))
    story.append(Spacer(1, 4 * mm))
    story.append(Paragraph(f"Bankverbindung: {COMPANY['bank']}", small))
    story.append(Spacer(1, 1 * mm))
    story.append(Paragraph('Zahlung erfolgte per Kreditkarte.', small))

    doc.build(story)
    buf.seek(0)
    return buf.read()


def generate_packing_slip_pdf(*, order_number, issue_date, customer, items, title='PACKZETTEL',
                              footer_note='Bitte Menge vor Versand prüfen. Keine Preisangaben – nur zur internen Kommissionierung.'):
    """Packzettel/Lieferschein – Artikel/Menge/Adresse, ohne Preise. items: [{sku,name,path,quantity}]"""
    buf = BytesIO()
    doc = SimpleDocTemplate(buf, pagesize=A4, leftMargin=18 * mm, rightMargin=18 * mm,
                            topMargin=16 * mm, bottomMargin=16 * mm, title=f"{title}-{order_number}")
    styles = getSampleStyleSheet()
    base = ParagraphStyle('base2', parent=styles['Normal'], fontName='Helvetica', fontSize=9, leading=12, textColor=DARK)
    small = ParagraphStyle('small2', parent=base, fontSize=8, textColor=GREY, leading=11)
    h_title = ParagraphStyle('h_title2', parent=base, fontName='Helvetica-Bold', fontSize=20, textColor=TEAL)
    cell = ParagraphStyle('cell2', parent=base, fontSize=9, leading=12)
    cell_r = ParagraphStyle('cell_r2', parent=cell, alignment=2)
    story = []

    d = issue_date.strftime('%d.%m.%Y') if isinstance(issue_date, datetime) else str(issue_date)
    story.append(Paragraph(title, h_title))
    story.append(Spacer(1, 2 * mm))
    story.append(Paragraph(f"Bestellnummer: B-{order_number}  ·  Datum: {d}", small))
    story.append(Spacer(1, 6 * mm))
    story.append(HRFlowable(width='100%', thickness=1.5, color=TEAL))
    story.append(Spacer(1, 6 * mm))

    name = ' '.join([customer.get('first_name') or '', customer.get('last_name') or '']).strip()
    addr_lines = [name]
    if customer.get('company'):
        addr_lines.append(customer['company'])
    if customer.get('street'):
        addr_lines.append(customer['street'])
    zc = ' '.join([customer.get('zip') or '', customer.get('city') or '']).strip()
    if zc:
        addr_lines.append(zc)
    if customer.get('country'):
        addr_lines.append(customer['country'])
    story.append(Paragraph('<font color="#6b7280" size="7">LIEFERADRESSE</font>', small))
    story.append(Spacer(1, 1.5 * mm))
    story.append(Paragraph('<br/>'.join([a for a in addr_lines if a]), base))
    story.append(Spacer(1, 8 * mm))

    head = ['Pos', 'Art.-Nr.', 'Bezeichnung', 'Pfad', 'Menge']
    data = [[Paragraph(f'<b>{h}</b>', ParagraphStyle('th2', parent=cell, textColor=colors.white,
             alignment=(2 if h == 'Menge' else 0))) for h in head]]
    for i, it in enumerate(items, start=1):
        data.append([
            Paragraph(str(i), cell),
            Paragraph(it.get('sku') or '', cell),
            Paragraph(it.get('name') or '', cell),
            Paragraph(it.get('path') or '', ParagraphStyle('pathc2', parent=cell, textColor=TEAL, fontSize=8)),
            Paragraph(str(it.get('quantity') or 0), cell_r),
        ])
    tbl = Table(data, colWidths=[10 * mm, 28 * mm, 66 * mm, 44 * mm, 20 * mm], repeatRows=1)
    tbl.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), DARK),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, LIGHT]),
        ('LINEBELOW', (0, 0), (-1, -1), 0.4, colors.HexColor('#e5e7eb')),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('LEFTPADDING', (0, 0), (-1, -1), 5),
        ('RIGHTPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(tbl)
    story.append(Spacer(1, 10 * mm))
    story.append(HRFlowable(width='100%', thickness=1, color=RED))
    story.append(Spacer(1, 3 * mm))
    story.append(Paragraph(footer_note, small))

    doc.build(story)
    buf.seek(0)
    return buf.read()
