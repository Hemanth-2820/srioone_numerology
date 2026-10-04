import os
import json
import re

workspace = r"c:\Users\DELL\Documents\srioone_numerology\srionegrow"
src_dir = os.path.join(workspace, "src")
products_file = os.path.join(src_dir, "data", "products.js")

with open(products_file, 'r', encoding='utf-8') as f:
    content = f.read()

products_match = re.search(r"export const products = (\[.*?\]);", content, re.DOTALL)
images_match = re.search(r"export const productImages = (\{.*?\});", content, re.DOTALL)

if products_match:
    products_str = products_match.group(1)
    products_str = re.sub(r'([{,]\s*)([a-zA-Z0-9_]+)(\s*:)', r'\1"\2"\3', products_str)
    products_str = re.sub(r',\s*]', ']', products_str)
    try:
        products = json.loads(products_str)
    except Exception as e:
        products = []
else:
    products = []

images = {}
if images_match:
    images_str = images_match.group(1)
    images_str = re.sub(r'([{,]\s*)([a-zA-Z0-9_]+)(\s*:)', r'\1"\2"\3', images_str)
    try:
        images = json.loads(images_str)
    except:
        pass

sql_statements = []
sql_statements.append("/* -------------------------------------------------------- */")
sql_statements.append("/* Run this in phpMyAdmin to seed all your default products */")
sql_statements.append("/* -------------------------------------------------------- */\n")

for p in products:
    name = p.get('name', '').replace("'", "''")
    price_str = re.sub(r"[^0-9.]", "", str(p.get('price', '0')))
    try:
        price = float(price_str)
    except:
        price = 0.0
    
    category = p.get('group', p.get('category', 'Stones')).replace("'", "''")
    desc = f"Beautiful {name} for {category}".replace("'", "''")
    image_url = images.get(p.get('name'), '').replace("'", "''")
    
    # Use INSERT IGNORE or check
    sql = f"INSERT INTO products (name, description, price, category, image_url) SELECT '{name}', '{desc}', {price}, '{category}', '{image_url}' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = '{name}');"
    sql_statements.append(sql)

# Also add the 3 core services to the services table!
sql_statements.append("\n/* -------------------------------------------------------- */")
sql_statements.append("/* Seed Default Services */")
sql_statements.append("/* -------------------------------------------------------- */\n")

services = [
    ("Numerology", "Decode the cosmic blueprint hidden in your numbers.", 1500, "infinity_icon"),
    ("Vaastu Shastra", "Harmonize your living and working spaces.", 5000, "home_icon"),
    ("Crystal Healing", "Restore your internal vibration with ancient crystals.", 2500, "crystal_icon")
]

for s in services:
    s_name = s[0]
    s_desc = s[1].replace("'", "''")
    s_price = s[2]
    
    sql = f"INSERT INTO services (name, description, price) SELECT '{s_name}', '{s_desc}', {s_price} FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM services WHERE name = '{s_name}');"
    sql_statements.append(sql)


with open(os.path.join(workspace, "cpanel_seed.sql"), "w", encoding="utf-8") as f:
    f.write("\n".join(sql_statements))

print("Created cpanel_seed.sql")
