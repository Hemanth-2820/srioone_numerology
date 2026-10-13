<?php
require 'db.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['id'])) {
        $stmt = $conn->prepare("SELECT * FROM products WHERE id = ?");
        $stmt->execute([$_GET['id']]);
        $product = $stmt->fetch(PDO::FETCH_ASSOC);
        echo json_encode($product);
    } else {
        $stmt = $conn->query("SELECT * FROM products ORDER BY id DESC");
        $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($products);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $id = $_GET['id'] ?? '';
    if ($id) {
        $stmt = $conn->prepare("DELETE FROM products WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['success' => true, 'message' => 'Product deleted successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Missing ID']);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = $_POST['id'] ?? '';
    $name = $_POST['name'] ?? '';
    $category = $_POST['category'] ?? '';
    $price = $_POST['price'] ?? '';
    $description = $_POST['description'] ?? 'Premium quality SRIONE product, carefully sourced and prepared.';
    
    $material = $_POST['material'] ?? '';
    $purpose  = $_POST['purpose'] ?? '';
    $care     = $_POST['care'] ?? '';
    
    // Auto-migrate columns if they don't exist yet
    try { $conn->exec("ALTER TABLE products ADD COLUMN material TEXT DEFAULT NULL"); } catch(Exception $e) {}
    try { $conn->exec("ALTER TABLE products ADD COLUMN purpose TEXT DEFAULT NULL"); } catch(Exception $e) {}
    try { $conn->exec("ALTER TABLE products ADD COLUMN care TEXT DEFAULT NULL"); } catch(Exception $e) {}

    $image_url = '';
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = '../uploads/';
        if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);
        
        $fileName = time() . '_' . basename($_FILES['image']['name']);
        $targetFile = $uploadDir . $fileName;
        
        if (move_uploaded_file($_FILES['image']['tmp_name'], $targetFile)) {
            $image_url = 'uploads/' . $fileName;
        }
    }
    
    if ($name && $price) {
        if ($id) {
            // Update
            if ($image_url) {
                $stmt = $conn->prepare("UPDATE products SET name=?, category=?, price=?, description=?, material=?, purpose=?, care=?, image_url=? WHERE id=?");
                $stmt->execute([$name, $category, $price, $description, $material, $purpose, $care, $image_url, $id]);
            } else {
                $stmt = $conn->prepare("UPDATE products SET name=?, category=?, price=?, description=?, material=?, purpose=?, care=? WHERE id=?");
                $stmt->execute([$name, $category, $price, $description, $material, $purpose, $care, $id]);
            }
            echo json_encode(['success' => true, 'message' => 'Product updated successfully']);
        } else {
            // Insert
            $stmt = $conn->prepare("INSERT INTO products (name, category, price, description, material, purpose, care, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$name, $category, $price, $description, $material, $purpose, $care, $image_url]);
            echo json_encode(['success' => true, 'message' => 'Product added successfully']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    }
}
?>