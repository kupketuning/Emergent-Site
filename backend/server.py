from fastapi import FastAPI, APIRouter, HTTPException, Header, Query
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
