<?php
require 'db.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$user_id = $_GET['user_id'] ?? $_POST['user_id'] ?? null;
if (!$user_id) {
    // If sent as JSON payload
    $data = json_decode(file_get_contents("php://input"));
    $user_id = $data->user_id ?? null;
}

if (!$user_id) {
    echo json_encode(['success' => false, 'message' => 'User ID is required']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Fetch User & Address
    $stmt = $conn->prepare("SELECT name, email, address, city, state, zip FROM users WHERE id = ?");
    $stmt->execute([$user_id]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    // Fetch Orders
    $stmt2 = $conn->prepare("SELECT id, total_amount, status, created_at FROM orders WHERE user_id = ? ORDER BY id DESC");
    $stmt2->execute([$user_id]);
    $orders = $stmt2->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'user' => $user, 'orders' => $orders]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    $action = $data->action ?? '';

    if ($action === 'update_address') {
        $address = $data->address ?? '';
        $city = $data->city ?? '';
        $state = $data->state ?? '';
        $zip = $data->zip ?? '';
        
        $stmt = $conn->prepare("UPDATE users SET address = ?, city = ?, state = ?, zip = ? WHERE id = ?");
        if ($stmt->execute([$address, $city, $state, $zip, $user_id])) {
            echo json_encode(['success' => true, 'message' => 'Address updated successfully']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to update address']);
        }
    }
    
    elseif ($action === 'create_order') {
        $amount = $data->amount ?? 0;
        $stmt = $conn->prepare("INSERT INTO orders (user_id, total_amount, status) VALUES (?, ?, 'Processing')");
        if ($stmt->execute([$user_id, $amount])) {
            echo json_encode(['success' => true, 'order_id' => $conn->lastInsertId()]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to create order']);
        }
    }
}
?>