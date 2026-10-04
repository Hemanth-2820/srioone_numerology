import { Link } from 'react-router-dom';
import '../service.css';

export default function Vaastu() {
  return (
    <div className="service-page service-vaastu">
      <header className="service-header">
        <Link className="back-link" to="/services">← Back to services</Link>
      </header>
      <main>
        <section className="service-hero">
          <div className="eyebrow">SRIONE / Vaastu</div>
          <h1>Harmonize Your <span>Space.</span></h1>
          <p className="lead">Vaastu Shastra is the traditional Indian system of architecture. It integrates nature, cosmic energy, and your physical environment to create living and working spaces that naturally promote health, wealth, and profound peace.</p>
        </section>
        <section className="service-content">
          <article className="panel">
            <h2>The Architecture of Well-being</h2>
            <p>Your environment deeply impacts your internal state. When a home or office is out of alignment with natural laws, it can cause invisible friction in your daily life. Our SRIONE Vaastu consultations analyze your spatial layouts to identify blockages and recommend harmonious adjustments.</p>
            
            <h3 style={{ marginTop: '30px', marginBottom: '15px', fontFamily: 'var(--font-heading)' }}>Our Vaastu Analysis Includes:</h3>
            <ul>
              <li><strong>Directional Alignment:</strong> Ensuring the five elements (Earth, Water, Fire, Air, Space) are perfectly balanced in your floor plan.</li>
              <li><strong>Energy Flow Optimization:</strong> Removing clutter and structural blockages to allow prana (life force) to flow freely.</li>
              <li><strong>Remedial Solutions:</strong> We offer simple, practical, and non-destructive remedies (using crystals, colors, and placement) to correct existing Vaastu doshas.</li>
              <li><strong>Workspace Success:</strong> Specific adjustments for offices and shops to attract prosperity and positive client interactions.</li>
            </ul>
            <p>Experience the profound shift when your external environment supports your internal goals. A Vaastu-compliant space is a magnet for abundance and joy.</p>
          </article>
          <aside className="panel consultation" style={{ background: 'var(--color-pista)' }}>
            <div className="eyebrow" style={{ color: '#111' }}>Elevate Your Space</div>
            <h2>Book a Vaastu Consultation.</h2>
            <p style={{ color: '#111' }}>Ready to align your home or office with the flow of nature? Connect with SRIONE on WhatsApp to schedule your comprehensive Vaastu review.</p>
            <a className="whatsapp-button" href="https://wa.me/919705131915?text=Hello%20SRIONE%2C%20I%20would%20like%20to%20book%20a%20Vaastu%20consultation." target="_blank" rel="noopener noreferrer">Message on WhatsApp</a>
          </aside>
        </section>
      </main>
    </div>
  );
}
