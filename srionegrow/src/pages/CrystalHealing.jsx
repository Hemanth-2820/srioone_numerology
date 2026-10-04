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
          <h1>Restore Your <span>Vibration.</span></h1>
          <p className="lead">Crystal healing is a profound energetic therapy. By harnessing the stable, pure frequencies of Earth’s natural crystals, we can unblock your chakras, cleanse your aura, and restore your mind and body to a state of radiant health.</p>
        </section>
        <section className="service-content">
          <article className="panel">
            <h2>The Power of Natural Resonance</h2>
            <p>In our modern, high-stress world, our personal energy fields can easily become depleted or chaotic. Crystals, formed over millions of years, hold incredibly stable electromagnetic fields. When brought into our aura, they act as tuning forks, entraining our own vibration back to a state of harmony.</p>
            
            <h3 style={{ marginTop: '30px', marginBottom: '15px', fontFamily: 'var(--font-heading)' }}>What to Expect in a Session:</h3>
            <ul>
              <li><strong>Chakra Balancing:</strong> Strategic placement of specific stones (like Amethyst, Citrine, and Rose Quartz) on your body's energy centers to clear blockages.</li>
              <li><strong>Aura Cleansing:</strong> Sweeping away stagnant or negative energy accumulated from daily stress and interactions.</li>
              <li><strong>Deep Relaxation:</strong> A meditative, soothing experience that calms the nervous system and promotes cellular repair.</li>
              <li><strong>Personalized Crystal Prescriptions:</strong> Recommendations on which SRIONE crystal bracelets or stones you should wear daily to maintain your alignment.</li>
            </ul>
            <p>Healing begins the moment your energy shifts. Allow the ancient wisdom of crystals to ground, protect, and elevate your spirit.</p>
          </article>
          <aside className="panel consultation" style={{ background: 'var(--color-light-peach)' }}>
            <div className="eyebrow" style={{ color: '#111' }}>Awaken Your Energy</div>
            <h2>Book a Crystal Healing Session.</h2>
            <p style={{ color: '#111' }}>Experience the deeply restorative power of crystalline energy. Connect with SRIONE on WhatsApp to book your personalized healing session.</p>
            <a className="whatsapp-button" href="https://wa.me/919705131915?text=Hello%20SRIONE%2C%20I%20would%20like%20to%20book%20a%20Crystal%20Healing%20session." target="_blank" rel="noopener noreferrer">Message on WhatsApp</a>
          </aside>
        </section>
      </main>
    </div>
  );
}
