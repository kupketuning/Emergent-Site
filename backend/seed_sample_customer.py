"""Idempotentes Seed-Script: Musterkunde mit Testbestellung zur Demo der neuen Kundenkonto-Funktionen."""
import asyncio
import json
from datetime import datetime, timezone
from io import BytesIO

from reportlab.pdfgen import canvas

import sb_db
import auth_service
import invoice

SAMPLE_EMAIL = "musterkunde@kupketuning.de"
SAMPLE_PASSWORD = "Musterkunde2026!"


def _dummy_pdf(text: str) -> bytes:
    buf = BytesIO()
    c = canvas.Canvas(buf)
    c.drawString(100, 700, text)
    c.save()
    return buf.getvalue()


async def main():
    pool = await sb_db.get_pool()
    async with pool.acquire() as conn:
        existing_order = await conn.fetchrow(
            """select o.id from orders o join customers c on c.id=o.customer_id
               where c.email=$1 limit 1""", SAMPLE_EMAIL)
        if existing_order:
            print("Musterkunde + Testbestellung existieren bereits – kein erneutes Seeding.")
            return

        user = await auth_service.get_user_by_email(conn, SAMPLE_EMAIL)
        if not user:
            user = await conn.fetchrow(
                "insert into users (email, password_hash, name, role) values ($1,$2,$3,'customer') returning *",
                SAMPLE_EMAIL, auth_service.hash_password(SAMPLE_PASSWORD), "Max Musterkunde")
            print(f"Musterkunde-Konto angelegt: {SAMPLE_EMAIL}")

        customer = await conn.fetchrow(
            """insert into customers (email, first_name, last_name, street, zip, city, country, phone)
               values ($1,'Max','Musterkunde','Beispielstraße 12','01067','Dresden','DE','+49 151 00000000')
               on conflict (email) do update set first_name=excluded.first_name returning id""", SAMPLE_EMAIL)
        customer_id = customer['id']

        prod = await conn.fetchrow("select * from products where price_net > 0 order by created_at limit 1")
        items = [{
            "product_id": str(prod['id']), "sku": prod['sku'], "name": prod['name'], "quantity": 1,
            "unit_price_net": float(prod['price_net']), "unit_price_gross": round(float(prod['price_net']) * 1.19, 2),
            "tax_rate": float(prod['tax_rate'] or 19), "vehicle": prod['vehicle'],
            "product_type": prod['product_type'], "assembly_group": prod['assembly_group'],
        }]
        subtotal_net = items[0]['unit_price_net']
        tax_total = round(subtotal_net * 0.19, 2)
        total_gross = round(subtotal_net + tax_total + 5.95, 2)

        seq = await conn.fetchval("select get_next_number('order_2026')")
        order_number = f"2026-{seq:05d}"
        order = await conn.fetchrow(
            """insert into orders (order_number, customer_id, status, items, shipping_method,
                                  shipping_cost_gross, subtotal_net, tax_total, total_gross)
               values ($1,$2,'VERSENDET',$3::jsonb,'HERMES',5.95,$4,$5,$6) returning *""",
            order_number, customer_id, json.dumps(items), subtotal_net, tax_total, total_gross)

        inv_seq = await conn.fetchval("select get_next_number('invoice_2026')")
        invoice_number = f"RE-2026-{inv_seq:04d}"
        pdf_bytes = invoice.generate_invoice_pdf(
            invoice_number=invoice_number, order_number=order_number, issue_date=datetime.now(timezone.utc),
            customer={"first_name": "Max", "last_name": "Musterkunde", "street": "Beispielstraße 12",
                     "zip": "01067", "city": "Dresden", "country": "DE"},
            items=[{"sku": items[0]['sku'], "name": items[0]['name'],
                   "path": invoice.build_breadcrumb(prod['vehicle'], prod['product_type'], prod['assembly_group']),
                   "quantity": 1, "unit_price_net": subtotal_net, "line_net": subtotal_net}],
            subtotal_net=subtotal_net, tax_total=tax_total, shipping_gross=5.95, total_gross=total_gross)
        pdf_url = sb_db.upload_bytes(f"{invoice_number}.pdf", pdf_bytes, "application/pdf", "invoices")
        inv = await conn.fetchrow(
            """insert into invoices (invoice_number, order_id, customer_id, type, items, subtotal_net,
                                    tax_total, total_gross, payment_method, pdf_url)
               values ($1,$2,$3,'AUTO',$4::jsonb,$5,$6,$7,'Kreditkarte',$8) returning id""",
            invoice_number, order['id'], customer_id, json.dumps(items), subtotal_net, tax_total, total_gross, pdf_url)
        await conn.execute("update orders set invoice_id=$1 where id=$2", inv['id'], order['id'])

        label_url = sb_db.upload_bytes(f"{order_number}-label.pdf", _dummy_pdf("HERMES VERSANDLABEL (Beispiel)"),
                                       "application/pdf", "shipping-labels")
        await conn.execute("update orders set shipping_label_url=$1 where id=$2", label_url, order['id'])

        await conn.execute(
            """insert into support_requests (order_id, customer_id, category, message, status, admin_reply, replied_at)
               values ($1,$2,'RUECKFRAGE','Wann wird meine Bestellung versendet?','BEANTWORTET',
                       'Ihre Bestellung wurde heute versendet und sollte in 2-3 Werktagen bei Ihnen eintreffen.', now())""",
            order['id'], customer_id)

    print(f"Testbestellung angelegt: {order_number} (Rechnung {invoice_number})")
    print(f"Login Musterkunde: {SAMPLE_EMAIL} / {SAMPLE_PASSWORD}")


if __name__ == "__main__":
    asyncio.run(main())
