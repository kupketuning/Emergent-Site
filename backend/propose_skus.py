"""Liest die 56 Alt-Produkte aus MongoDB und schlaegt vehicle/product_type/assembly_group + SKU vor.
NUR Vorschlag, KEINE Speicherung in Supabase.
"""
import os, asyncio
from pathlib import Path
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

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

    # vehicle
    vehicle = 'WARTBURG' if 'wartburg' in name.lower() else 'TRABANT'

    # assembly_group
    assembly = CAT_ASSEMBLY.get(cat, 'MOTOR')
    if cat == 'tuning' and kw(name, ['Benzinpumpe', 'elektr']):
        assembly = 'ELEKTRIK'

    # product_type
    if badge in ('Motorsport', 'Rennsport') or kw(text, ['Rennsport', 'Renn-', 'Gruppe A', 'Überrollkäfig', 'Schalensitz', '4-Punkt', 'Mehrkolben', 'ONS']):
        ptype = 'RENNSPORT'
    elif cat in ('tuning', 'fahrwerke', 'raeder') or badge in ('Tuning', 'Exclusiv', 'Leichtbau', 'Neu', 'Eigenentwicklung') or kw(text, ['Sport', 'Tuning', 'GTI', 'Tieferlegung', 'Gewinde', 'K&N', 'Domstrebe', 'Spurverbreiter', 'Felg', 'Fächerkrümmer', 'Doppelvergaser', 'Nockenwelle', 'Kurzhub']):
        ptype = 'TUNING'
    else:
        ptype = 'ORIGINAL'

    # is_set
    is_set = kw(name, ['Komplettbausatz', 'Komplettsystem', 'Komplett-', ' komplett', 'Bausatz', 'Umbausatz', ' Kit', 'Sparset', ' Set', '-Set'])

    return vehicle, ptype, assembly, is_set

async def main():
    client = AsyncIOMotorClient(os.environ['MONGO_URL'])
    db = client[os.environ['DB_NAME']]
    products = await db.products.find().to_list(1000)
    products.sort(key=lambda p: (p.get('category', ''), p.get('name', '')))

    counters = {}
    rows = []
    for p in products:
        vehicle, ptype, assembly, is_set = propose(p)
        base = f"{VMAP[vehicle]}-{TMAP[ptype]}-{AMAP[assembly]}" + ("-SET" if is_set else "")
        counters[base] = counters.get(base, 0) + 1
        sku = f"{base}-{counters[base]:03d}"
        rows.append((p.get('name', ''), p.get('category', ''), vehicle, ptype, assembly, 'ja' if is_set else 'nein', sku))

    print(f"TOTAL {len(rows)}")
    print("| # | Alt-Name | Alt-Kat. | vehicle | product_type | assembly_group | Set | SKU |")
    print("|---|----------|----------|---------|--------------|----------------|-----|-----|")
    for idx, r in enumerate(rows, 1):
        name = r[0] if len(r[0]) <= 46 else r[0][:44] + '..'
        print(f"| {idx} | {name} | {r[1]} | {r[2]} | {r[3]} | {r[4]} | {r[5]} | {r[6]} |")

    client.close()

asyncio.run(main())
