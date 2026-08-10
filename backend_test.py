#!/usr/bin/env python3
"""
Backend API Test Suite for Kupke-Tuning
Tests all endpoints at /api prefix using the production URL
"""
import requests
import sys
import os
from pathlib import Path

# Read REACT_APP_BACKEND_URL from frontend/.env
env_path = Path(__file__).parent / "frontend" / ".env"
BASE_URL = None
with open(env_path) as f:
    for line in f:
        if line.startswith("REACT_APP_BACKEND_URL="):
            BASE_URL = line.split("=", 1)[1].strip()
            break

if not BASE_URL:
    print("❌ ERROR: Could not find REACT_APP_BACKEND_URL in frontend/.env")
    sys.exit(1)

API_URL = f"{BASE_URL}/api"
ADMIN_PASSWORD = "kupke-admin"

# Test results tracking
passed = 0
failed = 0
test_results = []

def test(name, condition, details=""):
    """Track test results"""
    global passed, failed
    if condition:
        passed += 1
        test_results.append(f"✅ {name}")
        print(f"✅ {name}")
    else:
        failed += 1
        test_results.append(f"❌ {name}: {details}")
        print(f"❌ {name}: {details}")
    return condition

def print_section(title):
    """Print section header"""
    print(f"\n{'='*60}")
    print(f"  {title}")
    print(f"{'='*60}")

# Store created product ID for cleanup
created_product_id = None

try:
    print(f"\n🔍 Testing Kupke-Tuning Backend API")
    print(f"📍 Base URL: {BASE_URL}")
    print(f"📍 API URL: {API_URL}")
    
    # ============================================================
    # TEST 1: Root endpoint
    # ============================================================
    print_section("TEST 1: Root Endpoint")
    try:
        resp = requests.get(f"{API_URL}/", timeout=10)
        test("GET /api/ returns 200", resp.status_code == 200, f"Got {resp.status_code}")
        if resp.status_code == 200:
            data = resp.json()
            test("GET /api/ returns correct message", 
                 data.get("message") == "Kupke-Tuning API",
                 f"Got: {data}")
    except Exception as e:
        test("GET /api/ request", False, str(e))
    
    # ============================================================
    # TEST 2: Categories endpoint
    # ============================================================
    print_section("TEST 2: Categories Endpoint")
    try:
        resp = requests.get(f"{API_URL}/categories", timeout=10)
        test("GET /api/categories returns 200", resp.status_code == 200, f"Got {resp.status_code}")
        if resp.status_code == 200:
            categories = resp.json()
            test("GET /api/categories returns 8 categories", 
                 len(categories) == 8,
                 f"Got {len(categories)} categories")
            if len(categories) > 0:
                first_cat = categories[0]
                test("Categories have id/name/sub fields",
                     "id" in first_cat and "name" in first_cat and "sub" in first_cat,
                     f"Got keys: {list(first_cat.keys())}")
    except Exception as e:
        test("GET /api/categories request", False, str(e))
    
    # ============================================================
    # TEST 3: All products endpoint
    # ============================================================
    print_section("TEST 3: All Products Endpoint")
    all_products = []
    try:
        resp = requests.get(f"{API_URL}/products", timeout=10)
        test("GET /api/products returns 200", resp.status_code == 200, f"Got {resp.status_code}")
        if resp.status_code == 200:
            all_products = resp.json()
            test("GET /api/products returns 56 products", 
                 len(all_products) == 56,
                 f"Got {len(all_products)} products")
            if len(all_products) > 0:
                product = all_products[0]
                required_fields = ["id", "art_nr", "name", "category", "sub", "brand", 
                                   "price", "delivery", "badge", "fahrzeug", "image", 
                                   "description", "featured"]
                has_all_fields = all(field in product for field in required_fields)
                test("Products have all required fields",
                     has_all_fields,
                     f"Missing: {[f for f in required_fields if f not in product]}")
    except Exception as e:
        test("GET /api/products request", False, str(e))
    
    # ============================================================
    # TEST 4: Filter by category
    # ============================================================
    print_section("TEST 4: Filter Products by Category")
    try:
        resp = requests.get(f"{API_URL}/products?category=tuning", timeout=10)
        test("GET /api/products?category=tuning returns 200", 
             resp.status_code == 200, f"Got {resp.status_code}")
        if resp.status_code == 200:
            tuning_products = resp.json()
            test("GET /api/products?category=tuning returns only tuning products",
                 len(tuning_products) > 0 and all(p["category"] == "tuning" for p in tuning_products),
                 f"Got {len(tuning_products)} products, categories: {set(p['category'] for p in tuning_products)}")
    except Exception as e:
        test("GET /api/products?category=tuning request", False, str(e))
    
    # ============================================================
    # TEST 5: Search products
    # ============================================================
    print_section("TEST 5: Search Products")
    try:
        resp = requests.get(f"{API_URL}/products?q=KONI", timeout=10)
        test("GET /api/products?q=KONI returns 200", 
             resp.status_code == 200, f"Got {resp.status_code}")
        if resp.status_code == 200:
            koni_products = resp.json()
            test("GET /api/products?q=KONI finds KONI products",
                 len(koni_products) > 0,
                 f"Got {len(koni_products)} products")
            if len(koni_products) > 0:
                # Check if KONI appears in name, description, brand, art_nr, or sub
                has_koni = any(
                    "KONI" in str(p.get("name", "")).upper() or
                    "KONI" in str(p.get("description", "")).upper() or
                    "KONI" in str(p.get("brand", "")).upper() or
                    "KONI" in str(p.get("art_nr", "")).upper() or
                    "KONI" in str(p.get("sub", "")).upper()
                    for p in koni_products
                )
                test("Search results contain KONI in relevant fields",
                     has_koni,
                     f"First product: {koni_products[0].get('name', 'N/A')}")
    except Exception as e:
        test("GET /api/products?q=KONI request", False, str(e))
    
    # ============================================================
    # TEST 6: Filter by featured
    # ============================================================
    print_section("TEST 6: Filter Featured Products")
    try:
        resp = requests.get(f"{API_URL}/products?featured=true", timeout=10)
        test("GET /api/products?featured=true returns 200", 
             resp.status_code == 200, f"Got {resp.status_code}")
        if resp.status_code == 200:
            featured_products = resp.json()
            test("GET /api/products?featured=true returns only featured products",
                 len(featured_products) > 0 and all(p["featured"] == True for p in featured_products),
                 f"Got {len(featured_products)} products, featured status: {[p['featured'] for p in featured_products[:3]]}")
    except Exception as e:
        test("GET /api/products?featured=true request", False, str(e))
    
    # ============================================================
    # TEST 7: Get single product
    # ============================================================
    print_section("TEST 7: Get Single Product")
    if len(all_products) > 0:
        valid_id = all_products[0]["id"]
        try:
            resp = requests.get(f"{API_URL}/products/{valid_id}", timeout=10)
            test("GET /api/products/{valid_id} returns 200", 
                 resp.status_code == 200, f"Got {resp.status_code}")
            if resp.status_code == 200:
                product = resp.json()
                test("GET /api/products/{valid_id} returns correct product",
                     product["id"] == valid_id,
                     f"Expected {valid_id}, got {product.get('id')}")
        except Exception as e:
            test("GET /api/products/{valid_id} request", False, str(e))
        
        # Test invalid ID
        try:
            invalid_id = "invalid-product-id-12345"
            resp = requests.get(f"{API_URL}/products/{invalid_id}", timeout=10)
            test("GET /api/products/{invalid_id} returns 404", 
                 resp.status_code == 404, f"Got {resp.status_code}")
        except Exception as e:
            test("GET /api/products/{invalid_id} request", False, str(e))
    else:
        test("Get single product (skipped - no products)", False, "No products available")
    
    # ============================================================
    # TEST 8: Admin login
    # ============================================================
    print_section("TEST 8: Admin Login")
    admin_token = None
    
    # Test wrong password
    try:
        resp = requests.post(f"{API_URL}/admin/login", 
                            json={"password": "wrong-password"}, 
                            timeout=10)
        test("POST /api/admin/login with wrong password returns 401", 
             resp.status_code == 401, f"Got {resp.status_code}")
    except Exception as e:
        test("POST /api/admin/login with wrong password", False, str(e))
    
    # Test correct password
    try:
        resp = requests.post(f"{API_URL}/admin/login", 
                            json={"password": ADMIN_PASSWORD}, 
                            timeout=10)
        test("POST /api/admin/login with correct password returns 200", 
             resp.status_code == 200, f"Got {resp.status_code}")
        if resp.status_code == 200:
            data = resp.json()
            admin_token = data.get("token")
            test("POST /api/admin/login returns token",
                 admin_token == ADMIN_PASSWORD,
                 f"Expected '{ADMIN_PASSWORD}', got '{admin_token}'")
    except Exception as e:
        test("POST /api/admin/login with correct password", False, str(e))
    
    # ============================================================
    # TEST 9: Create product (protected)
    # ============================================================
    print_section("TEST 9: Create Product (Protected)")
    
    # Test without token
    try:
        new_product = {
            "name": "Test Product",
            "category": "tuning",
            "sub": "Test",
            "brand": "Test Brand",
            "price": 99.99,
            "delivery": "1-2 Tage",
            "description": "Test product for API testing"
        }
        resp = requests.post(f"{API_URL}/products", 
                            json=new_product, 
                            timeout=10)
        test("POST /api/products without token returns 401", 
             resp.status_code == 401, f"Got {resp.status_code}")
    except Exception as e:
        test("POST /api/products without token", False, str(e))
    
    # Test with token
    if admin_token:
        try:
            resp = requests.post(f"{API_URL}/products", 
                                json=new_product,
                                headers={"X-Admin-Token": admin_token},
                                timeout=10)
            test("POST /api/products with token returns 200", 
                 resp.status_code == 200, f"Got {resp.status_code}")
            if resp.status_code == 200:
                created = resp.json()
                created_product_id = created.get("id")
                test("POST /api/products returns product with id",
                     created_product_id is not None,
                     f"Got: {created}")
                test("POST /api/products returns correct name",
                     created.get("name") == new_product["name"],
                     f"Expected '{new_product['name']}', got '{created.get('name')}'")
        except Exception as e:
            test("POST /api/products with token", False, str(e))
    else:
        test("POST /api/products with token (skipped)", False, "No admin token available")
    
    # ============================================================
    # TEST 10: Update product (protected)
    # ============================================================
    print_section("TEST 10: Update Product (Protected)")
    
    if admin_token and created_product_id:
        try:
            update_data = {"price": 149.99}
            resp = requests.put(f"{API_URL}/products/{created_product_id}",
                               json=update_data,
                               headers={"X-Admin-Token": admin_token},
                               timeout=10)
            test("PUT /api/products/{id} with token returns 200", 
                 resp.status_code == 200, f"Got {resp.status_code}")
            if resp.status_code == 200:
                updated = resp.json()
                test("PUT /api/products/{id} updates price",
                     updated.get("price") == 149.99,
                     f"Expected 149.99, got {updated.get('price')}")
        except Exception as e:
            test("PUT /api/products/{id} with token", False, str(e))
    else:
        test("PUT /api/products/{id} (skipped)", False, "No admin token or created product")
    
    # ============================================================
    # TEST 11: Delete product (protected)
    # ============================================================
    print_section("TEST 11: Delete Product (Protected)")
    
    if admin_token and created_product_id:
        try:
            resp = requests.delete(f"{API_URL}/products/{created_product_id}",
                                  headers={"X-Admin-Token": admin_token},
                                  timeout=10)
            test("DELETE /api/products/{id} with token returns 200", 
                 resp.status_code == 200, f"Got {resp.status_code}")
            if resp.status_code == 200:
                data = resp.json()
                test("DELETE /api/products/{id} returns success",
                     data.get("success") == True,
                     f"Got: {data}")
        except Exception as e:
            test("DELETE /api/products/{id} with token", False, str(e))
        
        # Test deleting non-existent product
        try:
            resp = requests.delete(f"{API_URL}/products/{created_product_id}",
                                  headers={"X-Admin-Token": admin_token},
                                  timeout=10)
            test("DELETE /api/products/{non_existent_id} returns 404", 
                 resp.status_code == 404, f"Got {resp.status_code}")
        except Exception as e:
            test("DELETE /api/products/{non_existent_id}", False, str(e))
    else:
        test("DELETE /api/products/{id} (skipped)", False, "No admin token or created product")

except Exception as e:
    print(f"\n❌ FATAL ERROR: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

# ============================================================
# SUMMARY
# ============================================================
print(f"\n{'='*60}")
print(f"  TEST SUMMARY")
print(f"{'='*60}")
print(f"✅ Passed: {passed}")
print(f"❌ Failed: {failed}")
print(f"📊 Total: {passed + failed}")
print(f"{'='*60}\n")

if failed > 0:
    print("❌ SOME TESTS FAILED\n")
    print("Failed tests:")
    for result in test_results:
        if result.startswith("❌"):
            print(f"  {result}")
    sys.exit(1)
else:
    print("✅ ALL TESTS PASSED\n")
    sys.exit(0)
