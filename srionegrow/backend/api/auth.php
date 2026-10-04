<?php
require 'db.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$data = json_decode(file_get_contents("php://input"));
$action = $data->action ?? '';

if ($action === 'register') {
    $name = $data->name ?? '';
    $email = $data->email ?? '';
    $password = $data->password ?? '';
    
    if (!$name || !$email || !$password) {
        echo json_encode(['success' => false, 'message' => 'All fields are required.']);
        exit;
    }
    
    // Check if user exists
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        echo json_encode(['success' => false, 'message' => 'Email already registered.']);
        exit;
    }
    
    // Insert user
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $conn->prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
    if ($stmt->execute([$name, $email, $hashed_password])) {
        
        // Send Welcome Email
        $to = $email;
        $subject = "Welcome to SRIONE - Your Journey Begins";
        
        $htmlContent = '
        <html>
        <head>
          <style>
            body { font-family: "Inter", sans-serif; background-color: #f4f4f4; color: #111111; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 12px; border-top: 6px solid #FF9933; }
            .header { text-align: center; margin-bottom: 30px; }
            .header h1 { color: #111111; font-size: 24px; letter-spacing: 2px; }
            .content { line-height: 1.6; font-size: 16px; color: #444444; }
            .btn { display: inline-block; padding: 12px 24px; background-color: #FF9933; color: #111111; text-decoration: none; font-weight: bold; border-radius: 6px; margin-top: 20px; }
            .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #888888; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>SRIONE</h1>
            </div>
            <div class="content">
              <p>Hello <strong>' . htmlspecialchars($name) . '</strong>,</p>
              <p>Welcome to SRIONE! We are absolutely thrilled to have you join our community.</p>
              <p>You now have access to explore our exclusive collections, book specialized consultations, and embark on a journey of deep ancient wisdom and numeric alignment.</p>
              <center><a href="https://srionegrow.com/shop" class="btn">Explore the Shop</a></center>
              <p style="margin-top: 30px;">If you have any questions, feel free to reply to this email.</p>
              <p>Best Regards,<br><strong>The SRIONE Team</strong></p>
            </div>
            <div class="footer">
              &copy; ' . date("Y") . ' SRIONE. All rights reserved.<br>
              info@srionegrow.com | +91 97051 31915
            </div>
          </div>
        </body>
        </html>';
        
        $headers = "MIME-Version: 1.0" . "\r\n";
        $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
        $headers .= "From: SRIONE <info@srionegrow.com>" . "\r\n";
        $headers .= "Reply-To: info@srionegrow.com" . "\r\n";
        
        mail($to, $subject, $htmlContent, $headers);
        
        echo json_encode(['success' => true, 'message' => 'Registration successful! Welcome email sent.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Registration failed.']);
    }
}

elseif ($action === 'login') {
    $email = $data->email ?? '';
    $password = $data->password ?? '';
    
    $stmt = $conn->prepare("SELECT id, name, password FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($user && password_verify($password, $user['password'])) {
        echo json_encode(['success' => true, 'user' => ['id' => $user['id'], 'name' => $user['name'], 'email' => $email]]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid email or password.']);
    }
}

elseif ($action === 'forgot_password') {
    $email = $data->email ?? '';
    
    // In a real app, generate a unique token and save it to the DB, then email a reset link.
    // For now, we will just send a mock email.
    
    $to = $email;
    $subject = "SRIONE - Password Reset Request";
    
    $htmlContent = '
    <html>
    <head>
      <style>
        body { font-family: "Inter", sans-serif; background-color: #f4f4f4; color: #111111; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 12px; border-top: 6px solid #FF9933; }
        .header { text-align: center; margin-bottom: 30px; }
        .header h1 { color: #111111; font-size: 24px; letter-spacing: 2px; }
        .content { line-height: 1.6; font-size: 16px; color: #444444; }
        .btn { display: inline-block; padding: 12px 24px; background-color: #FF9933; color: #111111; text-decoration: none; font-weight: bold; border-radius: 6px; margin-top: 20px; }
        .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #888888; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>SRIONE</h1>
        </div>
        <div class="content">
          <p>Hello,</p>
          <p>We received a request to reset your password for your SRIONE account.</p>
          <p>If you did not make this request, you can safely ignore this email and your password will remain unchanged.</p>
          <p>Otherwise, click the button below to securely reset your password:</p>
          <center><a href="https://srionegrow.com/auth?reset=1" class="btn">Reset My Password</a></center>
          <p style="margin-top: 30px;">For your security, this link will expire in 24 hours.</p>
          <p>Best Regards,<br><strong>The SRIONE Team</strong></p>
        </div>
        <div class="footer">
          &copy; ' . date("Y") . ' SRIONE. All rights reserved.<br>
          info@srionegrow.com | +91 97051 31915
        </div>
      </div>
    </body>
    </html>';
    
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= "From: SRIONE <info@srionegrow.com>" . "\r\n";
    
    mail($to, $subject, $htmlContent, $headers);
    
    echo json_encode(['success' => true, 'message' => 'If that email exists, a reset link has been sent.']);
}
else {
    echo json_encode(['success' => false, 'message' => 'Invalid action']);
}
?>