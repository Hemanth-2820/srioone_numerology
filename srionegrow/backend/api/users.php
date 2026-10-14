<?php
require 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Only return genuine registered customers, excluding admin accounts
    $stmt = $conn->query("SELECT * FROM users WHERE email != 'admin@srione.com' AND name != 'Admin User' ORDER BY id DESC");
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($users);
}
?>