import os
import glob

src_dir = r"c:\Users\DELL\Documents\srioone_numerology\srionegrow\src"
files = glob.glob(os.path.join(src_dir, "**", "*.*"), recursive=True)

for file in files:
    if file.endswith((".css", ".jsx", ".js")):
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Replace inline styles and css colors
        new_content = content.replace("'#111'", "'var(--text-primary)'")
        new_content = new_content.replace('"#111"', '"var(--text-primary)"')
        new_content = new_content.replace("#111111", "var(--text-primary)")
        new_content = new_content.replace("'#222'", "'var(--text-secondary)'")
        new_content = new_content.replace('"#222"', '"var(--text-secondary)"')
        new_content = new_content.replace("#222222", "var(--text-secondary)")
        new_content = new_content.replace("color: 'black'", "color: 'var(--text-primary)'")
        new_content = new_content.replace("color: \"black\"", "color: \"var(--text-primary)\"")
        new_content = new_content.replace("color: black", "color: var(--text-primary)")
        
        if new_content != content:
            with open(file, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated {file}")
