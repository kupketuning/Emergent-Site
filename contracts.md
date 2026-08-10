# Kupke-Tuning – Backend Contracts

## Ziel
Produkte serverseitig verwalten (MongoDB), einfache Wartung über passwortgeschützten Admin-Bereich.

## Datenmodell: Product
- id: str (uuid)
- art_nr: str (Kupke Best.-/Art.-Nr.)
- name: str
- category: str (siehe Kategorien-IDs)
- sub: str
- brand: str
- price: float | null  (null => "Preis auf Anfrage")
- delivery: str
- badge: str | null
- fahrzeug: str
- image: str (URL)
- description: str (prägnant, eigene Formulierung)
- featured: bool
- created_at: datetime

## API (alle mit /api Prefix)
- GET /api/products?category=&q=&featured=  -> Liste
- GET /api/products/{id} -> Produkt
- POST /api/products (Admin: Header X-Admin-Token) -> erstellt
- PUT /api/products/{id} (Admin) -> aktualisiert
- DELETE /api/products/{id} (Admin) -> löscht
- GET /api/categories -> Kategorien
- POST /api/admin/login {password} -> { token }  (token = ADMIN_PASSWORD)

## Auth (Wartung)
- Einfacher Passwort-Gate über backend .env ADMIN_PASSWORD.
- Mutierende Endpunkte prüfen Header X-Admin-Token == ADMIN_PASSWORD.

## Seed
- seed_data.py enthält kompletten Katalog (aus kupketuning.de abgeleitet).
- Beim Start: wenn products-Collection leer -> seed einfügen.

## Frontend Integration
- mock.js behält statische Inhalte (categories, features, teams, brands, IMG, topbarItems, formatPrice).
- Produkte kommen aus Backend via ProductsContext (fetch /api/products).
- Seiten Home/Category/ProductDetail/Search nutzen useProducts().
- Admin-Seite /admin: Login + Tabelle + Formular (create/update/delete).
- formatPrice(null) => "Preis auf Anfrage".
