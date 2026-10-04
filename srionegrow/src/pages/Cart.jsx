import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();

  return (
    <section className="section" style={{ minHeight: '60vh' }}>
      <div className="section-heading" style={{ marginBottom: '30px' }}>
        <h2>Your Cart</h2>
      </div>

      {cart.length === 0 ? (
        <div className="empty">
          <p>Your cart is currently empty.</p>
          <Link to="/shop" className="btn btn-primary" style={{ marginTop: '20px' }}>Browse Shop</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: '1fr 350px' }}>
          <div>
            {cart.map(item => (
              <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '20px', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', marginBottom: '16px', background: 'var(--bg-card)' }}>
                <div style={{ width: '80px', height: '80px', background: 'var(--color-pista)', borderRadius: '8px', display: 'grid', placeItems: 'center', fontSize: '2rem' }}>
                   {item.image ? <img src={`/${item.image}`} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} /> : item.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 8px 0' }}>{item.name}</h3>
                  <div className="price" style={{ fontSize: '0.9rem', padding: '2px 8px' }}>{item.price}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button type="button" className="filter" style={{ padding: '4px 10px' }} onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                  <span style={{ fontWeight: '800' }}>{item.quantity}</span>
                  <button type="button" className="filter" style={{ padding: '4px 10px' }} onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                </div>
                <button type="button" style={{ background: 'transparent', border: 'none', color: '#ff4444', fontWeight: '800', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => removeFromCart(item.id)}>Remove</button>
              </div>
            ))}
          </div>
          
          <div style={{ padding: '24px', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-card)', background: 'var(--bg-secondary)', alignSelf: 'start' }}>
            <h3 style={{ marginTop: 0 }}>Order Summary</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontWeight: '800', fontSize: '1.2rem' }}>
              <span>Total:</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <Link to="/checkout" className="btn btn-primary" style={{ display: 'block', textAlign: 'center', width: '100%' }}>Proceed to Checkout</Link>
          </div>
        </div>
      )}
    </section>
  );
}
