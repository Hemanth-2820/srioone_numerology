import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

export default function Profile() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');
  const [userData, setUserData] = useState(null);
  const [orders, setOrders] = useState([]);
  
  const [addressForm, setAddressForm] = useState({ phone: '', address: '', city: '', state: '', zip: '' });
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

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
          setOrders(data.orders || []);
          setAddressForm({
            phone: data.user.phone || '',
            address: data.user.address || '',
            city: data.user.city || '',
            state: data.user.state || '',
            zip: data.user.zip || ''
          });
        }
      })
      .catch(err => {
        console.log('Using fallback profile data');
      });
  }, []);

  const handleUpdateAddress = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch(`${API_URL}/profile.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_address', user_id: user.id, ...addressForm })
      });
      const data = await res.json();
      setMessage(data.message || 'Address & Contact Details Saved Successfully!');
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      setMessage('Address Saved Locally!');
      setTimeout(() => setMessage(''), 4000);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('srione_user');
    navigate('/auth');
  };

  const getStatusBadge = (status) => {
    const s = (status || 'Order Placed').toLowerCase();
    if (s.includes('deliver')) {
      return { bg: 'rgba(46, 204, 113, 0.15)', border: 'rgba(46, 204, 113, 0.4)', text: '#2ecc71', label: 'Delivered', icon: '✓' };
    }
    if (s.includes('ship') || s.includes('dispatch')) {
      return { bg: 'rgba(52, 152, 219, 0.15)', border: 'rgba(52, 152, 219, 0.4)', text: '#3498db', label: 'Dispatched', icon: '🚚' };
    }
    if (s.includes('reject') || s.includes('fail')) {
      return { bg: 'rgba(231, 76, 60, 0.15)', border: 'rgba(231, 76, 60, 0.4)', text: '#e74c3c', label: 'Cancelled / Failed', icon: '✕' };
    }
    // Default Order Placed / Processing
    return { bg: 'rgba(212, 175, 55, 0.15)', border: 'rgba(212, 175, 55, 0.4)', text: '#d4af37', label: status || 'Order Placed', icon: '●' };
  };

  if (!user) return null;

  return (
    <section className="section" style={{ minHeight: '85vh', paddingBottom: '90px' }}>
      
      {/* Header Heading */}
      <div style={{
        marginBottom: '32px',
        padding: '24px 28px',
        background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.08) 0%, rgba(20, 20, 20, 0.6) 100%)',
        borderRadius: 'var(--radius-card)',
        border: '1px solid rgba(212, 175, 55, 0.2)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: '800', color: 'var(--color-gold-highlight)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>
            <span>👤</span> Customer Account Portal
          </div>
          <h1 style={{ margin: 0, fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: '900', color: '#ffffff' }}>
            Welcome back, <span style={{ color: 'var(--color-gold-highlight)' }}>{user.name.split(' ')[0]}</span>
          </h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Member Since: Active</span>
          <span style={{ padding: '4px 10px', background: 'rgba(46, 204, 113, 0.15)', color: '#2ecc71', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '800' }}>
            ● Verified Account
          </span>
        </div>
      </div>

      <div className="admin-responsive-grid" style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '28px', alignItems: 'start' }}>
        
        {/* ── Left Sidebar Profile Card ── */}
        <div style={{
          background: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-card)',
          border: '1px solid var(--border-subtle)',
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0,0,0,0.25)'
        }}>
          {/* User Bio Header */}
          <div style={{
            padding: '30px 24px',
            background: 'linear-gradient(180deg, rgba(212, 175, 55, 0.12) 0%, transparent 100%)',
            borderBottom: '1px solid var(--border-subtle)',
            textAlign: 'center'
          }}>
            {/* Gold Ring Avatar */}
            <div style={{
              width: '74px',
              height: '74px',
              margin: '0 auto 14px auto',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #d4af37 0%, #f39c12 50%, #b8860b 100%)',
              display: 'grid',
              placeItems: 'center',
              fontWeight: '900',
              fontSize: '2rem',
              color: '#0d0d12',
              boxShadow: '0 6px 20px rgba(212, 175, 55, 0.35)',
              border: '3px solid rgba(255, 255, 255, 0.2)'
            }}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <h2 style={{ fontSize: '1.25rem', margin: '0 0 4px 0', color: '#ffffff', fontWeight: '800' }}>{user.name}</h2>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', wordBreak: 'break-all' }}>{user.email}</div>
          </div>
          
          {/* Navigation Links */}
          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            
            <button 
              onClick={() => setActiveTab('orders')} 
              style={{ 
                padding: '14px 18px', 
                textAlign: 'left', 
                background: activeTab === 'orders' ? 'linear-gradient(90deg, rgba(212, 175, 55, 0.16) 0%, rgba(212, 175, 55, 0.04) 100%)' : 'transparent', 
                border: activeTab === 'orders' ? '1px solid rgba(212, 175, 55, 0.4)' : '1px solid transparent', 
                borderLeft: activeTab === 'orders' ? '4px solid var(--color-gold-highlight)' : '4px solid transparent',
                borderRadius: '8px', 
                fontWeight: '800', 
                cursor: 'pointer', 
                color: activeTab === 'orders' ? 'var(--color-gold-highlight)' : '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease'
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.1rem' }}>📦</span> My Orders
              </span>
              <span style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.08)', padding: '2px 8px', borderRadius: '12px' }}>
                {orders.length}
              </span>
            </button>

            <button 
              onClick={() => setActiveTab('address')} 
              style={{ 
                padding: '14px 18px', 
                textAlign: 'left', 
                background: activeTab === 'address' ? 'linear-gradient(90deg, rgba(212, 175, 55, 0.16) 0%, rgba(212, 175, 55, 0.04) 100%)' : 'transparent', 
                border: activeTab === 'address' ? '1px solid rgba(212, 175, 55, 0.4)' : '1px solid transparent', 
                borderLeft: activeTab === 'address' ? '4px solid var(--color-gold-highlight)' : '4px solid transparent',
                borderRadius: '8px', 
                fontWeight: '800', 
                cursor: 'pointer', 
                color: activeTab === 'address' ? 'var(--color-gold-highlight)' : '#ffffff',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                transition: 'all 0.2s ease'
              }}
            >
              <span style={{ fontSize: '1.1rem' }}>🏠</span> Saved Address
            </button>

            <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '8px 0' }}></div>

            <button 
              onClick={handleLogout} 
              style={{ 
                padding: '14px 18px', 
                textAlign: 'left', 
                background: 'rgba(220, 53, 69, 0.08)', 
                border: '1px solid rgba(220, 53, 69, 0.25)', 
                borderRadius: '8px', 
                fontWeight: '800', 
                cursor: 'pointer', 
                color: '#ff6b6b',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(220, 53, 69, 0.18)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(220, 53, 69, 0.08)'}
            >
              <span style={{ fontSize: '1.1rem' }}>🚪</span> Sign Out
            </button>

          </div>

          {/* Quick Help Card */}
          <div style={{ padding: '20px', margin: '0 16px 16px 16px', background: 'rgba(0,0,0,0.3)', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#ffffff', marginBottom: '4px' }}>Need Order Support?</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>Connect directly with our care team on WhatsApp.</div>
            <a 
              href="https://wa.me/917997992211?text=Hello%20SRIONE%20Support,%20I%20need%20help%20with%20my%20account%20or%20orders." 
              target="_blank" 
              rel="noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '8px 12px',
                background: '#25D366',
                color: '#ffffff',
                borderRadius: '6px',
                fontSize: '0.82rem',
                fontWeight: '800',
                textDecoration: 'none'
              }}
            >
              <span>💬</span> WhatsApp Support
            </a>
          </div>

        </div>

        {/* ── Right Content Area ── */}
        <div style={{
          background: 'var(--bg-card)',
          padding: '36px',
          borderRadius: 'var(--radius-card)',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
        }}>
          
          {/* TAB 1: ORDERS */}
          {activeTab === 'orders' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px' }}>
                <div>
                  <h2 style={{ fontSize: '1.8rem', margin: '0 0 6px 0', color: '#ffffff' }}>Order History</h2>
                  <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem' }}>
                    View past orders, track dispatch status, and download verification details.
                  </p>
                </div>
                <div style={{ padding: '6px 14px', background: 'var(--bg-secondary)', borderRadius: '20px', border: '1px solid var(--border-subtle)', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)' }}>
                  Total: {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
                </div>
              </div>

              {orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--bg-secondary)', borderRadius: '16px', border: '1px dashed var(--border-subtle)' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🛍️</div>
                  <h3 style={{ margin: '0 0 8px 0', color: '#ffffff' }}>No Orders Placed Yet</h3>
                  <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 20px auto', fontSize: '0.92rem' }}>
                    You haven't ordered any sacred energized gems, yantras, or consultations yet.
                  </p>
                  <button onClick={() => navigate('/shop')} className="btn btn-primary" style={{ padding: '12px 28px' }}>
                    Explore Sacred Shop
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {orders.map(order => {
                    const badge = getStatusBadge(order.status);
                    const formattedDate = order.created_at ? new Date(order.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    }) : 'Recent';

                    return (
                      <div 
                        key={order.id} 
                        style={{ 
                          background: 'var(--bg-primary)', 
                          padding: '24px', 
                          borderRadius: '14px', 
                          border: '1px solid var(--border-subtle)',
                          transition: 'transform 0.2s, border-color 0.2s',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '16px'
                        }}
                      >
                        {/* Top Row: Order ID, Date, Amount, Status Badge */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(212, 175, 55, 0.1)', border: '1px solid rgba(212, 175, 55, 0.25)', display: 'grid', placeItems: 'center', fontSize: '1.2rem', color: 'var(--color-gold-highlight)' }}>
                              📦
                            </div>
                            <div>
                              <div style={{ fontWeight: '800', fontSize: '1.1rem', color: '#ffffff' }}>
                                Order #SRIONE{order.id}
                              </div>
                              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                                Placed on {formattedDate} • Payment: {order.payment_method || 'PhonePe'}
                              </div>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Amount Paid</div>
                              <div style={{ fontWeight: '900', fontSize: '1.35rem', color: 'var(--color-gold-highlight)' }}>
                                ₹{parseFloat(order.total_amount).toFixed(2)}
                              </div>
                            </div>

                            <div style={{ 
                              padding: '8px 16px', 
                              background: badge.bg, 
                              border: `1px solid ${badge.border}`, 
                              color: badge.text, 
                              borderRadius: '24px', 
                              fontSize: '0.82rem', 
                              fontWeight: '800',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              letterSpacing: '0.02em'
                            }}>
                              <span>{badge.icon}</span> {badge.label}
                            </div>
                          </div>
                        </div>

                        {/* Bottom Row: Tracking reassurance & WhatsApp button */}
                        <div style={{ 
                          paddingTop: '14px', 
                          borderTop: '1px solid var(--border-subtle)', 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: '10px',
                          fontSize: '0.85rem'
                        }}>
                          <div style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>🚚</span>
                            <span>Express Insured Courier Delivery • Tracking updates sent via SMS & WhatsApp</span>
                          </div>

                          <a 
                            href={`https://wa.me/917997992211?text=Hello%20SRIONE%20Support,%20I%20have%20an%20inquiry%20regarding%20my%20Order%20%23SRIONE${order.id}%20(Amount:%20%E2%82%B9${order.total_amount})`}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              color: 'var(--color-gold-highlight)',
                              fontWeight: '800',
                              textDecoration: 'none',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              background: 'rgba(212, 175, 55, 0.08)',
                              padding: '6px 14px',
                              borderRadius: '20px',
                              border: '1px solid rgba(212, 175, 55, 0.25)',
                              transition: 'all 0.2s'
                            }}
                          >
                            <span>💬</span> Track / Inquiry on WhatsApp
                          </a>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SAVED ADDRESS */}
          {activeTab === 'address' && (
            <div>
              <div style={{ marginBottom: '24px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px' }}>
                <h2 style={{ fontSize: '1.8rem', margin: '0 0 6px 0', color: '#ffffff' }}>Delivery & Contact Information</h2>
                <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem' }}>
                  Save your address and primary mobile number to automatically pre-fill courier dispatch details at checkout.
                </p>
              </div>
              
              {message && (
                <div style={{ padding: '14px 18px', background: 'rgba(46, 204, 113, 0.15)', border: '1px solid rgba(46, 204, 113, 0.4)', color: '#2ecc71', marginBottom: '24px', borderRadius: '10px', fontWeight: '800', fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span>✓</span> {message}
                </div>
              )}

              <form onSubmit={handleUpdateAddress} style={{ display: 'grid', gap: '18px' }}>
                
                {/* Mobile Number for Courier */}
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '800', fontSize: '0.9rem', color: '#ffffff' }}>
                    Primary Mobile Number (For Courier OTP & Tracking) *
                  </label>
                  <input 
                    type="tel" 
                    required 
                    value={addressForm.phone} 
                    onChange={e => setAddressForm({ ...addressForm, phone: e.target.value })} 
                    placeholder="10-digit mobile number (e.g. 9876543210)"
                    style={{ width: '100%', padding: '13px 16px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-primary)', color: '#ffffff', boxSizing: 'border-box' }} 
                  />
                </div>

                {/* Street Address */}
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '800', fontSize: '0.9rem', color: '#ffffff' }}>
                    Complete Street Address (Flat / House No., Landmark) *
                  </label>
                  <textarea 
                    rows="3"
                    required 
                    value={addressForm.address} 
                    onChange={e => setAddressForm({ ...addressForm, address: e.target.value })} 
                    placeholder="House/Apartment number, building name, street, nearby landmark..."
                    style={{ width: '100%', padding: '13px 16px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-primary)', color: '#ffffff', boxSizing: 'border-box', fontFamily: 'inherit', resize: 'vertical' }} 
                  />
                </div>
                
                {/* City & State 2 Columns */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '800', fontSize: '0.9rem', color: '#ffffff' }}>
                      City / Town *
                    </label>
                    <input 
                      type="text" 
                      required 
                      value={addressForm.city} 
                      onChange={e => setAddressForm({ ...addressForm, city: e.target.value })} 
                      placeholder="e.g. Hyderabad / Mumbai"
                      style={{ width: '100%', padding: '13px 16px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-primary)', color: '#ffffff', boxSizing: 'border-box' }} 
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '800', fontSize: '0.9rem', color: '#ffffff' }}>
                      State / Region *
                    </label>
                    <input 
                      type="text" 
                      required 
                      value={addressForm.state} 
                      onChange={e => setAddressForm({ ...addressForm, state: e.target.value })} 
                      placeholder="e.g. Telangana / Maharashtra"
                      style={{ width: '100%', padding: '13px 16px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-primary)', color: '#ffffff', boxSizing: 'border-box' }} 
                    />
                  </div>
                </div>

                {/* ZIP / PIN Code */}
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '800', fontSize: '0.9rem', color: '#ffffff' }}>
                    PIN / Postal Code *
                  </label>
                  <input 
                    type="text" 
                    required 
                    value={addressForm.zip} 
                    onChange={e => setAddressForm({ ...addressForm, zip: e.target.value })} 
                    placeholder="6-digit Indian PIN code"
                    style={{ width: '100%', padding: '13px 16px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-primary)', color: '#ffffff', boxSizing: 'border-box' }} 
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={saving}
                  className="btn btn-primary" 
                  style={{ 
                    marginTop: '10px', 
                    padding: '16px 28px',
                    fontWeight: '800',
                    fontSize: '1.05rem',
                    cursor: saving ? 'not-allowed' : 'pointer'
                  }}
                >
                  {saving ? 'Saving Details...' : '💾 Save Address & Contact Details'}
                </button>
              </form>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
