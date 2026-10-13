<?php
require_once 'db.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$data = json_decode(file_get_contents("php://input"));
$currentPassword = trim($data->currentPassword ?? '');
$newPassword = trim($data->newPassword ?? '');
$username = trim($data->username ?? 'admin');

if (empty($currentPassword) || empty($newPassword)) {
    echo json_encode(['success' => false, 'message' => 'Current password and new password are required.']);
    exit;
}

if (strlen($newPassword) < 6) {
    echo json_encode(['success' => false, 'message' => 'New password must be at least 6 characters.']);
    exit;
}

try {
    $stmt = $conn->prepare("SELECT * FROM admins WHERE username = ? LIMIT 1");
    $stmt->execute([$username]);
    $admin = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$admin) {
        echo json_encode(['success' => false, 'message' => 'Admin user not found.']);
        exit;
    }

    $isMatch = password_verify($currentPassword, $admin['password']) || $currentPassword === $admin['password'];
    if (!$isMatch) {
        echo json_encode(['success' => false, 'message' => 'Current password does not match.']);
        exit;
    }

    $newHash = password_hash($newPassword, PASSWORD_BCRYPT);
    $updateStmt = $conn->prepare("UPDATE admins SET password = ? WHERE id = ?");
    $updateStmt->execute([$newHash, $admin['id']]);

    echo json_encode(['success' => true, 'message' => 'Password updated successfully in database!']);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
