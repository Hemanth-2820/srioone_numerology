import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

export default function Navbar() {
  const { cart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const cartCount = cart.length;
  const user = JSON.parse(localStorage.getItem('srione_user'));

  return (
    <header className="topbar">
      <div className="topbar-container">
        
        <Link className="brand" to="/" style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <img src="/srionegrow_logo.png" alt="SRIONE logo" style={{ height: '85px', width: 'auto', objectFit: 'contain', borderRadius: '4px' }} />
        </Link>
        
        <div className="search-bar" style={{ display: 'none' }}>
          {/* Hiding search bar to keep mobile clean, can be re-enabled if needed */}
        </div>

        <nav className={`topbar-nav ${menuOpen ? 'mobile-active' : ''}`}>
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/shop" onClick={() => setMenuOpen(false)}>Shop</Link>
          <Link to="/services" onClick={() => setMenuOpen(false)}>Services</Link>
          <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
          {/* Show Auth on mobile menu */}
          {user ? <Link to="/profile" className="mobile-auth-link" style={{ display: menuOpen ? 'block' : 'none', marginTop: '10px', color: 'var(--color-saffron)', fontWeight: '800' }} onClick={() => setMenuOpen(false)}>My Account</Link> : <Link to="/auth" className="mobile-auth-link" style={{ display: menuOpen ? 'block' : 'none', marginTop: '10px', color: 'var(--color-saffron)', fontWeight: '800' }} onClick={() => setMenuOpen(false)}>Sign In / Sign Up</Link>}
        </nav>

        <div className="topbar-actions">
          <Link 
            className="cart-btn" 
            to="/cart" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              padding: '10px 18px', 
              background: 'linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)', 
              borderRadius: 'var(--radius-pill)', 
              color: '#0d1117', 
              fontWeight: '800', 
              textDecoration: 'none',
              boxShadow: '0 4px 15px rgba(212, 175, 55, 0.35)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(212, 175, 55, 0.5)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(212, 175, 55, 0.35)'; }}
          >
            <span style={{ fontSize: '1rem' }}>🛒</span>
            <span style={{ letterSpacing: '0.04em' }}>CART</span>
            <span className="badge" style={{ 
              background: '#0d1117', 
              color: 'var(--color-gold-highlight)', 
              padding: '2px 8px', 
              borderRadius: '12px', 
              fontSize: '0.8rem',
              fontWeight: '900',
              marginLeft: '2px'
            }}>
              {cartCount}
            </span>
          </Link>
          {user ? <Link className="btn btn-primary auth-btn" to="/profile" style={{ background: 'var(--color-gold-highlight)', color: 'var(--color-navy)' }}>My Account</Link> : <Link className="btn btn-primary auth-btn" to="/auth" style={{ color: 'var(--color-navy)' }}>Sign In / Sign Up</Link>}
          
          <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)} style={{ display: 'none', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', padding: '5px' }}>
            {menuOpen ? '✖' : '☰'}
          </button>
        </div>
      </div>
    </header>
  );
}
