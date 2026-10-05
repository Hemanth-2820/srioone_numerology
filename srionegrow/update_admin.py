import os

workspace = r'c:\Users\DELL\Documents\srioone_numerology\srionegrow'
admin_file = os.path.join(workspace, 'src/pages/Admin.jsx')

with open(admin_file, 'r', encoding='utf-8') as f:
    admin = f.read()

# Add delete product function
if 'handleDeleteProduct' not in admin:
    delete_fns = '''  const handleDeleteProduct = async (id) => {
    if(!confirm('Are you sure you want to delete this product?')) return;
    try {
      await fetch(`${API_URL}/products.php?id=${id}`, { method: 'DELETE' });
      fetchData();
    } catch(err) { alert('Failed to delete'); }
  };

  const handleEditProduct = (product) => {
    setFormData({ id: product.id, name: product.name, category: product.category, price: product.price });
  };

  const handleDeleteService = async (id) => {
    if(!confirm('Are you sure you want to delete this service?')) return;
    try {
      await fetch(`${API_URL}/services.php?id=${id}`, { method: 'DELETE' });
      fetchData();
    } catch(err) { alert('Failed to delete'); }
  };

  const handleEditService = (service) => {
    setServiceForm({ id: service.id, name: service.name, mark: service.mark, description: service.description, link: service.link, css_class: service.css_class });
  };'''
    admin = admin.replace('const handleUploadService = async (e) => {', delete_fns + '\n\n  const handleUploadService = async (e) => {')

# Modify product form data initialization
if "setFormData({ name: '', category: 'Stones', price: '' });" in admin:
    admin = admin.replace("setFormData({ name: '', category: 'Stones', price: '' });", "setFormData({ id: null, name: '', category: 'Stones', price: '' });")

if "data.append('name', formData.name);" in admin:
    admin = admin.replace("data.append('name', formData.name);", "data.append('name', formData.name);\n    if (formData.id) data.append('id', formData.id);")
    
if "formData.append('name', serviceForm.name);" in admin:
    admin = admin.replace("formData.append('name', serviceForm.name);", "formData.append('name', serviceForm.name);\n    if (serviceForm.id) formData.append('id', serviceForm.id);")

# Add actions to product table
admin = admin.replace('<th>Price</th>', '<th>Price</th><th>Actions</th>')
admin = admin.replace('<td>₹{p.price}</td>', '<td>₹{p.price}</td><td><button onClick={() => handleEditProduct(p)} style={{marginRight:"5px", padding:"2px 5px"}}>Edit</button><button onClick={() => handleDeleteProduct(p.id)} style={{background:"red", color:"white", padding:"2px 5px", border:"none"}}>Del</button></td>')

# Add actions to service table
admin = admin.replace('<th>Mark</th>', '<th>Mark</th><th>Actions</th>')
admin = admin.replace('<td>{s.mark}</td>', '<td>{s.mark}</td><td><button onClick={() => handleEditService(s)} style={{marginRight:"5px", padding:"2px 5px"}}>Edit</button><button onClick={() => handleDeleteService(s.id)} style={{background:"red", color:"white", padding:"2px 5px", border:"none"}}>Del</button></td>')

# Fix form headers to show 'Edit' or 'Add'
admin = admin.replace('<h3>Add New Product</h3>', '<h3>{formData.id ? "Edit Product" : "Add New Product"}</h3>')
admin = admin.replace('<h3>Add New Service</h3>', '<h3>{serviceForm.id ? "Edit Service" : "Add New Service"}</h3>')
admin = admin.replace('Upload Product', '{formData.id ? "Update Product" : "Upload Product"}')
admin = admin.replace('Upload Service', '{serviceForm.id ? "Update Service" : "Upload Service"}')

with open(admin_file, 'w', encoding='utf-8') as f:
    f.write(admin)

print('Updated Admin.jsx')
