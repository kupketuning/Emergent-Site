"""JWT-basierte Authentifizierung (Kunden + Mitarbeiter) über Supabase/Postgres."""
import os
import secrets
import ipaddress
from datetime import datetime, timedelta, timezone
from pathlib import Path

import bcrypt
import jwt
from dotenv import load_dotenv
from fastapi import HTTPException, Request, Response

import sb_db

load_dotenv(Path(__file__).parent / '.env')

JWT_SECRET = os.environ['JWT_SECRET']
JWT_ALGORITHM = 'HS256'
ACCESS_TOKEN_MINUTES = 30
REFRESH_TOKEN_DAYS = 7
MAX_FAILED_ATTEMPTS = 5
LOCKOUT_MINUTES = 15

STAFF_ROLES = ('admin', 'bearbeiter')


# ---------------- Passwörter ----------------
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')


def verify_password(password: str, password_hash: str) -> bool:
    if not password_hash:
        return False
    try:
        return bcrypt.checkpw(password.encode('utf-8'), password_hash.encode('utf-8'))
    except ValueError:
        return False


# ---------------- JWT ----------------
def create_access_token(user_id: str, role: str) -> str:
    payload = {'sub': user_id, 'role': role, 'type': 'access',
               'exp': datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_MINUTES)}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def create_refresh_token(user_id: str) -> str:
    payload = {'sub': user_id, 'type': 'refresh',
               'exp': datetime.now(timezone.utc) + timedelta(days=REFRESH_TOKEN_DAYS)}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def decode_token(token: str) -> dict:
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Sitzung abgelaufen, bitte erneut anmelden")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Ungültige Anmeldung")


def set_auth_cookies(response: Response, user_id: str, role: str):
    access = create_access_token(user_id, role)
    refresh = create_refresh_token(user_id)
    response.set_cookie('access_token', access, httponly=True, secure=True, samesite='none',
                        max_age=ACCESS_TOKEN_MINUTES * 60, path='/')
    response.set_cookie('refresh_token', refresh, httponly=True, secure=True, samesite='none',
                        max_age=REFRESH_TOKEN_DAYS * 86400, path='/')


def clear_auth_cookies(response: Response):
    response.delete_cookie('access_token', path='/')
    response.delete_cookie('refresh_token', path='/')


# ---------------- Benutzer-Lookup ----------------
async def get_user_by_id(conn, user_id: str):
    return await conn.fetchrow("select * from users where id=$1", user_id)


async def get_user_by_email(conn, email: str):
    return await conn.fetchrow("select * from users where email=$1", email.lower().strip())


def public_user(row) -> dict:
    if not row:
        return None
    d = dict(row)
    d.pop('password_hash', None)
    d.pop('failed_attempts', None)
    d.pop('locked_until', None)
    return d


# ---------------- Login mit Brute-Force-Schutz ----------------
async def authenticate(conn, email: str, password: str):
    user = await get_user_by_email(conn, email)
    if not user:
        raise HTTPException(status_code=401, detail="E-Mail oder Passwort ist falsch")
    if user['locked_until'] and user['locked_until'] > datetime.now(timezone.utc):
        raise HTTPException(status_code=429, detail="Zu viele Fehlversuche. Bitte in 15 Minuten erneut versuchen.")
    if not user['is_active']:
        raise HTTPException(status_code=403, detail="Dieses Konto wurde deaktiviert.")
    if not verify_password(password, user['password_hash']):
        attempts = (user['failed_attempts'] or 0) + 1
        locked_until = datetime.now(timezone.utc) + timedelta(minutes=LOCKOUT_MINUTES) if attempts >= MAX_FAILED_ATTEMPTS else None
        await conn.execute("update users set failed_attempts=$1, locked_until=$2 where id=$3",
                           attempts, locked_until, user['id'])
        raise HTTPException(status_code=401, detail="E-Mail oder Passwort ist falsch")
    await conn.execute("update users set failed_attempts=0, locked_until=null where id=$1", user['id'])
    return user


# ---------------- Request-Auth-Helfer ----------------
async def _resolve_user(request: Request):
    token = request.cookies.get('access_token')
    if not token:
        auth = request.headers.get('Authorization', '')
        if auth.startswith('Bearer '):
            token = auth[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Nicht angemeldet")
    payload = decode_token(token)
    if payload.get('type') != 'access':
        raise HTTPException(status_code=401, detail="Ungültiger Token-Typ")
    pool = await sb_db.get_pool()
    async with pool.acquire() as conn:
        user = await get_user_by_id(conn, payload['sub'])
    if not user or not user['is_active']:
        raise HTTPException(status_code=401, detail="Konto nicht gefunden oder deaktiviert")
    return user


async def get_current_user(request: Request) -> dict:
    return public_user(await _resolve_user(request))


def require_role(*roles):
    async def dep(request: Request) -> dict:
        user = await _resolve_user(request)
        if roles and user['role'] not in roles:
            raise HTTPException(status_code=403, detail="Keine Berechtigung für diese Aktion")
        return public_user(user)
    return dep


# ---------------- Passwort zurücksetzen ----------------
async def create_reset_token(conn, user_id: str) -> str:
    token = secrets.token_urlsafe(32)
    expires = datetime.now(timezone.utc) + timedelta(hours=1)
    await conn.execute(
        "insert into password_reset_tokens (user_id, token, expires_at) values ($1,$2,$3)",
        user_id, token, expires)
    return token


async def consume_reset_token(conn, token: str, new_password: str):
    row = await conn.fetchrow("select * from password_reset_tokens where token=$1", token)
    if not row or row['used'] or row['expires_at'] < datetime.now(timezone.utc):
        raise HTTPException(status_code=400, detail="Der Link ist ungültig oder abgelaufen.")
    await conn.execute("update password_reset_tokens set used=true where id=$1", row['id'])
    await conn.execute("update users set password_hash=$1, failed_attempts=0, locked_until=null where id=$2",
                       hash_password(new_password), row['user_id'])
    return row['user_id']


# ---------------- Google Login (Emergent Managed Auth) ----------------
import httpx

EMERGENT_AUTH_SESSION_URL = "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data"


async def exchange_google_session(session_id: str) -> dict:
    async with httpx.AsyncClient(timeout=15) as client:
        resp = await client.get(EMERGENT_AUTH_SESSION_URL, headers={'X-Session-ID': session_id})
    if resp.status_code != 200:
        raise HTTPException(status_code=401, detail="Google-Anmeldung fehlgeschlagen")
    return resp.json()


async def find_or_create_google_user(conn, profile: dict):
    email = profile['email'].lower().strip()
    user = await get_user_by_email(conn, email)
    if user:
        if not user['is_active']:
            raise HTTPException(status_code=403, detail="Dieses Konto wurde deaktiviert.")
        return user
    return await conn.fetchrow(
        """insert into users (email, name, role, auth_provider, google_id)
           values ($1,$2,'customer','google',$3) returning *""",
        email, profile.get('name'), profile.get('id'))
