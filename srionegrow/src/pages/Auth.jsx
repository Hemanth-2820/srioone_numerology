import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

export default function Auth() {
  const navigate = useNavigate();
  // 'signin', 'signup', 'forgot'
  const [view, setView] = useState('signin');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    const action = view === 'signin' ? 'login' : view === 'signup' ? 'register' : 'forgot_password';

    try {
      const res = await fetch(`${API_URL}/auth.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...formData })
      });
      const data = await res.json();
      
      if (data.success) {
        setMessage({ type: 'success', text: data.message || 'Success!' });
        if (action === 'login') {
          // Store user details in localStorage or context in real app
          localStorage.setItem('srione_user', JSON.stringify(data.user));
          setTimeout(() => navigate('/shop'), 1500);
        } else if (action === 'register') {
           setTimeout(() => setView('signin'), 3000);
        }
      } else {
        setMessage({ type: 'error', text: data.message || 'Something went wrong.' });
      }
    } catch (err) {
      console.log(err);
      // Fallback for local testing when PHP isn't running
      setMessage({ type: 'success', text: `Mock ${action} successful! (PHP backend not detected)` });
      if (action === 'login') setTimeout(() => navigate('/shop'), 1500);
    }
    
    setLoading(false);
  };

  return (
    <section className="section" style={{ minHeight: '80vh', display: 'grid', placeItems: 'center', background: 'var(--color-light-green)' }}>
      <div style={{ background: 'var(--bg-primary)', padding: '40px', borderRadius: 'var(--radius-card)', width: '100%', maxWidth: '450px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid var(--border-subtle)' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div className="eyebrow" style={{ justifyContent: 'center' }}>
            {view === 'signin' ? 'Welcome Back' : view === 'signup' ? 'Join Us' : 'Reset Password'}
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', margin: '10px 0' }}>
            {view === 'signin' ? 'Sign in.' : view === 'signup' ? 'Create Account.' : 'Forgot Password?'}
          </h1>
        </div>

        {message.text && (
          <div style={{ padding: '12px', marginBottom: '20px', borderRadius: '8px', background: message.type === 'success' ? 'var(--color-pista)' : '#FFB6B6', color: 'var(--text-primary)', fontWeight: '600', textAlign: 'center' }}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {view === 'signup' && (
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '800', fontSize: '0.9rem' }}>FULL NAME</label>
              <input type="text" name="name" required value={formData.name} onChange={handleChange} placeholder="John Doe" style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)', fontSize: '1rem' }} />
            </div>
          )}

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '800', fontSize: '0.9rem' }}>EMAIL ADDRESS</label>
            <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="you@example.com" style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)', fontSize: '1rem' }} />
          </div>

          {view !== 'forgot' && (
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '800', fontSize: '0.9rem' }}>PASSWORD</label>
              <input type="password" name="password" required value={formData.password} onChange={handleChange} placeholder="••••••••" style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)', fontSize: '1rem' }} />
            </div>
          )}

          <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '16px', marginTop: '10px', fontSize: '1.1rem' }}>
            {loading ? 'Processing...' : view === 'signin' ? 'Sign In' : view === 'signup' ? 'Create Account' : 'Send Reset Link'}
          </button>
        </form>

        <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'center', fontSize: '0.9rem', fontWeight: '600' }}>
          {view === 'signin' && (
            <>
              <button onClick={() => { setView('forgot'); setMessage({ type: '', text: '' }); }} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', textDecoration: 'underline' }}>Forgot your password?</button>
              <span style={{ color: 'var(--text-secondary)' }}>Don't have an account? <button onClick={() => { setView('signup'); setMessage({ type: '', text: '' }); }} style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', fontWeight: '800', textDecoration: 'underline' }}>Sign up</button></span>
            </>
          )}
          {view === 'signup' && (
            <span style={{ color: 'var(--text-secondary)' }}>Already have an account? <button onClick={() => { setView('signin'); setMessage({ type: '', text: '' }); }} style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', fontWeight: '800', textDecoration: 'underline' }}>Sign in</button></span>
          )}
          {view === 'forgot' && (
            <button onClick={() => { setView('signin'); setMessage({ type: '', text: '' }); }} style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', fontWeight: '800', textDecoration: 'underline' }}>← Back to Sign in</button>
          )}
        </div>
      </div>
    </section>
  );
}
