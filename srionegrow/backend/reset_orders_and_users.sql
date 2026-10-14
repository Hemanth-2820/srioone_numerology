-- ========================================================
-- RESET USERS & ORDERS FOR FRESH LAUNCH
-- Run this SQL in phpMyAdmin to start clean with #SRIONE1
-- ========================================================

-- 1. Disable Foreign Key checks temporarily
SET FOREIGN_KEY_CHECKS = 0;

-- 2. Clear all previous test orders and reset AUTO_INCREMENT to 1
TRUNCATE TABLE orders;

-- 3. Clear all test registered customers and reset AUTO_INCREMENT to 1
TRUNCATE TABLE users;

-- 4. Re-enable Foreign Key checks
SET FOREIGN_KEY_CHECKS = 1;

-- 5. Note: Your Admin Dashboard credentials remain safe in the `admins` table.
-- Customers will now register fresh with User #1, #2, #3...
-- Orders will now be created fresh as #SRIONE1, #SRIONE2, #SRIONE3...
