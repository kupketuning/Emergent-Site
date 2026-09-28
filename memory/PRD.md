# Kupke-Tuning (kupketuning.de) — PRD

## Original problem statement
Pixel-perfect clone of trabantwelt.de, modernized for kupketuning.de — a motorsport/tuning
parts shop for Trabant/Wartburg/Barkas B1000. E-commerce storefront with categories,
shopping cart, product variants, inquiry form, admin panel, Stripe checkout, Supabase
(Postgres) backend. User communicates in German — all UI/emails must be German.

## Architecture
- Frontend: React (CRA) + Tailwind, Context API (ProductsContext, CookieConsentContext)
- Backend: FastAPI (`server.py`), Supabase/Postgres via asyncpg (`sb_db.py`), MongoDB for
  legacy products/inquiries, Stripe Checkout + webhook, reportlab PDF invoices (`invoice.py`)
- DB schema: `/app/backend/supabase_schema.sql` (idempotent, run via `apply_schema.py`)

## Key DB schema
- `products`: id, sku, name, vehicle(TRABANT/WARTBURG/B1000/VW/OPEL), product_type
  (ORIGINAL/TUNING — RENNSPORT removed Sept 2026), assembly_group, price_net, tax_rate,
  is_set, images, stock_quantity, stock_min_alert, special_category(NORMTEIL/ABVERKAUF), is_active
- `orders`: id, order_number, customer_id, status(NEU/BEZAHLT/IN_BEARBEITUNG/VERSENDET/
  ABGEHOLT/STORNIERT), items(jsonb), shipping_cost_gross, total_gross, stripe_payment_intent_id,
  invoice_id, shipping_label_url, packing_slip_url (new)
- `invoices`: id, invoice_number, pdf_url, total_net, tax_amount, total_gross, type

## What's implemented (chronological)
- Full storefront: catalog nav (Vehicle→Type→Assembly→Product black tiles), cart, Stripe
  checkout, PDF invoice generation, explosion-drawing UI, Normteile/Abverkauf categories,
  Team page, legal pages, cookie consent, SEO meta tags — all DONE and tested (iter 2-4)
- **2026-09-28**: Fixed Supabase project pause (was DNS-unreachable; user reactivated
  project in dashboard). Applied pending RENNSPORT→TUNING migration (constraint now only
  allows ORIGINAL/TUNING). Added Resend email integration via Emergent managed proxy
  (`email_service.py`, no user API key needed) — sends invoice-download email to customer
  automatically on paid checkout. Built interim Hermes shipping workflow (Hermes has no
  API access yet): admin uploads Hermes label PDF per order in Admin→Bestellungen →
  system auto-generates a packing-slip PDF (reportlab, no prices) → emails label link to
  customer + packing-slip link to warehouse (`lager@kupketuning.de`) → order status →
  VERSENDET. Added admin bulk monthly invoice ZIP export
  (`GET /api/sb/invoices/export?year&month`). Added low-stock banner in Admin→Produkte
  (only counts products with stock_min_alert > 0, fixed after testing feedback).
  All verified via testing_agent (41/41 backend pytest, frontend Playwright pass).

## Env vars (backend/.env)
EMERGENT_EMAIL_KEY, EMAIL_FROM_NAME="Kupke Tuning", WAREHOUSE_EMAIL="lager@kupketuning.de"
(Resend/email — platform-managed, no Resend account needed)
DATABASE_URL / SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY (Supabase — user-owned project,
ref "calysfldoxbbtvveivhp"; was paused Sept 2026, user must keep project active — free-tier
Supabase auto-pauses after ~1 week inactivity)
STRIPE_API_KEY / STRIPE_PUBLISHABLE_KEY / STRIPE_WEBHOOK_SECRET (test mode)

## P0/P1/P2 backlog remaining
- P1 (blocked on user): Real Hermes API integration once user obtains Hermes Business API
  access — would replace the manual-upload interim workflow with fully automated label
  generation. Current interim workflow is fully functional and was explicitly approved.
- P2: Dynamic tiered shipping cost (currently flat 5,95€ Hermes rate) based on cart
  weight/size — `weight_grams` field already exists on products.
- P2 (future, needs asset from user): ~30s intro video of Thomas on homepage.
- Minor code-review notes from testing agent (non-blocking): consider BackgroundTasks for
  the 2 emails in shipping-label upload to avoid blocking the request; consider row-level
  lock on pending_checkouts to fully rule out a checkout-success + webhook race.

## Known operational risk
Supabase free-tier project auto-pauses after inactivity → breaks all `/api/sb/*` endpoints
with DNS/connection errors until user manually resumes it in the Supabase dashboard. If this
recurs, check `getent hosts <ref>.supabase.co` — NXDOMAIN means paused/deleted, not a
sandbox network issue (confirmed independently via Google/Cloudflare DNS during this session).
