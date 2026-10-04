import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

export default function Profile() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');
  const [userData, setUserData] = useState(null);
  const [orders, setOrders] = useState([]);
  
  const [addressForm, setAddressForm] = useState({ address: '', city: '', state: '', zip: '' });
  const [message, setMessage] = useState('');

  const user = JSON.parse(localStorage.getItem('srione_user'));

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    fetch(`${API_URL}/profile.php?user_id=${user.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setUserData(data.user);
          setOrders(data.orders);
          setAddressForm({
            address: data.user.address || '',
            city: data.user.city || '',
            state: data.user.state || '',
            zip: data.user.zip || ''
          });
        }
      })
      .catch(err => {
        console.log('Using mock profile data (PHP not found)');
        setOrders([
          { id: 1042, total_amount: 1499, status: 'Shipped', created_at: '2026-10-01' },
          { id: 1021, total_amount: 500, status: 'Delivered', created_at: '2026-09-15' }
        ]);
      });
  }, []);

  const handleUpdateAddress = async (e) => {
    e.preventDefault();
    setMessage('Saving...');
    try {
      const res = await fetch(`${API_URL}/profile.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_address', user_id: user.id, ...addressForm })
      });
      const data = await res.json();
      setMessage(data.message || 'Address Saved!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Mock Address Saved! (PHP not running)');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('srione_user');
    navigate('/auth');
  };

  if (!user) return null;

  return (
    <section className="section" style={{ minHeight: '80vh' }}>
      <div className="grid-responsive-2col" style={{ alignItems: 'start' }}>
        
        {/* Sidebar */}
        <div style={{ background: 'var(--bg-secondary)', padding: '30px', borderRadius: 'var(--radius-card)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
             <div style={{ width: '50px', height: '50px', background: 'var(--color-saffron)', borderRadius: '50%', display: 'grid', placeItems: 'center', fontWeight: '900', fontSize: '1.2rem', color: '#111' }}>
               {user.name.charAt(0).toUpperCase()}
             </div>
             <div>
               <h2 style={{ fontSize: '1.2rem', margin: 0 }}>{user.name}</h2>
               <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{user.email}</span>
             </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button onClick={() => setActiveTab('orders')} style={{ padding: '12px 20px', textAlign: 'left', background: activeTab === 'orders' ? 'var(--bg-primary)' : 'transparent', border: activeTab === 'orders' ? '1px solid var(--border-subtle)' : 'none', borderRadius: '8px', fontWeight: '800', cursor: 'pointer', color: 'var(--text-primary)' }}>📦 My Orders</button>
            <button onClick={() => setActiveTab('address')} style={{ padding: '12px 20px', textAlign: 'left', background: activeTab === 'address' ? 'var(--bg-primary)' : 'transparent', border: activeTab === 'address' ? '1px solid var(--border-subtle)' : 'none', borderRadius: '8px', fontWeight: '800', cursor: 'pointer', color: 'var(--text-primary)' }}>🏠 Saved Address</button>
            <button onClick={handleLogout} style={{ padding: '12px 20px', textAlign: 'left', background: 'transparent', border: 'none', fontWeight: '800', cursor: 'pointer', color: '#d9534f' }}>🚪 Sign Out</button>
          </div>
        </div>

        {/* Content Area */}
        <div style={{ background: 'var(--bg-card)', padding: '40px', borderRadius: 'var(--radius-card)', border: '1px solid var(--border-subtle)' }}>
          
          {activeTab === 'orders' && (
            <div>
              <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>Order History</h2>
              {orders.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)' }}>You haven't placed any orders yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {orders.map(order => (
                    <div key={order.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-primary)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                       <div>
                         <h4 style={{ margin: '0 0 5px 0' }}>Order #{order.id}</h4>
                         <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{new Date(order.created_at).toLocaleDateString()}</span>
                       </div>
                       <div style={{ fontWeight: '900', fontSize: '1.2rem' }}>₹{order.total_amount}</div>
                       <div style={{ padding: '6px 12px', background: order.status === 'Processing' ? 'var(--color-saffron)' : 'var(--color-pista)', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '800', color: '#111' }}>
                         {order.status}
                       </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'address' && (
            <div>
              <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>Shipping Address</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>Save your address here to auto-fill at checkout.</p>
              
              {message && <div style={{ padding: '10px', background: 'var(--color-pista)', marginBottom: '20px', borderRadius: '8px', fontWeight: '600' }}>{message}</div>}

              <form onSubmit={handleUpdateAddress} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '800' }}>Street Address</label>
                  <input type="text" required value={addressForm.address} onChange={e => setAddressForm({...addressForm, address: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-primary)' }} />
                </div>
                
                <div className="grid-responsive-2col" style={{ gap: '15px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '800' }}>City</label>
                    <input type="text" required value={addressForm.city} onChange={e => setAddressForm({...addressForm, city: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-primary)' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '800' }}>State</label>
                    <input type="text" required value={addressForm.state} onChange={e => setAddressForm({...addressForm, state: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-primary)' }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '800' }}>ZIP / PIN Code</label>
                  <input type="text" required value={addressForm.zip} onChange={e => setAddressForm({...addressForm, zip: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-primary)' }} />
                </div>

                <button type="submit" className="btn btn-primary" style={{ marginTop: '20px', padding: '16px' }}>Save Address</button>
              </form>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
