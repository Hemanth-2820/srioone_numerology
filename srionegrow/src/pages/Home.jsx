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
          <div className="eyebrow">Intelligence, reimagined</div>
          <h1>SRIONE<br /><span className="hero-highlight">Beyond <span className="highlight-yellow">Calculation</span></span></h1>
          <p className="hero-copy">We build intelligent systems for ideas that do not fit inside ordinary limits. Enter a new dimension of strategy, technology and human possibility.</p>
          <div className="hero-actions">
            <Link className="btn btn-primary" to="/shop">Explore collection</Link>
            <Link className="btn" to="/services">Our services</Link>
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
      <section style={{ background: 'var(--gradient-card)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ padding: '100px 24px', maxWidth: '1200px', margin: '0 auto' }}>
          <div className="section-heading" style={{ textAlign: 'center', marginBottom: '60px' }}>
            <div className="eyebrow" style={{ justifyContent: 'center' }}>What we make</div>
            <h2 style={{ color: 'var(--text-primary)', fontSize: '2.5rem', marginBottom: '16px' }}>Expertise & Practices.</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Focused services for brands and teams navigating a world that is changing shape.</p>
          </div>
          
          <div className="services-grid">
            <Link className="glass-card service-card service-link service-numerology" to="/services/numerology" style={{ textDecoration: 'none' }}>
              <div className="service-mark">∞</div>
              <h3>Numerology</h3>
              <p>Explore the patterns and meanings held in numbers to bring clarity to your path.</p>
              <span className="service-cta">Explore service <span aria-hidden="true">↗</span></span>
            </Link>
            <Link className="glass-card service-card service-link service-vaastu" to="/services/vaastu" style={{ textDecoration: 'none' }}>
              <div className="service-mark">⌂</div>
              <h3>Vaastu</h3>
              <p>Shape balanced spaces that support harmony, intention and positive energy.</p>
              <span className="service-cta">Explore service <span aria-hidden="true">↗</span></span>
            </Link>
            <Link className="glass-card service-card service-link service-crystal" to="/services/crystal-healing" style={{ textDecoration: 'none' }}>
              <div className="service-mark">◇</div>
              <h3>Crystal Healing</h3>
              <p>Reconnect with calm, focus and grounded energy through intentional crystal work.</p>
              <span className="service-cta">Explore service <span aria-hidden="true">↗</span></span>
            </Link>
          </div>
          <div style={{ textAlign: 'center', marginTop: '60px' }}>
            <Link className="btn btn-primary" to="/services">Explore All Services</Link>
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
