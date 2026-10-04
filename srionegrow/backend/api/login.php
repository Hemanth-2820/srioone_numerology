<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$data = json_decode(file_get_contents("php://input"));
$password = $data->password ?? '';

// Default admin password (change this!)
if ($password === 'admin123') {
    echo json_encode(['success' => true, 'token' => 'secure-admin-token']);
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid password']);
}
?>