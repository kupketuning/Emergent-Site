"""QA cleanup: removes test order/invoice/customer/products created during E2E testing."""
import asyncio
import os
from pathlib import Path

import asyncpg
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

load_dotenv(Path(__file__).resolve().parents[1] / ".env")

TEST_EMAILS = ("qa.e2e.pay@kupke.test", "qa.e2e@kupke.test", "qa.test@kupke.test")


async def main():
    conn = await asyncpg.connect(os.environ["DATABASE_URL"], statement_cache_size=0)
    try:
        cust = await conn.fetch("select id, email from customers where email = any($1::text[])", list(TEST_EMAILS))
        cids = [c["id"] for c in cust]
        print("test customers:", [c["email"] for c in cust])
        if cids:
            orders = await conn.fetch("select id, order_number from orders where customer_id = any($1::uuid[])", cids)
            print("orders to delete:", [o["order_number"] for o in orders])
            await conn.execute("update orders set invoice_id=null where customer_id = any($1::uuid[])", cids)
            invs = await conn.fetch("select invoice_number from invoices where customer_id = any($1::uuid[])", cids)
            print("invoices to delete:", [i["invoice_number"] for i in invs])
            await conn.execute("delete from invoices where customer_id = any($1::uuid[])", cids)
            await conn.execute("delete from orders where customer_id = any($1::uuid[])", cids)
            await conn.execute("delete from customers where id = any($1::uuid[])", cids)
        # remove QA-created products
        prods = await conn.fetch("delete from products where name like 'TEST_%' returning sku, name")
        print("products deleted:", [(p["sku"], p["name"]) for p in prods])
        # reset counters so production numbering starts fresh
        await conn.execute("delete from counters where id in ('order_2026','invoice_2026')")
        print("counters reset")
        print("remaining orders:", await conn.fetchval("select count(*) from orders"))
        print("remaining invoices:", await conn.fetchval("select count(*) from invoices"))
        print("remaining products:", await conn.fetchval("select count(*) from products"))
    finally:
        await conn.close()

    mc = AsyncIOMotorClient(os.environ["MONGO_URL"])
    mdb = mc[os.environ["DB_NAME"]]
    res = await mdb.pending_checkouts.delete_many({"customer.email": {"$in": list(TEST_EMAILS)}})
    print("mongo pending_checkouts deleted:", res.deleted_count)
    res2 = await mdb.inquiries.delete_many({"name": {"$regex": "^TEST_"}})
    print("mongo test inquiries deleted:", res2.deleted_count)
    mc.close()


asyncio.run(main())
