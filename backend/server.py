from fastapi import FastAPI, APIRouter, HTTPException, Header, Query, UploadFile, File
from starlette.concurrency import run_in_threadpool
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, timezone

from seed_data import PRODUCTS as SEED_PRODUCTS, CATEGORIES
import sb_db

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'kupke-admin')

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
PRODUCT_FIELDS = ['sku', 'name', 'description', 'vehicle', 'product_type', 'assembly_group',
                  'price_net', 'tax_rate', 'is_set', 'images', 'explosion_drawing_id',
                  'dekra_certified', 'stock_quantity', 'stock_min_alert', 'weight_grams',
                  'is_active', 'sort_order', 'youtube_url']


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
async def sb_next_sku(vehicle: str, product_type: str, assembly_group: str,
                      is_set: bool = False, x_admin_token: Optional[str] = Header(None)):
    _check_admin(x_admin_token)
    pool = await sb_db.get_pool()
    async with pool.acquire() as conn:
        sku = await sb_db.generate_sku(conn, vehicle, product_type, assembly_group, is_set)
    return {"sku": sku}


@api_router.get("/sb/products")
async def sb_list_products(vehicle: Optional[str] = None, assembly_group: Optional[str] = None,
                           is_active: Optional[bool] = None, q: Optional[str] = None):
    pool = await sb_db.get_pool()
    where, args, i = [], [], 1
    if vehicle:
        where.append(f"vehicle=${i}"); args.append(vehicle); i += 1
    if assembly_group:
        where.append(f"assembly_group=${i}"); args.append(assembly_group); i += 1
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
        url = await run_in_threadpool(sb_db.upload_bytes, f.filename, content, f.content_type)
        urls.append(url)
    return {"urls": urls}


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
