import os

workspace = r'c:\Users\DELL\Documents\srioone_numerology\srionegrow'

# 1. Update database.sql
db_file = os.path.join(workspace, 'backend/database.sql')
with open(db_file, 'r', encoding='utf-8') as f:
    sql = f.read()

if 'image_url VARCHAR(255) DEFAULT NULL' not in sql:
    sql = sql.replace('css_class VARCHAR(50) DEFAULT \'service-numerology\',', 'css_class VARCHAR(50) DEFAULT \'service-numerology\',\n    image_url VARCHAR(255) DEFAULT NULL,')
    with open(db_file, 'w', encoding='utf-8') as f:
        f.write(sql)

# 2. Update services.php to handle image upload
php_file = os.path.join(workspace, 'backend/api/services.php')
with open(php_file, 'r', encoding='utf-8') as f:
    php = f.read()

if '$_FILES[\'image\']' not in php:
    new_php = """$css_class = $_POST['css_class'] ?? 'service-numerology';
    
    $image_url = '';
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = '../uploads/';
        if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);
        $fileName = time() . '_' . basename($_FILES['image']['name']);
        $targetFile = $uploadDir . $fileName;
        if (move_uploaded_file($_FILES['image']['tmp_name'], $targetFile)) {
            $image_url = 'uploads/' . $fileName;
        }
    }"""
    php = php.replace("$css_class = $_POST['css_class'] ?? 'service-numerology';", new_php)
    
    php = php.replace("INSERT INTO services (name, mark, description, link, css_class) VALUES (?, ?, ?, ?, ?)", "INSERT INTO services (name, mark, description, link, css_class, image_url) VALUES (?, ?, ?, ?, ?, ?)")
    php = php.replace("execute([$name, $mark, $description, $link, $css_class])", "execute([$name, $mark, $description, $link, $css_class, $image_url])")
    
    with open(php_file, 'w', encoding='utf-8') as f:
        f.write(php)

# 3. Update Admin.jsx for Services form
admin_file = os.path.join(workspace, 'src/pages/Admin.jsx')
with open(admin_file, 'r', encoding='utf-8') as f:
    admin = f.read()

if 'serviceImageFile' not in admin:
    # Add state
    admin = admin.replace('const [serviceForm, setServiceForm] = useState({ name: \'\', mark: \'\', description: \'\', link: \'/contact\', css_class: \'service-numerology\' });', 'const [serviceForm, setServiceForm] = useState({ name: \'\', mark: \'\', description: \'\', link: \'/contact\', css_class: \'service-numerology\' });\n  const [serviceImageFile, setServiceImageFile] = useState(null);')
    
    # Update handler
    old_handler = """  const handleUploadService = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/services.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(serviceForm)
      });
      const result = await res.json();
      if(result.success) {
        alert('Service added!');
        fetchData();
        setServiceForm({ name: '', mark: '', description: '', link: '/contact', css_class: 'service-numerology' });
      }
    } catch (err) {
      alert('Mock Service Add Success! (PHP not connected)');
    }
  };"""
    new_handler = """  const handleUploadService = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', serviceForm.name);
    formData.append('mark', serviceForm.mark);
    formData.append('description', serviceForm.description);
    formData.append('link', serviceForm.link);
    formData.append('css_class', serviceForm.css_class);
    if (serviceImageFile) formData.append('image', serviceImageFile);

    try {
      const res = await fetch(`${API_URL}/services.php`, {
        method: 'POST',
        body: formData
      });
      const result = await res.json();
      if(result.success) {
        alert('Service added!');
        fetchData();
        setServiceForm({ name: '', mark: '', description: '', link: '/contact', css_class: 'service-numerology' });
        setServiceImageFile(null);
      }
    } catch (err) {
      alert('Mock Service Add Success! (PHP not connected)');
    }
  };"""
    admin = admin.replace(old_handler, new_handler)
    
    # Update form
    old_form = """            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '24px' }}>Add Service</button>"""
    new_form = """            <label style={{ display: 'block', marginTop: '16px', marginBottom: '8px', fontWeight: '800' }}>Service Image (Optional)</label>
            <input type="file" accept="image/*" onChange={e => setServiceImageFile(e.target.files[0])} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }} />
            
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '24px' }}>Add Service</button>"""
    admin = admin.replace(old_form, new_form)

    with open(admin_file, 'w', encoding='utf-8') as f:
        f.write(admin)

print("Backend and Admin updated for Service images!")
