import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { cartCount } = useCart();

  return (
    <header className="topbar">
      <nav className="nav-wrap" aria-label="Main navigation">
        <Link className="brand" to="/">
          <img src="/srionegrow_logo.png" alt="SRIONE logo" />
          <span>SRIONE</span>
        </Link>
        <div className="nav-search" aria-label="Search products">
          <label className="search-field-wrap" aria-label="Search category">
            <select className="search-category" aria-label="Select category">
              <option value="all">All</option>
              <option value="stones">Stones</option>
              <option value="bracelets">Bracelets</option>
            </select>
          </label>
          <div className="nav-search-main">
            <input type="text" className="nav-search-input" placeholder="Search..." aria-label="Search products" />
          </div>
          <button className="nav-search-btn" type="button" aria-label="Search">⌕</button>
        </div>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/shop">Shop</Link>
          <Link to="/services">Services</Link>
          <Link to="/contact">Contact</Link>
        </div>
        <div className="nav-actions">
          <Link className="cart-btn" to="/cart">🛒 Cart <span className="cart-badge">{cartCount}</span></Link>
          <Link className="btn btn-primary" to="/auth">Sign In / Sign Up</Link>
        </div>
      </nav>
    </header>
  );
}
