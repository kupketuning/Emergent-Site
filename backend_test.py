#!/usr/bin/env python3
"""
Backend API Testing for Kupke-Tuning - Variants and Inquiries Features
Tests the newly added features at /api prefix using REACT_APP_BACKEND_URL
"""

import requests
import json
from datetime import datetime

# Load backend URL from frontend/.env
BACKEND_URL = "https://design-322.preview.emergentagent.com"
API_BASE = f"{BACKEND_URL}/api"
ADMIN_TOKEN = "kupke-admin"

# Test results tracking
test_results = []
failed_tests = []

def log_test(test_name, passed, details=""):
    """Log test result"""
    status = "✅ PASS" if passed else "❌ FAIL"
    result = f"{status}: {test_name}"
    if details:
        result += f" - {details}"
    test_results.append(result)
    if not passed:
        failed_tests.append(test_name)
    print(result)
    return passed

def test_products_variants_field():
    """Test 1: GET /api/products - confirm products include variants field"""
    print("\n=== Test 1: Products Variants Field ===")
    
    try:
        response = requests.get(f"{API_BASE}/products", timeout=10)
        
        if response.status_code != 200:
            return log_test("GET /api/products status", False, f"Expected 200, got {response.status_code}")
        
        log_test("GET /api/products status", True, "200 OK")
        
        products = response.json()
        
        # Check all products have variants field
        all_have_variants = all("variants" in p for p in products)
        log_test("All products have 'variants' field", all_have_variants)
        
        # Find specific products
        kutfw113535kr = next((p for p in products if p.get("art_nr") == "KUTFW113535KR"), None)
        kutalu1 = next((p for p in products if p.get("art_nr") == "KUTALU1"), None)
        
        # Test KUTFW113535KR - should have 2 variant groups
        if kutfw113535kr:
            variants = kutfw113535kr.get("variants", [])
            has_two_groups = len(variants) == 2
            log_test("KUTFW113535KR has 2 variant groups", has_two_groups, 
                    f"Found {len(variants)} groups: {[v.get('name') for v in variants]}")
            
            if has_two_groups:
                group_names = [v.get("name") for v in variants]
                has_dampfer = "Dämpfer" in group_names
                has_tieferlegung = "Tieferlegung VA/HA" in group_names
                log_test("KUTFW113535KR has 'Dämpfer' group", has_dampfer)
                log_test("KUTFW113535KR has 'Tieferlegung VA/HA' group", has_tieferlegung)
        else:
            log_test("Find product KUTFW113535KR", False, "Product not found")
        
        # Test KUTALU1 - should have 1 variant group
        if kutalu1:
            variants = kutalu1.get("variants", [])
            has_one_group = len(variants) == 1
            log_test("KUTALU1 has 1 variant group", has_one_group,
                    f"Found {len(variants)} groups: {[v.get('name') for v in variants]}")
            
            if has_one_group:
                group_name = variants[0].get("name")
                has_lochkreis = group_name == "Lochkreis"
                log_test("KUTALU1 has 'Lochkreis' group", has_lochkreis, f"Group name: {group_name}")
        else:
            log_test("Find product KUTALU1", False, "Product not found")
        
        # Check that some products have empty variants list
        products_without_variants = [p for p in products if len(p.get("variants", [])) == 0]
        log_test("Some products have empty variants list", len(products_without_variants) > 0,
                f"Found {len(products_without_variants)} products without variants")
        
        return True
        
    except Exception as e:
        log_test("GET /api/products", False, f"Exception: {str(e)}")
        return False


def test_inquiries_create_public():
    """Test 2a: POST /api/inquiries (public, no token)"""
    print("\n=== Test 2a: Create Inquiry (Public) ===")
    
    try:
        inquiry_data = {
            "name": "Max Mustermann",
            "email": "max.mustermann@example.com",
            "phone": "+49 123 456789",
            "product_name": "KONI Komplett-Sportfahrwerk",
            "product_art_nr": "KUTFW113535KR",
            "variant": "KONI-Rot, 35/35 mm",
            "message": "Ich interessiere mich für dieses Sportfahrwerk. Bitte kontaktieren Sie mich."
        }
        
        response = requests.post(f"{API_BASE}/inquiries", json=inquiry_data, timeout=10)
        
        if response.status_code != 200:
            return log_test("POST /api/inquiries (public)", False, 
                          f"Expected 200, got {response.status_code}: {response.text}")
        
        log_test("POST /api/inquiries status", True, "200 OK")
        
        inquiry = response.json()
        
        # Verify response structure
        has_id = "id" in inquiry and inquiry["id"]
        log_test("Inquiry has generated ID", has_id, f"ID: {inquiry.get('id', 'N/A')}")
        
        has_handled = "handled" in inquiry and inquiry["handled"] == False
        log_test("Inquiry has handled=false", has_handled)
        
        has_created_at = "created_at" in inquiry and inquiry["created_at"]
        log_test("Inquiry has created_at", has_created_at)
        
        # Verify all fields are present
        for field in ["name", "email", "phone", "product_name", "product_art_nr", "variant", "message"]:
            has_field = field in inquiry and inquiry[field] == inquiry_data[field]
            log_test(f"Inquiry has correct '{field}'", has_field)
        
        # Store inquiry ID for later tests
        global created_inquiry_id
        created_inquiry_id = inquiry.get("id")
        
        return True
        
    except Exception as e:
        log_test("POST /api/inquiries (public)", False, f"Exception: {str(e)}")
        return False


def test_inquiries_list_without_token():
    """Test 2b: GET /api/inquiries WITHOUT admin token -> 401"""
    print("\n=== Test 2b: List Inquiries Without Token ===")
    
    try:
        response = requests.get(f"{API_BASE}/inquiries", timeout=10)
        
        is_401 = response.status_code == 401
        log_test("GET /api/inquiries without token returns 401", is_401,
                f"Status: {response.status_code}")
        
        return is_401
        
    except Exception as e:
        log_test("GET /api/inquiries without token", False, f"Exception: {str(e)}")
        return False


def test_inquiries_list_with_token():
    """Test 2c: GET /api/inquiries WITH X-Admin-Token header"""
    print("\n=== Test 2c: List Inquiries With Token ===")
    
    try:
        headers = {"X-Admin-Token": ADMIN_TOKEN}
        response = requests.get(f"{API_BASE}/inquiries", headers=headers, timeout=10)
        
        if response.status_code != 200:
            return log_test("GET /api/inquiries with token", False,
                          f"Expected 200, got {response.status_code}: {response.text}")
        
        log_test("GET /api/inquiries with token status", True, "200 OK")
        
        inquiries = response.json()
        
        # Verify it's a list
        is_list = isinstance(inquiries, list)
        log_test("Response is a list", is_list)
        
        if is_list and len(inquiries) > 0:
            # Check if our created inquiry is in the list
            global created_inquiry_id
            found_inquiry = any(inq.get("id") == created_inquiry_id for inq in inquiries)
            log_test("Created inquiry is in the list", found_inquiry)
            
            # Verify sorting (newest first)
            if len(inquiries) > 1:
                dates = [inq.get("created_at") for inq in inquiries if "created_at" in inq]
                is_sorted = dates == sorted(dates, reverse=True)
                log_test("Inquiries sorted newest first", is_sorted)
        
        return True
        
    except Exception as e:
        log_test("GET /api/inquiries with token", False, f"Exception: {str(e)}")
        return False


def test_inquiries_delete_without_token():
    """Test 2d: DELETE /api/inquiries/{id} WITHOUT token -> 401"""
    print("\n=== Test 2d: Delete Inquiry Without Token ===")
    
    try:
        global created_inquiry_id
        response = requests.delete(f"{API_BASE}/inquiries/{created_inquiry_id}", timeout=10)
        
        is_401 = response.status_code == 401
        log_test("DELETE /api/inquiries/{id} without token returns 401", is_401,
                f"Status: {response.status_code}")
        
        return is_401
        
    except Exception as e:
        log_test("DELETE /api/inquiries without token", False, f"Exception: {str(e)}")
        return False


def test_inquiries_delete_with_token():
    """Test 2e: DELETE /api/inquiries/{id} WITH token"""
    print("\n=== Test 2e: Delete Inquiry With Token ===")
    
    try:
        global created_inquiry_id
        headers = {"X-Admin-Token": ADMIN_TOKEN}
        response = requests.delete(f"{API_BASE}/inquiries/{created_inquiry_id}", 
                                  headers=headers, timeout=10)
        
        if response.status_code != 200:
            return log_test("DELETE /api/inquiries/{id} with token", False,
                          f"Expected 200, got {response.status_code}: {response.text}")
        
        log_test("DELETE /api/inquiries/{id} with token status", True, "200 OK")
        
        result = response.json()
        has_success = result.get("success") == True
        log_test("Delete returns {success: true}", has_success, f"Response: {result}")
        
        return True
        
    except Exception as e:
        log_test("DELETE /api/inquiries with token", False, f"Exception: {str(e)}")
        return False


def test_inquiries_delete_nonexistent():
    """Test 2f: DELETE non-existent inquiry WITH token -> 404"""
    print("\n=== Test 2f: Delete Non-existent Inquiry ===")
    
    try:
        fake_id = "00000000-0000-0000-0000-000000000000"
        headers = {"X-Admin-Token": ADMIN_TOKEN}
        response = requests.delete(f"{API_BASE}/inquiries/{fake_id}", 
                                  headers=headers, timeout=10)
        
        is_404 = response.status_code == 404
        log_test("DELETE non-existent inquiry returns 404", is_404,
                f"Status: {response.status_code}")
        
        return is_404
        
    except Exception as e:
        log_test("DELETE non-existent inquiry", False, f"Exception: {str(e)}")
        return False


def test_product_crud_with_variants():
    """Test 3: Create, Update, Delete product WITH variants"""
    print("\n=== Test 3: Product CRUD with Variants ===")
    
    try:
        headers = {"X-Admin-Token": ADMIN_TOKEN}
        
        # Create product with variants
        product_data = {
            "name": "Test Produkt mit Varianten",
            "art_nr": "TEST123",
            "category": "tuning",
            "sub": "Test",
            "brand": "Test Brand",
            "price": 299.99,
            "description": "Test Beschreibung",
            "variants": [
                {
                    "name": "Test Variant Group",
                    "options": ["Option A", "Option B", "Option C"]
                }
            ]
        }
        
        # CREATE
        response = requests.post(f"{API_BASE}/products", json=product_data, 
                               headers=headers, timeout=10)
        
        if response.status_code != 200:
            return log_test("POST /api/products with variants", False,
                          f"Expected 200, got {response.status_code}: {response.text}")
        
        log_test("POST /api/products with variants status", True, "200 OK")
        
        product = response.json()
        product_id = product.get("id")
        
        # Verify variants are stored
        has_variants = "variants" in product and len(product["variants"]) == 1
        log_test("Created product has variants", has_variants,
                f"Variants: {product.get('variants', [])}")
        
        if has_variants:
            variant_group = product["variants"][0]
            correct_name = variant_group.get("name") == "Test Variant Group"
            correct_options = variant_group.get("options") == ["Option A", "Option B", "Option C"]
            log_test("Variant group has correct name", correct_name)
            log_test("Variant group has correct options", correct_options)
        
        # UPDATE - change variants
        update_data = {
            "variants": [
                {
                    "name": "Updated Variant Group",
                    "options": ["New Option 1", "New Option 2"]
                },
                {
                    "name": "Second Group",
                    "options": ["X", "Y", "Z"]
                }
            ]
        }
        
        response = requests.put(f"{API_BASE}/products/{product_id}", 
                              json=update_data, headers=headers, timeout=10)
        
        if response.status_code != 200:
            log_test("PUT /api/products/{id} update variants", False,
                    f"Expected 200, got {response.status_code}: {response.text}")
        else:
            log_test("PUT /api/products/{id} update variants status", True, "200 OK")
            
            updated_product = response.json()
            has_two_groups = len(updated_product.get("variants", [])) == 2
            log_test("Updated product has 2 variant groups", has_two_groups,
                    f"Groups: {[v.get('name') for v in updated_product.get('variants', [])]}")
        
        # DELETE (cleanup)
        response = requests.delete(f"{API_BASE}/products/{product_id}", 
                                 headers=headers, timeout=10)
        
        if response.status_code != 200:
            log_test("DELETE /api/products/{id} cleanup", False,
                    f"Expected 200, got {response.status_code}")
        else:
            log_test("DELETE /api/products/{id} cleanup", True, "Product deleted successfully")
        
        return True
        
    except Exception as e:
        log_test("Product CRUD with variants", False, f"Exception: {str(e)}")
        return False


def main():
    """Run all tests"""
    print("=" * 70)
    print("KUPKE-TUNING BACKEND API TESTS - Variants & Inquiries Features")
    print("=" * 70)
    print(f"Backend URL: {API_BASE}")
    print(f"Admin Token: {ADMIN_TOKEN}")
    print("=" * 70)
    
    # Run all tests
    test_products_variants_field()
    test_inquiries_create_public()
    test_inquiries_list_without_token()
    test_inquiries_list_with_token()
    test_inquiries_delete_without_token()
    test_inquiries_delete_with_token()
    test_inquiries_delete_nonexistent()
    test_product_crud_with_variants()
    
    # Summary
    print("\n" + "=" * 70)
    print("TEST SUMMARY")
    print("=" * 70)
    
    total_tests = len(test_results)
    passed_tests = total_tests - len(failed_tests)
    
    print(f"\nTotal Tests: {total_tests}")
    print(f"Passed: {passed_tests}")
    print(f"Failed: {len(failed_tests)}")
    
    if failed_tests:
        print("\n❌ FAILED TESTS:")
        for test in failed_tests:
            print(f"  - {test}")
    else:
        print("\n✅ ALL TESTS PASSED!")
    
    print("\n" + "=" * 70)
    
    return len(failed_tests) == 0


if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)
