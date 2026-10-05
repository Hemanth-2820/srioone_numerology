<?php
// IMPORTANT: Update these credentials with your cPanel Email Account details!
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require_once __DIR__ . '/PHPMailer/Exception.php';
require_once __DIR__ . '/PHPMailer/PHPMailer.php';
require_once __DIR__ . '/PHPMailer/SMTP.php';

function getMailer() {
    $mail = new PHPMailer(true);
    
    // Server settings
    $mail->isSMTP();                                            // Send using SMTP
    $mail->Host       = 'mail.srionegrow.com';                  // Set the SMTP server to send through (usually mail.yourdomain.com)
    $mail->SMTPAuth   = true;                                   // Enable SMTP authentication
    $mail->Username   = 'info@srionegrow.com';                  // SMTP username (your full cPanel email address)
    $mail->Password   = 'YOUR_EMAIL_PASSWORD_HERE';             // SMTP password (the password for that email account)
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;            // Enable implicit TLS encryption (SSL)
    $mail->Port       = 465;                                    // TCP port to connect to (465 for SSL, 587 for TLS)
    
    return $mail;
}
?>