import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { products as localProducts } from '../data/products';
import { API_URL } from '../config';
import { useCart } from '../context/CartContext';

export default function Home() {
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [toastItem, setToastItem] = useState(null);
  const { addToCart } = useCart();
  
  const heroImages = [
    '/hero_bg.png',
    '/hero_bg_2.png',
    '/hero_bg_3.png'
  ];

  useEffect(() => {
    // Fetch Services
    fetch(`${API_URL}/services.php`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) setServices(data.slice(0, 3));
      })
      .catch(() => {});

    // Fetch Products
    fetch(`${API_URL}/products.php`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          const mapped = data.map(p => ({
            id: p.id,
            name: p.name,
            group: p.category,
            rawPrice: parseFloat(p.price),
            price: p.price.toString().startsWith('₹') || p.price.toString().startsWith('$') ? p.price : `₹${p.price}`,
            image: p.image_url,
            icon: p.icon,
            isDb: true
          }));
          setProducts(mapped.slice(0, 6));
        } else {
          setProducts(localProducts.slice(0, 6).map((p, idx) => ({ ...p, id: idx, isDb: false })));
        }
      })
      .catch(() => {
        setProducts(localProducts.slice(0, 6).map((p, idx) => ({ ...p, id: idx, isDb: false })));
      });

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleQuickAdd = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setToastItem(product.name);
    setTimeout(() => setToastItem(null), 2500);
  };

  return (
    <>
      {/* ── Toast Alert for Quick Add to Cart ── */}
      {toastItem && (
        <div style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          background: 'linear-gradient(135deg, #111118, #1a1a24)',
          border: '1px solid var(--color-gold-highlight)',
          color: '#ffffff',
          padding: '16px 24px',
          borderRadius: '12px',
          boxShadow: '0 12px 35px rgba(0,0,0,0.6)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontWeight: '800',
          fontSize: '0.95rem',
          animation: 'fadeIn 0.3s ease-out'
        }}>
          <span style={{ fontSize: '1.3rem' }}>✓</span>
          <span>Added <b>{toastItem}</b> to sacred cart!</span>
          <Link to="/cart" style={{ marginLeft: '10px', color: 'var(--color-gold-highlight)', textDecoration: 'underline', fontSize: '0.85rem' }}>View Cart →</Link>
        </div>
      )}

      {/* ── Hero Slideshow Section ── */}
      <section className="hero">
        {heroImages.map((src, index) => (
          <img 
            key={index}
            src={src} 
            className="hero-video" 
            alt={`Cosmic Numerology ${index + 1}`} 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
              position: 'absolute',
              top: 0,
              left: 0,
              opacity: index === currentSlide ? 1 : 0,
              transition: 'opacity 1.5s ease-in-out'
            }} 
          />
        ))}
        <div className="hero-shade"></div>
        <div className="numerology-grid" aria-hidden="true"></div>
        <div className="numerology-particles" aria-hidden="true">
          <span className="num n1">1</span>
          <span className="num n2">7</span>
          <span className="num n3">9</span>
          <span className="num n4">3</span>
          <span className="num n5">8</span>
          <span className="num n6">∞</span>
        </div>
        <div className="hero-content">
          <div className="eyebrow" style={{ color: 'rgba(255,255,255,0.85)', borderColor: 'rgba(255,255,255,0.3)', letterSpacing: '0.12em' }}>
            ✦ Sacred Numerology, Vaastu & Energized Crystals
          </div>
          <h1 style={{ color: '#ffffff', textShadow: '0 4px 20px rgba(0,0,0,0.6)', fontSize: 'clamp(2.4rem, 6vw, 4.4rem)', lineHeight: 1.15 }}>
            SRIONE<br />
            <span className="hero-highlight">Your Cosmic <span className="highlight-yellow" style={{ color: 'var(--color-gold-highlight)' }}>Blueprint</span></span>
          </h1>
          <p className="hero-copy" style={{ color: 'rgba(255, 255, 255, 0.92)', textShadow: '0 2px 10px rgba(0,0,0,0.6)', fontSize: '1.15rem', maxWidth: '640px' }}>
            Unlock the hidden frequencies of your birth destiny. Discover certified sacred crystals, yantras, and architectural Vaastu remedies to manifest wealth, health, and cosmic alignment.
          </p>
          <div className="hero-actions" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <Link className="btn btn-primary" to="/shop" style={{ padding: '14px 32px', fontSize: '1rem', fontWeight: '800' }}>
              Explore Sacred Shop ↗
            </Link>
            <Link className="btn" to="/services" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)', padding: '14px 28px', fontSize: '1rem', fontWeight: '800', background: 'rgba(0,0,0,0.3)' }}>
              Consultation Services
            </Link>
          </div>
        </div>
      </section>

      {/* ── 4-Column Sacred Trust & Quality Strip ── */}
      <section style={{
        background: 'linear-gradient(180deg, #12131a 0%, #171822 100%)',
        borderBottom: '1px solid var(--border-subtle)',
        borderTop: '1px solid var(--border-subtle)',
        padding: '32px 24px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '24px'
        }}>
          {[
            {
              icon: '🕉️',
              title: '100% Vedic Energized',
              desc: 'Consecrated under auspicious Vedic muhurtas & mantras.'
            },
            {
              icon: '🚚',
              title: 'Free Pan-India Delivery',
              desc: 'Secure express insured courier dispatch to your doorstep.'
            },
            {
              icon: '🔒',
              title: '256-Bit PhonePe Gateway',
              desc: 'Instant UPI, Cards & Net Banking with full encryption.'
            },
            {
              icon: '💬',
              title: 'Astrological Guidance',
              desc: 'Direct consultation & remedy recommendations on WhatsApp.'
            }
          ].map((item, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'rgba(212, 175, 55, 0.1)',
                border: '1px solid rgba(212, 175, 55, 0.25)',
                display: 'grid',
                placeItems: 'center',
                fontSize: '1.4rem',
                flexShrink: 0
              }}>
                {item.icon}
              </div>
              <div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '0.98rem', color: '#ffffff', fontWeight: '800' }}>
                  {item.title}
                </h4>
                <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Featured Shop Curations ── */}
      <section style={{ padding: '90px 24px', maxWidth: '1200px', margin: '0 auto' }}>
        <div className="section-heading" style={{ textAlign: 'center', marginBottom: '50px' }}>
          <div className="eyebrow" style={{ justifyContent: 'center', color: 'var(--color-gold-highlight)' }}>
            ✦ Sacred Curations
          </div>
          <h2 style={{ color: 'var(--text-primary)', fontSize: 'clamp(2.2rem, 5vw, 3rem)', margin: '12px 0', fontWeight: '900' }}>
            Empower Your <span style={{ color: 'var(--color-gold-highlight)' }}>Cosmic Frequency</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '620px', margin: '0 auto', fontSize: '1.05rem' }}>
            Precision-crafted gemstones, energized rudraksha bracelets, and sacred yantras tested for vibrational purity.
          </p>
        </div>
        
        <div className="catalog" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '28px' }}>
          {products.map((product) => {
            const numeric = parseFloat((product.price || '').replace(/[^0-9.]/g, '') || '1000');
            const originalPrice = `₹${Math.round(numeric * 1.25).toLocaleString('en-IN')}`;
            const imgSrc = product.image
              ? (product.isDb ? `${API_URL.replace('/api', '')}/${product.image}` : `/${product.image}`)
              : null;

            return (
              <div 
                key={product.id} 
                className="product-card" 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  height: '100%', 
                  background: 'var(--bg-card)', 
                  borderRadius: 'var(--radius-card)', 
                  border: '1px solid var(--border-subtle)', 
                  overflow: 'hidden',
                  transition: 'transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease'
                }}
              >
                {/* Image / Thumbnail Container */}
                <Link to={`/shop/${product.id}`} style={{ textDecoration: 'none', position: 'relative', display: 'block', height: '260px', overflow: 'hidden', background: 'var(--bg-secondary)' }}>
                  {imgSrc ? (
                    <img 
                      src={imgSrc} 
                      alt={product.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }} 
                      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center', fontSize: '4.5rem', color: 'var(--color-gold-highlight)' }}>
                      {product.icon || '✦'}
                    </div>
                  )}
                  <span style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    background: 'rgba(10, 10, 15, 0.85)',
                    backdropFilter: 'blur(6px)',
                    border: '1px solid rgba(212, 175, 55, 0.4)',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: '800',
                    color: 'var(--color-gold-highlight)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em'
                  }}>
                    {product.group || 'Sacred Gem'}
                  </span>
                </Link>

                {/* Content Area */}
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <Link to={`/shop/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '1.25rem', color: '#ffffff', fontWeight: '800' }}>
                      {product.name}
                    </h3>
                  </Link>
                  <p style={{ margin: '0 0 18px 0', fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    Authentic energized remedy designed to align celestial chakras and planetary influences.
                  </p>

                  {/* Price & Action Row */}
                  <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)' }}>
                    <div>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textDecoration: 'line-through', marginRight: '8px' }}>
                        {originalPrice}
                      </span>
                      <span style={{ fontSize: '1.3rem', fontWeight: '900', color: 'var(--color-gold-highlight)' }}>
                        {product.price}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        onClick={(e) => handleQuickAdd(e, product)}
                        style={{
                          background: 'linear-gradient(135deg, var(--color-gold-highlight), #f39c12)',
                          color: '#0d0d12',
                          border: 'none',
                          padding: '8px 14px',
                          borderRadius: '8px',
                          fontWeight: '800',
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          transition: 'transform 0.15s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                      >
                        <span>+</span> Cart
                      </button>

                      <Link 
                        to={`/shop/${product.id}`} 
                        style={{
                          background: 'rgba(255,255,255,0.06)',
                          color: '#ffffff',
                          border: '1px solid var(--border-subtle)',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          fontWeight: '700',
                          fontSize: '0.85rem',
                          textDecoration: 'none'
                        }}
                      >
                        Details ↗
                      </Link>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <Link className="btn btn-primary" to="/shop" style={{ padding: '16px 40px', fontSize: '1.05rem', fontWeight: '800' }}>
            View Full Sacred Collection (25+ Items) ↗
          </Link>
        </div>
      </section>

      {/* ── Why SRIONE Section (The Sacred Difference) ── */}
      <section style={{
        background: 'linear-gradient(180deg, #101118 0%, #141622 100%)',
        padding: '90px 24px',
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <div className="eyebrow" style={{ justifyContent: 'center', color: 'var(--color-gold-highlight)' }}>
              ✦ The Sacred Difference
            </div>
            <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3rem)', color: '#ffffff', margin: '12px 0', fontWeight: '900' }}>
              Why Choose <span style={{ color: 'var(--color-gold-highlight)' }}>SRIONE GROW</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto', fontSize: '1.05rem' }}>
              We merge ancient Vedic wisdom with mathematical precision to bring tangible shifts to your life and environment.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '30px'
          }}>
            {[
              {
                icon: '🔢',
                title: 'Mathematical Numerology',
                desc: 'Tailored analysis based on your exact date of birth, name vibration, and destiny path to eliminate life obstacles.'
              },
              {
                icon: '🧭',
                title: 'Architectural Vaastu Harmony',
                desc: 'Scientific spatial corrections for residential and commercial spaces without requiring major demolition.'
              },
              {
                icon: '💎',
                title: 'Consecrated Sacred Energy',
                desc: 'Every gemstone and yantra undergoes purification and Vedic prana pratishtha before courier dispatch.'
              }
            ].map((feature, i) => (
              <div key={i} style={{
                background: 'var(--bg-card)',
                padding: '36px 28px',
                borderRadius: 'var(--radius-card)',
                border: '1px solid var(--border-subtle)',
                position: 'relative',
                transition: 'transform 0.2s',
                boxShadow: '0 8px 30px rgba(0,0,0,0.2)'
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.05) 100%)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: '1.8rem',
                  marginBottom: '20px'
                }}>
                  {feature.icon}
                </div>
                <h3 style={{ fontSize: '1.35rem', color: '#ffffff', margin: '0 0 12px 0', fontWeight: '800' }}>
                  {feature.title}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', lineHeight: 1.6, margin: 0 }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services Teaser Section ── */}
      <section style={{ background: 'var(--bg-secondary)', padding: '100px 24px', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '70px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className="eyebrow" style={{ justifyContent: 'center', color: 'var(--color-gold-highlight)' }}>Discover Your Path</div>
            <h2 style={{ color: 'var(--text-primary)', fontSize: 'clamp(2.2rem, 5vw, 3rem)', margin: '12px 0', fontFamily: 'var(--font-heading)', fontWeight: '900' }}>
              Expertise & Practices
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '640px' }}>
              Transformative consultations to align your space, spirit, and destiny. We guide you beyond the physical.
            </p>
          </div>

          <div className="services-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
            {services.length > 0 ? services.map(s => (
              <Link key={s.id} className="premium-service-card" to={s.link} style={{ textDecoration: 'none' }}>
                {s.image_url ? (
                  <img src={`${API_URL.replace('/api', '')}/${s.image_url}`} alt={s.name} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                ) : (
                  <div className={`premium-service-icon ${s.css_class}`} style={{ background: 'var(--bg-secondary)' }}>
                    <span style={{ fontSize: '2rem' }}>{s.mark}</span>
                  </div>
                )}
                <h3 style={{ fontSize: '1.6rem', marginBottom: '12px', color: 'var(--text-primary)', fontWeight: '800' }}>{s.name}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.6', flexGrow: 1 }}>{s.description}</p>
                <div className="premium-service-cta" style={{ fontWeight: '800', color: 'var(--color-gold-highlight)' }}>
                  Explore Consultation <span className="arrow">→</span>
                </div>
              </Link>
            )) : (
              <div style={{ textAlign: 'center', gridColumn: '1 / -1', color: 'var(--text-secondary)' }}>Loading featured services...</div>
            )}
          </div>

          <div style={{ textAlign: 'center', marginTop: '60px' }}>
            <Link className="btn btn-primary" to="/services" style={{ padding: '16px 40px', fontSize: '1.05rem', fontWeight: '800' }}>
              View All Consultations ↗
            </Link>
          </div>
        </div>
      </section>

      {/* ── Direct WhatsApp Consultation & Contact Band ── */}
      <section style={{ padding: '80px 24px', maxWidth: '1200px', margin: '0 auto' }}>
        <div className="contact-band" style={{
          background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.12) 0%, rgba(37, 211, 102, 0.08) 100%)',
          borderRadius: 'var(--radius-card)',
          border: '1px solid rgba(212, 175, 55, 0.3)',
          padding: '48px 36px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '24px'
        }}>
          <div>
            <div className="eyebrow" style={{ color: 'var(--color-gold-highlight)', marginBottom: '8px' }}>✦ Direct Astrological Channel</div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', color: '#ffffff', margin: '0 0 10px 0', fontWeight: '900' }}>
              Connect with Our Lead Numerologist
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '560px', margin: 0, fontSize: '1rem', lineHeight: 1.6 }}>
              Receive instant personalized guidance for your name correction, birth chart, or home Vaastu directly on WhatsApp.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <a 
              className="btn btn-primary" 
              href="https://wa.me/917997992211?text=Hello%20SRIONE%20GROW,%20I%20would%20like%20to%20book%20a%20sacred%20consultation." 
              target="_blank" 
              rel="noreferrer"
              style={{
                background: '#25D366',
                borderColor: '#25D366',
                color: '#ffffff',
                padding: '16px 28px',
                fontSize: '1rem',
                fontWeight: '900',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 8px 25px rgba(37, 211, 102, 0.4)'
              }}
            >
              <span>💬</span> Chat on WhatsApp
            </a>

            <Link 
              className="btn" 
              to="/contact"
              style={{
                color: '#ffffff',
                borderColor: 'var(--border-subtle)',
                background: 'rgba(255,255,255,0.06)',
                padding: '16px 28px',
                fontSize: '1rem',
                fontWeight: '800'
              }}
            >
              Contact Form
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
