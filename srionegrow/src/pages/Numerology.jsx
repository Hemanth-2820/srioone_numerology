import { Link } from 'react-router-dom';
import '../service.css';

export default function Numerology() {
  return (
    <div className="service-page service-numerology">
      <header className="service-header">
        <Link className="back-link" to="/services">← Back to services</Link>
      </header>
      <main>
        <section className="service-hero">
          <div className="eyebrow">SRIONE / Numerology</div>
          <h1>Unlock Your <span>Cosmic Blueprint.</span></h1>
          <p className="lead">Numerology is the ancient science of numbers. By analyzing the numbers hidden within your birth date and name, we decode the harmonious patterns shaping your life, empowering you to make decisions with absolute clarity and confidence.</p>
        </section>
        <section className="service-content">
          <article className="panel">
            <h2>Deep Dive into Your Numbers</h2>
            <p>Every number carries a unique vibrational frequency. A personal Numerology consultation at SRIONE is not just a reading; it is a profound journey into self-discovery. We use your details as a starting point for an intentional conversation about your true purpose, optimal timing, and the hidden themes of your upcoming life chapters.</p>
            
            <h3 style={{ marginTop: '30px', marginBottom: '15px', fontFamily: 'var(--font-heading)' }}>What We Explore Together:</h3>
            <ul>
              <li><strong>Life Path Number:</strong> Uncover the core mission you were born to fulfill.</li>
              <li><strong>Destiny & Expression:</strong> Learn how the world perceives you and how to communicate your truth.</li>
              <li><strong>Personal Year Cycles:</strong> Understand the current harmonious weather of your life to time major moves perfectly.</li>
              <li><strong>Name Correction Guidance:</strong> Align your name's vibration with success and harmony.</li>
            </ul>
            <p>Whether you are facing a crossroads in your career, seeking harmony in relationships, or simply wanting to understand yourself better, our Numerology sessions provide the actionable insights you need.</p>
          </article>
          <aside className="panel consultation" style={{ background: 'var(--color-lemon)' }}>
            <div className="eyebrow" style={{ color: '#111' }}>Transform Your Life</div>
            <h2>Book a Numerology Consultation.</h2>
            <p style={{ color: '#111' }}>Take the first step towards a life of clarity and purpose. Connect with SRIONE directly on WhatsApp to discuss your personalized session.</p>
            <a className="whatsapp-button" href="https://wa.me/919705131915?text=Hello%20SRIONE%2C%20I%20would%20like%20to%20book%20a%20Numerology%20consultation." target="_blank" rel="noopener noreferrer">Message on WhatsApp</a>
          </aside>
        </section>
      </main>
    </div>
  );
}
