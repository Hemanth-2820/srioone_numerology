<?php
// =============================================
// PHONEPE PAYMENT GATEWAY CONFIG
// =============================================
// Flip PHONEPE_TEST_MODE to false when going live
// and replace the credentials below with LIVE keys.
// =============================================

define('PHONEPE_TEST_MODE', false);

// ---- PRODUCTION Credentials (PhonePe Business Live Mode) ----
define('PHONEPE_CLIENT_ID',      'SU2610121823430855554880');
define('PHONEPE_CLIENT_SECRET',  '0910ad47-0d43-4b80-a7d1-f527e18b7e27');
define('PHONEPE_CLIENT_VERSION', 1);

// ---- API Base URLs ----
define('PHONEPE_BASE_URL', PHONEPE_TEST_MODE
    ? 'https://api-preprod.phonepe.com/apis/pg-sandbox'
    : 'https://api.phonepe.com/apis/pg');

// ---- Your site URL (no trailing slash) ----
define('SITE_URL', 'https://srionegrow.com');

// ---- PhonePe Redirect after payment ----
define('PHONEPE_REDIRECT_URL', SITE_URL . '/payment-status');
