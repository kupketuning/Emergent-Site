import os, json, requests

API_URL = os.popen("grep REACT_APP_BACKEND_URL /app/frontend/.env | cut -d '=' -f2").read().strip()
TOKEN = "kupke-admin"
DRAWING_ID = "15942503-0520-4a03-ae3d-dc3210d4f33c"

PARTS = [
    {"bild": "*", "sach": "03 16712 007", "menge": 1, "name": "Abgasanlage komplett – Trabant 1.1 Tuning", "is_set": True},
    {"bild": "1", "sach": "40 15053 101", "menge": 1, "name": "Eingangsrohr"},
    {"bild": "2", "sach": "03 16791 004", "menge": 2, "name": "Schelle TGL 14415"},
    {"bild": "3", "sach": "", "menge": 2, "name": "Sechskantschraube M8x45 TGL 0-931"},
    {"bild": "4", "sach": "", "menge": 2, "name": "Sechskantmutter M8 TGL 0-934"},
    {"bild": "5", "sach": "03 16373 502", "menge": 1, "name": "Schelle Innenteil"},
    {"bild": "6", "sach": "03 16374 503", "menge": 1, "name": "Schelle Außenteil"},
    {"bild": "7", "sach": "", "menge": 2, "name": "Innensechskantschraube M8x20 TGL 42698"},
    {"bild": "8", "sach": "", "menge": 2, "name": "Scheibe 8,4 TGL 0-9021"},
    {"bild": "9", "sach": "", "menge": 2, "name": "Federring B8 TGL 7403"},
    {"bild": "10", "sach": "53 22110 102", "menge": 4, "name": "Aufhängeelement"},
    {"bild": "11", "sach": "40 15051 108", "menge": 1, "name": "Auspuffgeräusch-Vordämpfer"},
    {"bild": "12", "sach": "40 15052 100", "menge": 1, "name": "Auspuffgeräusch-Nachdämpfer"},
    {"bild": "13", "sach": "03 16316 502", "menge": 2, "name": "Klemmschelle"},
    {"bild": "14", "sach": "", "menge": 1, "name": "Sechskantschraube M8 (Endschalldämpfer-Befestigung)", "note": "geschätzt anhand Zeichnung, nicht im Originaldokument aufgeführt"},
    {"bild": "15", "sach": "", "menge": 1, "name": "Scheibe 8,4 (Endschalldämpfer-Befestigung)", "note": "geschätzt anhand Zeichnung, nicht im Originaldokument aufgeführt"},
    {"bild": "16", "sach": "", "menge": 2, "name": "Sechskantmutter M8 (Endschalldämpfer-Befestigung)", "note": "geschätzt anhand Zeichnung, nicht im Originaldokument aufgeführt"},
    {"bild": "17", "sach": "", "menge": 1, "name": "Hitzeschutzblech", "note": "geschätzt anhand Zeichnung, nicht im Originaldokument aufgeführt"},
]

created = []
for i, p in enumerate(PARTS):
    desc_bits = [f"Position {p['bild']} der Explosionszeichnung Abgasanlage Trabant 1.1 Tuning.", f"Menge im Fahrzeug: {p['menge']} Stück."]
    if p.get("sach"):
        desc_bits.append(f"Sachnummer: {p['sach']}.")
    if p.get("note"):
        desc_bits.append(f"Hinweis: {p['note']}")
    payload = {
        "name": p["name"],
        "description": " ".join(desc_bits),
        "vehicle": "TRABANT",
        "vehicle_model": "1.1",
        "product_type": "TUNING",
        "assembly_group": "ABGAS",
        "explosion_drawing_id": DRAWING_ID,
        "is_set": bool(p.get("is_set")),
        "price_net": 1.00,
        "tax_rate": 19,
        "stock_quantity": 25,
        "stock_min_alert": 5,
        "sort_order": i,
        "is_active": True,
        "images": [],
    }
    r = requests.post(f"{API_URL}/api/sb/products", json=payload, headers={"X-Admin-Token": TOKEN})
    r.raise_for_status()
    d = r.json()
    created.append((d["sku"], d["name"]))
    print(d["sku"], "-", d["name"])

print(f"\n{len(created)} Produkte angelegt.")
