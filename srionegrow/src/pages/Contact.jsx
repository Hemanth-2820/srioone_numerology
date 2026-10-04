import { useState } from 'react';

export default function Contact() {
  const [status, setStatus] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('Message sent successfully! We will get back to you shortly.');
    e.target.reset();
  };

  return (
    <section className="section" style={{ minHeight: '80vh' }}>
      <div className="section-heading" style={{ marginBottom: '50px', textAlign: 'center' }}>
        <h2 style={{ margin: '0 auto' }}>Let's Connect</h2>
        <p style={{ margin: '20px auto 0' }}>We are here to guide you on your journey. Reach out for consultations, product inquiries, or just to say hello.</p>
      </div>

      <div className="grid-responsive-2col" style={{ maxWidth: '1200px', margin: '0 auto', gap: '80px' }}>
        
        {/* Contact Info Panel */}
        <div style={{ background: 'var(--gradient-card)', padding: '50px', borderRadius: 'var(--radius-card)', border: '1px solid var(--border-subtle)' }}>
          <h3 style={{ fontSize: '2rem', marginBottom: '30px', fontFamily: 'var(--font-heading)' }}>Reach Out Directly</h3>
          
          <div style={{ marginBottom: '30px' }}>
            <h4 style={{ fontSize: '1.2rem', marginBottom: '10px', color: '#111' }}>Email Us</h4>
            <p style={{ margin: 0, fontSize: '1.1rem' }}><a href="mailto:info@srionegrow.com" style={{ color: 'var(--color-saffron)', fontWeight: '700' }}>info@srionegrow.com</a></p>
            <p style={{ margin: 0, fontSize: '1.1rem' }}><a href="mailto:ompraksh@srionegrow.com" style={{ color: 'var(--color-saffron)', fontWeight: '700' }}>ompraksh@srionegrow.com</a></p>
          </div>

          <div style={{ marginBottom: '30px' }}>
            <h4 style={{ fontSize: '1.2rem', marginBottom: '10px', color: '#111' }}>Call or WhatsApp</h4>
            <p style={{ margin: 0, fontSize: '1.1rem' }}>
              <a href="https://wa.me/919705131915" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', padding: '10px 20px', background: '#111', color: 'var(--color-saffron)', borderRadius: '30px', fontWeight: '800', marginTop: '10px' }}>
                +91 97051 31915
              </a>
            </p>
          </div>
          
          <div>
            <h4 style={{ fontSize: '1.2rem', marginBottom: '10px', color: '#111' }}>Business Hours</h4>
            <p style={{ margin: 0, fontSize: '1.1rem' }}>Monday - Saturday</p>
            <p style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-secondary)' }}>10:00 AM - 7:00 PM (IST)</p>
          </div>
        </div>

        {/* Contact Form */}
        <div>
          <h3 style={{ fontSize: '2rem', marginBottom: '30px', fontFamily: 'var(--font-heading)' }}>Send a Message</h3>
          {status && <div style={{ padding: '15px', background: 'var(--color-pista)', color: '#111', borderRadius: '8px', marginBottom: '20px', fontWeight: '600' }}>{status}</div>}
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: '700', fontSize: '1.1rem' }}>Your Name</label>
              <input type="text" required style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-subtle)', background: 'transparent', fontSize: '1.1rem' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: '700', fontSize: '1.1rem' }}>Email Address</label>
              <input type="email" required style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-subtle)', background: 'transparent', fontSize: '1.1rem' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: '700', fontSize: '1.1rem' }}>How can we help?</label>
              <textarea required rows="6" style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-subtle)', background: 'transparent', fontSize: '1.1rem', resize: 'vertical' }}></textarea>
            </div>
            <button type="submit" className="btn btn-primary" style={{ padding: '20px', fontSize: '1.2rem' }}>Send Message</button>
          </form>
        </div>

      </div>
    </section>
  );
}
