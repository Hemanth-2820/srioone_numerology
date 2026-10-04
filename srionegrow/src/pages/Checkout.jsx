import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function Checkout() {
  const { cartTotal, clearCart } = useCart();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    postalCode: ''
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await loadRazorpayScript();

    if (!res) {
      alert('Razorpay SDK failed to load. Are you online?');
      setLoading(false);
      return;
    }

    // Razorpay amount is in sub-units (paise/cents). Assuming INR for this demo.
    const amountInSubUnits = Math.round(cartTotal * 100);

    const options = {
      key: 'rzp_test_RsIb2qtwvvKvbV', // Test Key ID provided
      amount: amountInSubUnits,
      currency: 'INR',
      name: 'SRIONE',
      description: 'Order Payment',
      image: '/srionegrow_logo.png', // Optional logo
      handler: function (response) {
        // Payment successful
        console.log('Payment ID:', response.razorpay_payment_id);
        clearCart();
        setSubmitted(true);
        setLoading(false);
      },
      prefill: {
        name: formData.name,
        email: formData.email,
        contact: '9999999999' // Demo contact
      },
      notes: {
        address: `${formData.address}, ${formData.city}, ${formData.postalCode}`
      },
      theme: {
        color: '#FF9933' // Saffron color to match the brand
      }
    };

    const paymentObject = new window.Razorpay(options);
    
    paymentObject.on('payment.failed', function (response){
        alert(`Payment failed: ${response.error.description}`);
        setLoading(false);
    });

    paymentObject.open();
  };

  if (submitted) {
    return (
      <section className="section" style={{ minHeight: '60vh', textAlign: 'center', paddingTop: '150px' }}>
        <h2>Payment Successful!</h2>
        <p style={{ maxWidth: '400px', margin: '20px auto', color: 'var(--text-secondary)' }}>Thank you for your purchase. Your payment was securely processed via Razorpay. We will send a confirmation email shortly.</p>
        <Link to="/shop" className="btn btn-primary">Return to Shop</Link>
      </section>
    );
  }

  return (
    <section className="section" style={{ minHeight: '60vh' }}>
      <div className="section-heading" style={{ marginBottom: '30px' }}>
        <h2>Checkout</h2>
      </div>

      <div style={{ display: 'grid', gap: '30px', gridTemplateColumns: '1fr 350px' }}>
        <form onSubmit={handlePayment} style={{ background: 'var(--bg-card)', padding: '30px', borderRadius: 'var(--radius-card)', border: '1px solid var(--border-subtle)' }}>
          <h3>Shipping & Billing</h3>
          
          <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: '1fr 1fr', marginTop: '20px' }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '800' }}>Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)' }} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '800' }}>Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)' }} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '800' }}>Address</label>
              <input type="text" name="address" value={formData.address} onChange={handleInputChange} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '800' }}>City</label>
              <input type="text" name="city" value={formData.city} onChange={handleInputChange} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '800' }}>Postal Code</label>
              <input type="text" name="postalCode" value={formData.postalCode} onChange={handleInputChange} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)' }} />
            </div>
          </div>
          
          <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', marginTop: '30px', padding: '16px' }}>
            {loading ? 'Initiating Secure Payment...' : `Pay Securely via Razorpay (₹${cartTotal.toFixed(2)})`}
          </button>
          
          <p style={{ textAlign: 'center', marginTop: '14px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Payments are secured by Razorpay
          </p>
        </form>

        <div style={{ padding: '24px', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-card)', background: 'var(--bg-secondary)', alignSelf: 'start' }}>
           <h3 style={{ marginTop: 0 }}>Summary</h3>
           <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
             <span>Subtotal</span>
             <span>₹{cartTotal.toFixed(2)}</span>
           </div>
           <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid var(--border-subtle)' }}>
             <span>Shipping</span>
             <span>Free</span>
           </div>
           <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '900', fontSize: '1.2rem' }}>
             <span>Total</span>
             <span>₹{cartTotal.toFixed(2)}</span>
           </div>
        </div>
      </div>
    </section>
  );
}
