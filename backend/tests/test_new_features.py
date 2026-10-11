"""Backend tests for Jan-2026 session: support requests, widerruf, phone orders, order status, return label."""
import os
import io
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
def staff_client():
    s = requests.Session()
    r = s.post(f"{BASE_URL}/api/staff-auth/login",
               json={"email": STAFF_EMAIL, "password": STAFF_PASSWORD}, timeout=30)
    assert r.status_code == 200, r.text
    return s


@pytest.fixture(scope="session")
def customer_client():
    s = requests.Session()
    r = s.post(f"{BASE_URL}/api/auth/login",
               json={"email": CUST_EMAIL, "password": CUST_PASSWORD}, timeout=30)
    assert r.status_code == 200, r.text
    return s


@pytest.fixture(scope="session")
def sample_order(customer_client):
    r = customer_client.get(f"{BASE_URL}/api/account/orders", timeout=30)
    assert r.status_code == 200, r.text
    orders = r.json()
    assert orders, "sample customer has no orders"
    return orders[0]


# ---------------- Customer: Mein Konto ----------------
class TestCustomerAccount:
    def test_sample_order_exists(self, sample_order):
        assert sample_order["order_number"] == "2026-00013"
        assert sample_order["status"] == "VERSENDET"
        assert sample_order.get("invoice_pdf_url"), "sample order should have invoice link"
        assert sample_order.get("shipping_label_url"), "sample order should have shipping label"

    def test_list_support_requests_existing(self, customer_client, sample_order):
        r = customer_client.get(
            f"{BASE_URL}/api/account/orders/{sample_order['id']}/support-requests", timeout=30)
        assert r.status_code == 200, r.text
        reqs = r.json()
        assert len(reqs) >= 1
        answered = [x for x in reqs if x["status"] == "BEANTWORTET"]
        assert answered, "expected at least one answered demo request"
        assert answered[0].get("admin_reply")

    def test_create_support_request(self, customer_client, sample_order):
        r = customer_client.post(
            f"{BASE_URL}/api/account/orders/{sample_order['id']}/support-request",
            json={"category": "RUECKFRAGE", "message": "TEST pytest Rückfrage"}, timeout=30)
        assert r.status_code == 200, r.text
        req = r.json()
        assert req["status"] == "OFFEN"
        assert req["category"] == "RUECKFRAGE"

    def test_create_support_request_invalid_category(self, customer_client, sample_order):
        r = customer_client.post(
            f"{BASE_URL}/api/account/orders/{sample_order['id']}/support-request",
            json={"category": "BOGUS", "message": "x"}, timeout=30)
        assert r.status_code == 400

    def test_support_request_not_own_order(self, customer_client):
        bogus_id = str(uuid.uuid4())
        r = customer_client.post(
            f"{BASE_URL}/api/account/orders/{bogus_id}/support-request",
            json={"category": "RUECKFRAGE", "message": "x"}, timeout=30)
        assert r.status_code == 404

    def test_support_request_requires_auth(self):
        r = requests.post(
            f"{BASE_URL}/api/account/orders/{uuid.uuid4()}/support-request",
            json={"category": "RUECKFRAGE", "message": "x"}, timeout=30)
        assert r.status_code in (401, 403)


# ---------------- Staff: support reply + status + return-label ----------------
class TestStaffSupport:
    def test_list_support_requests_requires_staff(self):
        r = requests.get(f"{BASE_URL}/api/staff/support-requests", timeout=30)
        assert r.status_code in (401, 403)

    def test_list_support_requests_as_staff(self, staff_client):
        r = staff_client.get(f"{BASE_URL}/api/staff/support-requests", timeout=30)
        assert r.status_code == 200, r.text
        assert isinstance(r.json(), list)
        assert all("_id" not in x for x in r.json())

    def test_reply_support_request(self, staff_client, customer_client, sample_order):
        # Create a fresh OPEN request as customer
        c = customer_client.post(
            f"{BASE_URL}/api/account/orders/{sample_order['id']}/support-request",
            json={"category": "SONSTIGES", "message": "TEST reply-flow"}, timeout=30)
        assert c.status_code == 200, c.text
        req_id = c.json()["id"]

        r = staff_client.post(
            f"{BASE_URL}/api/staff/support-requests/{req_id}/reply",
            json={"reply": "TEST pytest reply"}, timeout=30)
        assert r.status_code == 200, r.text
        updated = r.json()
        assert updated["status"] == "BEANTWORTET"
        assert updated["admin_reply"] == "TEST pytest reply"

    def test_update_order_status(self, staff_client, sample_order):
        orig = sample_order["status"]
        r = staff_client.patch(
            f"{BASE_URL}/api/sb/orders/{sample_order['id']}/status",
            json={"status": "IN_BEARBEITUNG"}, timeout=30)
        assert r.status_code == 200, r.text
        assert r.json()["status"] == "IN_BEARBEITUNG"
        # Restore original
        back = staff_client.patch(
            f"{BASE_URL}/api/sb/orders/{sample_order['id']}/status",
            json={"status": orig}, timeout=30)
        assert back.status_code == 200
        assert back.json()["status"] == orig

    def test_update_order_status_invalid(self, staff_client, sample_order):
        r = staff_client.patch(
            f"{BASE_URL}/api/sb/orders/{sample_order['id']}/status",
            json={"status": "BOGUS"}, timeout=30)
        assert r.status_code == 400

    def test_update_order_status_404(self, staff_client):
        r = staff_client.patch(
            f"{BASE_URL}/api/sb/orders/{uuid.uuid4()}/status",
            json={"status": "NEU"}, timeout=30)
        assert r.status_code == 404

    def test_return_label_requires_staff(self):
        r = requests.post(
            f"{BASE_URL}/api/sb/orders/{uuid.uuid4()}/return-label",
            files={"file": ("x.pdf", io.BytesIO(b"%PDF-1.4\n"), "application/pdf")}, timeout=30)
        assert r.status_code in (401, 403)

    def test_return_label_404(self, staff_client):
        r = staff_client.post(
            f"{BASE_URL}/api/sb/orders/{uuid.uuid4()}/return-label",
            files={"file": ("x.pdf", io.BytesIO(b"%PDF-1.4\n"), "application/pdf")}, timeout=30)
        assert r.status_code == 404


# ---------------- Widerruf (customer-side cancellation) ----------------
class TestWiderruf:
    def test_widerruf_round_trip(self, customer_client, staff_client, sample_order):
        # Order currently VERSENDET -> eligible
        r = customer_client.post(
            f"{BASE_URL}/api/account/orders/{sample_order['id']}/widerruf", timeout=30)
        assert r.status_code == 200, r.text
        assert r.json()["status"] == "WIDERRUF_ANGEFORDERT"
        # Second attempt -> rejected
        r2 = customer_client.post(
            f"{BASE_URL}/api/account/orders/{sample_order['id']}/widerruf", timeout=30)
        assert r2.status_code == 400
        # Reset via staff
        back = staff_client.patch(
            f"{BASE_URL}/api/sb/orders/{sample_order['id']}/status",
            json={"status": "VERSENDET"}, timeout=30)
        assert back.status_code == 200

    def test_widerruf_requires_auth(self):
        r = requests.post(f"{BASE_URL}/api/account/orders/{uuid.uuid4()}/widerruf", timeout=30)
        assert r.status_code in (401, 403)


# ---------------- Phone Orders ----------------
class TestPhoneOrders:
    created_session = None

    def test_create_phone_order_requires_staff(self):
        r = requests.post(f"{BASE_URL}/api/admin/phone-orders", json={
            "items": [{"product_id": str(uuid.uuid4()), "quantity": 1}],
            "shipping_method": "HERMES",
            "customer": {"email": "x@y.z", "first_name": "A", "last_name": "B",
                         "street": "s", "zip": "1", "city": "c", "country": "DE"},
            "origin_url": BASE_URL}, timeout=30)
        assert r.status_code in (401, 403)

    def test_create_phone_order_success(self, staff_client):
        # pick a priced product
        pr = requests.get(f"{BASE_URL}/api/sb/products", params={"is_active": "true"}, timeout=30).json()
        priced = next((p for p in pr if float(p.get("price_net") or 0) > 0), None)
        assert priced, "need a priced product"
        unique_email = f"test_phone_{uuid.uuid4().hex[:8]}@example.com"
        payload = {
            "items": [{"product_id": priced["id"], "quantity": 1}],
            "shipping_method": "HERMES",
            "customer": {"email": unique_email, "first_name": "TEST", "last_name": "Phone",
                         "street": "Teststr. 1", "zip": "01234", "city": "Testort", "country": "DE"},
            "origin_url": BASE_URL,
        }
        r = staff_client.post(f"{BASE_URL}/api/admin/phone-orders", json=payload, timeout=60)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["session_id"].startswith("cs_")
        assert data["preview_number"].startswith("TEL-")
        assert "/bestellung-bezahlen?session_id=" in data["confirm_link"]
        TestPhoneOrders.created_session = data["session_id"]
        TestPhoneOrders.created_email = unique_email

    def test_phone_order_preview(self):
        assert TestPhoneOrders.created_session
        r = requests.get(f"{BASE_URL}/api/phone-orders/{TestPhoneOrders.created_session}", timeout=30)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["finalized"] is False
        assert data["needs_password"] is True
        assert data["checkout_url"] and data["checkout_url"].startswith("https://checkout.stripe.com")
        assert data["customer_email"] == TestPhoneOrders.created_email
        assert len(data["items"]) == 1

    def test_phone_order_set_password(self):
        s = requests.Session()
        r = s.post(f"{BASE_URL}/api/phone-orders/{TestPhoneOrders.created_session}/set-password",
                   json={"session_id": TestPhoneOrders.created_session, "password": "StrongPass123!"}, timeout=30)
        assert r.status_code == 200, r.text
        # second attempt rejected
        r2 = s.post(f"{BASE_URL}/api/phone-orders/{TestPhoneOrders.created_session}/set-password",
                    json={"session_id": TestPhoneOrders.created_session, "password": "Other123!"}, timeout=30)
        assert r2.status_code == 400
        # After set-password preview should have needs_password=False
        p = requests.get(f"{BASE_URL}/api/phone-orders/{TestPhoneOrders.created_session}", timeout=30)
        assert p.json()["needs_password"] is False

    def test_phone_order_preview_404(self):
        r = requests.get(f"{BASE_URL}/api/phone-orders/cs_doesnotexist", timeout=30)
        assert r.status_code == 404


# ---------------- Welcome email on register ----------------
class TestRegisterWelcome:
    def test_register_new_customer(self):
        email = f"test_welcome_{uuid.uuid4().hex[:8]}@example.com"
        r = requests.post(f"{BASE_URL}/api/auth/register", json={
            "email": email, "password": "StrongPass123!",
            "first_name": "TEST", "last_name": "Welcome"}, timeout=30)
        assert r.status_code == 200, r.text
        assert r.json()["email"] == email


# ---------------- Regression: dashboard metrics + inquiries ----------------
class TestRegression:
    def test_overview_metrics(self, staff_client):
        # dashboard metrics are typically computed from several endpoints
        for path in ("/api/sb/orders", "/api/inquiries", "/api/sb/products"):
            r = staff_client.get(f"{BASE_URL}{path}", timeout=60)
            assert r.status_code == 200, f"{path} => {r.status_code}: {r.text[:200]}"

    def test_general_inquiry_still_works(self, staff_client):
        payload = {"name": "TEST_QA_reg", "email": "qa.reg@kupke.test",
                   "message": "TEST regression inquiry", "product_name": "TEST", "art_nr": "TR-T-MO-001"}
        r = requests.post(f"{BASE_URL}/api/inquiries", json=payload, timeout=30)
        assert r.status_code == 200
        inq_id = r.json()["id"]
        lst = staff_client.get(f"{BASE_URL}/api/inquiries", timeout=30)
        assert any(x["id"] == inq_id for x in lst.json())
        # cleanup
        staff_client.delete(f"{BASE_URL}/api/inquiries/{inq_id}", timeout=30)
