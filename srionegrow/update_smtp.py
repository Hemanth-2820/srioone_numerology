import os

workspace = r'c:\Users\DELL\Documents\srioone_numerology\srionegrow'

# 1. Create smtp_config.php
smtp_config = '''<?php
// IMPORTANT: Update these credentials with your cPanel Email Account details!
use PHPMailer\\PHPMailer\\PHPMailer;
use PHPMailer\\PHPMailer\\Exception;

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
?>'''

with open(os.path.join(workspace, 'backend/api/smtp_config.php'), 'w', encoding='utf-8') as f:
    f.write(smtp_config)

# 2. Update auth.php
auth_file = os.path.join(workspace, 'backend/api/auth.php')
with open(auth_file, 'r', encoding='utf-8') as f:
    auth = f.read()

if "require 'smtp_config.php';" not in auth:
    auth = auth.replace("require 'db.php';", "require 'db.php';\nrequire 'smtp_config.php';")
    
    old_mail = '''        $headers = "MIME-Version: 1.0" . "\\r\\n";
        $headers .= "Content-type:text/html;charset=UTF-8" . "\\r\\n";
        $headers .= "From: SRIONE <info@srionegrow.com>" . "\\r\\n";
        $headers .= "Reply-To: info@srionegrow.com" . "\\r\\n";
        
        mail($to, $subject, $htmlContent, $headers);'''
        
    new_mail = '''        try {
            $mail = getMailer();
            $mail->setFrom('info@srionegrow.com', 'SRIONE');
            $mail->addAddress($to, $name);
            $mail->addReplyTo('info@srionegrow.com', 'SRIONE');
            
            $mail->isHTML(true);
            $mail->Subject = $subject;
            $mail->Body    = $htmlContent;
            
            $mail->send();
        } catch (Exception $e) {
            // Email failed but registration succeeded
        }'''
        
    auth = auth.replace(old_mail, new_mail)
    with open(auth_file, 'w', encoding='utf-8') as f:
        f.write(auth)

# 3. Update contact.php
contact_file = os.path.join(workspace, 'backend/api/contact.php')
with open(contact_file, 'r', encoding='utf-8') as f:
    contact = f.read()

if "require 'smtp_config.php';" not in contact:
    contact = contact.replace("if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS')", "require 'smtp_config.php';\n\nif ($_SERVER['REQUEST_METHOD'] === 'OPTIONS')")
    
    old_mail_contact = '''$headers = "MIME-Version: 1.0" . "\\r\\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\\r\\n";
$headers .= "From: SRIONE Website <no-reply@srionegrow.com>" . "\\r\\n";
$headers .= "Reply-To: " . $email . "\\r\\n";

if (mail($to, $email_subject, $htmlContent, $headers)) {
    echo json_encode(['success' => true, 'message' => 'Message sent successfully.']);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to send message. Please try again later.']);
}'''
    
    new_mail_contact = '''try {
    $mail = getMailer();
    $mail->setFrom('info@srionegrow.com', 'SRIONE Website');
    $mail->addAddress($to);
    $mail->addReplyTo($email, $name);
    
    $mail->isHTML(true);
    $mail->Subject = $email_subject;
    $mail->Body    = $htmlContent;
    
    $mail->send();
    echo json_encode(['success' => true, 'message' => 'Message sent successfully.']);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Failed to send message. Error: ' . $mail->ErrorInfo]);
}'''
    
    contact = contact.replace(old_mail_contact, new_mail_contact)
    with open(contact_file, 'w', encoding='utf-8') as f:
        f.write(contact)

print('Updated auth.php and contact.php to use PHPMailer')
