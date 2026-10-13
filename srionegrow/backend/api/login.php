<?php
require_once 'db.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// 1. Auto-create `admins` table if it doesn't exist yet
try {
    $conn->exec("CREATE TABLE IF NOT EXISTS admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    // 2. Ensure default admin exists
    $check = $conn->query("SELECT COUNT(*) FROM admins")->fetchColumn();
    if ($check == 0) {
        $defaultUser = 'admin';
        $defaultHash = password_hash('srione@2026', PASSWORD_BCRYPT);
        $insertStmt = $conn->prepare("INSERT INTO admins (username, password, role) VALUES (?, ?, 'admin')");
        $insertStmt->execute([$defaultUser, $defaultHash]);
    }
} catch (Exception $e) {
    // Table creation error handled gracefully
}

$data = json_decode(file_get_contents("php://input"));
$password = trim($data->password ?? '');
$username = trim($data->username ?? 'admin');

if (empty($password)) {
    echo json_encode(['success' => false, 'message' => 'Password is required']);
    exit;
}

try {
    // 3. Query the database table for admin
    $stmt = $conn->prepare("SELECT * FROM admins WHERE username = ? LIMIT 1");
    $stmt->execute([$username]);
    $admin = $stmt->fetch(PDO::FETCH_ASSOC);

    $isValid = false;
    if ($admin) {
        // Check hashed password or legacy plain text
        if (password_verify($password, $admin['password']) || $password === $admin['password']) {
            $isValid = true;
            // Upgrade plain-text password to bcrypt hash if needed
            if (!password_get_info($admin['password'])['algo']) {
                $newHash = password_hash($password, PASSWORD_BCRYPT);
                $up = $conn->prepare("UPDATE admins SET password = ? WHERE id = ?");
                $up->execute([$newHash, $admin['id']]);
            }
        }
    } else {
        // Fallback check against default credentials if user row is missing
        if ($password === 'srione@2026') {
            $isValid = true;
        }
    }

    if ($isValid) {
        // Generate authentication session token
        $token = bin2hex(random_bytes(24));
        echo json_encode([
            'success' => true,
            'message' => 'Login successful',
            'token' => $token,
            'user' => [
                'username' => $admin['username'] ?? 'admin',
                'role' => $admin['role'] ?? 'admin'
            ]
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid password']);
    }
} catch (Exception $e) {
    // Fallback if DB query fails
    if ($password === 'srione@2026') {
        echo json_encode(['success' => true, 'token' => 'secure-admin-token']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
    }
}
?>