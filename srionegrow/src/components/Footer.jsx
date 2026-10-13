import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{
      background: 'linear-gradient(180deg, var(--bg-primary) 0%, #111721 100%)',
      borderTop: '1px solid var(--border-subtle)',
      padding: '70px 24px 30px',
      marginTop: '80px',
      position: 'relative'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '40px',
        paddingBottom: '50px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        
        {/* Brand Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
            <img src="/srionegrow_logo.png" alt="SRIONE logo" style={{ height: '48px', width: 'auto', objectFit: 'contain', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.1)' }} />
            <span style={{ color: '#ffffff', fontWeight: '900', fontSize: '1.4rem', letterSpacing: '0.08em', fontFamily: 'var(--font-heading)' }}>SRIONE</span>
          </Link>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', margin: 0, fontSize: '0.95rem' }}>
            Sacred spiritual remedies, authentic energized crystals, and personalized numerology consultations to bring harmony, clarity, and prosperity into your life.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', color: 'var(--color-gold-highlight)', fontSize: '0.85rem', fontWeight: '700' }}>
            <span>✦</span> Authentic Vedic & Numerological Guidance
          </div>
        </div>

        {/* Quick Links Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3 style={{ color: '#ffffff', fontSize: '1.1rem', fontWeight: '800', marginBottom: '8px', fontFamily: 'var(--font-heading)', letterSpacing: '0.03em' }}>Explore</h3>
          <Link to="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.95rem', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}>Home</Link>
          <Link to="/shop" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.95rem', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}>Shop Collection</Link>
          <Link to="/services" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.95rem', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}>Consultation Services</Link>
          <Link to="/contact" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.95rem', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}>Contact & Enquiries</Link>
          <Link to="/profile" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.95rem', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}>Customer Account</Link>
        </div>

        {/* Sacred Specialties Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3 style={{ color: '#ffffff', fontSize: '1.1rem', fontWeight: '800', marginBottom: '8px', fontFamily: 'var(--font-heading)', letterSpacing: '0.03em' }}>Our Specialties</h3>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>• Business & Mobile Numerology</span>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>• Vaastu Directional Analysis</span>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>• Consecrated Ebony Karungali</span>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>• Seven Chakra & Rashi Stones</span>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>• Certified Spiritual Remedies</span>
        </div>

        {/* Contact & Support Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <h3 style={{ color: '#ffffff', fontSize: '1.1rem', fontWeight: '800', marginBottom: '8px', fontFamily: 'var(--font-heading)', letterSpacing: '0.03em' }}>Direct Support</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <a href="mailto:info@srionegrow.com" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1rem' }}>✉️</span> info@srionegrow.com
            </a>
            <a href="mailto:ompraksh@srionegrow.com" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1rem' }}>✉️</span> ompraksh@srionegrow.com
            </a>
          </div>

          <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            <a
              href="https://wa.me/919705131915"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                background: '#25D366',
                color: '#ffffff',
                borderRadius: '30px',
                textDecoration: 'none',
                fontWeight: '800',
                fontSize: '0.9rem',
                boxShadow: '0 4px 14px rgba(37, 211, 102, 0.3)'
              }}
            >
              💬 WhatsApp Us
            </a>

            <a
              href="tel:+919705131915"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                background: 'var(--color-saffron)',
                color: 'var(--color-navy)',
                borderRadius: '30px',
                textDecoration: 'none',
                fontWeight: '800',
                fontSize: '0.9rem'
              }}
            >
              📞 Call
            </a>
          </div>
        </div>

      </div>

      {/* Trust & Transparency Note */}
      <div style={{
        maxWidth: '1200px',
        margin: '28px auto 0',
        padding: '14px 24px',
        textAlign: 'center',
        background: 'rgba(255, 255, 255, 0.03)',
        borderRadius: '10px',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        color: 'var(--text-muted)',
        fontSize: '0.85rem',
        lineHeight: '1.6'
      }}>
        🛡️ <strong style={{ color: 'var(--text-secondary)' }}>Authenticity Notice:</strong> All items are curated strictly for personal spiritual devotion, religious worship, and aesthetic beauty. Individual spiritual beliefs and experiences may vary.
      </div>

      {/* Copyright & Developer Credits Bottom Bar */}
      <div style={{
        maxWidth: '1200px',
        margin: '24px auto 0',
        paddingTop: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        color: 'var(--text-muted)',
        fontSize: '0.88rem'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ color: '#ffffff', fontWeight: '700' }}>© 2026 SRIONE. All rights reserved.</span>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Owned and operated by Omprakash Sinha</span>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Developed by{' '}
            <a
              href="https://nsgsolutions.in"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--color-gold-highlight)', fontWeight: '700', textDecoration: 'none' }}
              onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
              onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
            >
              NSG Solutions (nsgsolutions.in)
            </a>
          </span>
        </div>
        <div style={{ display: 'flex', gap: '20px', fontSize: '0.85rem' }}>
          <Link to="/contact" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Privacy Policy</Link>
          <Link to="/contact" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Terms & Conditions</Link>
          <Link to="/contact" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Shipping & Refunds</Link>
        </div>
      </div>
    </footer>
  );
}
