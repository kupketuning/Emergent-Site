"""Backend tests for Jan-2026 iteration 7: delivery-note, phone-order custom item, Bestandskunden, 3-option confirm."""
import os
import uuid
import pytest
import requests
from dotenv import dotenv_values

frontend_env = dotenv_values("/app/frontend/.env")
BASE_URL = (os.environ.get("REACT_APP_BACKEND_URL") or frontend_env.get("REACT_APP_BACKEND_URL")).rstrip("/")

STAFF_EMAIL = "kupketuning@gmail.com"
STAFF_PASSWORD = "kupke-admin"
CUST_EMAIL = "musterkunde@kupketuning.de"
CUST_PASSWORD = "Musterkunde2026!"


@pytest.fixture(scope="session")
def staff():
    s = requests.Session()
    r = s.post(f"{BASE_URL}/api/staff-auth/login",
               json={"email": STAFF_EMAIL, "password": STAFF_PASSWORD}, timeout=30)
    assert r.status_code == 200, r.text
    return s


@pytest.fixture(scope="session")
def customer():
    s = requests.Session()
    r = s.post(f"{BASE_URL}/api/auth/login",
               json={"email": CUST_EMAIL, "password": CUST_PASSWORD}, timeout=30)
    assert r.status_code == 200, r.text
    return s


@pytest.fixture(scope="session")
def sample_order(customer):
    r = customer.get(f"{BASE_URL}/api/account/orders", timeout=30)
    assert r.status_code == 200
    orders = r.json()
    assert orders
    return orders[0]


# ---------- GET /staff/customers (new) ----------
class TestStaffCustomers:
    def test_requires_auth(self):
        r = requests.get(f"{BASE_URL}/api/staff/customers", timeout=30)
        assert r.status_code in (401, 403)

    def test_lists_customers_includes_musterkunde(self, staff):
        r = staff.get(f"{BASE_URL}/api/staff/customers", timeout=30)
        assert r.status_code == 200, r.text
        data = r.json()
        assert isinstance(data, list)
        assert any(c.get("email") == CUST_EMAIL for c in data)
        # Ensure no mongo _id leaks
        for c in data[:5]:
            assert "_id" not in c
            for key in ("email", "first_name", "last_name"):
                assert key in c


# ---------- Phone order: custom item only ----------
class TestPhoneOrderCustomItem:
    created_pid = None
    created_sku = None
    created_session = None
    created_email = None

    def test_create_phone_order_custom_only(self, staff):
        unique_email = f"test_custom_{uuid.uuid4().hex[:8]}@example.com"
        TestPhoneOrderCustomItem.created_email = unique_email
        payload = {
            "customer": {"email": unique_email, "first_name": "TEST", "last_name": "Custom",
                         "street": "Teststr. 2", "zip": "01234", "city": "Testort", "country": "DE"},
            "items": [],
            "custom_item": {
                "name": "TEST_Individuelle Spezialanfertigung",
                "price_net": 123.45,
                "tax_rate": 19,
                "shipping_cost_gross_override": 15.00,
                "lead_time_text": "Lieferung in 5 Werktagen",
            },
            "shipping_method": "HERMES",
            "origin_url": BASE_URL,
        }
        r = staff.post(f"{BASE_URL}/api/admin/phone-orders", json=payload, timeout=60)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["session_id"].startswith("cs_")
        assert data["preview_number"].startswith("TEL-")
        TestPhoneOrderCustomItem.created_session = data["session_id"]

    def test_preview_has_lead_time_and_no_needs_password(self):
        sid = TestPhoneOrderCustomItem.created_session
        assert sid
        r = requests.get(f"{BASE_URL}/api/phone-orders/{sid}", timeout=30)
        assert r.status_code == 200, r.text
        data = r.json()
        assert "needs_password" not in data, "needs_password field must be removed"
        assert data.get("lead_time_text") == "Lieferung in 5 Werktagen"
        assert data["customer_email"] == TestPhoneOrderCustomItem.created_email
        assert len(data["items"]) == 1
        assert data["items"][0]["name"].startswith("TEST_")
        # Shipping cost override took effect (15.00)
        assert float(data["shipping_cost_gross"]) == pytest.approx(15.00, abs=0.01)
        # capture created product id
        TestPhoneOrderCustomItem.created_pid = data["items"][0]["product_id"]
        TestPhoneOrderCustomItem.created_sku = data["items"][0]["sku"]

    def test_individuell_product_sku_prefix(self):
        assert TestPhoneOrderCustomItem.created_sku
        assert TestPhoneOrderCustomItem.created_sku.startswith("IND-"), \
            f"Expected IND- prefix, got {TestPhoneOrderCustomItem.created_sku}"

    def test_individuell_product_not_in_public_catalog(self):
        pid = TestPhoneOrderCustomItem.created_pid
        assert pid
        r = requests.get(f"{BASE_URL}/api/sb/products", params={"is_active": "true"}, timeout=60)
        assert r.status_code == 200
        prods = r.json()
        assert not any(p["id"] == pid for p in prods), \
            "INDIVIDUELL custom item leaked into public is_active=true catalog"

    def test_individuell_product_has_correct_fields(self, staff):
        pid = TestPhoneOrderCustomItem.created_pid
        # Admin can view via is_active=false filter
        r = requests.get(f"{BASE_URL}/api/sb/products", params={"is_active": "false"}, timeout=60)
        assert r.status_code == 200
        match = next((p for p in r.json() if p["id"] == pid), None)
        assert match, "created individuell product not found via is_active=false"
        assert match["is_active"] is False
        assert match["special_category"] == "INDIVIDUELL"
        assert match["sku"].startswith("IND-")

    def test_set_password_endpoint_removed(self):
        sid = TestPhoneOrderCustomItem.created_session
        r = requests.post(f"{BASE_URL}/api/phone-orders/{sid}/set-password",
                          json={"session_id": sid, "password": "StrongPass123!"}, timeout=30)
        assert r.status_code in (404, 405), f"Expected 404/405 (removed), got {r.status_code}"


# ---------- Phone order: catalog + custom combined ----------
class TestPhoneOrderCombined:
    def test_catalog_plus_custom(self, staff):
        prods = requests.get(f"{BASE_URL}/api/sb/products",
                             params={"is_active": "true"}, timeout=30).json()
        priced = next((p for p in prods if float(p.get("price_net") or 0) > 0), None)
        assert priced
        unique_email = f"test_combo_{uuid.uuid4().hex[:8]}@example.com"
        payload = {
            "customer": {"email": unique_email, "first_name": "A", "last_name": "B",
                         "street": "s", "zip": "01234", "city": "c", "country": "DE"},
            "items": [{"product_id": priced["id"], "quantity": 1}],
            "custom_item": {"name": "TEST_Zusatz", "price_net": 5.0, "tax_rate": 19,
                            "lead_time_text": "7 Tage"},
            "shipping_method": "HERMES",
            "origin_url": BASE_URL,
        }
        r = staff.post(f"{BASE_URL}/api/admin/phone-orders", json=payload, timeout=60)
        assert r.status_code == 200, r.text
        sid = r.json()["session_id"]
        pr = requests.get(f"{BASE_URL}/api/phone-orders/{sid}", timeout=30).json()
        assert len(pr["items"]) == 2
        assert pr["lead_time_text"] == "7 Tage"

    def test_empty_items_and_no_custom_rejected(self, staff):
        payload = {
            "customer": {"email": "x@y.z", "first_name": "A", "last_name": "B",
                         "street": "s", "zip": "1", "city": "c", "country": "DE"},
            "items": [],
            "shipping_method": "HERMES",
            "origin_url": BASE_URL,
        }
        r = staff.post(f"{BASE_URL}/api/admin/phone-orders", json=payload, timeout=30)
        assert r.status_code == 400


# ---------- Delivery note endpoint ----------
class TestDeliveryNote:
    def test_requires_staff(self, sample_order):
        r = requests.get(f"{BASE_URL}/api/sb/orders/{sample_order['id']}/delivery-note", timeout=30)
        assert r.status_code in (401, 403)

    def test_404_for_unknown(self, staff):
        r = staff.get(f"{BASE_URL}/api/sb/orders/{uuid.uuid4()}/delivery-note", timeout=30)
        assert r.status_code == 404

    def test_returns_pdf(self, staff, sample_order):
        r = staff.get(f"{BASE_URL}/api/sb/orders/{sample_order['id']}/delivery-note", timeout=60)
        assert r.status_code == 200, r.text
        assert r.headers.get("content-type", "").startswith("application/pdf")
        assert r.content[:4] == b"%PDF"
        # Content should contain 'LIEFERSCHEIN' not 'PACKZETTEL'
        # (basic byte-level check; PDF text may be fragmented but headline is often extractable)
        assert b"LIEFERSCHEIN" in r.content or b"Lieferschein" in r.content

    def test_delivery_note_works_for_any_status(self, staff, sample_order):
        # Try to toggle to IN_BEARBEITUNG and still download
        orig = sample_order["status"]
        staff.patch(f"{BASE_URL}/api/sb/orders/{sample_order['id']}/status",
                    json={"status": "IN_BEARBEITUNG"}, timeout=30)
        try:
            r = staff.get(f"{BASE_URL}/api/sb/orders/{sample_order['id']}/delivery-note", timeout=60)
            assert r.status_code == 200
            assert r.content[:4] == b"%PDF"
        finally:
            staff.patch(f"{BASE_URL}/api/sb/orders/{sample_order['id']}/status",
                        json={"status": orig}, timeout=30)


# ---------- VERSENDET auto-email trigger (idempotency) ----------
class TestVersendetAutoEmail:
    def test_status_change_to_versendet_no_duplicate(self, staff, sample_order):
        # Reset to IN_BEARBEITUNG first
        r0 = staff.patch(f"{BASE_URL}/api/sb/orders/{sample_order['id']}/status",
                         json={"status": "IN_BEARBEITUNG"}, timeout=30)
        assert r0.status_code == 200
        # Transition to VERSENDET (should trigger email send, but request must succeed either way)
        r1 = staff.patch(f"{BASE_URL}/api/sb/orders/{sample_order['id']}/status",
                         json={"status": "VERSENDET"}, timeout=60)
        assert r1.status_code == 200
        assert r1.json()["status"] == "VERSENDET"
        # Second VERSENDET -> must still 200, but should NOT re-send (we can only check 200)
        r2 = staff.patch(f"{BASE_URL}/api/sb/orders/{sample_order['id']}/status",
                         json={"status": "VERSENDET"}, timeout=30)
        assert r2.status_code == 200


# ---------- Regression: PACKZETTEL (shipping label) stays PACKZETTEL ----------
class TestShippingLabelRegression:
    def test_shipping_label_endpoint_still_requires_staff(self):
        import io
        r = requests.post(
            f"{BASE_URL}/api/sb/orders/{uuid.uuid4()}/shipping-label",
            files={"file": ("x.pdf", io.BytesIO(b"%PDF-1.4\n"), "application/pdf")}, timeout=30)
        assert r.status_code in (401, 403)


# ---------- Regression: existing endpoints still intact ----------
class TestRegression:
    def test_products_public_ok(self):
        r = requests.get(f"{BASE_URL}/api/sb/products", params={"is_active": "true"}, timeout=30)
        assert r.status_code == 200
        prods = r.json()
        # No INDIVIDUELL leaks
        for p in prods:
            assert p.get("special_category") != "INDIVIDUELL"

    def test_staff_orders_list(self, staff):
        r = staff.get(f"{BASE_URL}/api/sb/orders", timeout=60)
        assert r.status_code == 200

    def test_account_orders_still_works(self, customer):
        r = customer.get(f"{BASE_URL}/api/account/orders", timeout=30)
        assert r.status_code == 200

    def test_support_requests_still_work(self, customer, sample_order):
        r = customer.get(
            f"{BASE_URL}/api/account/orders/{sample_order['id']}/support-requests", timeout=30)
        assert r.status_code == 200
