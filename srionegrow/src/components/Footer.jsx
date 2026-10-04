import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-subtle)', padding: '60px 24px 20px', marginTop: '60px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px', paddingBottom: '40px', borderBottom: '1px solid var(--border-subtle)' }}>
        
        {/* Brand Column */}
        <div className="footer-brand" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: 'var(--text-primary)', fontWeight: '900', fontSize: '1.4rem', letterSpacing: '0.1em' }}>
            <img src="/srionegrow_logo.png" alt="SRIONE logo" style={{ height: '40px', borderRadius: '8px' }} />
            <span>SRIONE</span>
          </Link>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
            Precision-crafted tools, deep ancient wisdom, and intelligent systems for ideas that do not fit inside ordinary limits.
          </p>
        </div>

        {/* Links Column */}
        <div className="footer-column" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3 style={{ color: 'var(--text-primary)', fontSize: '1.1rem', marginBottom: '8px' }}>Explore</h3>
          <Link to="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: '600' }}>Home</Link>
          <Link to="/shop" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: '600' }}>Shop Collection</Link>
          <Link to="/services" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: '600' }}>Our Services</Link>
          <Link to="/contact" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: '600' }}>Contact Us</Link>
        </div>

        {/* Contact Column */}
        <div className="footer-column" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ color: 'var(--text-primary)', fontSize: '1.1rem', marginBottom: '4px' }}>Get in Touch</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <a href="mailto:ompraksh@srionegrow.com" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
              ✉️ ompraksh@srionegrow.com
            </a>
            <a href="mailto:info@srionegrow.com" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
              ✉️ info@srionegrow.com
            </a>
          </div>

          <div style={{ marginTop: '4px' }}>
            <a href="tel:+919705131915" style={{ color: 'var(--text-primary)', background: 'var(--color-saffron)', padding: '8px 16px', borderRadius: 'var(--radius-pill)', textDecoration: 'none', fontWeight: '800', display: 'inline-block' }}>
              📞 +91 97051 31915
            </a>
          </div>
        </div>

      </div>

      {/* Copyright Bottom */}
      <div className="footer-bottom" style={{ maxWidth: '1200px', margin: '0 auto', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '600' }}>
        <span>© 2026 SRIONE. All rights reserved.</span>
        <div style={{ display: 'flex', gap: '20px' }}>
          <Link to="/admin" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Admin Login</Link>
          <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Privacy Policy</a>
          <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
