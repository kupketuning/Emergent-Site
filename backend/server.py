from fastapi import FastAPI, APIRouter, HTTPException, Header, Query, UploadFile, File, Request
from starlette.concurrency import run_in_threadpool
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import json
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, timezone

import asyncpg
import stripe

from seed_data import PRODUCTS as SEED_PRODUCTS, CATEGORIES
import sb_db
import invoice
import image_util

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'kupke-admin')

stripe.api_key = os.environ['STRIPE_API_KEY']
STRIPE_WEBHOOK_SECRET = os.environ.get('STRIPE_WEBHOOK_SECRET', '')
SHIPPING_RATES_CENTS = {'HERMES': 595, 'ABHOLUNG': 0}

app = FastAPI()
api_router = APIRouter(prefix="/api")


# ---------------- Models ----------------
class Product(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    art_nr: str = ""
    name: str
    category: str
    sub: str = ""
    brand: str = ""
    price: Optional[float] = None
    delivery: str = "1-2 Tage"
    badge: Optional[str] = None
    fahrzeug: str = ""
    image: str = ""
    description: str = ""
    featured: bool = False
    variants: List[dict] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ProductCreate(BaseModel):
    art_nr: str = ""
    name: str
    category: str
    sub: str = ""
    brand: str = ""
    price: Optional[float] = None
    delivery: str = "1-2 Tage"
    badge: Optional[str] = None
    fahrzeug: str = ""
    image: str = ""
    description: str = ""
    featured: bool = False
    variants: List[dict] = Field(default_factory=list)


class ProductUpdate(BaseModel):
    art_nr: Optional[str] = None
    name: Optional[str] = None
    category: Optional[str] = None
    sub: Optional[str] = None
    brand: Optional[str] = None
    price: Optional[float] = None
    delivery: Optional[str] = None
    badge: Optional[str] = None
    fahrzeug: Optional[str] = None
    image: Optional[str] = None
    description: Optional[str] = None
    featured: Optional[bool] = None
    variants: Optional[List[dict]] = None


class Inquiry(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    phone: str = ""
    product_name: str = ""
    product_art_nr: str = ""
    variant: str = ""
    message: str
    handled: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class InquiryCreate(BaseModel):
    name: str
    email: str
    phone: str = ""
    product_name: str = ""
    product_art_nr: str = ""
    variant: str = ""
    message: str


class LoginInput(BaseModel):
    password: str


def _check_admin(token: Optional[str]):
    if token != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Nicht autorisiert")


def _clean(doc: dict) -> dict:
    doc.pop('_id', None)
    return doc


# ---------------- Routes ----------------
@api_router.get("/")
async def root():
    return {"message": "Kupke-Tuning API"}


@api_router.get("/categories")
async def get_categories():
    return CATEGORIES


@api_router.post("/admin/login")
async def admin_login(data: LoginInput):
    if data.password != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Falsches Passwort")
    return {"token": ADMIN_PASSWORD}


@api_router.get("/products", response_model=List[Product])
async def list_products(
    category: Optional[str] = None,
    q: Optional[str] = None,
    featured: Optional[bool] = None,
):
    query: dict = {}
    if category:
        query["category"] = category
    if featured is not None:
        query["featured"] = featured
    if q:
        query["$or"] = [
            {"name": {"$regex": q, "$options": "i"}},
            {"description": {"$regex": q, "$options": "i"}},
            {"art_nr": {"$regex": q, "$options": "i"}},
            {"brand": {"$regex": q, "$options": "i"}},
            {"sub": {"$regex": q, "$options": "i"}},
        ]
    docs = await db.products.find(query).to_list(1000)
    return [Product(**_clean(d)) for d in docs]


@api_router.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: str):
    doc = await db.products.find_one({"id": product_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Produkt nicht gefunden")
    return Product(**_clean(doc))


@api_router.post("/products", response_model=Product)
async def create_product(data: ProductCreate, x_admin_token: Optional[str] = Header(None)):
    _check_admin(x_admin_token)
    product = Product(**data.dict())
    await db.products.insert_one(product.dict())
    return product


@api_router.put("/products/{product_id}", response_model=Product)
async def update_product(product_id: str, data: ProductUpdate, x_admin_token: Optional[str] = Header(None)):
    _check_admin(x_admin_token)
    existing = await db.products.find_one({"id": product_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Produkt nicht gefunden")
    updates = {k: v for k, v in data.dict().items() if v is not None}
    if updates:
        await db.products.update_one({"id": product_id}, {"$set": updates})
    doc = await db.products.find_one({"id": product_id})
    return Product(**_clean(doc))


@api_router.delete("/products/{product_id}")
async def delete_product(product_id: str, x_admin_token: Optional[str] = Header(None)):
    _check_admin(x_admin_token)
    res = await db.products.delete_one({"id": product_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Produkt nicht gefunden")
    return {"success": True}


@api_router.post("/inquiries", response_model=Inquiry)
async def create_inquiry(data: InquiryCreate):
    inquiry = Inquiry(**data.dict())
    await db.inquiries.insert_one(inquiry.dict())
    return inquiry


@api_router.get("/inquiries", response_model=List[Inquiry])
async def list_inquiries(x_admin_token: Optional[str] = Header(None)):
    _check_admin(x_admin_token)
    docs = await db.inquiries.find().sort("created_at", -1).to_list(1000)
    return [Inquiry(**_clean(d)) for d in docs]


@api_router.delete("/inquiries/{inquiry_id}")
async def delete_inquiry(inquiry_id: str, x_admin_token: Optional[str] = Header(None)):
    _check_admin(x_admin_token)
    res = await db.inquiries.delete_one({"id": inquiry_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Anfrage nicht gefunden")
    return {"success": True}


# ==================== Supabase-backed admin product management ====================
PRODUCT_FIELDS = ['sku', 'name', 'description', 'vehicle', 'vehicle_model', 'product_type', 'assembly_group',
                  'price_net', 'tax_rate', 'is_set', 'images', 'explosion_drawing_id',
                  'dekra_certified', 'stock_quantity', 'stock_min_alert', 'weight_grams',
                  'is_active', 'sort_order', 'youtube_url', 'special_category']


def _gross(net, rate):
    try:
        return round(float(net or 0) * (1 + float(rate or 0) / 100), 2)
    except (TypeError, ValueError):
        return None


def _prod(rec):
    d = dict(rec)
    d['price_gross'] = _gross(d.get('price_net'), d.get('tax_rate'))
    return d


def _coerce(data: dict) -> dict:
    out = {k: v for k, v in data.items() if k in PRODUCT_FIELDS}
    for k in ('vehicle', 'vehicle_model', 'product_type', 'assembly_group', 'special_category'):
        if k in out and out[k] == '':
            out[k] = None
    if 'price_net' in out and out['price_net'] not in (None, ''):
        out['price_net'] = float(str(out['price_net']).replace(',', '.'))
    if 'tax_rate' in out and out['tax_rate'] not in (None, ''):
        out['tax_rate'] = float(str(out['tax_rate']).replace(',', '.'))
    for k in ('stock_quantity', 'stock_min_alert', 'weight_grams', 'sort_order'):
        if k in out and out[k] not in (None, ''):
            out[k] = int(out[k])
    for k in ('is_set', 'dekra_certified', 'is_active'):
        if k in out:
            out[k] = bool(out[k])
    if 'explosion_drawing_id' in out and not out['explosion_drawing_id']:
        out['explosion_drawing_id'] = None
    if 'images' in out and out['images'] is None:
        out['images'] = []
    return out


@api_router.get("/sb/next-sku")
async def sb_next_sku(vehicle: Optional[str] = None, product_type: Optional[str] = None,
                      assembly_group: Optional[str] = None, is_set: bool = False,
                      special_category: Optional[str] = None, x_admin_token: Optional[str] = Header(None)):
    _check_admin(x_admin_token)
    pool = await sb_db.get_pool()
    async with pool.acquire() as conn:
        if special_category:
            sku = await sb_db.generate_special_sku(conn, special_category)
        else:
            sku = await sb_db.generate_sku(conn, vehicle, product_type, assembly_group, is_set)
    return {"sku": sku}


@api_router.get("/sb/products")
async def sb_list_products(vehicle: Optional[str] = None, assembly_group: Optional[str] = None,
                           is_active: Optional[bool] = None, q: Optional[str] = None,
                           special_category: Optional[str] = None):
    pool = await sb_db.get_pool()
    where, args, i = [], [], 1
    if vehicle:
        where.append(f"vehicle=${i}"); args.append(vehicle); i += 1
    if assembly_group:
        where.append(f"assembly_group=${i}"); args.append(assembly_group); i += 1
    if special_category:
        where.append(f"special_category=${i}"); args.append(special_category); i += 1
    if is_active is not None:
        where.append(f"is_active=${i}"); args.append(is_active); i += 1
    if q:
        where.append(f"(name ilike ${i} or sku ilike ${i} or description ilike ${i})"); args.append(f"%{q}%"); i += 1
    sql = "select * from products"
    if where:
        sql += " where " + " and ".join(where)
    sql += " order by sort_order asc, created_at desc"
    async with pool.acquire() as conn:
        rows = await conn.fetch(sql, *args)
    return [_prod(r) for r in rows]


@api_router.get("/sb/products/{pid}")
async def sb_get_product(pid: str):
    pool = await sb_db.get_pool()
    async with pool.acquire() as conn:
        r = await conn.fetchrow("select * from products where id=$1", pid)
    if not r:
        raise HTTPException(status_code=404, detail="Produkt nicht gefunden")
    return _prod(r)


@api_router.post("/sb/products")
async def sb_create_product(data: dict, x_admin_token: Optional[str] = Header(None)):
    _check_admin(x_admin_token)
    pool = await sb_db.get_pool()
    async with pool.acquire() as conn:
        vals = _coerce(data)
        if not vals.get('sku'):
            if data.get('special_category'):
                vals['sku'] = await sb_db.generate_special_sku(conn, data['special_category'])
            else:
                vals['sku'] = await sb_db.generate_sku(conn, data['vehicle'], data['product_type'],
                                                       data['assembly_group'], bool(data.get('is_set')))
        cols = [c for c in PRODUCT_FIELDS if c in vals]
        placeholders = ",".join(f"${k}" for k in range(1, len(cols) + 1))
        args = [vals[c] for c in cols]
        try:
            r = await conn.fetchrow(
                f"insert into products ({','.join(cols)}) values ({placeholders}) returning *", *args)
        except asyncpg.UniqueViolationError:
            raise HTTPException(status_code=409, detail="SKU existiert bereits")
    return _prod(r)


@api_router.put("/sb/products/{pid}")
async def sb_update_product(pid: str, data: dict, x_admin_token: Optional[str] = Header(None)):
    _check_admin(x_admin_token)
    updates = _coerce(data)
    updates.pop('sku', None)  # SKU bleibt fix
    pool = await sb_db.get_pool()
    if not updates:
        return await sb_get_product(pid)
    cols = list(updates.keys())
    set_clause = ",".join(f"{c}=${idx}" for idx, c in enumerate(cols, start=1))
    args = [updates[c] for c in cols]
    args.append(pid)
    async with pool.acquire() as conn:
        r = await conn.fetchrow(
            f"update products set {set_clause} where id=${len(args)} returning *", *args)
    if not r:
        raise HTTPException(status_code=404, detail="Produkt nicht gefunden")
    return _prod(r)


@api_router.delete("/sb/products/{pid}")
async def sb_delete_product(pid: str, x_admin_token: Optional[str] = Header(None)):
    _check_admin(x_admin_token)
    pool = await sb_db.get_pool()
    async with pool.acquire() as conn:
        res = await conn.execute("delete from products where id=$1", pid)
    if res.endswith("0"):
        raise HTTPException(status_code=404, detail="Produkt nicht gefunden")
    return {"success": True}


@api_router.get("/sb/explosion-drawings")
async def sb_list_drawings(vehicle: Optional[str] = None, assembly_group: Optional[str] = None):
    pool = await sb_db.get_pool()
    where, args, i = [], [], 1
    if vehicle:
        where.append(f"vehicle=${i}"); args.append(vehicle); i += 1
    if assembly_group:
        where.append(f"assembly_group=${i}"); args.append(assembly_group); i += 1
    sql = "select * from explosion_drawings"
    if where:
        sql += " where " + " and ".join(where)
    sql += " order by title"
    async with pool.acquire() as conn:
        rows = await conn.fetch(sql, *args)
    return [dict(r) for r in rows]


@api_router.post("/sb/explosion-drawings")
async def sb_create_drawing(data: dict, x_admin_token: Optional[str] = Header(None)):
    _check_admin(x_admin_token)
    pool = await sb_db.get_pool()
    async with pool.acquire() as conn:
        r = await conn.fetchrow(
            "insert into explosion_drawings (vehicle, assembly_group, title, image_url) "
            "values ($1,$2,$3,$4) returning *",
            data.get('vehicle'), data.get('assembly_group'), data.get('title'), data.get('image_url'))
    return dict(r)


@api_router.delete("/sb/explosion-drawings/{did}")
async def sb_delete_drawing(did: str, x_admin_token: Optional[str] = Header(None)):
    _check_admin(x_admin_token)
    pool = await sb_db.get_pool()
    async with pool.acquire() as conn:
        res = await conn.execute("delete from explosion_drawings where id=$1", did)
    if res.endswith("0"):
        raise HTTPException(status_code=404, detail="Zeichnung nicht gefunden")
    return {"success": True}


@api_router.post("/sb/upload")
async def sb_upload(files: List[UploadFile] = File(...), x_admin_token: Optional[str] = Header(None)):
    _check_admin(x_admin_token)
    urls = []
    for f in files:
        content = await f.read()
        content, ctype = await run_in_threadpool(image_util.apply_watermark, content, f.content_type)
        url = await run_in_threadpool(sb_db.upload_bytes, f.filename, content, ctype)
        urls.append(url)
    return {"urls": urls}


# ==================== Stripe Checkout (server-side, prices from Supabase) ====================
class CheckoutItem(BaseModel):
    product_id: str
    quantity: int = 1
    variant: str = ""


class CheckoutCustomer(BaseModel):
    email: str
    first_name: str = ""
    last_name: str = ""
    company: str = ""
    street: str = ""
    zip: str = ""
    city: str = ""
    country: str = "DE"
    phone: str = ""


class CheckoutRequest(BaseModel):
    items: List[CheckoutItem]
    shipping_method: str  # HERMES | ABHOLUNG
    customer: CheckoutCustomer
    origin_url: str


@api_router.post("/checkout")
async def create_checkout(req: CheckoutRequest):
    if not req.items:
        raise HTTPException(status_code=400, detail="Der Warenkorb ist leer.")
    if req.shipping_method not in SHIPPING_RATES_CENTS:
        raise HTTPException(status_code=400, detail="Ungültige Versandart.")

    pool = await sb_db.get_pool()
    line_items, resolved = [], []
    subtotal_net = tax_total = 0.0

    async with pool.acquire() as conn:
        for it in req.items:
            r = await conn.fetchrow("select * from products where id=$1", it.product_id)
            if not r:
                raise HTTPException(status_code=404, detail=f"Produkt nicht gefunden: {it.product_id}")
            net = float(r['price_net'] or 0)
            if net <= 0:
                raise HTTPException(status_code=400,
                                    detail=f"Für „{r['name']}“ ist kein Preis hinterlegt – bitte per Preisanfrage bestellen.")
            rate = float(r['tax_rate'] or 0)
            gross = round(net * (1 + rate / 100), 2)
            qty = max(1, int(it.quantity))
            name = r['name'] + (f" ({it.variant})" if it.variant else "")
            images = list(r['images'] or [])
            prod_data = {"name": name}
            if images:
                prod_data["images"] = images[:1]
            line_items.append({
                "price_data": {"currency": "eur", "product_data": prod_data,
                               "unit_amount": int(round(gross * 100))},
                "quantity": qty,
            })
            subtotal_net += net * qty
            tax_total += (gross - net) * qty
            resolved.append({"product_id": str(r['id']), "sku": r['sku'], "name": name,
                             "quantity": qty, "variant": it.variant,
                             "unit_price_net": net, "unit_price_gross": gross, "tax_rate": rate,
                             "vehicle": r['vehicle'], "product_type": r['product_type'],
                             "assembly_group": r['assembly_group']})

    ship_cents = SHIPPING_RATES_CENTS[req.shipping_method]
    shipping_options = []
    if ship_cents > 0:
        shipping_options = [{"shipping_rate_data": {
            "type": "fixed_amount",
            "fixed_amount": {"amount": ship_cents, "currency": "eur"},
            "display_name": "Hermes Versand",
        }}]
    total_gross = round(subtotal_net + tax_total + ship_cents / 100, 2)

    session = await run_in_threadpool(lambda: stripe.checkout.Session.create(
        mode="payment",
        line_items=line_items,
        shipping_options=shipping_options,
        customer_email=req.customer.email or None,
        success_url=f"{req.origin_url}/bestellung-bestaetigt?session_id={{CHECKOUT_SESSION_ID}}",
        cancel_url=f"{req.origin_url}/warenkorb",
        metadata={"shipping_method": req.shipping_method},
    ))

    await db.pending_checkouts.insert_one({
        "session_id": session.id,
        "items": resolved,
        "customer": req.customer.dict(),
        "shipping_method": req.shipping_method,
        "shipping_cost_gross": round(ship_cents / 100, 2),
        "subtotal_net": round(subtotal_net, 2),
        "tax_total": round(tax_total, 2),
        "total_gross": total_gross,
        "finalized": False,
        "order_id": None,
        "order_number": None,
        "created_at": datetime.now(timezone.utc),
    })
    return {"url": session.url, "session_id": session.id}


async def _finalize_order(session_id: str):
    pending = await db.pending_checkouts.find_one({"session_id": session_id})
    if not pending:
        return None
    if pending.get("finalized"):
        return {"order_number": pending.get("order_number"), "status": "BEZAHLT"}

    session = await run_in_threadpool(stripe.checkout.Session.retrieve, session_id)
    if session.get("payment_status") != "paid" and session.get("status") != "complete":
        return {"order_number": None, "status": "PENDING"}

    cust = pending["customer"]
    pool = await sb_db.get_pool()
    async with pool.acquire() as conn:
        async with conn.transaction():
            crow = await conn.fetchrow(
                """insert into customers (email, first_name, last_name, company, street, zip, city, country, phone)
                   values ($1,$2,$3,$4,$5,$6,$7,$8,$9)
                   on conflict (email) do update set
                     first_name=excluded.first_name, last_name=excluded.last_name,
                     company=excluded.company, street=excluded.street, zip=excluded.zip,
                     city=excluded.city, country=excluded.country, phone=excluded.phone
                   returning id""",
                cust.get("email"), cust.get("first_name"), cust.get("last_name"),
                cust.get("company"), cust.get("street"), cust.get("zip"),
                cust.get("city"), cust.get("country", "DE"), cust.get("phone"))
            customer_id = crow["id"]
            n = await conn.fetchval("select get_next_number('order_2026')")
            order_number = f"2026-{n:05d}"
            orow = await conn.fetchrow(
                """insert into orders (order_number, customer_id, status, items, shipping_method,
                       shipping_cost_gross, subtotal_net, tax_total, total_gross,
                       stripe_payment_intent_id, stripe_payment_status)
                   values ($1,$2,'BEZAHLT',$3::jsonb,$4,$5,$6,$7,$8,$9,$10)
                   returning id""",
                order_number, customer_id, json.dumps(pending["items"]),
                pending["shipping_method"], pending["shipping_cost_gross"],
                pending["subtotal_net"], pending["tax_total"], pending["total_gross"],
                session.get("payment_intent"), session.get("payment_status"))
            order_id = orow["id"]
            for it in pending["items"]:
                await conn.execute(
                    "update products set stock_quantity = greatest(0, stock_quantity - $1) where id=$2",
                    it["quantity"], it["product_id"])

        # Rechnung erzeugen (best-effort, außerhalb der Bestell-Transaktion)
        try:
            await _create_invoice(conn, order_id, customer_id, cust, pending, order_number)
        except Exception:
            logger.exception("Rechnungserzeugung fehlgeschlagen für Bestellung %s", order_number)

    await db.pending_checkouts.update_one(
        {"session_id": session_id},
        {"$set": {"finalized": True, "order_id": str(order_id), "order_number": order_number}})
    return {"order_number": order_number, "status": "BEZAHLT"}


async def _create_invoice(conn, order_id, customer_id, cust, pending, order_number):
    year = datetime.now(timezone.utc).year
    n = await conn.fetchval("select get_next_number($1)", f"invoice_{year}")
    invoice_number = f"RE-{year}-{n:04d}"

    items = []
    for it in pending["items"]:
        line_net = round(float(it["unit_price_net"]) * int(it["quantity"]), 2)
        items.append({
            "sku": it.get("sku", ""), "name": it.get("name", ""),
            "path": invoice.build_breadcrumb(it.get("vehicle"), it.get("product_type"), it.get("assembly_group")),
            "quantity": it["quantity"], "unit_price_net": it["unit_price_net"], "line_net": line_net,
        })

    issue_date = datetime.now(timezone.utc)
    pdf_bytes = await run_in_threadpool(
        lambda: invoice.generate_invoice_pdf(
            invoice_number=invoice_number, order_number=order_number, issue_date=issue_date,
            customer=cust, items=items, subtotal_net=pending["subtotal_net"],
            tax_total=pending["tax_total"], shipping_gross=pending["shipping_cost_gross"],
            total_gross=pending["total_gross"]))
    pdf_url = await run_in_threadpool(
        sb_db.upload_bytes, f"{invoice_number}.pdf", pdf_bytes, "application/pdf", "invoices")

    inv = await conn.fetchrow(
        """insert into invoices (invoice_number, order_id, customer_id, type, items,
               subtotal_net, tax_total, total_gross, payment_method, pdf_url)
           values ($1,$2,$3,'AUTO',$4::jsonb,$5,$6,$7,'Kreditkarte',$8)
           returning id""",
        invoice_number, order_id, customer_id, json.dumps(items),
        pending["subtotal_net"], pending["tax_total"], pending["total_gross"], pdf_url)
    await conn.execute("update orders set invoice_id=$1 where id=$2", inv["id"], order_id)
    return invoice_number


@api_router.get("/checkout/status/{session_id}")
async def checkout_status(session_id: str):
    result = await _finalize_order(session_id)
    if result is None:
        raise HTTPException(status_code=404, detail="Checkout-Sitzung nicht gefunden.")
    return result


@api_router.post("/stripe-webhook")
async def stripe_webhook(request: Request):
    payload = await request.body()
    sig = request.headers.get("stripe-signature", "")
    if STRIPE_WEBHOOK_SECRET:
        try:
            event = stripe.Webhook.construct_event(payload, sig, STRIPE_WEBHOOK_SECRET)
        except Exception:
            raise HTTPException(status_code=400, detail="Ungültige Stripe-Signatur.")
    else:
        event = json.loads(payload)
    if event.get("type") == "checkout.session.completed":
        await _finalize_order(event["data"]["object"]["id"])
    return {"status": "ok"}


@api_router.get("/sb/orders")
async def sb_list_orders(x_admin_token: Optional[str] = Header(None)):
    _check_admin(x_admin_token)
    pool = await sb_db.get_pool()
    async with pool.acquire() as conn:
        rows = await conn.fetch(
            """select o.*, c.email as customer_email, c.first_name, c.last_name,
                      c.street, c.zip, c.city,
                      i.invoice_number, i.pdf_url as invoice_pdf_url
               from orders o
               left join customers c on c.id = o.customer_id
               left join invoices i on i.id = o.invoice_id
               order by o.created_at desc""")
    out = []
    for r in rows:
        d = dict(r)
        if isinstance(d.get('items'), str):
            try:
                d['items'] = json.loads(d['items'])
            except Exception:
                pass
        out.append(d)
    return out


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


@app.on_event("startup")
async def seed_db():
    count = await db.products.count_documents({})
    if count == 0:
        docs = [Product(**item).dict() for item in SEED_PRODUCTS]
        if docs:
            await db.products.insert_many(docs)
        logger.info(f"Seeded {len(docs)} products into DB")
    else:
        logger.info(f"DB already has {count} products, skipping seed")


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
