import os
import re

workspace = r'c:\Users\DELL\Documents\srioone_numerology\srionegrow'

seed_file = os.path.join(workspace, 'cpanel_seed.sql')
with open(seed_file, 'r', encoding='utf-8') as f:
    sql = f.read()

# Make image_url NULL for all seed products to force fallback to icons
sql = re.sub(r"'[^']*?\.png'", 'NULL', sql)
sql = re.sub(r"'[^']*?\.jpg'", 'NULL', sql)

with open(seed_file, 'w', encoding='utf-8') as f:
    f.write(sql)

print('Cleaned up seed image URLs')
