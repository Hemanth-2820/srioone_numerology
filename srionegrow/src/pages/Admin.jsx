import { useState, useEffect } from 'react';
import { API_URL } from '../config';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);
  const [serviceForm, setServiceForm] = useState({ name: '', mark: '', description: '', link: '/contact', css_class: 'service-numerology' });
  const [serviceImageFile, setServiceImageFile] = useState(null);
  
  const [formData, setFormData] = useState({ name: '', category: 'Stones', price: '' });
  const [imageFile, setImageFile] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/login.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
        fetchData();
      } else {
        alert('Invalid Password');
      }
    } catch (err) {
      // Fallback for local testing if PHP isn't running
      if (password === 'srione@2026') {
        setIsAuthenticated(true);
        fetchData();
      } else {
        alert('Invalid Password (Local Fallback)');
      }
    }
  };

  const fetchData = async () => {
    try {
      const pRes = await fetch(`${API_URL}/products.php`);
      if(pRes.ok) setProducts(await pRes.json());
      
      const sRes = await fetch(`${API_URL}/services.php`);
      if(sRes.ok) setServices(await sRes.json());

      const uRes = await fetch(`${API_URL}/users.php`);
      if(uRes.ok) setUsers(await uRes.json());
    } catch (err) {
      console.log('Using mock data, PHP API not reachable');
      setProducts([
        { id: 1, name: 'Amethyst', category: 'Stones', price: '4500' },
        { id: 2, name: 'Citrine Bracelet', category: 'Bracelets', price: '8500' }
      ]);
      setUsers([{ id: 1, name: 'Admin', email: 'admin@srione.com', created_at: 'Today' }]);
      setServices([{ id: 1, name: 'Sample Service', mark: '✧', description: 'This is a sample service.', link: '/contact' }]);
    }
  };

  
    const handleDeleteProduct = async (id) => {
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
  };

  const handleUploadService = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', serviceForm.name);
    if (serviceForm.id) formData.append('id', serviceForm.id);
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
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    if (formData.id) data.append('id', formData.id);
    data.append('category', formData.category);
    data.append('price', formData.price);
    if (imageFile) data.append('image', imageFile);

    try {
      const res = await fetch(`${API_URL}/products.php`, { method: 'POST', body: data });
      const result = await res.json();
      if(result.success) {
        alert('Product uploaded!');
        fetchData(); // Refresh list
        setFormData({ id: null, name: '', category: 'Stones', price: '' });
      }
    } catch (err) {
      alert('Mock Upload Success! (PHP not connected)');
    }
  };

  if (!isAuthenticated) {
    return (
      <section className="section" style={{ minHeight: '70vh', display: 'grid', placeItems: 'center' }}>
        <form onSubmit={handleLogin} style={{ background: 'var(--bg-card)', padding: '40px', borderRadius: 'var(--radius-card)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
          <h2>Admin Login</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>Enter password to access dashboard</p>
          <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="Password..." style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }} />
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Login</button>
        </form>
      </section>
    );
  }

  return (
    <section className="section" style={{ minHeight: '80vh' }}>
      <div className="section-heading" style={{ marginBottom: '30px' }}>
        <h2>Admin Dashboard</h2>
        <p>Manage your SRIONE shop and users.</p>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '30px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px' }}>
        <button onClick={() => setActiveTab('products')} style={{ padding: '8px 16px', background: activeTab === 'products' ? 'var(--bg-surface-active)' : 'transparent', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', fontWeight: '800', cursor: 'pointer' }}>Manage Products</button>
        <button onClick={() => setActiveTab('services')} style={{ padding: '8px 16px', background: activeTab === 'services' ? 'var(--bg-surface-active)' : 'transparent', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', fontWeight: '800', cursor: 'pointer' }}>Manage Services</button>
        <button onClick={() => setActiveTab('users')} style={{ padding: '8px 16px', background: activeTab === 'users' ? 'var(--bg-surface-active)' : 'transparent', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', fontWeight: '800', cursor: 'pointer' }}>View Users</button>
      </div>

      {activeTab === 'products' && (
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '40px' }}>
          <form onSubmit={handleUpload} style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: 'var(--radius-card)', border: '1px solid var(--border-subtle)', alignSelf: 'start' }}>
            <h3>{formData.id ? "Edit Product" : "Add New Product"}</h3>
            <label style={{ display: 'block', marginTop: '16px', marginBottom: '8px', fontWeight: '800' }}>Product Name</label>
            <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }} />
            <label style={{ display: 'block', marginTop: '16px', marginBottom: '8px', fontWeight: '800' }}>Category</label>
            <input list="category-options" required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }} placeholder="Type a category..." />
            <datalist id="category-options">
              <option value="Stones" />
              <option value="Bracelets" />
              <option value="Balancing" />
              <option value="Accessories" />
              <option value="Vaastu" />
            </datalist>
            <label style={{ display: 'block', marginTop: '16px', marginBottom: '8px', fontWeight: '800' }}>Price (e.g. 4500)</label>
            <input type="number" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }} />
            <label style={{ display: 'block', marginTop: '16px', marginBottom: '8px', fontWeight: '800' }}>Product Image</label>
            <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} style={{ width: '100%' }} />
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '24px' }}>{formData.id ? "Update Product" : "Upload Product"}</button>
          </form>

          <div>
            <h3>Current Products</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-card)', overflow: 'hidden' }}>
              <thead>
                <tr style={{ background: 'var(--border-subtle)', color: 'var(--bg-primary)' }}>
                  <th style={{ padding: '12px', textAlign: 'left' }}>ID</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Name</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Category</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Price</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '12px' }}>{p.id}</td>
                    <td style={{ padding: '12px', fontWeight: '800' }}>{p.name}</td>
                    <td style={{ padding: '12px' }}>{p.category}</td>
                    <td style={{ padding: '12px' }}>₹{p.price}</td>
                    <td style={{ padding: '12px' }}>
                      <button onClick={() => handleEditProduct(p)} style={{marginRight:"5px", padding:"4px 8px", background:"var(--color-pista)", border:"1px solid var(--border-subtle)", borderRadius:"4px", cursor:"pointer", fontWeight:"bold"}}>Edit</button>
                      <button onClick={() => handleDeleteProduct(p.id)} style={{background:"red", color:"white", padding:"4px 8px", border:"none", borderRadius:"4px", cursor:"pointer", fontWeight:"bold"}}>Del</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      
      {activeTab === 'services' && (
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '40px' }}>
          <form onSubmit={handleUploadService} style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: 'var(--radius-card)', border: '1px solid var(--border-subtle)', alignSelf: 'start' }}>
            <h3>{serviceForm.id ? "Edit Service" : "Add New Service"}</h3>
            <label style={{ display: 'block', marginTop: '16px', marginBottom: '8px', fontWeight: '800' }}>Service Name</label>
            <input type="text" required value={serviceForm.name} onChange={e => setServiceForm({...serviceForm, name: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }} />
            
            <label style={{ display: 'block', marginTop: '16px', marginBottom: '8px', fontWeight: '800' }}>Icon / Emoji (e.g. 📱, ✧)</label>
            <input type="text" required value={serviceForm.mark} onChange={e => setServiceForm({...serviceForm, mark: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }} />
            
            <label style={{ display: 'block', marginTop: '16px', marginBottom: '8px', fontWeight: '800' }}>Description</label>
            <textarea required value={serviceForm.description} onChange={e => setServiceForm({...serviceForm, description: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-subtle)', minHeight: '80px' }} />
            
            <label style={{ display: 'block', marginTop: '16px', marginBottom: '8px', fontWeight: '800' }}>Link URL</label>
            <input type="text" value={serviceForm.link} onChange={e => setServiceForm({...serviceForm, link: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }} />
            
            <label style={{ display: 'block', marginTop: '16px', marginBottom: '8px', fontWeight: '800' }}>Color Theme</label>
            <select value={serviceForm.css_class} onChange={e => setServiceForm({...serviceForm, css_class: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
              <option value="service-numerology">Yellow / Saffron (Numerology)</option>
              <option value="service-vaastu">Green (Vaastu)</option>
              <option value="service-crystal">Yellow + Green (Crystal)</option>
            </select>
            
            <label style={{ display: 'block', marginTop: '16px', marginBottom: '8px', fontWeight: '800' }}>Service Image (Optional)</label>
            <input type="file" accept="image/*" onChange={e => setServiceImageFile(e.target.files[0])} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }} />
            
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '24px' }}>Add Service</button>
          </form>

          <div>
            <h3>Current Services</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-card)', overflow: 'hidden' }}>
              <thead>
                <tr style={{ background: 'var(--border-subtle)', color: 'var(--bg-primary)' }}>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Icon</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Name</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Link</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.map(s => (
                  <tr key={s.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '12px', fontSize: '1.5rem' }}>{s.mark}</td>
                    <td style={{ padding: '12px', fontWeight: '800' }}>{s.name}</td>
                    <td style={{ padding: '12px' }}>{s.link}</td>
                    <td style={{ padding: '12px' }}>
                      <button onClick={() => handleEditService(s)} style={{marginRight:"5px", padding:"4px 8px", background:"var(--color-pista)", border:"1px solid var(--border-subtle)", borderRadius:"4px", cursor:"pointer", fontWeight:"bold"}}>Edit</button>
                      <button onClick={() => handleDeleteService(s.id)} style={{background:"red", color:"white", padding:"4px 8px", border:"none", borderRadius:"4px", cursor:"pointer", fontWeight:"bold"}}>Del</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div>
          <h3>Registered Users</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-card)', overflow: 'hidden' }}>
            <thead>
              <tr style={{ background: 'var(--border-subtle)', color: 'var(--bg-primary)' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>ID</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Name</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Email</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Registered At</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '12px' }}>{u.id}</td>
                  <td style={{ padding: '12px', fontWeight: '800' }}>{u.name}</td>
                  <td style={{ padding: '12px' }}>{u.email}</td>
                  <td style={{ padding: '12px' }}>{u.created_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
