import os
import re

workspace = r"c:\Users\DELL\Documents\srioone_numerology\srionegrow"
src_products_file = os.path.join(workspace, "src", "data", "products.js")

with open(src_products_file, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update frontend_old/products.js
frontend_old_products_file = os.path.join(workspace, "frontend_old", "products.js")
# Replace 'export const' with 'const' and 'export function' with 'function'
plain_js = content.replace("export const ", "const ").replace("export function ", "function ")
with open(frontend_old_products_file, "w", encoding="utf-8") as f:
    f.write(plain_js)
print("Updated frontend_old/products.js successfully")

# 2. Extract product descriptions for SQL
desc_match = re.search(r"export const productDescriptions = \{(.*?)\};", content, re.DOTALL)
descriptions = {}
if desc_match:
    for m in re.finditer(r'"([^"]+)":\s*"([^"]+)"', desc_match.group(1)):
        descriptions[m.group(1)] = m.group(2)

# Extract products list
prod_match = re.search(r"export const products = \[(.*?)\];", content, re.DOTALL)
product_names = []
if prod_match:
    for m in re.finditer(r'name:\s*"([^"]+)"', prod_match.group(1)):
        product_names.append(m.group(1))

# 3. Generate update_descriptions.sql
sql_lines = [
    "-- SQL script to update all products with their 100% unique descriptions",
    "-- Run this in phpMyAdmin or MySQL client\n"
]
for name in product_names:
    desc = descriptions.get(name, f"Authentic {name} curated for sacred spiritual balance")
    safe_name = name.replace("'", "''")
    safe_desc = desc.replace("'", "''")
    sql_lines.append(f"UPDATE products SET description = '{safe_desc}' WHERE name = '{safe_name}';")

sql_file = os.path.join(workspace, "update_descriptions.sql")
with open(sql_file, "w", encoding="utf-8") as f:
    f.write("\n".join(sql_lines))
print(f"Generated update_descriptions.sql with {len(product_names)} UPDATE statements")

# Also write to backend/update_descriptions.sql
backend_sql_file = os.path.join(workspace, "backend", "update_descriptions.sql")
with open(backend_sql_file, "w", encoding="utf-8") as f:
    f.write("\n".join(sql_lines))

# 4. Create backend/api/update_db_descriptions.php for 1-click execution
php_script = f"""<?php
require_once __DIR__ . '/db.php';

header("Content-Type: application/json");

$updates = [
"""
for name in product_names:
    desc = descriptions.get(name, f"Authentic {name} curated for sacred spiritual balance")
    safe_name = name.replace("'", "\\'")
    safe_desc = desc.replace("'", "\\'")
    php_script += f"    '{safe_name}' => '{safe_desc}',\n"

php_script += """
];

$updatedCount = 0;
$stmt = $conn->prepare("UPDATE products SET description = ? WHERE name = ?");

foreach ($updates as $name => $desc) {
    if ($stmt->execute([$desc, $name])) {
        $updatedCount++;
    }
}

echo json_encode([
    'success' => true,
    'message' => "Successfully updated descriptions for $updatedCount products!",
    'total' => count($updates)
]);
?>
"""

php_file = os.path.join(workspace, "backend", "api", "update_db_descriptions.php")
with open(php_file, "w", encoding="utf-8") as f:
    f.write(php_script)
print("Created backend/api/update_db_descriptions.php successfully")
