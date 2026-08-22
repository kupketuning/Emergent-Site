import os
from pathlib import Path
from dotenv import load_dotenv
import psycopg2

load_dotenv(Path(__file__).parent / '.env')
DSN = os.environ['DATABASE_URL']

def main():
    sql = (Path(__file__).parent / 'supabase_schema.sql').read_text()
    conn = psycopg2.connect(DSN)
    conn.autocommit = True
    cur = conn.cursor()
    print('== Applying schema ==')
    cur.execute(sql)
    print('Schema applied OK')

    # Tables
    cur.execute("""
        select table_name from information_schema.tables
        where table_schema='public' order by table_name;
    """)
    tables = [r[0] for r in cur.fetchall()]
    print('TABLES:', tables)

    # Function exists
    cur.execute("select proname from pg_proc where proname in ('get_next_number','set_updated_at') order by proname;")
    print('FUNCTIONS:', [r[0] for r in cur.fetchall()])

    # Triggers
    cur.execute("select trigger_name, event_object_table from information_schema.triggers where trigger_schema='public' order by 1;")
    print('TRIGGERS:', cur.fetchall())

    # RLS policies count per table
    cur.execute("select tablename, count(*) from pg_policies where schemaname='public' group by tablename order by tablename;")
    print('POLICIES:', cur.fetchall())

    # Test atomic counter
    cur.execute("select get_next_number('order_2026');")
    n1 = cur.fetchone()[0]
    cur.execute("select get_next_number('order_2026');")
    n2 = cur.fetchone()[0]
    print(f'get_next_number order_2026 -> {n1} then {n2} (should increment)')

    # Insert ONE test product
    cur.execute("""
        insert into products (sku, name, description, vehicle, product_type, assembly_group, price_net, is_set, images, dekra_certified, stock_quantity, weight_grams, sort_order, youtube_url)
        values ('TR-T-AB-001', 'Edelstahl-Abgasanlage Gruppe A Trabant 1.1',
                'Komplette Gruppe-A-Abgasanlage aus Edelstahl, speziell fuer den Trabant 1.1 entwickelt und gefertigt.',
                'TRABANT','TUNING','ABGAS', 327.00, false,
                array['https://images.unsplash.com/photo-1691924216519-fe00a5a535ad'], true, 12, 4200, 10, null)
        on conflict (sku) do update set name = excluded.name, updated_at = now()
        returning id, sku, name, price_net, tax_rate, created_at, updated_at;
    """)
    row = cur.fetchone()
    print('INSERTED PRODUCT:', row)
    pid, sku = row[0], row[1]
    created_at, updated_at_1 = row[5], row[6]

    # Test updated_at trigger by updating
    cur.execute("update products set stock_quantity = stock_quantity + 1 where id = %s returning updated_at;", (pid,))
    updated_at_2 = cur.fetchone()[0]
    print(f'updated_at before={updated_at_1} after={updated_at_2} changed={updated_at_2 != updated_at_1}')

    # Count products
    cur.execute("select count(*) from products;")
    print('PRODUCTS COUNT:', cur.fetchone()[0])

    cur.close(); conn.close()
    print('== DONE ==')

if __name__ == '__main__':
    main()
