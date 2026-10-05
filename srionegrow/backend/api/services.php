<?php
require 'db.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $conn->query("SELECT * FROM services ORDER BY id DESC");
    $services = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($services);
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $id = $_GET['id'] ?? '';
    if ($id) {
        $stmt = $conn->prepare("DELETE FROM services WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['success' => true, 'message' => 'Service deleted successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Missing ID']);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = $_POST['id'] ?? '';
    $name = $_POST['name'] ?? '';
    $mark = $_POST['mark'] ?? '';
    $description = $_POST['description'] ?? '';
    $link = $_POST['link'] ?? '/contact';
    $css_class = $_POST['css_class'] ?? 'service-numerology';
    
    $image_url = '';
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = '../uploads/';
        if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);
        
        $fileName = time() . '_srv_' . basename($_FILES['image']['name']);
        $targetFile = $uploadDir . $fileName;
        
        if (move_uploaded_file($_FILES['image']['tmp_name'], $targetFile)) {
            $image_url = 'uploads/' . $fileName;
        }
    }
    
    if ($name && $description) {
        if ($id) {
            if ($image_url) {
                $stmt = $conn->prepare("UPDATE services SET name=?, mark=?, description=?, link=?, css_class=?, image_url=? WHERE id=?");
                $stmt->execute([$name, $mark, $description, $link, $css_class, $image_url, $id]);
            } else {
                $stmt = $conn->prepare("UPDATE services SET name=?, mark=?, description=?, link=?, css_class=? WHERE id=?");
                $stmt->execute([$name, $mark, $description, $link, $css_class, $id]);
            }
            echo json_encode(['success' => true, 'message' => 'Service updated successfully']);
        } else {
            $stmt = $conn->prepare("INSERT INTO services (name, mark, description, link, css_class, image_url) VALUES (?, ?, ?, ?, ?, ?)");
            $stmt->execute([$name, $mark, $description, $link, $css_class, $image_url]);
            echo json_encode(['success' => true, 'message' => 'Service added successfully']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    }
}
?>