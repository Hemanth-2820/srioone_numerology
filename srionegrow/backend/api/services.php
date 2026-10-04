<?php
require 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $conn->query("SELECT * FROM services ORDER BY id DESC");
    $services = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($services);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    $name = $data->name ?? '';
    $mark = $data->mark ?? '';
    $description = $data->description ?? '';
    $link = $data->link ?? '/contact';
    $css_class = $data->css_class ?? 'service-numerology';
    
    if ($name && $description) {
        $stmt = $conn->prepare("INSERT INTO services (name, mark, description, link, css_class) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$name, $mark, $description, $link, $css_class]);
        echo json_encode(['success' => true, 'message' => 'Service added successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    }
}
?>