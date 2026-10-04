import os

workspace = r"c:\Users\DELL\Documents\srioone_numerology\srionegrow"
home_path = os.path.join(workspace, "src", "pages", "Home.jsx")

with open(home_path, "r", encoding="utf-8") as f:
    content = f.read()

# Fix 1: Featured Curations section-heading
old_featured_heading = """<div className="section-heading" style={{ textAlign: 'center', marginBottom: '60px' }}>"""
new_featured_heading = """<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '60px' }}>"""
content = content.replace(old_featured_heading, new_featured_heading)

# Fix 2: Expertise & Practices section-heading
old_services_heading = """<div className="section-heading" style={{ textAlign: 'center', marginBottom: '60px' }}>"""
new_services_heading = """<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '60px' }}>"""
content = content.replace(old_services_heading, new_services_heading)

with open(home_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Home.jsx layout successfully fixed.")
