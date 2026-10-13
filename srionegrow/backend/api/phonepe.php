<?php
// =============================================
// PHONEPE PAYMENT INITIATION
// POST: { user_id, amount, name, email, address, city, postalCode, cart_items }
// Returns: { success, redirectUrl, merchantOrderId }
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

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid method']);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
if (!$data) {
    echo json_encode(['success' => false, 'message' => 'Invalid JSON payload']);
    exit;
}

$user_id    = $data['user_id']    ?? null;
$amount     = $data['amount']     ?? 0;
$name       = $data['name']       ?? '';
$email      = $data['email']      ?? '';
$phone      = $data['phone']      ?? '';
$address    = $data['address']    ?? '';
$city       = $data['city']       ?? '';
$state      = $data['state']      ?? '';
$postalCode = $data['postalCode'] ?? '';
$items      = $data['items']      ?? [];
$itemsJson  = !empty($items) ? json_encode($items) : null;

// Build full shipping address string
$fullAddress = trim("{$address}" . ($city ? ", {$city}" : "") . ($state ? ", {$state}" : "") . ($postalCode ? " - {$postalCode}" : "") . ($phone ? " (Phone: {$phone})" : ""));

if (!$amount || $amount <= 0) {
    echo json_encode(['success' => false, 'message' => 'Invalid amount']);
    exit;
}

// If user_id is missing, try to resolve from email or default to 1
if (!$user_id && !empty($email)) {
    try {
        $stmtU = $conn->prepare("SELECT id FROM users WHERE email = ? LIMIT 1");
        $stmtU->execute([$email]);
        $foundUser = $stmtU->fetch(PDO::FETCH_ASSOC);
        if ($foundUser) {
            $user_id = $foundUser['id'];
        }
    } catch (Exception $e) {}
}

// Ensure extra columns exist in orders table
try { $conn->exec("ALTER TABLE orders ADD COLUMN items TEXT DEFAULT NULL"); } catch (Exception $e) {}
try { $conn->exec("ALTER TABLE orders ADD COLUMN customer_name VARCHAR(255) DEFAULT NULL"); } catch (Exception $e) {}
try { $conn->exec("ALTER TABLE orders ADD COLUMN customer_email VARCHAR(255) DEFAULT NULL"); } catch (Exception $e) {}
try { $conn->exec("ALTER TABLE orders ADD COLUMN customer_phone VARCHAR(50) DEFAULT NULL"); } catch (Exception $e) {}
try { $conn->exec("ALTER TABLE orders ADD COLUMN shipping_address TEXT DEFAULT NULL"); } catch (Exception $e) {}
try { $conn->exec("ALTER TABLE orders ADD COLUMN payment_method VARCHAR(50) DEFAULT 'PhonePe'"); } catch (Exception $e) {}
try { $conn->exec("ALTER TABLE orders ADD COLUMN merchant_order_id VARCHAR(100) DEFAULT NULL"); } catch (Exception $e) {}

// ── Step 1: Create Order Record in DB (status = Pending) ──────────────────
try {
    $stmt = $conn->prepare(
        "INSERT INTO orders (user_id, total_amount, status, payment_method, items, customer_name, customer_email, customer_phone, shipping_address)
         VALUES (?, ?, 'Pending', 'PhonePe', ?, ?, ?, ?, ?)"
    );
    $stmt->execute([$user_id ?: null, $amount, $itemsJson, $name, $email, $phone, $fullAddress]);
    $orderId = $conn->lastInsertId();
} catch (Exception $e) {
    try {
        $stmt = $conn->prepare(
            "INSERT INTO orders (user_id, total_amount, status)
             VALUES (?, ?, 'Pending')"
        );
        $stmt->execute([$user_id ?: null, $amount]);
        $orderId = $conn->lastInsertId();
    } catch (Exception $e2) {
        echo json_encode(['success' => false, 'message' => 'DB error: ' . $e2->getMessage()]);
        exit;
    }
}

$merchantOrderId = 'SRIO_' . $orderId . '_' . time();

// Store merchantOrderId against order so we can verify later
try {
    $conn->prepare("UPDATE orders SET merchant_order_id = ? WHERE id = ?")
         ->execute([$merchantOrderId, $orderId]);
} catch (Exception $e) {
    // Column may not exist
}

// ── Step 2: Get OAuth Access Token from PhonePe ───────────────────────────
$tokenUrl = PHONEPE_BASE_URL . '/v1/oauth/token';
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
$tokenError    = curl_error($tokenCh);
curl_close($tokenCh);

if ($tokenError) {
    echo json_encode(['success' => false, 'message' => 'Token request failed: ' . $tokenError]);
    exit;
}

$tokenData = json_decode($tokenResponse, true);
$accessToken = $tokenData['access_token'] ?? null;

if (!$accessToken) {
    echo json_encode([
        'success' => false,
        'message' => 'Could not get PhonePe access token',
        'debug'   => $tokenData
    ]);
    exit;
}

// ── Step 3: Initiate Payment ──────────────────────────────────────────────
$amountInPaise = (int) round($amount * 100); // PhonePe uses paise

$paymentPayload = [
    'merchantOrderId' => $merchantOrderId,
    'amount'          => $amountInPaise,
    'expireAfter'     => 1200, // 20 minutes
    'paymentFlow'     => [
        'type'    => 'PG_CHECKOUT',
        'message' => 'Payment for SRIONE order #' . $orderId,
        'merchantUrls' => [
            'redirectUrl' => PHONEPE_REDIRECT_URL . '?orderId=' . $orderId . '&mid=' . urlencode($merchantOrderId),
        ],
    ],
];

$payCh = curl_init(PHONEPE_BASE_URL . '/checkout/v2/pay');
curl_setopt_array($payCh, [
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => json_encode($paymentPayload),
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER     => [
        'Content-Type: application/json',
        'Authorization: O-Bearer ' . $accessToken,
    ],
    CURLOPT_SSL_VERIFYPEER => true,
    CURLOPT_TIMEOUT        => 30,
]);
$payResponse = curl_exec($payCh);
$payError    = curl_error($payCh);
curl_close($payCh);

if ($payError) {
    echo json_encode(['success' => false, 'message' => 'Payment initiation failed: ' . $payError]);
    exit;
}

$payData = json_decode($payResponse, true);

// PhonePe returns redirectUrl inside paymentFlow or data
$redirectUrl = $payData['redirectUrl']
    ?? $payData['data']['redirectUrl']
    ?? $payData['paymentFlow']['paymentUrl']
    ?? null;

if (!$redirectUrl) {
    echo json_encode([
        'success' => false,
        'message' => 'No redirect URL from PhonePe',
        'debug'   => $payData
    ]);
    exit;
}

// ── Step 4: Return redirect URL to frontend ───────────────────────────────
echo json_encode([
    'success'         => true,
    'redirectUrl'     => $redirectUrl,
    'merchantOrderId' => $merchantOrderId,
    'orderId'         => $orderId,
]);
?>
