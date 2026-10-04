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
          <h1>Read the <span>pattern.</span></h1>
          <p className="lead">Numerology offers a reflective way to explore the meaning and rhythm held in your numbers, helping you approach decisions with greater clarity.</p>
        </section>
        <section className="service-content">
          <article className="panel">
            <h2>What we explore</h2>
            <p>A personal session uses your details as a starting point for an intentional conversation about direction, timing and the themes shaping your next chapter.</p>
            <ul>
              <li>Life path and personal number insights</li>
              <li>Support for decisions and new beginnings</li>
              <li>A clear, personal interpretation of your numbers</li>
            </ul>
          </article>
          <aside className="panel consultation">
            <div className="eyebrow">Begin your session</div>
            <h2>Book a Numerology consultation.</h2>
            <p>Connect with SRIONE on WhatsApp to discuss your session.</p>
            <a className="whatsapp-button" href="https://wa.me/919705131915?text=Hello%20SRIONE%2C%20I%20would%20like%20to%20book%20a%20Numerology%20consultation." target="_blank" rel="noopener noreferrer">Book Consultation</a>
          </aside>
        </section>
      </main>
    </div>
  );
}
