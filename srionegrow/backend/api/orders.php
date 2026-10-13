<?php
require 'db.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Ensure the merchant_order_id and payment_method columns exist
try {
    $conn->exec("ALTER TABLE orders ADD COLUMN merchant_order_id VARCHAR(100) DEFAULT NULL");
} catch(PDOException $e) {}
try {
    $conn->exec("ALTER TABLE orders ADD COLUMN payment_method VARCHAR(50) DEFAULT 'PhonePe'");
} catch(PDOException $e) {}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Fetch all orders with user and shipping details for admin
    $stmt = $conn->prepare("SELECT o.id, o.user_id, o.total_amount, o.status, o.payment_method, o.merchant_order_id, o.created_at, o.items, o.customer_name, o.customer_email, o.customer_phone, o.shipping_address, u.name, u.email FROM orders o LEFT JOIN users u ON o.user_id = u.id ORDER BY o.id DESC");
    $stmt->execute();
    $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'orders' => $orders]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    $action = $data->action ?? '';

    if ($action === 'update_status') {
        $order_id = $data->order_id ?? null;
        $status = $data->status ?? 'Pending';
        
        if ($order_id) {
            $stmt = $conn->prepare("UPDATE orders SET status = ? WHERE id = ?");
            if ($stmt->execute([$status, $order_id])) {
                
                // If status is "Order Placed" or "Delivered", send update email to user
                if ($status === 'Order Placed' || $status === 'Shipped' || $status === 'Delivered') {
                    $stmtUser = $conn->prepare("SELECT o.*, u.name as u_name, u.email as u_email FROM orders o LEFT JOIN users u ON o.user_id = u.id WHERE o.id = ?");
                    $stmtUser->execute([$order_id]);
                    $order_info = $stmtUser->fetch(PDO::FETCH_ASSOC);
                    
                    if ($order_info) {
                        $cEmail = !empty($order_info['customer_email']) ? $order_info['customer_email'] : $order_info['u_email'];
                        $cName  = !empty($order_info['customer_name']) ? $order_info['customer_name'] : (!empty($order_info['u_name']) ? $order_info['u_name'] : 'Customer');

                        if ($cEmail) {
                            try {
                                require_once 'smtp_config.php';
                                $mail = getMailer();
                                $mail->setFrom('info@srionegrow.com', 'SRIONE GROW');
                                $mail->addAddress($cEmail, $cName);
                                $mail->isHTML(true);
                                $mail->Subject = "Order #SRIONE{$order_id} Status Update: {$status}";
                                $mail->Body    = "
                                <div style='font-family:Arial,sans-serif; max-width:600px; margin:0 auto; padding:20px; border:1px solid #eee; border-radius:10px;'>
                                    <h2 style='color:#d4af37;'>SRIONE GROW</h2>
                                    <p>Hello <b>{$cName}</b>,</p>
                                    <p>Your order <b>#SRIONE{$order_id}</b> has been updated to: <span style='font-weight:bold; color:#2ecc71;'>{$status}</span>.</p>
                                    <p>Total: ₹{$order_info['total_amount']}</p>
                                    <p>Thank you for choosing SRIONE GROW 🙏</p>
                                </div>";
                                $mail->send();
                            } catch (Exception $e) {
                                // Email failed
                            }
                        }
                    }
                }
                
                echo json_encode(['success' => true, 'message' => 'Order status updated']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Failed to update order']);
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'Order ID required']);
        }
    }
}
?>
