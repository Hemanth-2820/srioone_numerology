import { Link } from 'react-router-dom';
import '../service.css';

export default function CrystalHealing() {
  return (
    <div className="service-page service-crystal">
      <header className="service-header">
        <Link className="back-link" to="/services">← Back to services</Link>
      </header>
      <main>
        <section className="service-hero">
          <div className="eyebrow">SRIONE / Crystal Healing</div>
          <h1>Find your <span>frequency.</span></h1>
          <p className="lead">Crystal healing is a mindful practice of working with stones, attention and intention to create a calmer, more grounded space for reflection.</p>
        </section>
        <section className="service-content">
          <article className="panel">
            <h2>What we explore</h2>
            <p>Your session is shaped around your intention, with thoughtful guidance on crystals and rituals that can support your personal practice.</p>
            <ul>
              <li>Intention-led crystal selection</li>
              <li>Grounding and energy-focused practices</li>
              <li>Guidance for building a personal ritual</li>
            </ul>
          </article>
          <aside className="panel consultation">
            <div className="eyebrow">Begin your session</div>
            <h2>Book a Crystal Healing consultation.</h2>
            <p>Connect with SRIONE on WhatsApp to discuss your session.</p>
            <a className="whatsapp-button" href="https://wa.me/919705131915?text=Hello%20SRIONE%2C%20I%20would%20like%20to%20book%20a%20Crystal%20Healing%20consultation." target="_blank" rel="noopener noreferrer">Book Consultation</a>
          </aside>
        </section>
      </main>
    </div>
  );
}
