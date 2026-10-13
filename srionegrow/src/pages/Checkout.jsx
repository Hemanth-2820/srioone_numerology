import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('srione_user'));

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: ''
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('srione_user');
    if (!storedUser) {
      navigate('/auth?redirect=/checkout');
      return;
    }

    try {
      const u = JSON.parse(storedUser);
      setFormData(prev => ({ ...prev, name: u.name || '', email: u.email || '' }));

      fetch(`${API_URL}/profile.php?user_id=${u.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.user) {
            setFormData(prev => ({
              ...prev,
              phone:      data.user.phone   || prev.phone,
              address:    data.user.address || prev.address,
              city:       data.user.city    || prev.city,
              state:      data.user.state   || prev.state,
              postalCode: data.user.zip     || prev.postalCode
            }));
          }
        })
        .catch(() => {});
    } catch (e) {
      navigate('/auth?redirect=/checkout');
    }
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhonePePayment = async (e) => {
    e.preventDefault();
    setError('');

    // Quick mobile verification check for Indian carriers (10 digits)
    const cleanPhone = formData.phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      setError('Please enter a valid 10-digit mobile number for courier dispatch.');
      return;
    }

    setLoading(true);

    try {
      const fullAddress = `${formData.address}${formData.state ? `, State: ${formData.state}` : ''}${formData.phone ? ` (Phone: ${formData.phone})` : ''}`;

      const res = await fetch(`${API_URL}/phonepe.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id:    user?.id || null,
          amount:     cartTotal,
          name:       formData.name,
          email:      formData.email,
          phone:      formData.phone,
          address:    formData.address,
          city:       formData.city,
          state:      formData.state,
          postalCode: formData.postalCode,
          items:      cart.map(item => ({
            id:       item.id,
            name:     item.name,
            price:    item.price,
            quantity: item.quantity || 1
          }))
        }),
      });

      let data;
      try {
        data = await res.json();
      } catch (jsonErr) {
        throw new Error('Server returned invalid response');
      }

      if (data.success && data.redirectUrl) {
        clearCart();
        window.location.href = data.redirectUrl;
      } else {
        setError(data.message || 'Payment initiation failed. Please try again.');
      }
    } catch (err) {
      setError(err.message ? `Error: ${err.message}` : 'Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <section className="section" style={{ minHeight: '60vh', textAlign: 'center', paddingTop: '150px' }}>
        <h2>Login Required</h2>
        <p style={{ marginTop: '10px', color: 'var(--text-secondary)' }}>You must be signed in to access checkout and complete your payment.</p>
        <Link to="/auth?redirect=/checkout" className="btn btn-primary" style={{ marginTop: '20px', display: 'inline-block' }}>Sign In / Sign Up</Link>
      </section>
    );
  }

  if (cart.length === 0 && !loading) {
    return (
      <section className="section" style={{ minHeight: '60vh', textAlign: 'center', paddingTop: '150px' }}>
        <h2>Your cart is empty</h2>
        <Link to="/shop" className="btn btn-primary" style={{ marginTop: '20px', display: 'inline-block' }}>Browse Shop</Link>
      </section>
    );
  }

  return (
    <section className="section" style={{ minHeight: '75vh', paddingBottom: '90px' }}>
      {/* Header Banner */}
      <div className="section-heading" style={{
        marginBottom: '36px',
        padding: '30px 24px',
        background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.08) 0%, rgba(14, 159, 61, 0.05) 100%)',
        borderRadius: 'var(--radius-card)',
        border: '1px solid rgba(212, 175, 55, 0.2)'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', background: 'rgba(212, 175, 55, 0.15)', borderRadius: '20px', color: 'var(--color-gold-highlight)', fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '12px' }}>
            <span>🔒</span> 256-bit Encrypted Checkout
          </div>
          <h1 style={{ margin: '0 0 8px 0', fontSize: 'clamp(2.2rem, 5vw, 3.4rem)', fontWeight: '900', letterSpacing: '-0.03em', color: '#ffffff' }}>
            Complete Your <span style={{ color: 'var(--color-gold-highlight)' }}>Order</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '1rem' }}>
            Enter your delivery details to complete sacred order placement with instant PhonePe gateway verification.
          </p>
        </div>
      </div>

      <div className="checkout-responsive-grid" style={{ display: 'grid', gap: '30px' }}>

        {/* ── Left: Shipping & Billing Form ── */}
        <form onSubmit={handlePhonePePayment} style={{ background: 'var(--bg-card)', padding: '36px', borderRadius: 'var(--radius-card)', border: '1px solid var(--border-subtle)' }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '1.4rem', color: '#ffffff' }}>
            Delivery & Contact Details
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: '0 0 24px 0' }}>
            Courier tracking updates and dispatch notifications will be sent to your phone and email.
          </p>

          <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: '1fr 1fr', marginBottom: '28px' }}>
            
            {/* Full Name */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '800', fontSize: '0.9rem', color: '#ffffff' }}>Full Name *</label>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleInputChange} 
                required
                placeholder="e.g. Ramesh Sharma"
                style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)', color: '#ffffff', boxSizing: 'border-box' }} 
              />
            </div>

            {/* Email Address */}
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '800', fontSize: '0.9rem', color: '#ffffff' }}>Email Address *</label>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleInputChange} 
                required
                placeholder="name@example.com"
                style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)', color: '#ffffff', boxSizing: 'border-box' }} 
              />
            </div>

            {/* Phone Number (Crucial for Courier Dispatch) */}
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '800', fontSize: '0.9rem', color: '#ffffff' }}>Mobile Number (For Courier OTP) *</label>
              <input 
                type="tel" 
                name="phone" 
                value={formData.phone} 
                onChange={handleInputChange} 
                required
                placeholder="10-digit mobile number"
                style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)', color: '#ffffff', boxSizing: 'border-box' }} 
              />
            </div>

            {/* Delivery Street Address */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '800', fontSize: '0.9rem', color: '#ffffff' }}>Complete Street Address (Flat / House No., Landmark) *</label>
              <input 
                type="text" 
                name="address" 
                value={formData.address} 
                onChange={handleInputChange} 
                required
                placeholder="Flat / House / Building No., Street, Landmark..."
                style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)', color: '#ffffff', boxSizing: 'border-box' }} 
              />
            </div>

            {/* City */}
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '800', fontSize: '0.9rem', color: '#ffffff' }}>City / Town *</label>
              <input 
                type="text" 
                name="city" 
                value={formData.city} 
                onChange={handleInputChange} 
                required
                placeholder="e.g. Hyderabad / Mumbai"
                style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)', color: '#ffffff', boxSizing: 'border-box' }} 
              />
            </div>

            {/* State */}
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '800', fontSize: '0.9rem', color: '#ffffff' }}>State / Region *</label>
              <input 
                type="text" 
                name="state" 
                value={formData.state} 
                onChange={handleInputChange} 
                required
                placeholder="e.g. Telangana / Maharashtra"
                style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)', color: '#ffffff', boxSizing: 'border-box' }} 
              />
            </div>

            {/* PIN Code */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '800', fontSize: '0.9rem', color: '#ffffff' }}>PIN / Postal Code *</label>
              <input 
                type="text" 
                name="postalCode" 
                value={formData.postalCode} 
                onChange={handleInputChange} 
                required
                placeholder="6-digit Indian PIN code"
                style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)', color: '#ffffff', boxSizing: 'border-box' }} 
              />
            </div>
          </div>

          {error && (
            <div style={{ background: 'rgba(220,53,69,0.12)', border: '1px solid rgba(220,53,69,0.4)', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', color: '#ff6b6b', fontWeight: '700', fontSize: '0.92rem' }}>
              ⚠️ {error}
            </div>
          )}

          {/* Payment Method Preview Banner */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(95, 37, 159, 0.15) 0%, rgba(123, 47, 247, 0.08) 100%)',
            border: '1px solid rgba(123, 47, 247, 0.35)',
            borderRadius: '12px',
            padding: '16px 20px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#5f259f', display: 'grid', placeItems: 'center', fontSize: '1.4rem' }}>
                💜
              </div>
              <div>
                <div style={{ fontWeight: '800', color: '#ffffff', fontSize: '1rem' }}>PhonePe Payment Gateway</div>
                <small style={{ color: 'var(--text-secondary)' }}>Instant UPI, Debit/Credit Cards & Net Banking</small>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '6px', fontSize: '0.75rem', fontWeight: '800', color: 'var(--color-gold-highlight)', background: 'rgba(0,0,0,0.3)', padding: '6px 12px', borderRadius: '20px' }}>
              ✓ GPay • PhonePe • Paytm • Cards
            </div>
          </div>

          {/* PhonePe Pay Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '18px 24px',
              background: loading ? '#555' : 'linear-gradient(135deg, #5f259f, #7b2ff7)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              fontSize: '1.15rem',
              fontWeight: '900',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              letterSpacing: '0.02em',
              transition: 'transform 0.2s, box-shadow 0.2s',
              boxShadow: loading ? 'none' : '0 10px 30px rgba(95, 37, 159, 0.5)',
            }}
            onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 14px 40px rgba(95, 37, 159, 0.65)'; }}}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(95, 37, 159, 0.5)'; }}
          >
            {loading ? (
              <>
                <span style={{ display: 'inline-block', width: '20px', height: '20px', border: '3px solid rgba(255,255,255,0.3)', borderTop: '3px solid #fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></span>
                Connecting to PhonePe Gateway...
              </>
            ) : (
              <>
                <span>🔒</span>
                Pay ₹{cartTotal.toFixed(2)} with PhonePe
              </>
            )}
          </button>

          <div style={{ textAlign: 'center', marginTop: '14px' }}>
            <small style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
              🛡️ Regulated by RBI & PhonePe India Pvt Ltd • 100% Encrypted Payment
            </small>
          </div>
        </form>

        {/* ── Right: Order Summary with Thumbnails ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{
            padding: '28px',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-card)',
            background: 'var(--bg-card)',
            position: 'sticky',
            top: '100px'
          }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.25rem', color: '#ffffff', fontFamily: 'var(--font-heading)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
              Order Summary ({cart.length} items)
            </h3>

            {/* Items with Thumbnails */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px', maxHeight: '320px', overflowY: 'auto' }}>
              {cart.map((item, i) => {
                const numericUnit = parseFloat(item.price.replace(/[^0-9.]/g, '') || '0');
                const lineTotal = (numericUnit * (item.quantity || 1)).toFixed(2);
                const imgSrc = item.image 
                  ? (item.isDb ? `${API_URL.replace('/api', '')}/${item.image}` : `/${item.image}`) 
                  : null;

                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.92rem' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '8px', overflow: 'hidden', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                      {imgSrc ? (
                        <img src={imgSrc} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <span style={{ fontSize: '1.3rem', color: 'var(--color-gold-highlight)' }}>{item.icon || '✦'}</span>
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ color: '#ffffff', fontWeight: '700', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.name}
                      </div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        Qty: {item.quantity || 1} × {item.price}
                      </div>
                    </div>
                    <div style={{ fontWeight: '800', color: 'var(--color-gold-highlight)', whiteSpace: 'nowrap' }}>
                      ₹{lineTotal}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Price Calculations */}
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.92rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Subtotal:</span>
                <span style={{ color: '#ffffff', fontWeight: '700' }}>₹{cartTotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Express Delivery:</span>
                <span style={{ color: '#4caf50', fontWeight: '800' }}>FREE</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>GST & Packaging:</span>
                <span style={{ color: '#4caf50', fontWeight: '800' }}>Included</span>
              </div>
            </div>

            {/* Total */}
            <div style={{
              borderTop: '1px solid var(--border-subtle)',
              marginTop: '16px',
              paddingTop: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline'
            }}>
              <span style={{ fontSize: '1.1rem', fontWeight: '800', color: '#ffffff' }}>Grand Total:</span>
              <span style={{ fontSize: '1.6rem', fontWeight: '900', color: 'var(--color-gold-highlight)' }}>
                ₹{cartTotal.toFixed(2)}
              </span>
            </div>

            {/* Trust Badges */}
            <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { icon: '🔒', text: '256-bit SSL Encrypted Checkout' },
                { icon: '💳', text: 'UPI / Cards / Net Banking Supported' },
                { icon: '🚚', text: 'Free Delivery on All Orders' },
                { icon: '🙏', text: 'Authentic Sacred Products Guaranteed' },
              ].map((badge, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                  <span style={{ fontSize: '1rem' }}>{badge.icon}</span>
                  <span>{badge.text}</span>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}
