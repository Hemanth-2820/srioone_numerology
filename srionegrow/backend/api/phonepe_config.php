<?php
// =============================================
// PHONEPE PAYMENT GATEWAY CONFIG
// =============================================
// Flip PHONEPE_TEST_MODE to false when going live
// and replace the credentials below with LIVE keys.
// =============================================

define('PHONEPE_TEST_MODE', false);

// ---- TEST Credentials (PhonePe Business Test Mode) ----
define('PHONEPE_CLIENT_ID',      'M238464VSJRQF_2610130950');
define('PHONEPE_CLIENT_SECRET',  'NWVlZDk1NTktM2E3NS00OTRiLTljZjgtOWRlMzgzMzM3OThk');
define('PHONEPE_CLIENT_VERSION', 1);

// ---- API Base URLs ----
define('PHONEPE_BASE_URL', PHONEPE_TEST_MODE
    ? 'https://api-preprod.phonepe.com/apis/pg-sandbox'
    : 'https://api.phonepe.com/apis/pg');

// ---- Your site URL (no trailing slash) ----
define('SITE_URL', 'https://srionegrow.com');

// ---- PhonePe Redirect after payment ----
define('PHONEPE_REDIRECT_URL', SITE_URL . '/payment-status');
