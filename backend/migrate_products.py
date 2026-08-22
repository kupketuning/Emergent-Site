"""Migriert die 56 Alt-Produkte (MongoDB) in die Supabase products-Tabelle.
Wendet die vom Kunden bestaetigten Korrekturen an und berechnet SKUs deterministisch neu.
"""
import os
from pathlib import Path
from dotenv import load_dotenv
from pymongo import MongoClient
import psycopg2
from psycopg2.extras import execute_values

load_dotenv(Path(__file__).parent / '.env')

VMAP = {'TRABANT': 'TR', 'WARTBURG': 'WA', 'B1000': 'B1', 'VW': 'VW', 'OPEL': 'OP'}
TMAP = {'ORIGINAL': 'O', 'TUNING': 'T', 'RENNSPORT': 'R'}
AMAP = {'MOTOR': 'MO', 'BREMSE': 'BR', 'FAHRWERK': 'FW', 'ABGAS': 'AB', 'ELEKTRIK': 'EL', 'KAROSSERIE': 'KA'}
CAT_ASSEMBLY = {
    'abgasanlagen': 'ABGAS', 'bremsen': 'BREMSE', 'fahrwerke': 'FAHRWERK',
    'raeder': 'FAHRWERK', 'sicherheit': 'KAROSSERIE', 'design': 'KAROSSERIE',
    'motorsport': 'KAROSSERIE', 'tuning': 'MOTOR',
}


def kw(s, words):
    s = s.lower()
    return any(w.lower() in s for w in words)


def propose(p):
    name = p.get('name', ''); cat = p.get('category', ''); badge = (p.get('badge') or '')
    text = f"{name} {p.get('description','')} {badge}"
    vehicle = 'WARTBURG' if 'wartburg' in name.lower() else 'TRABANT'
    assembly = CAT_ASSEMBLY.get(cat, 'MOTOR')
    if cat == 'tuning' and kw(name, ['Benzinpumpe', 'elektr']):
        assembly = 'ELEKTRIK'
    if badge in ('Motorsport', 'Rennsport') or kw(text, ['Rennsport', 'Gruppe A', 'Überrollkäfig', 'Schalensitz', '4-Punkt', 'Mehrkolben', 'ONS']):
        ptype = 'RENNSPORT'
    elif cat in ('tuning', 'fahrwerke', 'raeder') or badge in ('Tuning', 'Exclusiv', 'Leichtbau', 'Neu', 'Eigenentwicklung') or kw(text, ['Sport', 'Tuning', 'GTI', 'Tieferlegung', 'Gewinde', 'K&N', 'Domstrebe', 'Spurverbreiter', 'Felg', 'Fächerkrümmer', 'Doppelvergaser', 'Nockenwelle', 'Kurzhub']):
        ptype = 'TUNING'
    else:
        ptype = 'ORIGINAL'
    is_set = kw(name, ['Komplettbausatz', 'Komplettsystem', 'Komplett-', ' komplett', 'Bausatz', 'Umbausatz', ' Kit', 'Sparset', ' Set', '-Set'])
    return vehicle, ptype, assembly, is_set


def apply_corrections(name, vehicle, ptype, assembly, is_set):
    n = name
    if 'Wartburg-Trommelbremse' in n:
        vehicle, ptype = 'TRABANT', 'TUNING'
    if 'Größere Bremsanlage' in n and 'Umbausatz' in n:
        ptype = 'TUNING'
    if 'Flankenschutz' in n:
        ptype = 'TUNING'
    if 'Karosserie-Versteifungssatz' in n:
        ptype = 'TUNING'
    if 'Überrollbügel' in n:
        ptype = 'RENNSPORT'
    return vehicle, ptype, assembly, is_set


def main():
    mc = MongoClient(os.environ['MONGO_URL'])
    mdb = mc[os.environ['DB_NAME']]
    products = list(mdb.products.find())
    products.sort(key=lambda p: (p.get('category', ''), p.get('name', '')))

    counters = {}
    records = []
    for p in products:
        name = p.get('name', '')
        vehicle, ptype, assembly, is_set = propose(p)
        vehicle, ptype, assembly, is_set = apply_corrections(name, vehicle, ptype, assembly, is_set)
        base = f"{VMAP[vehicle]}-{TMAP[ptype]}-{AMAP[assembly]}" + ("-SET" if is_set else "")
        counters[base] = counters.get(base, 0) + 1
        sku = f"{base}-{counters[base]:03d}"

        price = p.get('price')
        has_price = price is not None and float(price) > 0
        price_net = float(price) if has_price else 0
        is_active = bool(has_price)
        images = [p['image']] if p.get('image') else []
        sort_order = 10 if is_set else 100

        records.append((
            sku, name, p.get('description', ''), vehicle, ptype, assembly,
            price_net, 19.00, is_set, images, False,  # dekra_certified
            0,   # stock_quantity
            5,   # stock_min_alert
            0,   # weight_grams
            is_active, sort_order,
        ))

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    conn.autocommit = True
    cur = conn.cursor()
    cur.execute("delete from products;")
    print("Alte products-Zeilen geloescht.")

    execute_values(cur, """
        insert into products
        (sku, name, description, vehicle, product_type, assembly_group,
         price_net, tax_rate, is_set, images, dekra_certified,
         stock_quantity, stock_min_alert, weight_grams, is_active, sort_order)
        values %s
    """, records)
    print(f"{len(records)} Produkte eingefuegt.")

    # Summary
    cur.execute("select count(*) from products;")
    total = cur.fetchone()[0]
    cur.execute("select is_active, count(*) from products group by is_active order by is_active;")
    active = dict(cur.fetchall())
    cur.execute("select vehicle, count(*) from products group by vehicle order by vehicle;")
    by_vehicle = cur.fetchall()
    cur.execute("select assembly_group, count(*) from products group by assembly_group order by assembly_group;")
    by_assembly = cur.fetchall()
    cur.execute("select product_type, count(*) from products group by product_type order by product_type;")
    by_type = cur.fetchall()
    cur.execute("select count(*) from products where is_set;")
    sets = cur.fetchone()[0]

    print("\n===== ZUSAMMENFASSUNG =====")
    print(f"TOTAL: {total}")
    print(f"AKTIV: {active.get(True,0)} | INAKTIV: {active.get(False,0)}")
    print(f"SETS: {sets}")
    print(f"NACH VEHICLE: {by_vehicle}")
    print(f"NACH ASSEMBLY: {by_assembly}")
    print(f"NACH TYPE: {by_type}")

    cur.close(); conn.close(); mc.close()


if __name__ == '__main__':
    main()
