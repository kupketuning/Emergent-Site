"""Backend tests for Kupke-Tuning: Supabase products, admin auth, checkout (Stripe), orders/invoices."""
import os
import re
import uuid
from pathlib import Path

import pytest
import requests
from dotenv import dotenv_values

frontend_env = dotenv_values("/app/frontend/.env")
base_url = os.environ.get("REACT_APP_BACKEND_URL") or frontend_env.get("REACT_APP_BACKEND_URL")
if not base_url:
    raise RuntimeError("REACT_APP_BACKEND_URL missing")
BASE_URL = base_url.rstrip("/")

CRED_PATH = Path("/app/memory/test_credentials.md")
ADMIN_PASSWORD = "kupke-admin"
if CRED_PATH.exists():
    m = re.search(r'(?im)^\s*[-*]?\s*Password:\s*`?([^`\s]+)', CRED_PATH.read_text())
    if m:
        ADMIN_PASSWORD = m.group(1)

HEADERS_ADMIN = {"X-Admin-Token": ADMIN_PASSWORD, "Content-Type": "application/json"}


@pytest.fixture(scope="session")
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="session")
def sb_products(client):
    r = client.get(f"{BASE_URL}/api/sb/products", params={"is_active": "true"}, timeout=60)
    assert r.status_code == 200, r.text
    data = r.json()
    assert isinstance(data, list) and len(data) > 0
    return data


@pytest.fixture(scope="session")
def priced_product(sb_products):
    priced = [p for p in sb_products if float(p.get("price_net") or 0) > 0]
    if not priced:
        pytest.fail("No priced product (price_net>0) found in Supabase products")
    return priced[0]


@pytest.fixture(scope="session")
def unpriced_product(sb_products):
    un = [p for p in sb_products if float(p.get("price_net") or 0) == 0]
    if not un:
        pytest.fail("No unpriced product found")
    return un[0]


# ---------------- Health / basics ----------------
class TestHealth:
    def test_root(self, client):
        r = client.get(f"{BASE_URL}/api/", timeout=30)
        assert r.status_code == 200
        assert "Kupke" in r.json().get("message", "")

    def test_sb_products_shape(self, sb_products):
        p = sb_products[0]
        for key in ("id", "sku", "name", "price_net", "price_gross", "assembly_group", "is_active"):
            assert key in p, f"missing {key}"
        assert all(x.get("is_active") is True for x in sb_products)
        assert "_id" not in p

    def test_sb_product_detail(self, client, priced_product):
        r = client.get(f"{BASE_URL}/api/sb/products/{priced_product['id']}", timeout=30)
        assert r.status_code == 200
        assert r.json()["sku"] == priced_product["sku"]

    def test_sb_product_404(self, client):
        r = client.get(f"{BASE_URL}/api/sb/products/{uuid.uuid4()}", timeout=30)
        assert r.status_code == 404


# ---------------- Admin auth ----------------
class TestAdminAuth:
    def test_login_success(self, client):
        r = client.post(f"{BASE_URL}/api/admin/login", json={"password": ADMIN_PASSWORD}, timeout=30)
        assert r.status_code == 200, r.text
        assert r.json().get("token") == ADMIN_PASSWORD

    def test_login_wrong_password(self, client):
        r = client.post(f"{BASE_URL}/api/admin/login", json={"password": "wrong"}, timeout=30)
        assert r.status_code == 401

    def test_orders_requires_token(self, client):
        r = client.get(f"{BASE_URL}/api/sb/orders", timeout=60)
        assert r.status_code == 401

    def test_orders_with_token(self, client):
        r = client.get(f"{BASE_URL}/api/sb/orders", headers=HEADERS_ADMIN, timeout=60)
        assert r.status_code == 200, r.text
        assert isinstance(r.json(), list)


# ---------------- Admin product CRUD (Supabase) ----------------
class TestSbProductCRUD:
    created = []

    def test_next_sku(self, client):
        r = client.get(f"{BASE_URL}/api/sb/next-sku", headers=HEADERS_ADMIN, timeout=30,
                       params={"vehicle": "TRABANT", "product_type": "TUNING",
                               "assembly_group": "MOTOR", "is_set": "false"})
        assert r.status_code == 200, r.text
        sku = r.json()["sku"]
        assert re.match(r"^TR-T-MO-\d{3}$", sku), sku

    def test_next_sku_requires_admin(self, client):
        r = client.get(f"{BASE_URL}/api/sb/next-sku", timeout=30,
                       params={"vehicle": "TRABANT", "product_type": "TUNING",
                               "assembly_group": "MOTOR"})
        assert r.status_code == 401

    def test_create_auto_sku_update_delete(self, client):
        payload = {"name": "TEST_Autotest Produkt", "vehicle": "TRABANT", "product_type": "TUNING",
                   "assembly_group": "MOTOR", "price_net": 12.5, "tax_rate": 19,
                   "stock_quantity": 3, "is_active": True, "is_set": False}
        r = client.post(f"{BASE_URL}/api/sb/products", headers=HEADERS_ADMIN, json=payload, timeout=60)
        assert r.status_code == 200, r.text
        prod = r.json()
        pid = prod["id"]
        TestSbProductCRUD.created.append(pid)
        assert prod["sku"] and re.match(r"^TR-T-MO-\d{3}$", prod["sku"]), prod["sku"]
        assert prod["price_gross"] == pytest.approx(14.88, abs=0.02)

        # GET verify persistence
        g = client.get(f"{BASE_URL}/api/sb/products/{pid}", timeout=30)
        assert g.status_code == 200
        assert g.json()["name"] == payload["name"]
        assert float(g.json()["price_net"]) == 12.5

        # UPDATE
        u = client.put(f"{BASE_URL}/api/sb/products/{pid}", headers=HEADERS_ADMIN,
                       json={"name": "TEST_Updated", "stock_quantity": 9}, timeout=60)
        assert u.status_code == 200, u.text
        g2 = client.get(f"{BASE_URL}/api/sb/products/{pid}", timeout=30)
        assert g2.json()["name"] == "TEST_Updated"
        assert g2.json()["stock_quantity"] == 9
        assert g2.json()["sku"] == prod["sku"]  # sku immutable

        # DELETE
        d = client.delete(f"{BASE_URL}/api/sb/products/{pid}", headers=HEADERS_ADMIN, timeout=60)
        assert d.status_code == 200, d.text
        TestSbProductCRUD.created.remove(pid)
        assert client.get(f"{BASE_URL}/api/sb/products/{pid}", timeout=30).status_code == 404

    def test_create_requires_admin(self, client):
        r = client.post(f"{BASE_URL}/api/sb/products", json={"name": "TEST_x", "vehicle": "TRABANT",
                        "product_type": "TUNING", "assembly_group": "MOTOR"}, timeout=30)
        assert r.status_code == 401

    @pytest.fixture(scope="class", autouse=True)
    def cleanup(self, client):
        yield
        for pid in list(TestSbProductCRUD.created):
            client.delete(f"{BASE_URL}/api/sb/products/{pid}", headers=HEADERS_ADMIN, timeout=60)


# ---------------- Checkout ----------------
def _customer():
    return {"email": "qa.test@kupke.test", "first_name": "QA", "last_name": "Tester",
            "street": "Teststr. 1", "zip": "01234", "city": "Testort", "country": "DE"}


class TestCheckout:
    session_id = None

    def test_checkout_priced_product(self, client, priced_product):
        body = {"items": [{"product_id": priced_product["id"], "quantity": 1}],
                "shipping_method": "HERMES", "customer": _customer(),
                "origin_url": BASE_URL}
        r = client.post(f"{BASE_URL}/api/checkout", json=body, timeout=90)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data.get("url", "").startswith("https://checkout.stripe.com"), data
        assert data.get("session_id", "").startswith("cs_"), data
        TestCheckout.session_id = data["session_id"]

    def test_checkout_unpriced_product_blocked(self, client, unpriced_product):
        body = {"items": [{"product_id": unpriced_product["id"], "quantity": 1}],
                "shipping_method": "HERMES", "customer": _customer(), "origin_url": BASE_URL}
        r = client.post(f"{BASE_URL}/api/checkout", json=body, timeout=60)
        assert r.status_code == 400, r.text
        assert "Preisanfrage" in r.json().get("detail", "")

    def test_checkout_empty_cart(self, client):
        r = client.post(f"{BASE_URL}/api/checkout", json={"items": [], "shipping_method": "HERMES",
                        "customer": _customer(), "origin_url": BASE_URL}, timeout=30)
        assert r.status_code == 400
        assert "Warenkorb" in r.json().get("detail", "")

    def test_checkout_invalid_shipping(self, client, priced_product):
        r = client.post(f"{BASE_URL}/api/checkout", json={
            "items": [{"product_id": priced_product["id"], "quantity": 1}],
            "shipping_method": "DHL", "customer": _customer(), "origin_url": BASE_URL}, timeout=30)
        assert r.status_code == 400
        assert "Versandart" in r.json().get("detail", "")

    def test_checkout_unknown_product(self, client):
        r = client.post(f"{BASE_URL}/api/checkout", json={
            "items": [{"product_id": str(uuid.uuid4()), "quantity": 1}],
            "shipping_method": "ABHOLUNG", "customer": _customer(), "origin_url": BASE_URL}, timeout=30)
        assert r.status_code == 404

    def test_checkout_abholung_free_shipping(self, client, priced_product):
        r = client.post(f"{BASE_URL}/api/checkout", json={
            "items": [{"product_id": priced_product["id"], "quantity": 2}],
            "shipping_method": "ABHOLUNG", "customer": _customer(), "origin_url": BASE_URL}, timeout=90)
        assert r.status_code == 200, r.text
        assert r.json()["url"].startswith("https://checkout.stripe.com")

    def test_status_pending(self, client):
        assert TestCheckout.session_id, "checkout session not created"
        r = client.get(f"{BASE_URL}/api/checkout/status/{TestCheckout.session_id}", timeout=60)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["status"] == "PENDING", data
        assert data["order_number"] is None

    def test_status_unknown_session(self, client):
        r = client.get(f"{BASE_URL}/api/checkout/status/cs_test_doesnotexist123", timeout=60)
        assert r.status_code == 404


# ---------------- Stripe webhook signature ----------------
class TestStripeWebhook:
    def test_invalid_signature_rejected(self, client):
        r = requests.post(f"{BASE_URL}/api/stripe-webhook",
                          data=b'{"type":"checkout.session.completed","data":{"object":{"id":"cs_x"}}}',
                          headers={"stripe-signature": "t=1,v1=deadbeef",
                                   "Content-Type": "application/json"}, timeout=30)
        assert r.status_code == 400, r.text
        assert "Signatur" in r.json().get("detail", "")

    def test_missing_signature_rejected(self, client):
        r = requests.post(f"{BASE_URL}/api/stripe-webhook", data=b'{"type":"ping"}',
                          headers={"Content-Type": "application/json"}, timeout=30)
        assert r.status_code == 400, r.text


# ---------------- Orders / invoices shape ----------------
class TestOrdersInvoices:
    def test_orders_shape_and_invoice_links(self, client):
        r = client.get(f"{BASE_URL}/api/sb/orders", headers=HEADERS_ADMIN, timeout=60)
        assert r.status_code == 200, r.text
        orders = r.json()
        assert isinstance(orders, list)
        if not orders:
            pytest.skip("no orders yet - covered by e2e purchase test")
        o = orders[0]
        for key in ("id", "order_number", "status", "items", "total_gross"):
            assert key in o, f"missing {key}"
        assert "_id" not in o
        assert re.match(r"^\d{4}-\d{5}$", o["order_number"]), o["order_number"]
        paid = [x for x in orders if x.get("status") == "BEZAHLT"]
        for p in paid:
            assert p.get("invoice_number"), f"paid order {p['order_number']} has no invoice_number"
            assert re.match(r"^RE-\d{4}-\d{4}$", p["invoice_number"]), p["invoice_number"]
            assert p.get("invoice_pdf_url"), "missing invoice_pdf_url"
            h = requests.get(p["invoice_pdf_url"], timeout=60)
            assert h.status_code == 200, f"pdf not reachable: {h.status_code}"
            assert h.content[:4] == b"%PDF", "invoice url did not return a PDF"


# ---------------- Inquiries (Anfragen tab) + drawings + filters ----------------
class TestInquiriesAndDrawings:
    created_inquiry = None

    def test_create_and_list_inquiry(self, client):
        payload = {"name": "TEST_QA", "email": "qa.inq@kupke.test", "message": "TEST Anfrage",
                   "product_name": "TEST Produkt", "art_nr": "TR-T-MO-999"}
        r = client.post(f"{BASE_URL}/api/inquiries", json=payload, timeout=30)
        assert r.status_code == 200, r.text
        inq = r.json()
        assert inq["email"] == payload["email"]
        assert "id" in inq and "_id" not in inq
        TestInquiriesAndDrawings.created_inquiry = inq["id"]

        lst = client.get(f"{BASE_URL}/api/inquiries", headers=HEADERS_ADMIN, timeout=30)
        assert lst.status_code == 200, lst.text
        assert any(x["id"] == inq["id"] for x in lst.json())

    def test_inquiries_requires_admin(self, client):
        r = client.get(f"{BASE_URL}/api/inquiries", timeout=30)
        assert r.status_code == 401

    def test_explosion_drawings_list(self, client):
        r = client.get(f"{BASE_URL}/api/sb/explosion-drawings",
                       params={"vehicle": "TRABANT", "assembly_group": "FAHRWERK"}, timeout=30)
        assert r.status_code == 200, r.text
        assert isinstance(r.json(), list)

    def test_products_is_active_false_filter(self, client):
        r = client.get(f"{BASE_URL}/api/sb/products", params={"is_active": "false"}, timeout=60)
        assert r.status_code == 200, r.text
        assert all(p.get("is_active") is False for p in r.json())

    def test_products_no_filter_returns_all(self, client, sb_products):
        r = client.get(f"{BASE_URL}/api/sb/products", timeout=60)
        assert r.status_code == 200
        assert len(r.json()) >= len(sb_products)

    @pytest.fixture(scope="class", autouse=True)
    def cleanup_inq(self, client):
        yield
        if TestInquiriesAndDrawings.created_inquiry:
            client.delete(f"{BASE_URL}/api/inquiries/{TestInquiriesAndDrawings.created_inquiry}",
                          headers=HEADERS_ADMIN, timeout=30)


# ---------------- Image upload + watermark (/api/sb/upload) ----------------
class TestUpload:
    def test_upload_requires_admin(self, client):
        import io
        buf = io.BytesIO(b"notanimage")
        r = requests.post(f"{BASE_URL}/api/sb/upload",
                          files={"files": ("TEST_x.png", buf, "image/png")}, timeout=60)
        assert r.status_code == 401, r.text

    def test_upload_image_returns_public_url(self):
        import io
        from PIL import Image
        img = Image.new("RGB", (600, 400), (30, 90, 180))
        buf = io.BytesIO()
        img.save(buf, format="PNG")
        buf.seek(0)
        r = requests.post(f"{BASE_URL}/api/sb/upload",
                          headers={"X-Admin-Token": ADMIN_PASSWORD},
                          files={"files": ("TEST_watermark.png", buf, "image/png")}, timeout=120)
        assert r.status_code == 200, r.text
        data = r.json()
        assert isinstance(data.get("urls"), list) and len(data["urls"]) == 1, data
        url = data["urls"][0]
        assert url.startswith("http"), url
        # URL must serve a real image
        h = requests.get(url, timeout=60)
        assert h.status_code == 200, f"uploaded image not reachable: {h.status_code}"
        out = Image.open(io.BytesIO(h.content))
        assert out.size[0] > 0 and out.size[1] > 0
        # watermark applied -> pixels are no longer uniform solid colour
        colors = out.convert("RGB").getcolors(maxcolors=100000)
        assert colors is not None and len(colors) > 1, "image appears unmodified (no watermark)"



# ---------------- Special categories (Normteil / Abverkauf) + vehicle_model ----------------
class TestSpecialCategories:
    created = []

    def test_next_sku_normteil(self, client):
        r = client.get(f"{BASE_URL}/api/sb/next-sku", headers=HEADERS_ADMIN,
                       params={"special_category": "NORMTEIL"}, timeout=30)
        assert r.status_code == 200, r.text
        assert re.match(r"^NT-\d{3}$", r.json()["sku"]), r.json()

    def test_next_sku_abverkauf(self, client):
        r = client.get(f"{BASE_URL}/api/sb/next-sku", headers=HEADERS_ADMIN,
                       params={"special_category": "ABVERKAUF"}, timeout=30)
        assert r.status_code == 200, r.text
        assert re.match(r"^AV-\d{3}$", r.json()["sku"]), r.json()

    def test_create_normteil_and_filter(self, client):
        payload = {"name": "TEST_Normteil Schraube M8", "special_category": "NORMTEIL",
                   "vehicle": None, "product_type": None, "assembly_group": None,
                   "price_net": 0.5, "tax_rate": 19, "stock_quantity": 100, "is_active": True}
        r = client.post(f"{BASE_URL}/api/sb/products", headers=HEADERS_ADMIN, json=payload, timeout=60)
        assert r.status_code == 200, r.text
        prod = r.json()
        TestSpecialCategories.created.append(prod["id"])
        assert re.match(r"^NT-\d{3}$", prod["sku"]), prod["sku"]
        assert prod["special_category"] == "NORMTEIL"

        # filter by special_category
        f = client.get(f"{BASE_URL}/api/sb/products",
                       params={"special_category": "NORMTEIL"}, timeout=60)
        assert f.status_code == 200
        assert any(p["id"] == prod["id"] for p in f.json())
        assert all(p.get("special_category") == "NORMTEIL" for p in f.json())

    def test_create_abverkauf(self, client):
        payload = {"name": "TEST_Abverkauf Deko", "special_category": "ABVERKAUF",
                   "price_net": 5, "tax_rate": 19, "stock_quantity": 1, "is_active": True}
        r = client.post(f"{BASE_URL}/api/sb/products", headers=HEADERS_ADMIN, json=payload, timeout=60)
        assert r.status_code == 200, r.text
        prod = r.json()
        TestSpecialCategories.created.append(prod["id"])
        assert re.match(r"^AV-\d{3}$", prod["sku"]), prod["sku"]

    def test_create_trabant_with_vehicle_model(self, client):
        payload = {"name": "TEST_Trabant P601 Motorteil", "vehicle": "TRABANT", "vehicle_model": "P601",
                   "product_type": "TUNING", "assembly_group": "MOTOR",
                   "price_net": 20, "tax_rate": 19, "stock_quantity": 1, "is_active": True}
        r = client.post(f"{BASE_URL}/api/sb/products", headers=HEADERS_ADMIN, json=payload, timeout=60)
        assert r.status_code == 200, r.text
        prod = r.json()
        TestSpecialCategories.created.append(prod["id"])
        assert prod.get("vehicle_model") == "P601"

        g = client.get(f"{BASE_URL}/api/sb/products/{prod['id']}", timeout=30)
        assert g.json().get("vehicle_model") == "P601"

    @pytest.fixture(scope="class", autouse=True)
    def cleanup(self, client):
        yield
        for pid in list(TestSpecialCategories.created):
            client.delete(f"{BASE_URL}/api/sb/products/{pid}", headers=HEADERS_ADMIN, timeout=60)


# ---------------- New session: shipping-label + ZIP invoice export + RENNSPORT removed ----------------
class TestShippingLabelAndInvoiceExport:
    def test_shipping_label_requires_admin(self, client):
        import io
        r = requests.post(
            f"{BASE_URL}/api/sb/orders/00000000-0000-0000-0000-000000000000/shipping-label",
            files={"file": ("test.pdf", io.BytesIO(b"%PDF-1.4\n%dummy"), "application/pdf")},
            timeout=30)
        assert r.status_code == 401, r.text

    def test_shipping_label_404_for_unknown_order(self, client):
        import io
        r = requests.post(
            f"{BASE_URL}/api/sb/orders/00000000-0000-0000-0000-000000000000/shipping-label",
            headers={"X-Admin-Token": ADMIN_PASSWORD},
            files={"file": ("test.pdf", io.BytesIO(b"%PDF-1.4\n%dummy"), "application/pdf")},
            timeout=60)
        assert r.status_code == 404, r.text

    def test_invoice_export_requires_admin(self, client):
        r = client.get(f"{BASE_URL}/api/sb/invoices/export?year=2026&month=1", timeout=30)
        assert r.status_code == 401

    def test_invoice_export_invalid_month(self, client):
        r = client.get(f"{BASE_URL}/api/sb/invoices/export?year=2026&month=13",
                       headers=HEADERS_ADMIN, timeout=30)
        assert r.status_code == 400

    def test_invoice_export_returns_zip_or_404(self, client):
        # If invoices exist for Jan 2026 -> 200 zip; otherwise 404 (documented expected behavior)
        r = client.get(f"{BASE_URL}/api/sb/invoices/export?year=2026&month=1",
                       headers=HEADERS_ADMIN, timeout=90)
        assert r.status_code in (200, 404), r.text
        if r.status_code == 200:
            assert r.headers.get("content-type", "").startswith("application/zip")
            assert r.content[:2] == b"PK", "response is not a zip file"

    def test_orders_have_shipping_columns(self, client):
        """Every order row must expose shipping_label_url + packing_slip_url keys (may be null)."""
        r = client.get(f"{BASE_URL}/api/sb/orders", headers=HEADERS_ADMIN, timeout=60)
        assert r.status_code == 200
        orders = r.json()
        if not orders:
            pytest.skip("no orders")
        for o in orders:
            assert "shipping_label_url" in o
            assert "packing_slip_url" in o


class TestRennsportRemoved:
    def test_no_rennsport_products_in_db(self, client):
        """After migration the CHECK constraint only allows ORIGINAL/TUNING."""
        r = client.get(f"{BASE_URL}/api/sb/products", timeout=60)
        assert r.status_code == 200
        for p in r.json():
            assert p.get("product_type") != "RENNSPORT", f"RENNSPORT still present in {p.get('sku')}"

    def test_cannot_create_rennsport_product(self, client):
        payload = {"name": "TEST_Rennsport disallowed", "vehicle": "TRABANT",
                   "product_type": "RENNSPORT", "assembly_group": "MOTOR",
                   "price_net": 1, "tax_rate": 19, "is_active": True}
        r = client.post(f"{BASE_URL}/api/sb/products", headers=HEADERS_ADMIN,
                        json=payload, timeout=60)
        # DB CHECK constraint must reject -> 500 (asyncpg CheckViolation) or 400
        assert r.status_code >= 400, f"expected failure, got {r.status_code}: {r.text}"
