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

        <div className="topbar-actions" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          
          {/* Cart Button */}
          <Link 
            className="cart-btn" 
            to="/cart" 
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '8px', 
              height: '42px',
              padding: '0 18px', 
              background: 'linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)', 
              borderRadius: '24px', 
              color: '#0d1117', 
              fontWeight: '800', 
              fontSize: '0.85rem',
              letterSpacing: '0.04em',
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(212, 175, 55, 0.35)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(212, 175, 55, 0.55)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(212, 175, 55, 0.35)'; }}
          >
            <span style={{ fontSize: '1.05rem', lineHeight: 1 }}>🛒</span>
            <span>CART</span>
            <span style={{ 
              background: '#0d1117', 
              color: '#f4d03f', 
              padding: '2px 8px', 
              borderRadius: '12px', 
              fontSize: '0.78rem',
              fontWeight: '900',
              marginLeft: '2px'
            }}>
              {cartCount}
            </span>
          </Link>

          {/* User Account / Auth Button */}
          <Link 
            className="auth-btn" 
            to={user ? "/profile" : "/auth"} 
            style={{ 
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '42px',
              padding: '0 20px',
              background: user ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.05) 100%)' : 'transparent',
              border: '1.5px solid var(--color-gold-highlight)',
              borderRadius: '24px',
              color: 'var(--color-gold-highlight)',
              fontWeight: '800',
              fontSize: '0.85rem',
              letterSpacing: '0.04em',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
              boxShadow: user ? '0 4px 14px rgba(0,0,0,0.3)' : 'none'
            }}
            onMouseEnter={e => { 
              e.currentTarget.style.background = 'linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)'; 
              e.currentTarget.style.color = '#0d1117';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(212, 175, 55, 0.4)';
            }}
            onMouseLeave={e => { 
              e.currentTarget.style.background = user ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.05) 100%)' : 'transparent';
              e.currentTarget.style.color = 'var(--color-gold-highlight)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = user ? '0 4px 14px rgba(0,0,0,0.3)' : 'none';
            }}
          >
            {user ? '👤 MY ACCOUNT' : 'SIGN IN / SIGN UP'}
          </Link>
          
          <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)} style={{ display: 'none', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', padding: '5px' }}>
            {menuOpen ? '✖' : '☰'}
          </button>
        </div>
      </div>
    </header>
  );
}
