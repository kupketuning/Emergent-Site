"""Supabase (Postgres) data access via asyncpg + Storage helper for the admin product management."""
import os
import uuid
from pathlib import Path
from dotenv import load_dotenv
import asyncpg
import requests

load_dotenv(Path(__file__).parent / '.env')

DATABASE_URL = os.environ['DATABASE_URL']
SUPABASE_URL = os.environ.get('SUPABASE_URL', '').rstrip('/')
SERVICE_KEY = os.environ.get('SUPABASE_SERVICE_ROLE_KEY', '')
BUCKET = 'product-images'

VMAP = {'TRABANT': 'TR', 'WARTBURG': 'WA', 'B1000': 'B1', 'VW': 'VW', 'OPEL': 'OP'}
TMAP = {'ORIGINAL': 'O', 'TUNING': 'T', 'RENNSPORT': 'R'}
AMAP = {'MOTOR': 'MO', 'BREMSE': 'BR', 'FAHRWERK': 'FW', 'ABGAS': 'AB', 'ELEKTRIK': 'EL', 'KAROSSERIE': 'KA'}
SPECIAL_PREFIX = {'NORMTEIL': 'NT', 'ABVERKAUF': 'AV'}

_pool = None


async def get_pool():
    global _pool
    if _pool is None:
        _pool = await asyncpg.create_pool(
            dsn=DATABASE_URL,
            statement_cache_size=0,  # required for the transaction pooler
            min_size=1,
            max_size=5,
            command_timeout=30,
        )
    return _pool


async def generate_sku(conn, vehicle, product_type, assembly_group, is_set):
    prefix = f"{VMAP[vehicle]}-{TMAP[product_type]}-{AMAP[assembly_group]}"
    base = prefix + ("-SET" if is_set else "")
    rows = await conn.fetch("select sku from products where sku like $1", prefix + "-%")
    max_n = 0
    for r in rows:
        parts = r['sku'].split('-')
        if is_set:
            if not (len(parts) == 5 and parts[3] == 'SET'):
                continue
        else:
            if len(parts) != 4:
                continue
        try:
            max_n = max(max_n, int(parts[-1]))
        except ValueError:
            continue
    return f"{base}-{max_n + 1:03d}"


async def generate_special_sku(conn, special_category):
    prefix = SPECIAL_PREFIX[special_category]
    rows = await conn.fetch("select sku from products where sku like $1", prefix + "-%")
    max_n = 0
    for r in rows:
        parts = r['sku'].split('-')
        if len(parts) != 2:
            continue
        try:
            max_n = max(max_n, int(parts[1]))
        except ValueError:
            continue
    return f"{prefix}-{max_n + 1:03d}"


def ensure_bucket(bucket=BUCKET):
    if not (SUPABASE_URL and SERVICE_KEY):
        raise Exception("Supabase Storage nicht konfiguriert (SUPABASE_URL / SERVICE_KEY fehlt)")
    try:
        requests.post(
            f"{SUPABASE_URL}/storage/v1/bucket",
            headers={'Authorization': f'Bearer {SERVICE_KEY}', 'apikey': SERVICE_KEY, 'Content-Type': 'application/json'},
            json={'id': bucket, 'name': bucket, 'public': True},
            timeout=15,
        )
    except Exception:
        pass  # already exists or transient


def upload_bytes(filename, content, content_type, bucket=BUCKET):
    ensure_bucket(bucket)
    safe = (filename or 'datei').replace('/', '_').replace(' ', '_')
    path = f"{uuid.uuid4().hex}-{safe}"
    url = f"{SUPABASE_URL}/storage/v1/object/{bucket}/{path}"
    r = requests.post(
        url,
        headers={
            'Authorization': f'Bearer {SERVICE_KEY}',
            'apikey': SERVICE_KEY,
            'Content-Type': content_type or 'application/octet-stream',
            'x-upsert': 'true',
        },
        data=content,
        timeout=60,
    )
    if r.status_code not in (200, 201):
        raise Exception(f"Upload fehlgeschlagen: {r.status_code} {r.text}")
    return f"{SUPABASE_URL}/storage/v1/object/public/{bucket}/{path}"
