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
    // Ensure phone column exists
    try {
        $conn->exec("ALTER TABLE users ADD COLUMN phone VARCHAR(20) DEFAULT NULL");
    } catch (Exception $e) {}

    // Fetch User & Address
    $stmt = $conn->prepare("SELECT name, email, phone, address, city, state, zip FROM users WHERE id = ?");
    $stmt->execute([$user_id]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    // Fetch Orders
    $stmt2 = $conn->prepare("SELECT id, total_amount, status, payment_method, created_at FROM orders WHERE user_id = ? ORDER BY id DESC");
    $stmt2->execute([$user_id]);
    $orders = $stmt2->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'user' => $user, 'orders' => $orders]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    $action = $data->action ?? '';

    if ($action === 'update_address') {
        $phone = $data->phone ?? '';
        $address = $data->address ?? '';
        $city = $data->city ?? '';
        $state = $data->state ?? '';
        $zip = $data->zip ?? '';
        
        try {
            $conn->exec("ALTER TABLE users ADD COLUMN phone VARCHAR(20) DEFAULT NULL");
        } catch (Exception $e) {}

        $stmt = $conn->prepare("UPDATE users SET phone = ?, address = ?, city = ?, state = ?, zip = ? WHERE id = ?");
        if ($stmt->execute([$phone, $address, $city, $state, $zip, $user_id])) {
            echo json_encode(['success' => true, 'message' => 'Address & Contact updated successfully']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to update address']);
        }
    }
    
    elseif ($action === 'create_order') {
        $amount = $data->amount ?? 0;
        $status = 'Pending';
        
        $stmt = $conn->prepare("INSERT INTO orders (user_id, total_amount, status, payment_method) VALUES (?, ?, ?, 'Online')");
        if ($stmt->execute([$user_id, $amount, $status])) {
            $order_id = $conn->lastInsertId();
            
            // Fetch user info for email
            $stmtUser = $conn->prepare("SELECT email, name FROM users WHERE id = ?");
            $stmtUser->execute([$user_id]);
            $user_info = $stmtUser->fetch(PDO::FETCH_ASSOC);
            
            if ($user_info) {
                try {
                    require_once 'smtp_config.php';
                    
                    // Email to Admin
                    $mailAdmin = getMailer();
                    $mailAdmin->setFrom('info@srionegrow.com', 'SRIONE GROW');
                    $mailAdmin->addAddress('ompraksh@srionegrow.com', 'Admin');
                    $mailAdmin->isHTML(true);
                    $mailAdmin->Subject = "New Order Placed - Action Required";
                    $mailAdmin->Body    = "Hello Admin,<br><br>A new order (#{$order_id}) was placed by <b>{$user_info['name']}</b> ({$user_info['email']}) for ₹{$amount}.<br>Please log into the admin dashboard to check the uploaded screenshot and approve the payment.<br><br>Thanks,<br>SRIONE System";
                    $mailAdmin->send();
                    
                    // Email to User
                    $mailUser = getMailer();
                    $mailUser->setFrom('info@srionegrow.com', 'SRIONE GROW');
                    $mailUser->addAddress($user_info['email'], $user_info['name']);
                    $mailUser->isHTML(true);
                    $mailUser->Subject = "Order Payment Pending Approval";
                    $mailUser->Body    = "Hello {$user_info['name']},<br><br>Thank you for your order (#{$order_id}) of ₹{$amount}. We have received your payment screenshot. Your payment is currently <b>pending approval</b>. <br><br>Please wait while our admin verifies the transaction. You will receive an email once it is approved.<br><br>Thanks,<br>SRIONE Team";
                    $mailUser->send();
                    
                } catch (Exception $e) {
                    // Emails failed, but order was placed
                }
            }
            
            echo json_encode(['success' => true, 'order_id' => $order_id]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to create order']);
        }
    }
}
?>