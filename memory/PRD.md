# Kupke-Tuning (kupketuning.de) — PRD

## Original problem statement
Pixel-perfect clone of trabantwelt.de, modernized for kupketuning.de — a motorsport/tuning
parts shop for Trabant/Wartburg/Barkas B1000. E-commerce storefront with categories,
shopping cart, product variants, inquiry form, admin panel, Stripe checkout, Supabase
(Postgres) backend. User communicates in German — all UI/emails must be German.

## Architecture
- Frontend: React (CRA) + Tailwind, Context API (ProductsContext, CookieConsentContext, AuthContext)
- Backend: FastAPI (`server.py`), Supabase/Postgres via asyncpg (`sb_db.py`), MongoDB for
  legacy products/general inquiries/pending_checkouts, Stripe Checkout, reportlab PDF
  invoices (`invoice.py`), Resend email via Emergent proxy (`email_service.py`),
  JWT cookie auth (`auth_service.py`)
- DB schema: `/app/backend/supabase_schema.sql` (idempotent, run via `apply_schema.py`)

## Key DB schema
- `products`: id, sku, name, vehicle, product_type(ORIGINAL/TUNING), assembly_group,
  price_net, tax_rate, is_set, images, stock_quantity, stock_min_alert,
  special_category(NORMTEIL/ABVERKAUF), is_active
- `orders`: id, order_number, customer_id, status(NEU/BEZAHLT/IN_BEARBEITUNG/VERSENDET/
  ABGEHOLT/WIDERRUF_ANGEFORDERT/STORNIERT), items(jsonb), shipping_cost_gross, total_gross,
  invoice_id, shipping_label_url, packing_slip_url, return_label_url
- `invoices`: id, invoice_number, pdf_url, total_net, tax_amount, total_gross, type
- `users`: id, email, password_hash, name, role(customer/admin/bearbeiter), auth_provider
  (local/google), google_id, is_active, failed_attempts, locked_until
- `password_reset_tokens`: id, user_id, token, expires_at, used
- `support_requests`: id, order_id, customer_id, category(RUECKFRAGE/TERMINANFRAGE/
  REKLAMATION/SONSTIGES), message, status(OFFEN/BEANTWORTET), admin_reply, replied_at

## What's implemented (chronological)
- Full storefront: catalog nav (Vehicle→Type→Assembly→Product black tiles), cart, Stripe
  checkout, PDF invoice generation, explosion-drawing UI, Normteile/Abverkauf categories,
  Team page, legal pages, cookie consent, SEO meta tags, new dark-teal logo with "Tuning"
  wordmark — all DONE and tested
- **2026-09-28**: Fixed Supabase project pause, RENNSPORT→TUNING migration, Resend email
  for invoices, interim Hermes shipping-label workflow (manual PDF upload → auto
  packing-slip → emails to customer+warehouse), admin monthly invoice ZIP export,
  low-stock banner.
- **2026-10-11 (auth system)**: JWT cookie-based auth (`auth_service.py`) replacing the
  shared admin password. Customer accounts (email/password + Emergent-managed Google
  login) with order history at `/konto`. Staff accounts with roles admin/bearbeiter;
  admin manages staff via "Benutzer" tab. Admin "Übersicht" dashboard (orders+revenue
  this month, open inquiries, low-stock count). Password reset flow (shared backend
  endpoints, separate shop/admin UIs). First admin seeded: kupketuning@gmail.com.
- **2026-10-11 (customer account expansion)**: Welcome email on registration. Order status
  stepper in customer account (Neu→Bezahlt→In Bearbeitung→Versendet→Zugestellt), admin can
  change status via dropdown. Per-order support requests (customer picks category, admin
  replies from new "Support" tab, emails both directions). Widerruf (cancellation) by
  customer → notifies admin+warehouse → admin uploads Hermes return-label PDF → customer
  downloads it. Admin "Telefonbestellung" flow: admin builds a multi-item order for a
  customer by email, system emails a confirm+pay link (`/bestellung-bezahlen`), new
  customers set a password first, then pay via existing Stripe checkout. Sample customer
  seeded (`musterkunde@kupketuning.de` / `Musterkunde2026!`) with a demo order showing all
  new features. All verified via testing_agent: 24/24 new backend pytest + 100% frontend
  Playwright flows pass (iteration_6). Minor polish applied after review: removed redundant
  session_id from set-password body, added ESC-key close on phone-order drawer.
- **Logo redesign**: diamond color changed from light to dark teal (#148F81, global
  `--kt-teal` CSS var + all hardcoded hex refs updated); added "Tuning" wordmark (black,
  handwritten Permanent Marker font) top-right of KUPKE lockup, per user-approved draft.
- **Mobile bug fix**: homepage vehicle-tiles grid — the large "Trabant" tile had a
  non-responsive `min-h-[280px]` that overflowed into the row below on mobile (where the
  2-row span only applies at `md:` breakpoint). Fixed to `min-h-[180px] md:min-h-[280px]`.

## Env vars (backend/.env)
EMERGENT_EMAIL_KEY, EMAIL_FROM_NAME="Kupke Tuning", WAREHOUSE_EMAIL="lager@kupketuning.de",
ADMIN_EMAIL="kupketuning@gmail.com", JWT_SECRET (random hex, do not rotate — invalidates
all sessions), DATABASE_URL/SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY (user-owned project,
ref "calysfldoxbbtvveivhp" — auto-pauses on inactivity, see below), STRIPE_API_KEY/
STRIPE_PUBLISHABLE_KEY/STRIPE_WEBHOOK_SECRET (test mode)

## P0/P1/P2 backlog remaining
- P1 (blocked on user): Real Hermes API integration once user obtains Hermes Business API
  access — would replace manual label/return-label upload with full automation.
- P2: Dynamic tiered shipping cost (currently flat 5,95€) based on cart weight/size.
- P2: Continuous support-request dialog (customer can reply to admin's reply) — currently
  single-reply MVP, planned as Phase 2 per user's approved plan.
- P2: Saved addresses + "Bestellung erneut aufgeben" in customer account.
- P2: Order status change audit log (who/when) — flagged by testing agent code review.
- P2 (future, needs asset from user): ~30s intro video of Thomas on homepage.
- P3: Real Hermes API full automation; broader return/exchange self-service.

## Known operational risk
Supabase free-tier project auto-pauses after inactivity → breaks all `/api/sb/*` and auth
endpoints with DNS/connection errors until user manually resumes it in the Supabase
dashboard (Project → Restore). Check `getent hosts <ref>.supabase.co` — NXDOMAIN means
paused/deleted, confirmed independently via Google/Cloudflare DNS (not a sandbox issue).
This has recurred 2x in this session; consider advising user to check periodically or
upgrade off free tier.
