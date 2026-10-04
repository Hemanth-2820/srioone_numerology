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
          <h1>Bring space into <span>balance.</span></h1>
          <p className="lead">Vaastu consultation brings intention to the relationship between people and their spaces, helping you create environments that feel balanced, considered and supportive.</p>
        </section>
        <section className="service-content">
          <article className="panel">
            <h2>What we explore</h2>
            <p>We look at the way energy, movement and purpose meet inside a home, workspace or site, then translate that view into practical guidance.</p>
            <ul>
              <li>Space planning and directional guidance</li>
              <li>Home and workspace energy review</li>
              <li>Practical recommendations for balance</li>
            </ul>
          </article>
          <aside className="panel consultation">
            <div className="eyebrow">Begin your session</div>
            <h2>Book a Vaastu consultation.</h2>
            <p>Connect with SRIONE on WhatsApp to discuss your space.</p>
            <a className="whatsapp-button" href="https://wa.me/919705131915?text=Hello%20SRIONE%2C%20I%20would%20like%20to%20book%20a%20Vaastu%20consultation." target="_blank" rel="noopener noreferrer">Book Consultation</a>
          </aside>
        </section>
      </main>
    </div>
  );
}
