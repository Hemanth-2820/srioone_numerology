import os

workspace = r'c:\Users\DELL\Documents\srioone_numerology\srionegrow'
seed_path = os.path.join(workspace, 'cpanel_seed.sql')

with open(seed_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = [line for line in lines if 'INSERT INTO services' not in line]

services_to_add = [
    ('Aura scanning', '✧', 'Deep harmony field analysis to identify blockages and align your aura.', '/contact', 'service-crystal'),
    ('Numerology report', '∞', 'Comprehensive life path and destiny analysis based on your birth numbers.', '/contact', 'service-numerology'),
    ('Vaastu report', '⌂', 'Detailed spatial harmony report for your home or office layout.', '/contact', 'service-vaastu'),
    ('Vaastu consultation', '⌂', 'Personalized one-on-one guidance to harmonize your living spaces.', '/contact', 'service-vaastu'),
    ('Vedic numerology', '🕉️', 'Ancient Vedic calculation techniques for precise life predictions.', '/contact', 'service-numerology'),
    ('Pronology', '🔤', 'The science of name vibrations and how your name impacts your destiny.', '/contact', 'service-numerology'),
    ('Business numerology', '📈', 'Strategic naming and timing analysis for corporate success and wealth.', '/contact', 'service-numerology'),
    ('Phone numerology', '📱', 'Selecting the perfect high-vibration mobile number for luck and growth.', '/contact', 'service-numerology'),
    ('Aura boosting', '✨', 'Harmonious cleansing and amplification to attract positivity and abundance.', '/contact', 'service-crystal'),
    ('Remedies', '🌿', 'Customized spiritual and physical remedies to overcome life obstacles.', '/contact', 'service-crystal')
]

with open(seed_path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
    f.write('\n/* ------------------------------------------------------------------ */\n')
    f.write('/* New User Requested Services */\n')
    f.write('/* ------------------------------------------------------------------ */\n')
    for name, mark, desc, link, css in services_to_add:
        f.write(f"INSERT INTO services (name, mark, description, link, css_class) SELECT '{name}', '{mark}', '{desc}', '{link}', '{css}' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM services WHERE name = '{name}');\n")

print('Updated cpanel_seed.sql with 10 new services!')
