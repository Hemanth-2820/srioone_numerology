import os
import json
import re

workspace = r"c:\Users\DELL\Documents\srioone_numerology\srionegrow"
src_dir = os.path.join(workspace, "src")
products_file = os.path.join(src_dir, "data", "products.js")

with open(products_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Extract products list
products_match = re.search(r"export const products = (\[.*?\]);", content, re.DOTALL)
# Extract images
images_match = re.search(r"export const productImages = (\{.*?\});", content, re.DOTALL)

if products_match:
    products_str = products_match.group(1)
    # Convert JS object syntax to valid JSON by quoting keys
    products_str = re.sub(r'([{,]\s*)([a-zA-Z0-9_]+)(\s*:)', r'\1"\2"\3', products_str)
    # Fix trailing commas
    products_str = re.sub(r',\s*]', ']', products_str)
    
    try:
        products = json.loads(products_str)
    except json.JSONDecodeError as e:
        print("Error decoding products:", e)
        products = []
else:
    products = []

images = {}
if images_match:
    images_str = images_match.group(1)
    # Keys are already quoted in JS for productImages
    # Just need to make sure it's valid JSON
    images_str = re.sub(r'([{,]\s*)([a-zA-Z0-9_]+)(\s*:)', r'\1"\2"\3', images_str)
    try:
        images = json.loads(images_str)
    except:
        pass

# Generate PHP script to seed database
php_script = f"""<?php
require_once __DIR__ . '/api/db.php';

$products = {json.dumps(products)};
$images = {json.dumps(images)};

$conn->begin_transaction();

try {{
    // Clear existing products to avoid duplicates during seed
    // $conn->query("DELETE FROM products"); 
    
    $stmt = $conn->prepare("INSERT INTO products (name, description, price, category, image_url) VALUES (?, ?, ?, ?, ?)");
    
    foreach ($products as $p) {{
        $name = $p['name'];
        $price_str = preg_replace("/[^0-9.]/", "", $p['price']);
        $price = floatval($price_str);
        $category = isset($p['group']) ? $p['group'] : $p['category'];
        $desc = "Beautiful " . $name . " for " . $category;
        
        $image_url = "";
        if (isset($images[$name])) {{
            $image_url = $images[$name];
        }}
        
        // Check if exists
        $check = $conn->prepare("SELECT id FROM products WHERE name = ?");
        $check->bind_param("s", $name);
        $check->execute();
        $res = $check->get_result();
        
        if ($res->num_rows == 0) {{
            $stmt->bind_param("ssdss", $name, $desc, $price, $category, $image_url);
            $stmt->execute();
        }}
    }}
    
    $conn->commit();
    echo "Successfully seeded " . count($products) . " products to the database!";
}} catch (Exception $e) {{
    $conn->rollback();
    echo "Error: " . $e->getMessage();
}}
?>
"""

seed_path = os.path.join(workspace, "backend", "seed_products.php")
with open(seed_path, "w", encoding="utf-8") as f:
    f.write(php_script)

print(f"Created seed_products.php with {len(products)} products.")
