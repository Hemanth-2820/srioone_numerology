<?php
// ========================================================
// ONE-TIME RESET SCRIPT FOR DATABASE
// Visit: https://srionegrow.com/backend/api/clean_reset.php?token=srione_launch_clean_2026
// This clears old test users and orders, and resets order numbering to #SRIONE1
// ========================================================

require_once 'db.php';

header("Content-Type: application/json; charset=UTF-8");

$token = $_GET['token'] ?? '';
if ($token !== 'srione_launch_clean_2026') {
    echo json_encode([
        'success' => false, 
        'message' => 'Unauthorized. Please supply the correct security token.'
    ]);
    exit;
}

try {
    $conn->exec("SET FOREIGN_KEY_CHECKS = 0");
    
    // Truncate test orders and reset AUTO_INCREMENT to 1
    $conn->exec("TRUNCATE TABLE orders");
    
    // Truncate test users and reset AUTO_INCREMENT to 1
    $conn->exec("TRUNCATE TABLE users");
    
    $conn->exec("SET FOREIGN_KEY_CHECKS = 1");

    echo json_encode([
        'success' => true,
        'message' => 'All test users and orders have been removed! Order ID counter reset. The next order will be #SRIONE1.'
    ]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
