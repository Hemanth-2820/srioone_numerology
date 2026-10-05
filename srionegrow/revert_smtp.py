import os

workspace = r'c:\Users\DELL\Documents\srioone_numerology\srionegrow'

# Revert auth.php
auth_file = os.path.join(workspace, 'backend/api/auth.php')
with open(auth_file, 'r', encoding='utf-8') as f:
    auth = f.read()

if 'getMailer()' in auth:
    auth = auth.replace("require 'db.php';\nrequire 'smtp_config.php';", "require 'db.php';")
    
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
        
    old_mail = '''        $headers = "MIME-Version: 1.0" . "\\r\\n";
        $headers .= "Content-type:text/html;charset=UTF-8" . "\\r\\n";
        $headers .= "From: SRIONE <info@srionegrow.com>" . "\\r\\n";
        $headers .= "Reply-To: info@srionegrow.com" . "\\r\\n";
        
        mail($to, $subject, $htmlContent, $headers);'''
        
    auth = auth.replace(new_mail, old_mail)
    with open(auth_file, 'w', encoding='utf-8') as f:
        f.write(auth)

# Revert contact.php
contact_file = os.path.join(workspace, 'backend/api/contact.php')
with open(contact_file, 'r', encoding='utf-8') as f:
    contact = f.read()

if 'getMailer()' in contact:
    contact = contact.replace("require 'smtp_config.php';\n\nif ($_SERVER['REQUEST_METHOD'] === 'OPTIONS')", "if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS')")
    
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
    
    old_mail_contact = '''$headers = "MIME-Version: 1.0" . "\\r\\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\\r\\n";
$headers .= "From: SRIONE Website <no-reply@srionegrow.com>" . "\\r\\n";
$headers .= "Reply-To: " . $email . "\\r\\n";

if (mail($to, $email_subject, $htmlContent, $headers)) {
    echo json_encode(['success' => true, 'message' => 'Message sent successfully.']);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to send message. Please try again later.']);
}'''
    
    contact = contact.replace(new_mail_contact, old_mail_contact)
    with open(contact_file, 'w', encoding='utf-8') as f:
        f.write(contact)

print('Reverted to native mail()')
