import { useState, useEffect } from 'react';
import { API_URL } from '../config';
import { getProductDescription, getProductSpecs } from '../data/products';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  
  const [activeTab, setActiveTab] = useState('orders');
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);
  const [orders, setOrders] = useState([]);
  
  // Search & Filter state for Orders
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('ALL');

  // Search state for Products
  const [productSearch, setProductSearch] = useState('');

  const [serviceForm, setServiceForm] = useState({ name: '', mark: '', description: '', link: '/contact', css_class: 'service-numerology' });
  const [serviceImageFile, setServiceImageFile] = useState(null);
  
  const [formData, setFormData] = useState({ name: '', category: 'Stones', price: '', description: '', material: '', purpose: '', care: '' });
  const [imageFile, setImageFile] = useState(null);
  const [passwordState, setPasswordState] = useState({ current: '', next: '', confirm: '', loading: false });

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordState.next !== passwordState.confirm) {
      alert("New passwords do not match!");
      return;
    }
    setPasswordState(prev => ({ ...prev, loading: true, msg: '' }));
    try {
      const res = await fetch(`${API_URL}/admin_change_password.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordState.current,
          newPassword: passwordState.next
        })
      });
      const data = await res.json();
      if (data.success) {
        alert("Password updated successfully in database!");
        setPasswordState({ current: '', next: '', confirm: '', msg: 'Password updated!', loading: false });
      } else {
        alert(data.message || "Failed to update password");
        setPasswordState(prev => ({ ...prev, loading: false }));
      }
    } catch (err) {
      alert("Failed to connect to server");
      setPasswordState(prev => ({ ...prev, loading: false }));
    }
  };

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

      const oRes = await fetch(`${API_URL}/orders.php`);
      if(oRes.ok) {
        const oData = await oRes.json();
        if (oData.success) setOrders(oData.orders);
      }
    } catch (err) {
      console.log('Using mock data, PHP API not reachable');
      setProducts([
        { id: 1, name: 'Amethyst', category: 'Stones', price: '4500' },
        { id: 2, name: 'Citrine Bracelet', category: 'Bracelets', price: '8500' }
      ]);
      setUsers([{ id: 1, name: 'Admin', email: 'admin@srione.com', created_at: 'Today' }]);
      setServices([{ id: 1, name: 'Sample Service', mark: '✧', description: 'This is a sample service.', link: '/contact' }]);
      setOrders([{ id: 1, name: 'John Doe', email: 'john@example.com', total_amount: '4500', status: 'Order Placed', merchant_order_id: 'SRIO_1_1728800000', created_at: 'Today' }]);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    if(!confirm(`Are you sure you want to mark this order as ${newStatus}?`)) return;
    try {
      const res = await fetch(`${API_URL}/orders.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_status', order_id: orderId, status: newStatus })
      });
      const data = await res.json();
      if(data.success) {
        fetchData();
      } else {
        alert(data.message || 'Failed to update order');
      }
    } catch(err) {
      alert('Mock Update Success! (PHP not connected)');
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
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
    const specs = getProductSpecs(product.name, product.category);
    const isGenericDesc = !product.description || product.description.startsWith('Beautiful ') || product.description.includes('SRIONE product, carefully sourced');
    const desc = isGenericDesc ? getProductDescription(product.name) : product.description;

    setFormData({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      description: desc,
      material: product.material || specs.material,
      purpose: product.purpose || specs.purpose,
      care: product.care || specs.care
    });
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
    data.append('description', formData.description || ''); 
    data.append('material', formData.material || ''); 
    data.append('purpose', formData.purpose || ''); 
    data.append('care', formData.care || '');
    if (imageFile) data.append('image', imageFile);

    try {
      const res = await fetch(`${API_URL}/products.php`, { method: 'POST', body: data });
      const result = await res.json();
      if(result.success) {
        alert(formData.id ? 'Product updated!' : 'Product uploaded!');
        fetchData();
        setFormData({ id: null, name: '', category: 'Stones', price: '', description: '', material: '', purpose: '', care: '' });
        setImageFile(null);
      }
    } catch (err) {
      alert('Mock Upload Success! (PHP not connected)');
    }
  };

  // --- STATS / KPIS CALCULATIONS ---
  const totalRevenue = orders
    .filter(o => o.status !== 'Rejected' && o.status !== 'Payment Failed')
    .reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0);

  const pendingOrdersCount = orders.filter(o => o.status === 'Pending' || o.status === 'Order Placed').length;

  // Filtered orders list
  const filteredOrders = orders.filter(o => {
    const custName = (o.customer_name || o.name || '').toLowerCase();
    const custEmail = (o.customer_email || o.email || '').toLowerCase();
    const custPhone = (o.customer_phone || '').toLowerCase();
    const orderNum = `#srione${o.id}`.toLowerCase();
    const q = orderSearch.toLowerCase();
    const matchesQuery = !q || custName.includes(q) || custEmail.includes(q) || custPhone.includes(q) || orderNum.includes(q);
    
    if (!matchesQuery) return false;
    if (orderStatusFilter === 'ALL') return true;
    return (o.status || '').toLowerCase() === orderStatusFilter.toLowerCase();
  });

  // Filtered products list
  const filteredProducts = products.filter(p => {
    const q = productSearch.toLowerCase();
    return !q || (p.name || '').toLowerCase().includes(q) || (p.category || '').toLowerCase().includes(q);
  });

  if (!isAuthenticated) {
    return (
      <section className="section" style={{ minHeight: '75vh', display: 'grid', placeItems: 'center', padding: '60px 20px' }}>
        <form onSubmit={handleLogin} style={{ 
          background: 'var(--bg-card)', 
          padding: '44px 36px', 
          borderRadius: 'var(--radius-card)', 
          border: '1px solid rgba(212, 175, 55, 0.25)', 
          textAlign: 'center',
          maxWidth: '420px',
          width: '100%',
          boxShadow: '0 12px 40px rgba(0,0,0,0.45)'
        }}>
          <div style={{ width: '56px', height: '56px', margin: '0 auto 16px auto', borderRadius: '50%', background: 'linear-gradient(135deg, #d4af37, #f39c12)', display: 'grid', placeItems: 'center', fontSize: '1.6rem', color: '#111' }}>
            🔒
          </div>
          <h2 style={{ fontSize: '1.75rem', margin: '0 0 6px 0', color: '#ffffff' }}>Admin Sign In</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.9rem' }}>
            Enter your database admin credentials to manage sacred curations & orders.
          </p>
          <input 
            type="password" 
            required 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            placeholder="Enter admin password..." 
            style={{ width: '100%', padding: '14px 16px', marginBottom: '20px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)', color: '#ffffff', boxSizing: 'border-box', fontSize: '1rem' }} 
          />
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px', fontWeight: '800', fontSize: '1rem' }}>
            Sign In to Dashboard
          </button>
        </form>
      </section>
    );
  }

  return (
    <section className="section" style={{ minHeight: '85vh', paddingBottom: '90px' }}>
      
      {/* ── Top Header Banner ── */}
      <div style={{
        marginBottom: '28px',
        padding: '24px 28px',
        background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(20, 20, 20, 0.7) 100%)',
        borderRadius: 'var(--radius-card)',
        border: '1px solid rgba(212, 175, 55, 0.25)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontWeight: '800', color: 'var(--color-gold-highlight)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>
            <span>☸</span> Sacred Control Center
          </div>
          <h1 style={{ margin: 0, fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: '900', color: '#ffffff' }}>
            SRIONE <span style={{ color: 'var(--color-gold-highlight)' }}>Command Dashboard</span>
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            onClick={fetchData} 
            style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: '#ffffff', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}
          >
            <span>🔄</span> Refresh Data
          </button>
          <button 
            onClick={() => setIsAuthenticated(false)} 
            style={{ padding: '8px 16px', background: 'rgba(220,53,69,0.12)', border: '1px solid rgba(220,53,69,0.3)', borderRadius: '8px', color: '#ff6b6b', fontWeight: '800', cursor: 'pointer', fontSize: '0.85rem' }}
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* ── 4 KPI Stats Cards ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px',
        marginBottom: '32px'
      }}>
        {/* Card 1: Revenue */}
        <div style={{ background: 'var(--bg-secondary)', padding: '22px', borderRadius: '14px', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(212, 175, 55, 0.15)', display: 'grid', placeItems: 'center', fontSize: '1.4rem', color: 'var(--color-gold-highlight)' }}>
            💰
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>Total Revenue</div>
            <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#ffffff' }}>₹{totalRevenue.toFixed(2)}</div>
          </div>
        </div>

        {/* Card 2: Orders */}
        <div style={{ background: 'var(--bg-secondary)', padding: '22px', borderRadius: '14px', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(52, 152, 219, 0.15)', display: 'grid', placeItems: 'center', fontSize: '1.4rem', color: '#3498db' }}>
            📦
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>Total Orders</div>
            <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#ffffff' }}>
              {orders.length} <small style={{ fontSize: '0.8rem', color: 'var(--color-gold-highlight)' }}>({pendingOrdersCount} to dispatch)</small>
            </div>
          </div>
        </div>

        {/* Card 3: Products */}
        <div style={{ background: 'var(--bg-secondary)', padding: '22px', borderRadius: '14px', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(46, 204, 113, 0.15)', display: 'grid', placeItems: 'center', fontSize: '1.4rem', color: '#2ecc71' }}>
            💎
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>Active Products</div>
            <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#ffffff' }}>{products.length}</div>
          </div>
        </div>

        {/* Card 4: Users */}
        <div style={{ background: 'var(--bg-secondary)', padding: '22px', borderRadius: '14px', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(155, 89, 182, 0.15)', display: 'grid', placeItems: 'center', fontSize: '1.4rem', color: '#9b59b6' }}>
            👥
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>Registered Users</div>
            <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#ffffff' }}>{users.length}</div>
          </div>
        </div>
      </div>

      {/* ── Modern Navigation Tabs ── */}
      <div style={{ 
        display: 'flex', 
        gap: '10px', 
        marginBottom: '28px', 
        borderBottom: '1px solid var(--border-subtle)', 
        paddingBottom: '16px', 
        overflowX: 'auto',
        scrollbarWidth: 'none'
      }}>
        {[
          { key: 'orders', label: '📦 Orders Management', count: orders.length },
          { key: 'products', label: '💎 Manage Products', count: products.length },
          { key: 'services', label: '☸ Manage Services', count: services.length },
          { key: 'users', label: '👥 Registered Users', count: users.length },
          { key: 'settings', label: '🔒 Admin Security' },
        ].map(tab => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: '10px 20px',
                background: isActive ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.22) 0%, rgba(212, 175, 55, 0.08) 100%)' : 'rgba(255,255,255,0.04)',
                color: isActive ? 'var(--color-gold-highlight)' : '#ffffff',
                border: isActive ? '1px solid rgba(212, 175, 55, 0.45)' : '1px solid var(--border-subtle)',
                borderRadius: '10px',
                fontWeight: '800',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                fontSize: '0.92rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease'
              }}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span style={{ fontSize: '0.78rem', background: isActive ? 'rgba(212, 175, 55, 0.3)' : 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '12px' }}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ════════ TAB 1: ORDERS ════════ */}
      {activeTab === 'orders' && (
        <div>
          {/* Orders Filter & Search Toolbar */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '14px',
            marginBottom: '20px',
            background: 'var(--bg-secondary)',
            padding: '16px 20px',
            borderRadius: '12px',
            border: '1px solid var(--border-subtle)'
          }}>
            {/* Search Input */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1', minWidth: '260px' }}>
              <span style={{ fontSize: '1.1rem' }}>🔍</span>
              <input
                type="text"
                value={orderSearch}
                onChange={e => setOrderSearch(e.target.value)}
                placeholder="Search by Customer, Order ID (#SRIONE...), Phone..."
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-primary)', color: '#ffffff', fontSize: '0.9rem' }}
              />
              {orderSearch && (
                <button onClick={() => setOrderSearch('')} style={{ background: 'transparent', border: 'none', color: '#aaa', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
              )}
            </div>

            {/* Status Filter Chips */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {['ALL', 'Order Placed', 'Shipped', 'Delivered', 'Pending'].map(st => (
                <button
                  key={st}
                  onClick={() => setOrderStatusFilter(st)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '20px',
                    border: '1px solid var(--border-subtle)',
                    background: orderStatusFilter === st ? 'var(--color-gold-highlight)' : 'var(--bg-primary)',
                    color: orderStatusFilter === st ? '#111' : '#ffffff',
                    fontSize: '0.8rem',
                    fontWeight: '800',
                    cursor: 'pointer'
                  }}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Orders Table */}
          <div className="admin-table-container">
            <table style={{ width: '100%', borderCollapse: 'collapse', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-card)', overflow: 'hidden' }}>
              <thead>
                <tr style={{ background: '#1c2430', color: '#ffffff', fontSize: '0.88rem' }}>
                  <th style={{ padding: '14px 16px', textAlign: 'left' }}>Order ID</th>
                  <th style={{ padding: '14px 16px', textAlign: 'left' }}>Customer & Contact</th>
                  <th style={{ padding: '14px 16px', textAlign: 'left' }}>Items Ordered</th>
                  <th style={{ padding: '14px 16px', textAlign: 'left' }}>Delivery Address</th>
                  <th style={{ padding: '14px 16px', textAlign: 'left' }}>Amount</th>
                  <th style={{ padding: '14px 16px', textAlign: 'left' }}>Status</th>
                  <th style={{ padding: '14px 16px', textAlign: 'left' }}>Dispatch Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                      No orders found matching your search.
                    </td>
                  </tr>
                ) : filteredOrders.map(o => {
                  let parsedItems = [];
                  try {
                    if (o.items) parsedItems = typeof o.items === 'string' ? JSON.parse(o.items) : o.items;
                  } catch(e) {}

                  const custName = o.customer_name || o.name || 'Customer';
                  const custEmail = o.customer_email || o.email || '';
                  const custPhone = o.customer_phone || '';
                  const cleanPhone = custPhone.replace(/[^0-9]/g, '');
                  const address = o.shipping_address || '—';

                  const whatsappMsg = encodeURIComponent(
                    `Hello ${custName}, this is SRIONE GROW. Regarding your Order #SRIONE${o.id} (Amount: ₹${o.total_amount}): We are processing your sacred package for dispatch!`
                  );

                  return (
                    <tr key={o.id} style={{ borderBottom: '1px solid var(--border-subtle)', verticalAlign: 'top' }}>
                      
                      {/* 1. Order ID */}
                      <td style={{ padding: '14px 16px', fontWeight: '800' }}>
                        <div style={{ color: '#ffffff' }}>#SRIONE{o.id}</div>
                        <small style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>
                          {o.created_at ? new Date(o.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recent'}
                        </small>
                      </td>

                      {/* 2. Customer & Contact with WhatsApp button */}
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: '800', color: '#ffffff' }}>{custName}</div>
                        <small style={{ color: 'var(--text-secondary)' }}>{custEmail}</small>
                        
                        {cleanPhone ? (
                          <div style={{ marginTop: '6px' }}>
                            <a
                              href={`https://wa.me/91${cleanPhone}?text=${whatsappMsg}`}
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '4px 10px',
                                background: 'rgba(37, 211, 102, 0.15)',
                                border: '1px solid rgba(37, 211, 102, 0.35)',
                                color: '#2ecc71',
                                borderRadius: '14px',
                                fontSize: '0.78rem',
                                fontWeight: '800',
                                textDecoration: 'none'
                              }}
                            >
                              <span>💬</span> +91 {custPhone}
                            </a>
                          </div>
                        ) : null}
                      </td>

                      {/* 3. Items Ordered */}
                      <td style={{ padding: '14px 16px', maxWidth: '240px' }}>
                        {parsedItems && parsedItems.length > 0 ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {parsedItems.map((it, idx) => (
                              <div key={idx} style={{ fontSize: '0.82rem', background: 'rgba(255,255,255,0.05)', padding: '5px 8px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                                <span style={{ fontWeight: '700', color: '#ffffff' }}>{it.name}</span>
                                <div style={{ color: 'var(--color-gold-highlight)', fontSize: '0.75rem' }}>Qty: {it.quantity || 1} • {it.price}</div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Sacred Products</span>
                        )}
                      </td>

                      {/* 4. Delivery Address */}
                      <td style={{ padding: '14px 16px', maxWidth: '220px', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                        {address}
                      </td>

                      {/* 5. Amount */}
                      <td style={{ padding: '14px 16px', fontWeight: '900', color: 'var(--color-gold-highlight)', fontSize: '1.1rem' }}>
                        ₹{parseFloat(o.total_amount).toFixed(2)}
                      </td>

                      {/* 6. Status Badge */}
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{
                          padding: '6px 12px',
                          borderRadius: '20px',
                          fontSize: '0.78rem',
                          fontWeight: '800',
                          background: o.status === 'Delivered' ? 'rgba(46, 204, 113, 0.15)' : (o.status === 'Shipped' ? 'rgba(52, 152, 219, 0.15)' : 'rgba(212, 175, 55, 0.15)'),
                          border: `1px solid ${o.status === 'Delivered' ? 'rgba(46, 204, 113, 0.4)' : (o.status === 'Shipped' ? 'rgba(52, 152, 219, 0.4)' : 'rgba(212, 175, 55, 0.4)')}`,
                          color: o.status === 'Delivered' ? '#2ecc71' : (o.status === 'Shipped' ? '#3498db' : '#d4af37')
                        }}>
                          {o.status || 'Order Placed'}
                        </span>
                      </td>

                      {/* 7. Action Buttons */}
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          {o.status !== 'Shipped' && o.status !== 'Delivered' && (
                            <button
                              onClick={() => handleUpdateOrderStatus(o.id, 'Shipped')}
                              style={{ background: '#3498db', color: '#ffffff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: '800', cursor: 'pointer', fontSize: '0.78rem' }}
                            >
                              🚚 Mark Shipped
                            </button>
                          )}
                          {o.status !== 'Delivered' && (
                            <button
                              onClick={() => handleUpdateOrderStatus(o.id, 'Delivered')}
                              style={{ background: '#2ecc71', color: '#ffffff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: '800', cursor: 'pointer', fontSize: '0.78rem' }}
                            >
                              ✓ Mark Delivered
                            </button>
                          )}
                          {o.status === 'Pending' && (
                            <button
                              onClick={() => handleUpdateOrderStatus(o.id, 'Rejected')}
                              style={{ background: '#e74c3c', color: '#ffffff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: '800', cursor: 'pointer', fontSize: '0.78rem' }}
                            >
                              ✕ Cancel Order
                            </button>
                          )}
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ════════ TAB 2: PRODUCTS ════════ */}
      {activeTab === 'products' && (
        <div className="admin-responsive-grid" style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '30px', alignItems: 'start' }}>
          
          {/* Add / Edit Product Form */}
          <form onSubmit={handleUpload} style={{ background: 'var(--bg-card)', padding: '28px', borderRadius: 'var(--radius-card)', border: '1px solid var(--border-subtle)' }}>
            <h3 style={{ margin: '0 0 16px 0', color: '#ffffff' }}>{formData.id ? "Edit Product" : "Add New Product"}</h3>
            
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '800', fontSize: '0.88rem' }}>Product Name *</label>
            <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)', color: '#ffffff', marginBottom: '14px', boxSizing: 'border-box' }} />

            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '800', fontSize: '0.88rem' }}>Category *</label>
            <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)', color: '#ffffff', marginBottom: '14px', boxSizing: 'border-box' }}>
              <option value="Stones">Gemstones & Stones</option>
              <option value="Bracelets">Sacred Bracelets</option>
              <option value="Pyramids">Energized Pyramids</option>
              <option value="Vastu">Vaastu Remedies</option>
              <option value="Yantras">Sacred Yantras</option>
            </select>

            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '800', fontSize: '0.88rem' }}>Price (₹) *</label>
            <input type="number" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)', color: '#ffffff', marginBottom: '14px', boxSizing: 'border-box' }} />

            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '800', fontSize: '0.88rem' }}>Description</label>
            <textarea rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Detailed astrological explanation..." style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)', color: '#ffffff', marginBottom: '14px', boxSizing: 'border-box', fontFamily: 'inherit' }} />

            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '800', fontSize: '0.88rem' }}>Material</label>
            <input type="text" value={formData.material} onChange={e => setFormData({...formData, material: e.target.value})} placeholder="e.g. 100% Natural Certified Gemstone" style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)', color: '#ffffff', marginBottom: '14px', boxSizing: 'border-box' }} />

            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '800', fontSize: '0.88rem' }}>Purpose & Benefits</label>
            <input type="text" value={formData.purpose} onChange={e => setFormData({...formData, purpose: e.target.value})} placeholder="e.g. Wealth Attraction, Rahu Pacification" style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)', color: '#ffffff', marginBottom: '14px', boxSizing: 'border-box' }} />

            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '800', fontSize: '0.88rem' }}>Care & Cleansing</label>
            <input type="text" value={formData.care} onChange={e => setFormData({...formData, care: e.target.value})} placeholder="e.g. Cleanse in Ganga Jal or Raw Milk" style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)', color: '#ffffff', marginBottom: '14px', boxSizing: 'border-box' }} />

            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '800', fontSize: '0.88rem' }}>Product Image</label>
            <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)', color: '#ffffff', marginBottom: '18px', boxSizing: 'border-box' }} />

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', fontWeight: '800' }}>
              {formData.id ? "Update Product" : "Save New Product"}
            </button>
            {formData.id && (
              <button type="button" onClick={() => setFormData({ id: null, name: '', category: 'Stones', price: '', description: '', material: '', purpose: '', care: '' })} style={{ width: '100%', marginTop: '8px', padding: '8px', background: 'transparent', border: 'none', color: '#aaa', cursor: 'pointer' }}>
                Cancel Edit
              </button>
            )}
          </form>

          {/* Current Products Table with Search */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', gap: '12px' }}>
              <h3 style={{ margin: 0, color: '#ffffff' }}>Active Catalog ({filteredProducts.length})</h3>
              <input
                type="text"
                value={productSearch}
                onChange={e => setProductSearch(e.target.value)}
                placeholder="Search products..."
                style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)', color: '#ffffff', fontSize: '0.85rem' }}
              />
            </div>

            <div className="admin-table-container">
              <table style={{ width: '100%', borderCollapse: 'collapse', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-card)', overflow: 'hidden' }}>
                <thead>
                  <tr style={{ background: '#1c2430', color: '#ffffff', fontSize: '0.88rem' }}>
                    <th style={{ padding: '12px', textAlign: 'left' }}>ID</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Product</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Category</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Price</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map(p => (
                    <tr key={p.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '12px' }}>#{p.id}</td>
                      <td style={{ padding: '12px', fontWeight: '800', color: '#ffffff' }}>{p.name}</td>
                      <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{p.category}</td>
                      <td style={{ padding: '12px', fontWeight: '800', color: 'var(--color-gold-highlight)' }}>₹{p.price}</td>
                      <td style={{ padding: '12px' }}>
                        <button onClick={() => handleEditProduct(p)} style={{ marginRight: '6px', padding: '4px 10px', background: 'var(--color-gold-highlight)', color: '#111', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '800', fontSize: '0.78rem' }}>Edit</button>
                        <button onClick={() => handleDeleteProduct(p.id)} style={{ background: '#e74c3c', color: '#ffffff', padding: '4px 10px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '800', fontSize: '0.78rem' }}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ════════ TAB 3: SERVICES ════════ */}
      {activeTab === 'services' && (
        <div className="admin-responsive-grid" style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '30px', alignItems: 'start' }}>
          <form onSubmit={handleUploadService} style={{ background: 'var(--bg-card)', padding: '28px', borderRadius: 'var(--radius-card)', border: '1px solid var(--border-subtle)' }}>
            <h3 style={{ margin: '0 0 16px 0', color: '#ffffff' }}>{serviceForm.id ? "Edit Service" : "Add New Service"}</h3>
            
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '800', fontSize: '0.88rem' }}>Service Name *</label>
            <input type="text" required value={serviceForm.name} onChange={e => setServiceForm({...serviceForm, name: e.target.value})} style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)', color: '#ffffff', marginBottom: '14px', boxSizing: 'border-box' }} />
            
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '800', fontSize: '0.88rem' }}>Emblem / Icon (e.g. 📱, ✧, ☸) *</label>
            <input type="text" required value={serviceForm.mark} onChange={e => setServiceForm({...serviceForm, mark: e.target.value})} style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)', color: '#ffffff', marginBottom: '14px', boxSizing: 'border-box' }} />
            
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '800', fontSize: '0.88rem' }}>Description *</label>
            <textarea required value={serviceForm.description} onChange={e => setServiceForm({...serviceForm, description: e.target.value})} rows="3" style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)', color: '#ffffff', marginBottom: '14px', boxSizing: 'border-box', fontFamily: 'inherit' }} />
            
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '800', fontSize: '0.88rem' }}>Consultation Category</label>
            <select value={serviceForm.css_class} onChange={e => setServiceForm({...serviceForm, css_class: e.target.value})} style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)', color: '#ffffff', marginBottom: '14px', boxSizing: 'border-box' }}>
              <option value="service-numerology">Sacred Numerology</option>
              <option value="service-vaastu">Divine Vaastu Consultation</option>
              <option value="service-crystal">Crystal & Energy Remedies</option>
            </select>
            
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', fontWeight: '800' }}>Save Service</button>
          </form>

          <div>
            <h3 style={{ margin: '0 0 16px 0', color: '#ffffff' }}>Active Consultations & Services ({services.length})</h3>
            <div className="admin-table-container">
              <table style={{ width: '100%', borderCollapse: 'collapse', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-card)', overflow: 'hidden' }}>
                <thead>
                  <tr style={{ background: '#1c2430', color: '#ffffff' }}>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Icon</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Name</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map(s => (
                    <tr key={s.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '12px', fontSize: '1.4rem' }}>{s.mark}</td>
                      <td style={{ padding: '12px', fontWeight: '800', color: '#ffffff' }}>{s.name}</td>
                      <td style={{ padding: '12px' }}>
                        <button onClick={() => handleEditService(s)} style={{ marginRight: '6px', padding: '4px 10px', background: 'var(--color-gold-highlight)', color: '#111', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '800', fontSize: '0.78rem' }}>Edit</button>
                        <button onClick={() => handleDeleteService(s.id)} style={{ background: '#e74c3c', color: '#ffffff', padding: '4px 10px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '800', fontSize: '0.78rem' }}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ════════ TAB 4: USERS ════════ */}
      {activeTab === 'users' && (
        <div>
          <h3 style={{ margin: '0 0 16px 0', color: '#ffffff' }}>Registered Customers ({users.length})</h3>
          <div className="admin-table-container">
            <table style={{ width: '100%', borderCollapse: 'collapse', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-card)', overflow: 'hidden' }}>
              <thead>
                <tr style={{ background: '#1c2430', color: '#ffffff' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left' }}>User ID</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left' }}>Full Name</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left' }}>Email</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left' }}>Registered Date</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '12px 16px', fontWeight: '800' }}>#{u.id}</td>
                    <td style={{ padding: '12px 16px', fontWeight: '800', color: '#ffffff' }}>{u.name}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{u.email}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{u.created_at || 'Registered'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ════════ TAB 5: ADMIN SECURITY ════════ */}
      {activeTab === 'settings' && (
        <div style={{ maxWidth: '520px', background: 'var(--bg-card)', padding: '36px', borderRadius: 'var(--radius-card)', border: '1px solid rgba(212, 175, 55, 0.25)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span style={{ fontSize: '1.4rem' }}>🔒</span>
            <h3 style={{ margin: 0, color: '#ffffff' }}>Admin Security & Credentials</h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px', lineHeight: '1.5' }}>
            Update your admin master password. The new password will be hashed using bcrypt and stored safely in your MySQL <code style={{ color: 'var(--color-gold-highlight)' }}>admins</code> table.
          </p>

          <form onSubmit={handleChangePassword}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '800', color: '#ffffff', fontSize: '0.9rem' }}>Current Password *</label>
            <input
              type="password"
              required
              value={passwordState.current}
              onChange={e => setPasswordState({ ...passwordState, current: e.target.value })}
              placeholder="Enter current password..."
              style={{ width: '100%', padding: '12px 14px', marginBottom: '16px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)', color: '#ffffff', boxSizing: 'border-box' }}
            />

            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '800', color: '#ffffff', fontSize: '0.9rem' }}>New Password *</label>
            <input
              type="password"
              required
              value={passwordState.next}
              onChange={e => setPasswordState({ ...passwordState, next: e.target.value })}
              placeholder="Enter new password (min 6 characters)..."
              style={{ width: '100%', padding: '12px 14px', marginBottom: '16px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)', color: '#ffffff', boxSizing: 'border-box' }}
            />

            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '800', color: '#ffffff', fontSize: '0.9rem' }}>Confirm New Password *</label>
            <input
              type="password"
              required
              value={passwordState.confirm}
              onChange={e => setPasswordState({ ...passwordState, confirm: e.target.value })}
              placeholder="Confirm new password..."
              style={{ width: '100%', padding: '12px 14px', marginBottom: '24px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)', color: '#ffffff', boxSizing: 'border-box' }}
            />

            <button
              type="submit"
              disabled={passwordState.loading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '14px', fontWeight: '800', fontSize: '1rem' }}
            >
              {passwordState.loading ? 'Updating in Database...' : 'Save New Password to Database'}
            </button>
          </form>
        </div>
      )}

    </section>
  );
}
