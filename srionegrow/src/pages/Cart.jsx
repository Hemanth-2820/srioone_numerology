import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { API_URL } from '../config';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const user = localStorage.getItem('srione_user');

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
            <span>🛍️</span> Review Your Selection
          </div>
          <h1 style={{ margin: '0 0 8px 0', fontSize: 'clamp(2.2rem, 5vw, 3.4rem)', fontWeight: '900', letterSpacing: '-0.03em', color: '#ffffff' }}>
            Shopping <span style={{ color: 'var(--color-gold-highlight)' }}>Cart</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '1rem' }}>
            {cart.length > 0 ? `You have ${cart.reduce((sum, i) => sum + i.quantity, 0)} sacred item(s) ready for order.` : 'Your cart is waiting for sacred remedies.'}
          </p>
        </div>
      </div>

      {cart.length === 0 ? (
        /* Empty Cart State */
        <div style={{
          textAlign: 'center',
          padding: '80px 24px',
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-card)',
          border: '1px solid var(--border-subtle)',
          maxWidth: '640px',
          margin: '0 auto'
        }}>
          <div style={{ fontSize: '4.5rem', marginBottom: '20px' }}>🛍️</div>
          <h2 style={{ fontSize: '1.8rem', margin: '0 0 12px 0', color: '#ffffff', fontFamily: 'var(--font-heading)' }}>
            Your Cart is Empty
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '440px', margin: '0 auto 30px', lineHeight: '1.6', fontSize: '1.05rem' }}>
            Explore our curated gemstones, authentic Karungali ebony wood, and sacred remedies aligned with your cosmic energy.
          </p>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/shop" className="btn btn-primary" style={{ padding: '14px 28px', color: 'var(--color-navy)', fontWeight: '900' }}>
              Explore Sacred Shop ↗
            </Link>
            <Link to="/services" className="btn" style={{ padding: '14px 24px', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', color: '#ffffff' }}>
              Consultations
            </Link>
          </div>
        </div>
      ) : (
        /* Populated Cart Grid */
        <div className="cart-responsive-grid" style={{ display: 'grid', gap: '30px' }}>
          
          {/* Left: Cart Items List */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#ffffff' }}>Selected Items ({cart.length})</h3>
              <button
                onClick={clearCart}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  textDecoration: 'underline'
                }}
              >
                Clear Cart
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {cart.map(item => {
                const numericUnit = parseFloat(item.price.replace(/[^0-9.]/g, '') || '0');
                const lineTotal = (numericUnit * item.quantity).toFixed(2);
                const imgSrc = item.image 
                  ? (item.isDb ? `${API_URL.replace('/api', '')}/${item.image}` : `/${item.image}`) 
                  : null;

                return (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '20px',
                      padding: '20px',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-card)',
                      background: 'var(--bg-card)',
                      transition: 'border-color 0.2s',
                      flexWrap: 'wrap'
                    }}
                  >
                    {/* Thumbnail */}
                    <div style={{
                      width: '90px',
                      height: '90px',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-subtle)',
                      display: 'grid',
                      placeItems: 'center',
                      flexShrink: 0
                    }}>
                      {imgSrc ? (
                        <img src={imgSrc} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <span style={{ fontSize: '2.5rem', color: 'var(--color-gold-highlight)' }}>{item.icon || '✦'}</span>
                      )}
                    </div>

                    {/* Info */}
                    <div style={{ flex: '1 1 200px' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-gold-highlight)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>
                        {item.group || 'Sacred Item'}
                      </div>
                      <h4 style={{ margin: '0 0 6px 0', fontSize: '1.15rem', color: '#ffffff', fontWeight: '800' }}>
                        {item.name}
                      </h4>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        Unit: <b style={{ color: 'var(--text-primary)' }}>{item.price}</b>
                      </div>
                    </div>

                    {/* Stepper */}
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      background: 'var(--bg-secondary)',
                      overflow: 'hidden'
                    }}>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        style={{
                          padding: '6px 14px',
                          background: 'transparent',
                          border: 'none',
                          color: '#ffffff',
                          fontSize: '1.1rem',
                          cursor: 'pointer',
                          fontWeight: 'bold'
                        }}
                      >
                        −
                      </button>
                      <span style={{ padding: '0 12px', fontWeight: '800', fontSize: '1rem', color: '#ffffff', minWidth: '20px', textAlign: 'center' }}>
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        style={{
                          padding: '6px 14px',
                          background: 'transparent',
                          border: 'none',
                          color: '#ffffff',
                          fontSize: '1.1rem',
                          cursor: 'pointer',
                          fontWeight: 'bold'
                        }}
                      >
                        +
                      </button>
                    </div>

                    {/* Line Total */}
                    <div style={{ textAlign: 'right', minWidth: '90px' }}>
                      <div style={{ fontSize: '1.2rem', fontWeight: '900', color: 'var(--color-gold-highlight)' }}>
                        ₹{lineTotal}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#4caf50', fontWeight: '700' }}>
                        Free Delivery
                      </div>
                    </div>

                    {/* Remove Icon */}
                    <button
                      type="button"
                      title="Remove item"
                      onClick={() => removeFromCart(item.id)}
                      style={{
                        background: 'rgba(220, 53, 69, 0.1)',
                        border: '1px solid rgba(220, 53, 69, 0.3)',
                        color: '#ff6b6b',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '800',
                        fontSize: '0.9rem',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#dc3545'; e.currentTarget.style.color = '#fff'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(220, 53, 69, 0.1)'; e.currentTarget.style.color = '#ff6b6b'; }}
                    >
                      🗑️
                    </button>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: '20px' }}>
              <Link to="/shop" style={{ color: 'var(--color-gold-highlight)', textDecoration: 'none', fontWeight: '700', fontSize: '0.95rem' }}>
                ← Add More Sacred Items
              </Link>
            </div>
          </div>

          {/* Right: Order Summary Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{
              padding: '28px',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-card)',
              background: 'var(--bg-card)',
              position: 'sticky',
              top: '100px'
            }}>
              <h3 style={{ margin: '0 0 20px 0', fontSize: '1.3rem', color: '#ffffff', fontFamily: 'var(--font-heading)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
                Order Summary
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px', fontSize: '0.95rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                  <span>Items Subtotal:</span>
                  <span style={{ color: '#ffffff', fontWeight: '700' }}>₹{cartTotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                  <span>Delivery across India:</span>
                  <span style={{ color: '#4caf50', fontWeight: '800' }}>FREE</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                  <span>GST & Ritual Packaging:</span>
                  <span style={{ color: '#4caf50', fontWeight: '800' }}>Included</span>
                </div>
              </div>

              <div style={{
                borderTop: '1px solid var(--border-subtle)',
                paddingTop: '16px',
                marginBottom: '24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline'
              }}>
                <span style={{ fontSize: '1.1rem', fontWeight: '800', color: '#ffffff' }}>Grand Total:</span>
                <span style={{ fontSize: '1.6rem', fontWeight: '900', color: 'var(--color-gold-highlight)' }}>
                  ₹{cartTotal.toFixed(2)}
                </span>
              </div>

              {user ? (
                <Link
                  to="/checkout"
                  className="btn btn-primary"
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    width: '100%',
                    padding: '16px',
                    fontSize: '1.1rem',
                    fontWeight: '900',
                    color: 'var(--color-navy)',
                    boxShadow: '0 8px 24px rgba(212, 175, 55, 0.35)',
                    borderRadius: '12px'
                  }}
                >
                  ⚡ Proceed to Checkout
                </Link>
              ) : (
                <div>
                  <Link
                    to="/auth?redirect=/checkout"
                    className="btn btn-primary"
                    style={{
                      display: 'block',
                      textAlign: 'center',
                      width: '100%',
                      padding: '16px',
                      fontSize: '1.05rem',
                      fontWeight: '900',
                      color: 'var(--color-navy)',
                      marginBottom: '10px',
                      borderRadius: '12px'
                    }}
                  >
                    Sign In to Checkout
                  </Link>
                  <small style={{ display: 'block', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', lineHeight: '1.4' }}>
                    🔒 Please log in or register so we can link this order and tracking to your account.
                  </small>
                </div>
              )}

              {/* Trust Badges in Sidebar */}
              <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '10px', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>🔒</span> <b>PhonePe Gateway</b> – 100% Secure Payment
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>🚚</span> <b>Express Shipping</b> – Free Delivery Across India
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>✨</span> <b>Sacred Purity</b> – Pre-cleansed prior to packaging
                </div>
              </div>
            </div>
          </div>

        </div>
      )}
    </section>
  );
}
