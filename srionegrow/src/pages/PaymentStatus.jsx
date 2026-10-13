import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { API_URL } from '../config';

export default function PaymentStatus() {
  const [searchParams] = useSearchParams();
  const [status, setStatus]   = useState('verifying'); // verifying | success | failed | pending
  const [amount, setAmount]   = useState(0);
  const [orderId, setOrderId] = useState(null);
  const [error, setError]     = useState('');

  const orderId_  = searchParams.get('orderId');
  const mid       = searchParams.get('mid');

  useEffect(() => {
    if (!orderId_ || !mid) {
      setStatus('failed');
      setError('Missing payment information. Please contact support.');
      return;
    }

    setOrderId(orderId_);

    // Verify payment with backend
    fetch(`${API_URL}/phonepe_verify.php?orderId=${orderId_}&mid=${encodeURIComponent(mid)}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setAmount(data.amount || 0);
          if (data.ppState === 'COMPLETED') {
            setStatus('success');
          } else if (data.ppState === 'FAILED' || data.ppState === 'EXPIRED') {
            setStatus('failed');
          } else {
            setStatus('pending');
          }
        } else {
          setStatus('failed');
          setError(data.message || 'Could not verify payment.');
        }
      })
      .catch(() => {
        setStatus('failed');
        setError('Network error during payment verification.');
      });
  }, []);

  const states = {
    verifying: {
      icon: '⏳',
      color: 'var(--color-gold-highlight)',
      title: 'Verifying Payment...',
      subtitle: 'Please wait while we confirm your payment with PhonePe.',
      showSpinner: true,
    },
    success: {
      icon: '✅',
      color: '#4caf50',
      title: 'Payment Successful!',
      subtitle: `Your payment of ₹${amount.toFixed ? amount.toFixed(2) : amount} was confirmed. We are now processing your order.`,
      showSpinner: false,
    },
    failed: {
      icon: '❌',
      color: '#e53935',
      title: 'Payment Failed',
      subtitle: error || 'Your payment could not be processed. Please try again or contact support.',
      showSpinner: false,
    },
    pending: {
      icon: '🕐',
      color: 'var(--color-saffron)',
      title: 'Payment Pending',
      subtitle: 'Your payment is being processed. We will update your order once confirmed.',
      showSpinner: false,
    },
  };

  const s = states[status] || states.verifying;

  return (
    <section style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-card)',
        padding: '60px 48px',
        maxWidth: '520px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      }}>

        {/* Icon */}
        <div style={{
          fontSize: '4rem',
          marginBottom: '24px',
          animation: status === 'success' ? 'pop 0.4s ease' : 'none'
        }}>
          {s.icon}
        </div>

        {/* Spinner for verifying */}
        {s.showSpinner && (
          <div style={{
            width: '48px', height: '48px',
            border: '4px solid rgba(255,255,255,0.1)',
            borderTop: `4px solid ${s.color}`,
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 28px',
          }} />
        )}

        <h2 style={{ color: s.color, marginBottom: '16px', fontSize: '2rem' }}>{s.title}</h2>

        {orderId && status !== 'verifying' && (
          <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '10px 20px', display: 'inline-block', marginBottom: '16px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Order ID: <strong style={{ color: 'var(--text-primary)' }}>#SRIONE{orderId}</strong>
          </div>
        )}

        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '36px', fontSize: '1.05rem' }}>
          {s.subtitle}
        </p>

        {/* Action Buttons */}
        {status !== 'verifying' && (
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {status === 'success' && (
              <>
                <Link to="/profile" className="btn btn-primary">View My Orders</Link>
                <Link to="/shop" className="btn" style={{ color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}>Continue Shopping</Link>
              </>
            )}
            {(status === 'failed' || status === 'pending') && (
              <>
                <Link to="/checkout" className="btn btn-primary">Try Again</Link>
                <Link to="/contact" className="btn" style={{ color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}>Contact Support</Link>
              </>
            )}
          </div>
        )}

        {/* Trust note */}
        <p style={{ marginTop: '32px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          🔒 All transactions are secured & encrypted by PhonePe
        </p>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pop {
          0%   { transform: scale(0.5); opacity: 0; }
          70%  { transform: scale(1.2); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </section>
  );
}
