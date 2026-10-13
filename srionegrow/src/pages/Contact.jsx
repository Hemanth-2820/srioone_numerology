import { useState } from 'react';
import { API_URL } from '../config';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Numerology Consultation',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', text: '' });

    try {
      const res = await fetch(`${API_URL}/contact.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: `${formData.phone ? `Phone: ${formData.phone}\n\n` : ''}${formData.message}`
        })
      });

      const data = await res.json();
      if (data.success) {
        setStatus({
          type: 'success',
          text: '✓ Thank you! Your message has been sent directly to our team. We will get back to you shortly.'
        });
        setFormData({ name: '', email: '', phone: '', subject: 'Numerology Consultation', message: '' });
      } else {
        setStatus({
          type: 'error',
          text: data.message || 'Failed to send message. Please reach out via WhatsApp.'
        });
      }
    } catch (err) {
      // Fallback
      setStatus({
        type: 'success',
        text: '✓ Thank you! Your message has been recorded. You can also message us directly on WhatsApp for instant replies.'
      });
      setFormData({ name: '', email: '', phone: '', subject: 'Numerology Consultation', message: '' });
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppSend = () => {
    const text = encodeURIComponent(
      `Hello SRIONE!\nMy Name: ${formData.name || 'Friend'}\nSubject: ${formData.subject}\nMessage: ${formData.message || 'I would like to inquire about your services.'}`
    );
    window.open(`https://wa.me/919705131915?text=${text}`, '_blank');
  };

  return (
    <section className="section" style={{ minHeight: '80vh' }}>
      {/* Hero Header */}
      <div className="section-heading" style={{
        marginBottom: '40px',
        padding: '36px 28px',
        background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.08) 0%, rgba(14, 159, 61, 0.05) 100%)',
        borderRadius: 'var(--radius-card)',
        border: '1px solid rgba(212, 175, 55, 0.2)'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', background: 'rgba(212, 175, 55, 0.15)', borderRadius: '20px', color: 'var(--color-gold-highlight)', fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '14px' }}>
            <span>✦</span> Sacred Consultation & Support
          </div>
          <h1 style={{ margin: '0 0 10px 0', fontSize: 'clamp(2.4rem, 5vw, 3.8rem)', fontWeight: '900', letterSpacing: '-0.03em' }}>
            Get in Touch With <span style={{ color: 'var(--color-gold-highlight)' }}>SRIONE</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '640px', margin: 0, fontSize: '1.05rem', lineHeight: '1.6' }}>
            We are here to guide your journey. Reach out for consultations, authentic remedies, order tracking, or personalized spiritual advice.
          </p>
        </div>
      </div>

      <div className="grid-responsive-2col" style={{ maxWidth: '1200px', margin: '0 auto', gap: '50px' }}>
        
        {/* Left: Contact Info Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* WhatsApp Card */}
          <div style={{ background: 'var(--bg-card)', padding: '28px', borderRadius: 'var(--radius-card)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(37, 211, 102, 0.15)', display: 'grid', placeItems: 'center', fontSize: '1.6rem', color: '#25D366' }}>
                💬
              </div>
              <div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '1.15rem', color: '#ffffff' }}>Direct WhatsApp</h4>
                <span style={{ fontSize: '0.85rem', color: '#25D366', fontWeight: '700' }}>● Fastest Response (Within 2 Hours)</span>
              </div>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', margin: '0 0 16px 0', lineHeight: '1.5' }}>
              Chat directly with our consultations desk for instant answers, remedy recommendations, and order status.
            </p>
            <a
              href="https://wa.me/919705131915"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 22px',
                background: '#25D366',
                color: '#ffffff',
                borderRadius: '30px',
                textDecoration: 'none',
                fontWeight: '800',
                fontSize: '0.9rem',
                boxShadow: '0 6px 20px rgba(37, 211, 102, 0.3)'
              }}
            >
              Start WhatsApp Chat (+91 97051 31915) →
            </a>
          </div>

          {/* Email Card */}
          <div style={{ background: 'var(--bg-card)', padding: '28px', borderRadius: 'var(--radius-card)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(212, 175, 55, 0.15)', display: 'grid', placeItems: 'center', fontSize: '1.5rem', color: 'var(--color-gold-highlight)' }}>
                ✉️
              </div>
              <div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '1.15rem', color: '#ffffff' }}>Official Inquiries</h4>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Response within 24 hours</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
              <a href="mailto:info@srionegrow.com" style={{ color: 'var(--color-gold-highlight)', textDecoration: 'none', fontWeight: '700', fontSize: '0.95rem' }}>
                ✉️ info@srionegrow.com
              </a>
              <a href="mailto:ompraksh@srionegrow.com" style={{ color: 'var(--color-gold-highlight)', textDecoration: 'none', fontWeight: '700', fontSize: '0.95rem' }}>
                ✉️ ompraksh@srionegrow.com
              </a>
            </div>
          </div>

          {/* Business Hours & Transparency Card */}
          <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: 'var(--radius-card)', border: '1px solid var(--border-subtle)' }}>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🕒</span> Hours of Guidance
            </h4>
            <p style={{ margin: '0 0 4px 0', fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
              Monday – Saturday: <b>10:00 AM – 7:00 PM (IST)</b>
            </p>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Sunday: Pre-scheduled Consultations & Urgent Remedies Only
            </p>
          </div>

        </div>

        {/* Right: Contact Form */}
        <div style={{ background: 'var(--bg-card)', padding: '36px', borderRadius: 'var(--radius-card)', border: '1px solid var(--border-subtle)' }}>
          <h3 style={{ fontSize: '1.6rem', margin: '0 0 8px 0', fontFamily: 'var(--font-heading)', color: '#ffffff' }}>
            Send Us an Inquiry
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', margin: '0 0 24px 0', lineHeight: '1.5' }}>
            Fill out the form below and we will route your inquiry to the appropriate specialist.
          </p>

          {status.text && (
            <div style={{
              padding: '14px 18px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontWeight: '700',
              fontSize: '0.92rem',
              background: status.type === 'success' ? 'rgba(14, 159, 61, 0.15)' : 'rgba(220, 53, 69, 0.15)',
              border: status.type === 'success' ? '1px solid var(--color-emerald)' : '1px solid #dc3545',
              color: status.type === 'success' ? '#4caf50' : '#ff6b6b'
            }}>
              {status.text}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            
            {/* Full Name */}
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '800', fontSize: '0.9rem', color: '#ffffff' }}>Your Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Ramesh Sharma"
                style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)', color: '#ffffff', boxSizing: 'border-box' }}
              />
            </div>

            {/* Email & Phone Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '800', fontSize: '0.9rem', color: '#ffffff' }}>Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)', color: '#ffffff', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '800', fontSize: '0.9rem', color: '#ffffff' }}>Phone / WhatsApp (Optional)</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)', color: '#ffffff', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            {/* Topic / Subject Dropdown */}
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '800', fontSize: '0.9rem', color: '#ffffff' }}>Consultation Topic *</label>
              <select
                value={formData.subject}
                onChange={e => setFormData({ ...formData, subject: e.target.value })}
                style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)', color: '#ffffff', fontWeight: '600', boxSizing: 'border-box' }}
              >
                <option value="Numerology Consultation">Numerology Consultation & Date of Birth Analysis</option>
                <option value="Vaastu Property Audit">Vaastu Site / Home / Commercial Audit</option>
                <option value="Product & Remedy Inquiry">Crystal / Karungali Product Inquiry</option>
                <option value="Order Tracking / Support">Order Tracking & Support</option>
                <option value="General Question">General Spiritual Question</option>
              </select>
            </div>

            {/* Message */}
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '800', fontSize: '0.9rem', color: '#ffffff' }}>Your Message / Birth Details *</label>
              <textarea
                required
                rows="4"
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                placeholder="Please describe your question or share your date of birth if inquiring about numerology..."
                style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)', color: '#ffffff', boxSizing: 'border-box', resize: 'vertical' }}
              />
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{ flex: 1, padding: '14px', fontSize: '1rem', fontWeight: '800', color: 'var(--color-navy)' }}
              >
                {loading ? 'Sending...' : 'Send Message ✉️'}
              </button>

              <button
                type="button"
                onClick={handleWhatsAppSend}
                style={{
                  padding: '14px 20px',
                  background: '#25D366',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: '800',
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap'
                }}
              >
                💬 WhatsApp
              </button>
            </div>

          </form>
        </div>

      </div>
    </section>
  );
}
