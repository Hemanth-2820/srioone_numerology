import { Link } from 'react-router-dom';
import { products } from '../data/products';

export default function Home() {
  const featuredProducts = products.slice(0, 3); // Take first 3 for the home page

  return (
    <>
      <section className="hero">
        <video className="hero-video" autoPlay muted loop playsInline poster="/srionegrow_logo.png">
          <source src="/srione_video.mp4" type="video/mp4" />
        </video>
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
          <div className="eyebrow" style={{ color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(255,255,255,0.3)' }}>Numerology, Vaastu & Crystals</div>
          <h1 style={{ color: '#ffffff', textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>SRIONE<br /><span className="hero-highlight">Your Cosmic <span className="highlight-yellow" style={{ color: 'var(--color-saffron)' }}>Blueprint</span></span></h1>
          <p className="hero-copy" style={{ color: 'rgba(255, 255, 255, 0.9)', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>Unlock the hidden potential of your destiny. Explore transformative consultations and precision-crafted crystals to align your space, spirit, and future.</p>
          <div className="hero-actions">
            <Link className="btn btn-primary" to="/shop">Explore collection</Link>
            <Link className="btn" to="/services" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)' }}>Our services</Link>
          </div>
        </div>
      </section>

      {/* Featured Shop Section */}
      <section style={{ padding: '100px 24px', maxWidth: '1200px', margin: '0 auto' }}>
        <div className="section-heading" style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div className="eyebrow" style={{ justifyContent: 'center' }}>Featured Curations</div>
          <h2 style={{ color: 'var(--text-primary)', fontSize: '2.5rem', marginBottom: '16px' }}>Tools for the Next Move.</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Precision-crafted tools and insights.</p>
        </div>
        
        <div className="catalog" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {featuredProducts.map((product, idx) => (
            <Link to={`/shop/${idx}`} key={idx} className="product-card" style={{ textDecoration: 'none' }}>
              <article className="product">
                <div className="product-art">
                  {product.image ? <img src={`/${product.image}`} alt={product.name} /> : product.icon}
                </div>
                <div className="category">{product.group}</div>
                <h2 style={{ color: 'var(--text-primary)' }}>{product.name}</h2>
                <div className="product-bottom">
                  <div className="product-pricing">
                    <span className="price">{product.price}</span>
                  </div>
                  <button className="enquire" type="button">View Details ↗</button>
                </div>
              </article>
            </Link>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '60px' }}>
          <Link className="btn btn-primary" to="/shop">View Full Collection</Link>
        </div>
      </section>

      {/* Services Teaser Section */}
      <section style={{ background: 'var(--bg-secondary)', padding: '120px 24px', borderTop: '1px solid var(--border-subtle)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className="eyebrow" style={{ justifyContent: 'center', color: 'var(--color-saffron)' }}>Discover Your Path</div>
            <h2 style={{ color: 'var(--text-primary)', fontSize: '3rem', marginBottom: '20px', fontFamily: 'var(--font-heading)' }}>Expertise & Practices.</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px' }}>Transformative consultations to align your space, spirit, and destiny. We guide you beyond the physical.</p>
          </div>
          
          <div className="services-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
            
            <Link className="premium-service-card" to="/services/numerology" style={{ textDecoration: 'none' }}>
              <div className="premium-service-icon" style={{ background: 'var(--color-lemon)' }}>
                <span style={{ fontSize: '2rem' }}>∞</span>
              </div>
              <h3 style={{ fontSize: '1.8rem', marginBottom: '15px', color: 'var(--text-primary)' }}>Numerology</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.6', flexGrow: 1 }}>Decode the cosmic blueprint hidden in your numbers. Gain absolute clarity on your life path, career timing, and personal relationships.</p>
              <div className="premium-service-cta">Explore Numerology <span className="arrow">→</span></div>
            </Link>

            <Link className="premium-service-card" to="/services/vaastu" style={{ textDecoration: 'none' }}>
              <div className="premium-service-icon" style={{ background: 'var(--color-pista)' }}>
                <span style={{ fontSize: '2rem' }}>⌂</span>
              </div>
              <h3 style={{ fontSize: '1.8rem', marginBottom: '15px', color: 'var(--text-primary)' }}>Vaastu Shastra</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.6', flexGrow: 1 }}>Harmonize your living and working spaces. We optimize the flow of natural energy to attract abundance, health, and profound peace.</p>
              <div className="premium-service-cta">Explore Vaastu <span className="arrow">→</span></div>
            </Link>

            <Link className="premium-service-card" to="/services/crystal-healing" style={{ textDecoration: 'none' }}>
              <div className="premium-service-icon" style={{ background: 'var(--color-light-peach)' }}>
                <span style={{ fontSize: '2rem' }}>◇</span>
              </div>
              <h3 style={{ fontSize: '1.8rem', marginBottom: '15px', color: 'var(--text-primary)' }}>Crystal Healing</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.6', flexGrow: 1 }}>Restore your internal vibration. Cleanse your aura and balance your chakras using the ancient, stable frequencies of natural Earth crystals.</p>
              <div className="premium-service-cta">Explore Crystal Healing <span className="arrow">→</span></div>
            </Link>

          </div>
          
          <div style={{ textAlign: 'center', marginTop: '80px' }}>
            <Link className="btn btn-primary" to="/services" style={{ padding: '16px 40px', fontSize: '1.1rem' }}>View All Consultations</Link>
          </div>
        </div>
      </section>
      
      {/* Contact Band */}
      <section style={{ padding: '0 24px', maxWidth: '1200px', margin: '0 auto' }}>
        <div className="contact-band" style={{ borderBottom: 'none' }}>
          <div>
            <div className="eyebrow">Open channel</div>
            <h2>Let’s make the next dimension tangible.</h2>
            <p>Bring us the question you are still shaping. We will bring a sharper way to see it.</p>
          </div>
          <a className="btn btn-primary" href="mailto:hello@srione.com">Contact SRIONE</a>
        </div>
      </section>
    </>
  );
}
