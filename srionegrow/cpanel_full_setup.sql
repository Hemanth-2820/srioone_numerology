DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS services;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    address TEXT DEFAULT NULL,
    city VARCHAR(100) DEFAULT NULL,
    state VARCHAR(100) DEFAULT NULL,
    zip VARCHAR(20) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT DEFAULT NULL,
    category VARCHAR(100) NOT NULL,
    price VARCHAR(50) NOT NULL,
    image_url VARCHAR(255) DEFAULT NULL,
    icon VARCHAR(50) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    mark VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    link VARCHAR(255) DEFAULT '/contact',
    css_class VARCHAR(50) DEFAULT 'service-numerology',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

INSERT INTO users (name, email, password) VALUES ('Admin User', 'admin@srione.com', 'admin_hash_placeholder');


/* -------------------------------------------------------- */
/* Run this in phpMyAdmin to seed all your default products */
/* -------------------------------------------------------- */

INSERT INTO products (name, description, price, category, image_url) SELECT 'Amethyst', 'Beautiful Amethyst for Stones', 899.0, 'Stones', NULL FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Amethyst');
INSERT INTO products (name, description, price, category, image_url) SELECT 'Amazonite', 'Beautiful Amazonite for Stones', 799.0, 'Stones', NULL FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Amazonite');
INSERT INTO products (name, description, price, category, image_url) SELECT 'Blood stone', 'Beautiful Blood stone for Stones', 799.0, 'Stones', NULL FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Blood stone');
INSERT INTO products (name, description, price, category, image_url) SELECT 'Red Carnelian', 'Beautiful Red Carnelian for Stones', 799.0, 'Stones', NULL FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Red Carnelian');
INSERT INTO products (name, description, price, category, image_url) SELECT 'Cats eye', 'Beautiful Cats eye for Stones', 999.0, 'Stones', NULL FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Cats eye');
INSERT INTO products (name, description, price, category, image_url) SELECT 'Natural Citrine', 'Beautiful Natural Citrine for Stones', 1199.0, 'Stones', NULL FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Natural Citrine');
INSERT INTO products (name, description, price, category, image_url) SELECT 'Normal citrine', 'Beautiful Normal citrine for Stones', 999.0, 'Stones', NULL FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Normal citrine');
INSERT INTO products (name, description, price, category, image_url) SELECT 'Dhan yog', 'Beautiful Dhan yog for Balancing', 699.0, 'Balancing', NULL FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Dhan yog');
INSERT INTO products (name, description, price, category, image_url) SELECT 'Green avenchurain', 'Beautiful Green avenchurain for Stones', 799.0, 'Stones', NULL FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Green avenchurain');
INSERT INTO products (name, description, price, category, image_url) SELECT 'Green jade', 'Beautiful Green jade for Stones', 699.0, 'Stones', NULL FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Green jade');
INSERT INTO products (name, description, price, category, image_url) SELECT 'Green onyx', 'Beautiful Green onyx for Stones', 799.0, 'Stones', NULL FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Green onyx');
INSERT INTO products (name, description, price, category, image_url) SELECT 'Hematite', 'Beautiful Hematite for Stones', 699.0, 'Stones', NULL FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Hematite');
INSERT INTO products (name, description, price, category, image_url) SELECT 'Howlite', 'Beautiful Howlite for Stones', 799.0, 'Stones', NULL FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Howlite');
INSERT INTO products (name, description, price, category, image_url) SELECT 'Karungali damru', 'Beautiful Karungali damru for Accessories', 699.0, 'Accessories', '' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Karungali damru');
INSERT INTO products (name, description, price, category, image_url) SELECT 'Karungali rudraksha', 'Beautiful Karungali rudraksha for Accessories', 699.0, 'Accessories', '' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Karungali rudraksha');
INSERT INTO products (name, description, price, category, image_url) SELECT 'Labradorite', 'Beautiful Labradorite for Stones', 799.0, 'Stones', NULL FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Labradorite');
INSERT INTO products (name, description, price, category, image_url) SELECT 'Lapis', 'Beautiful Lapis for Stones', 899.0, 'Stones', NULL FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Lapis');
INSERT INTO products (name, description, price, category, image_url) SELECT 'Money magnet', 'Beautiful Money magnet for Vaastu', 699.0, 'Vaastu', '' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Money magnet');
INSERT INTO products (name, description, price, category, image_url) SELECT 'Moonstone', 'Beautiful Moonstone for Stones', 799.0, 'Stones', NULL FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Moonstone');
INSERT INTO products (name, description, price, category, image_url) SELECT 'Pyrite', 'Beautiful Pyrite for Stones', 699.0, 'Stones', NULL FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Pyrite');
INSERT INTO products (name, description, price, category, image_url) SELECT 'Rhodonite', 'Beautiful Rhodonite for Stones', 699.0, 'Stones', NULL FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Rhodonite');
INSERT INTO products (name, description, price, category, image_url) SELECT 'Rose', 'Beautiful Rose for Stones', 699.0, 'Stones', NULL FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Rose');
INSERT INTO products (name, description, price, category, image_url) SELECT 'Sevan chakra', 'Beautiful Sevan chakra for Balancing', 799.0, 'Balancing', NULL FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Sevan chakra');
INSERT INTO products (name, description, price, category, image_url) SELECT 'Smokey quartz', 'Beautiful Smokey quartz for Stones', 999.0, 'Stones', NULL FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Smokey quartz');
INSERT INTO products (name, description, price, category, image_url) SELECT 'Sulemani', 'Beautiful Sulemani for Stones', 799.0, 'Stones', NULL FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Sulemani');
INSERT INTO products (name, description, price, category, image_url) SELECT 'Tiger eye', 'Beautiful Tiger eye for Stones', 699.0, 'Stones', NULL FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Tiger eye');
INSERT INTO products (name, description, price, category, image_url) SELECT 'Red jespar', 'Beautiful Red jespar for Stones', 699.0, 'Stones', NULL FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Red jespar');
INSERT INTO products (name, description, price, category, image_url) SELECT 'Rodocrosite', 'Beautiful Rodocrosite for Stones', 799.0, 'Stones', NULL FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Rodocrosite');
INSERT INTO products (name, description, price, category, image_url) SELECT 'zibu keychain', 'Beautiful zibu keychain for Accessories', 199.0, 'Accessories', '' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'zibu keychain');
INSERT INTO products (name, description, price, category, image_url) SELECT 'Turquoise', 'Beautiful Turquoise for Stones', 799.0, 'Stones', NULL FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Turquoise');
INSERT INTO products (name, description, price, category, image_url) SELECT 'Turquoise high', 'Beautiful Turquoise high for Stones', 1199.0, 'Stones', NULL FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Turquoise high');
INSERT INTO products (name, description, price, category, image_url) SELECT 'Karungali full set (mala bracelet rudraksh, certificate)', 'Beautiful Karungali full set (mala bracelet rudraksh, certificate) for Bracelets', 799.0, 'Bracelets', '' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Karungali full set (mala bracelet rudraksh, certificate)');
INSERT INTO products (name, description, price, category, image_url) SELECT 'selenite leaf', 'Beautiful selenite leaf for Balancing', 899.0, 'Balancing', '' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'selenite leaf');
INSERT INTO products (name, description, price, category, image_url) SELECT 'selenite tower', 'Beautiful selenite tower for Balancing', 899.0, 'Balancing', '' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'selenite tower');
INSERT INTO products (name, description, price, category, image_url) SELECT 'vastu kit', 'Beautiful vastu kit for Vaastu', 1.0, 'Vaastu', '' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'vastu kit');
INSERT INTO products (name, description, price, category, image_url) SELECT 'wish box', 'Beautiful wish box for Balancing', 5.0, 'Balancing', '' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'wish box');
INSERT INTO products (name, description, price, category, image_url) SELECT 'oval money magnet', 'Beautiful oval money magnet for Vaastu', 10.0, 'Vaastu', '' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'oval money magnet');
INSERT INTO products (name, description, price, category, image_url) SELECT 'tree', 'Beautiful tree for Vaastu', 19.0, 'Vaastu', '' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'tree');
INSERT INTO products (name, description, price, category, image_url) SELECT 'pure quartz pyramid bracelet', 'Beautiful pure quartz pyramid bracelet for Bracelets', 5.0, 'Bracelets', '' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'pure quartz pyramid bracelet');
INSERT INTO products (name, description, price, category, image_url) SELECT 'zodiac shine coin full set 2', 'Beautiful zodiac shine coin full set 2 for Accessories', 1299.0, 'Accessories', '' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'zodiac shine coin full set 2');
INSERT INTO products (name, description, price, category, image_url) SELECT 'rashi set', 'Beautiful rashi set for Balancing', 9999.0, 'Balancing', '' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'rashi set');
INSERT INTO products (name, description, price, category, image_url) SELECT 'Mesha (Aries)', 'Beautiful Mesha (Aries) for Rashi', 899.0, 'Rashi', NULL FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Mesha (Aries)');
INSERT INTO products (name, description, price, category, image_url) SELECT 'Vrishabha (Taurus)', 'Beautiful Vrishabha (Taurus) for Rashi', 899.0, 'Rashi', '' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Vrishabha (Taurus)');
INSERT INTO products (name, description, price, category, image_url) SELECT 'Mithuna (Gemini)', 'Beautiful Mithuna (Gemini) for Rashi', 899.0, 'Rashi', NULL FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Mithuna (Gemini)');
INSERT INTO products (name, description, price, category, image_url) SELECT 'Karka (Cancer)', 'Beautiful Karka (Cancer) for Rashi', 899.0, 'Rashi', '' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Karka (Cancer)');
INSERT INTO products (name, description, price, category, image_url) SELECT 'Simha (Leo)', 'Beautiful Simha (Leo) for Rashi', 899.0, 'Rashi', '' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Simha (Leo)');
INSERT INTO products (name, description, price, category, image_url) SELECT 'Kanya (Virgo)', 'Beautiful Kanya (Virgo) for Rashi', 8999.0, 'Rashi', NULL FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Kanya (Virgo)');
INSERT INTO products (name, description, price, category, image_url) SELECT 'Tula (Libra)', 'Beautiful Tula (Libra) for Rashi', 899.0, 'Rashi', NULL FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Tula (Libra)');
INSERT INTO products (name, description, price, category, image_url) SELECT 'Vrishchika (Scorpio)', 'Beautiful Vrishchika (Scorpio) for Rashi', 899.0, 'Rashi', NULL FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Vrishchika (Scorpio)');
INSERT INTO products (name, description, price, category, image_url) SELECT 'Dhanu (Sagittarius)', 'Beautiful Dhanu (Sagittarius) for Rashi', 899.0, 'Rashi', NULL FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Dhanu (Sagittarius)');
INSERT INTO products (name, description, price, category, image_url) SELECT 'Makara (Capricorn)', 'Beautiful Makara (Capricorn) for Rashi', 899.0, 'Rashi', '' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Makara (Capricorn)');
INSERT INTO products (name, description, price, category, image_url) SELECT 'Kumbha (Aquarius)', 'Beautiful Kumbha (Aquarius) for Rashi', 899.0, 'Rashi', NULL FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Kumbha (Aquarius)');
INSERT INTO products (name, description, price, category, image_url) SELECT 'Meena (Pisces)', 'Beautiful Meena (Pisces) for Rashi', 899.0, 'Rashi', '' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Meena (Pisces)');
INSERT INTO products (name, description, price, category, image_url) SELECT 'Pyrite pen', 'Beautiful Pyrite pen for Accessories', 799.0, 'Accessories', '' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Pyrite pen');
INSERT INTO products (name, description, price, category, image_url) SELECT 'green zibu coin', 'Beautiful green zibu coin for Accessories', 199.0, 'Accessories', '' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'green zibu coin');
INSERT INTO products (name, description, price, category, image_url) SELECT 'mulank bracelet 3 set', 'Beautiful mulank bracelet 3 set for Bracelets', 9999.0, 'Bracelets', '' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'mulank bracelet 3 set');
INSERT INTO products (name, description, price, category, image_url) SELECT 'selenite plate ruff round', 'Beautiful selenite plate ruff round for Balancing', 199.0, 'Balancing', '' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'selenite plate ruff round');
INSERT INTO products (name, description, price, category, image_url) SELECT 'small pyamid', 'Beautiful small pyamid for Vaastu', 899.0, 'Vaastu', '' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'small pyamid');
INSERT INTO products (name, description, price, category, image_url) SELECT 'big pyramid', 'Beautiful big pyramid for Vaastu', 999.0, 'Vaastu', '' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'big pyramid');
INSERT INTO products (name, description, price, category, image_url) SELECT 'dhan yog chain girl bracelet', 'Beautiful dhan yog chain girl bracelet for Bracelets', 899.0, 'Bracelets', '' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'dhan yog chain girl bracelet');
INSERT INTO products (name, description, price, category, image_url) SELECT 'dhan yog boy chain bracelet', 'Beautiful dhan yog boy chain bracelet for Bracelets', 899.0, 'Bracelets', '' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'dhan yog boy chain bracelet');
INSERT INTO products (name, description, price, category, image_url) SELECT '2 kg pyrite', 'Beautiful 2 kg pyrite for Stones', 1999.0, 'Stones', '' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = '2 kg pyrite');
INSERT INTO products (name, description, price, category, image_url) SELECT 'rose quartz pendent', 'Beautiful rose quartz pendent for Accessories', 199.0, 'Accessories', '' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'rose quartz pendent');
INSERT INTO products (name, description, price, category, image_url) SELECT 'varity natural tumble 10 each', 'Beautiful varity natural tumble 10 each for Stones', 149.0, 'Stones', '' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'varity natural tumble 10 each');
INSERT INTO products (name, description, price, category, image_url) SELECT 'peacock frame', 'Beautiful peacock frame for Vaastu', 1299.0, 'Vaastu', NULL FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'peacock frame');
INSERT INTO products (name, description, price, category, image_url) SELECT 'pyrite anklet', 'Beautiful pyrite anklet for Accessories', 599.0, 'Accessories', NULL FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'pyrite anklet');
INSERT INTO products (name, description, price, category, image_url) SELECT 'vyapar vridji yantra', 'Beautiful vyapar vridji yantra for Vaastu', 1199.0, 'Vaastu', '' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'vyapar vridji yantra');
INSERT INTO products (name, description, price, category, image_url) SELECT 'kuber pendent', 'Beautiful kuber pendent for Vaastu', 5.0, 'Vaastu', '' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'kuber pendent');
INSERT INTO products (name, description, price, category, image_url) SELECT '7 chakra diye', 'Beautiful 7 chakra diye for Balancing', 15.0, 'Balancing', '' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = '7 chakra diye');
INSERT INTO products (name, description, price, category, image_url) SELECT '7 chakra hanger', 'Beautiful 7 chakra hanger for Balancing', 5.0, 'Balancing', '' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = '7 chakra hanger');

/* -------------------------------------------------------- */
/* Seed Default Services */
/* -------------------------------------------------------- */


/* ------------------------------------------------------------------ */
/* New User Requested Services */
/* ------------------------------------------------------------------ */
INSERT INTO services (name, mark, description, link, css_class) SELECT 'Aura scanning', '✧', 'Deep harmony field analysis to identify blockages and align your aura.', '/contact', 'service-crystal' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM services WHERE name = 'Aura scanning');
INSERT INTO services (name, mark, description, link, css_class) SELECT 'Numerology report', '∞', 'Comprehensive life path and destiny analysis based on your birth numbers.', '/contact', 'service-numerology' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM services WHERE name = 'Numerology report');
INSERT INTO services (name, mark, description, link, css_class) SELECT 'Vaastu report', '⌂', 'Detailed spatial harmony report for your home or office layout.', '/contact', 'service-vaastu' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM services WHERE name = 'Vaastu report');
INSERT INTO services (name, mark, description, link, css_class) SELECT 'Vaastu consultation', '⌂', 'Personalized one-on-one guidance to harmonize your living spaces.', '/contact', 'service-vaastu' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM services WHERE name = 'Vaastu consultation');
INSERT INTO services (name, mark, description, link, css_class) SELECT 'Vedic numerology', '🕉️', 'Ancient Vedic calculation techniques for precise life predictions.', '/contact', 'service-numerology' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM services WHERE name = 'Vedic numerology');
INSERT INTO services (name, mark, description, link, css_class) SELECT 'Pronology', '🔤', 'The science of name vibrations and how your name impacts your destiny.', '/contact', 'service-numerology' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM services WHERE name = 'Pronology');
INSERT INTO services (name, mark, description, link, css_class) SELECT 'Business numerology', '📈', 'Strategic naming and timing analysis for corporate success and wealth.', '/contact', 'service-numerology' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM services WHERE name = 'Business numerology');
INSERT INTO services (name, mark, description, link, css_class) SELECT 'Phone numerology', '📱', 'Selecting the perfect high-vibration mobile number for luck and growth.', '/contact', 'service-numerology' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM services WHERE name = 'Phone numerology');
INSERT INTO services (name, mark, description, link, css_class) SELECT 'Aura boosting', '✨', 'Harmonious cleansing and amplification to attract positivity and abundance.', '/contact', 'service-crystal' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM services WHERE name = 'Aura boosting');
INSERT INTO services (name, mark, description, link, css_class) SELECT 'Remedies', '🌿', 'Customized spiritual and physical remedies to overcome life obstacles.', '/contact', 'service-crystal' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM services WHERE name = 'Remedies');
