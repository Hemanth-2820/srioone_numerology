import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <Link className="brand" to="/"><img src="/srionegrow_logo.png" alt="SRIONE logo" /><span>SRIONE</span></Link>
        <p>Beyond Calculation.</p>
      </div>
      <div className="footer-column">
        <h3>Explore</h3>
        <Link to="/">Home</Link>
        <Link to="/shop">Shop</Link>
        <Link to="/services">Services</Link>
      </div>
      <div className="footer-column">
        <h3>Contact</h3>
        <a href="mailto:hello@srione.com">hello@srione.com</a>
      </div>
      <div className="footer-bottom">
        <span>© 2026 SRIONE. All rights reserved.</span>
      </div>
    </footer>
  );
}
