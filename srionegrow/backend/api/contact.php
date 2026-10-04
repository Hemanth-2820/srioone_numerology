<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$data = json_decode(file_get_contents("php://input"));

$name = htmlspecialchars($data->name ?? '');
$email = htmlspecialchars($data->email ?? '');
$subject = htmlspecialchars($data->subject ?? 'General Inquiry');
$messageText = htmlspecialchars($data->message ?? '');

if (!$name || !$email || !$messageText) {
    echo json_encode(['success' => false, 'message' => 'Please fill out all fields.']);
    exit;
}

// Email setup
$to = "info@srionegrow.com"; // Admin email where queries will go
$email_subject = "New Website Inquiry: " . $subject;

$htmlContent = '
<html>
<head>
  <style>
    body { font-family: "Inter", sans-serif; background-color: #f4f4f4; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 12px; border-top: 6px solid #FF9933; }
    .data-row { margin-bottom: 15px; }
    .data-row strong { color: #333; }
  </style>
</head>
<body>
  <div class="container">
    <h2>New Customer Inquiry</h2>
    <p>You have received a new message from the SRIONE website contact form.</p>
    <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin-top: 20px;">
        <div class="data-row"><strong>Name:</strong> ' . $name . '</div>
        <div class="data-row"><strong>Email:</strong> ' . $email . '</div>
        <div class="data-row"><strong>Subject:</strong> ' . $subject . '</div>
        <div class="data-row"><strong>Message:</strong><br><br>' . nl2br($messageText) . '</div>
    </div>
  </div>
</body>
</html>';

$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
$headers .= "From: SRIONE Website <no-reply@srionegrow.com>" . "\r\n";
$headers .= "Reply-To: " . $email . "\r\n";

if (mail($to, $email_subject, $htmlContent, $headers)) {
    echo json_encode(['success' => true, 'message' => 'Message sent successfully.']);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to send message. Please try again later.']);
}
?>