import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Services from './pages/Services';
import Numerology from './pages/Numerology';
import Vaastu from './pages/Vaastu';
import CrystalHealing from './pages/CrystalHealing';
import Contact from './pages/Contact';
import Auth from './pages/Auth';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Admin from './pages/Admin';
import Profile from './pages/Profile';

import { CartProvider } from './context/CartContext';

function App() {
  return (
    <CartProvider>
      <Router>
      <div className="site-shell">
        <Navbar />
        <main id="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/shop/:id" element={<ProductDetail />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/numerology" element={<Numerology />} />
            <Route path="/services/vaastu" element={<Vaastu />} />
            <Route path="/services/crystal-balancing" element={<CrystalHealing />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
        <Footer />
      </div>
      </Router>
    </CartProvider>
  );
}

export default App;
