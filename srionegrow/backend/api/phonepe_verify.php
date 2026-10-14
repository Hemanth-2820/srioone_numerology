<?php
// =============================================
// PHONEPE PAYMENT STATUS VERIFIER
// Called by frontend after PhonePe redirect
// GET: ?orderId=123&mid=SRIO_123_TIMESTAMP
// Returns: { success, status, amount }
// =============================================

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

require 'db.php';
require 'phonepe_config.php';
require 'smtp_config.php';

$orderId = $_GET['orderId'] ?? null;
$mid     = $_GET['mid']     ?? null;

if (!$orderId || !$mid) {
    echo json_encode(['success' => false, 'message' => 'Missing orderId or mid']);
    exit;
}

// ── Step 1: Get OAuth Access Token ────────────────────────────────────────
$tokenUrl = PHONEPE_TOKEN_URL;
$tokenPayload = http_build_query([
    'client_id'      => PHONEPE_CLIENT_ID,
    'client_version' => PHONEPE_CLIENT_VERSION,
    'client_secret'  => PHONEPE_CLIENT_SECRET,
    'grant_type'     => 'client_credentials',
]);

$tokenCh = curl_init($tokenUrl);
curl_setopt_array($tokenCh, [
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => $tokenPayload,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER     => ['Content-Type: application/x-www-form-urlencoded'],
    CURLOPT_SSL_VERIFYPEER => true,
    CURLOPT_TIMEOUT        => 30,
]);
$tokenResponse = curl_exec($tokenCh);
curl_close($tokenCh);

$tokenData   = json_decode($tokenResponse, true);
$accessToken = $tokenData['access_token'] ?? null;

if (!$accessToken) {
    echo json_encode(['success' => false, 'message' => 'Token fetch failed', 'debug' => $tokenData]);
    exit;
}

// ── Step 2: Check Payment Status at PhonePe ───────────────────────────────
$statusUrl = PHONEPE_BASE_URL . '/checkout/v2/order/' . urlencode($mid) . '/status';

$statusCh = curl_init($statusUrl);
curl_setopt_array($statusCh, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER     => [
        'Content-Type: application/json',
        'Authorization: O-Bearer ' . $accessToken,
    ],
    CURLOPT_SSL_VERIFYPEER => true,
    CURLOPT_TIMEOUT        => 30,
]);
$statusResponse = curl_exec($statusCh);
curl_close($statusCh);

$statusData = json_decode($statusResponse, true);

// PhonePe order states: COMPLETED, FAILED, PENDING, EXPIRED
$ppState = strtoupper($statusData['state'] ?? $statusData['data']['state'] ?? 'UNKNOWN');

// ── Step 3: Map PhonePe state → our order status ──────────────────────────
$statusMap = [
    'COMPLETED' => 'Order Placed',
    'FAILED'    => 'Payment Failed',
    'PENDING'   => 'Pending',
    'EXPIRED'   => 'Payment Failed',
];
$newStatus = $statusMap[$ppState] ?? 'Pending';

$amountPaise = $statusData['amount'] ?? $statusData['data']['amount'] ?? 0;
$amountRs    = $amountPaise / 100;

// ── Step 4: Update order in DB ────────────────────────────────────────────
try {
    $conn->prepare("UPDATE orders SET status = ? WHERE id = ?")
         ->execute([$newStatus, $orderId]);
} catch (Exception $e) {
    // Log but don't crash
}

// ── Step 5: If payment succeeded, send confirmation emails ────────────────
// ── Step 5: If payment succeeded, send confirmation emails ────────────────
if ($ppState === 'COMPLETED') {
    try {
        $stmt = $conn->prepare("SELECT o.*, u.email as u_email, u.name as u_name, u.phone as u_phone FROM orders o LEFT JOIN users u ON o.user_id = u.id WHERE o.id = ?");
        $stmt->execute([$orderId]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row) {
            $customerName  = !empty($row['customer_name']) ? $row['customer_name'] : (!empty($row['u_name']) ? $row['u_name'] : 'Customer');
            $customerEmail = !empty($row['customer_email']) ? $row['customer_email'] : (!empty($row['u_email']) ? $row['u_email'] : null);
            $customerPhone = !empty($row['customer_phone']) ? $row['customer_phone'] : (!empty($row['u_phone']) ? $row['u_phone'] : 'N/A');
            $shippingAddr  = !empty($row['shipping_address']) ? $row['shipping_address'] : 'Not provided';
            
            // Decode items
            $itemsListHtml = '';
            if (!empty($row['items'])) {
                $decodedItems = json_decode($row['items'], true);
                if (is_array($decodedItems)) {
                    $itemsListHtml .= '<table style="width:100%; border-collapse:collapse; margin:16px 0; font-family:Arial,sans-serif;">';
                    $itemsListHtml .= '<tr style="background:#222; color:#d4af37; text-align:left;"><th style="padding:10px 12px; border-bottom:2px solid #d4af37;">Item</th><th style="padding:10px 12px; border-bottom:2px solid #d4af37; text-align:center;">Qty</th><th style="padding:10px 12px; border-bottom:2px solid #d4af37; text-align:right;">Price</th></tr>';
                    foreach ($decodedItems as $it) {
                        $itemName = htmlspecialchars($it['name'] ?? 'Product');
                        $itemQty  = (int)($it['quantity'] ?? 1);
                        $itemPrice = htmlspecialchars($it['price'] ?? '');
                        $itemsListHtml .= "<tr style='border-bottom:1px solid #eee;'>
                            <td style='padding:10px 12px; font-weight:600; color:#333;'>{$itemName}</td>
                            <td style='padding:10px 12px; text-align:center; color:#555;'>{$itemQty}</td>
                            <td style='padding:10px 12px; text-align:right; font-weight:700; color:#111;'>{$itemPrice}</td>
                        </tr>";
                    }
                    $itemsListHtml .= '</table>';
                }
            }

            if (!$itemsListHtml) {
                $itemsListHtml = "<p style='color:#666;'>Sacred Astrology & Numerology Item(s)</p>";
            }

            // 1) Email to Customer
            if ($customerEmail) {
                try {
                    $mailUser = getMailer();
                    $mailUser->setFrom('info@srionegrow.com', 'SRIONE GROW');
                    $mailUser->addAddress($customerEmail, $customerName);
                    $mailUser->isHTML(true);
                    $mailUser->Subject = "🎉 Order Confirmed! #SRIONE{$orderId} – SRIONE GROW";
                    $mailUser->Body    = "
                    <div style='max-width:600px; margin:0 auto; font-family:Arial, sans-serif; background:#ffffff; border:1px solid #e0e0e0; border-radius:12px; overflow:hidden;'>
                        <div style='background:linear-gradient(135deg, #111118 0%, #1a1a24 100%); padding:28px 24px; text-align:center; border-bottom:3px solid #d4af37;'>
                            <h1 style='color:#d4af37; margin:0; font-size:24px; letter-spacing:1px;'>SRIONE GROW</h1>
                            <p style='color:#ffffff; margin:8px 0 0 0; font-size:14px;'>Sacred Numerology & Astrological Curations</p>
                        </div>
                        
                        <div style='padding:28px 24px;'>
                            <h2 style='color:#2ecc71; margin-top:0;'>✅ Order Confirmed & Payment Verified!</h2>
                            <p style='color:#333333; font-size:15px; line-height:1.6;'>
                                Hello <b>{$customerName}</b>,<br>
                                Thank you for choosing SRIONE GROW! Your order <b>#SRIONE{$orderId}</b> has been received and verified via PhonePe.
                            </p>
                            
                            <div style='background:#f9f9f9; padding:16px 20px; border-radius:8px; border-left:4px solid #d4af37; margin:20px 0;'>
                                <div style='font-size:14px; color:#555;'><strong>Order ID:</strong> #SRIONE{$orderId}</div>
                                <div style='font-size:14px; color:#555; margin-top:4px;'><strong>Payment Method:</strong> PhonePe Gateway</div>
                                <div style='font-size:16px; color:#111; margin-top:6px;'><strong>Total Paid:</strong> <span style='color:#d4af37; font-weight:bold;'>₹{$amountRs}</span></div>
                            </div>

                            <h3 style='color:#111; margin-bottom:8px; border-bottom:1px solid #ddd; padding-bottom:6px;'>Ordered Items</h3>
                            {$itemsListHtml}

                            <h3 style='color:#111; margin-top:24px; margin-bottom:8px; border-bottom:1px solid #ddd; padding-bottom:6px;'>Delivery Details</h3>
                            <p style='color:#444; font-size:14px; line-height:1.6; margin:6px 0;'>
                                <strong>Recipient:</strong> {$customerName}<br>
                                <strong>Phone:</strong> {$customerPhone}<br>
                                <strong>Shipping Address:</strong> {$shippingAddr}
                            </p>

                            <div style='background:#f4f6f8; padding:14px 18px; border-radius:8px; margin-top:24px; font-size:13px; color:#666;'>
                                🚚 Your order is currently being prepared for dispatch with express insured courier. You will receive tracking details via SMS/WhatsApp once shipped.
                            </div>
                        </div>

                        <div style='background:#111118; color:#888888; padding:18px; text-align:center; font-size:12px;'>
                            Need immediate support? Reach us on WhatsApp at <b>+91 7997992211</b> or email <b>info@srionegrow.com</b><br>
                            © " . date('Y') . " SRIONE GROW. All Rights Reserved.
                        </div>
                    </div>";
                    $mailUser->send();
                } catch (Exception $eUser) {}
            }

            // 2) Email to Admin
            try {
                $mailAdmin = getMailer();
                $mailAdmin->setFrom('info@srionegrow.com', 'SRIONE GROW Orders');
                $mailAdmin->addAddress('ompraksh@srionegrow.com', 'Admin');
                $mailAdmin->isHTML(true);
                $mailAdmin->Subject = "🚨 New Order Placed: #SRIONE{$orderId} – ₹{$amountRs} by {$customerName}";
                $mailAdmin->Body    = "
                <div style='max-width:600px; margin:0 auto; font-family:Arial, sans-serif; background:#ffffff; border:1px solid #e0e0e0; border-radius:12px; overflow:hidden;'>
                    <div style='background:#111118; padding:24px; text-align:center; border-bottom:3px solid #2ecc71;'>
                        <h2 style='color:#ffffff; margin:0;'>💰 New Order Received (PhonePe Verified)</h2>
                        <p style='color:#2ecc71; margin:6px 0 0 0; font-weight:bold;'>Order #SRIONE{$orderId} • Total: ₹{$amountRs}</p>
                    </div>

                    <div style='padding:24px;'>
                        <h3 style='color:#111; margin-top:0; border-bottom:1px solid #ddd; padding-bottom:6px;'>Customer & Contact Info</h3>
                        <p style='color:#333; font-size:14px; line-height:1.6;'>
                            <strong>Name:</strong> {$customerName}<br>
                            <strong>Email:</strong> " . ($customerEmail ? "<a href='mailto:{$customerEmail}'>{$customerEmail}</a>" : 'Not provided') . "<br>
                            <strong>Phone:</strong> {$customerPhone}<br>
                            <strong>Delivery Address:</strong> {$shippingAddr}
                        </p>

                        <h3 style='color:#111; margin-top:20px; border-bottom:1px solid #ddd; padding-bottom:6px;'>Purchased Items</h3>
                        {$itemsListHtml}

                        <div style='background:#e8f4fd; border-left:4px solid #3498db; padding:12px 16px; border-radius:6px; margin-top:20px; font-size:14px;'>
                            <strong>Action Required:</strong> Please login to your <a href='https://srionegrow.com/admin' style='color:#3498db; font-weight:bold;'>Admin Dashboard</a> to dispatch this order.
                        </div>
                    </div>
                </div>";
                $mailAdmin->send();
            } catch (Exception $eAdmin) {}
        }
    } catch (Exception $e) {
        // Log & proceed
    }
}

// ── Step 6: Return result to frontend ─────────────────────────────────────
echo json_encode([
    'success'   => true,
    'ppState'   => $ppState,
    'status'    => $newStatus,
    'amount'    => $amountRs,
    'orderId'   => $orderId,
]);
?>
