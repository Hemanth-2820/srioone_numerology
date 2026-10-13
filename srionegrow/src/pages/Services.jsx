import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '../config';

const defaultServices = [
  { id: 'numerology', name: 'Numerology', category: 'numerology', mark: '∞', desc: 'Explore cosmic patterns and numeric vibrations to bring profound clarity, alignment, and momentum to your life path.', class: 'service-numerology', link: '/services/numerology' },
  { id: 'vaastu', name: 'Vaastu', category: 'vaastu', mark: '⌂', desc: 'Harmonize living and workspace spatial orientations to remove negative stagnation and welcome abundance and tranquility.', class: 'service-vaastu', link: '/services/vaastu' },
  { id: 'crystal-balancing', name: 'Crystal Balancing', category: 'energy', mark: '◇', desc: 'Restore energetic equilibrium and inner calm through personalized crystal placement and vibrational harmonization.', class: 'service-crystal', link: '/services/crystal-balancing' },
  { id: 'aura-scanning', name: 'Aura Scanning', category: 'energy', mark: '✧', desc: 'Discover and analyze the subtle electromagnetic biofield surrounding you for deeper self-awareness and energetic vitality.', class: 'service-numerology', link: '/contact' },
  { id: 'numerology-report', name: 'Numerology Report', category: 'numerology', mark: '📄', desc: 'A comprehensive, personalized written analysis detailing your psychic root number, destiny timeline, and auspicious choices.', class: 'service-numerology', link: '/contact' },
  { id: 'vaastu-report', name: 'Vaastu Report', category: 'vaastu', mark: '📑', desc: 'A thorough spatial diagnostic blueprint identifying structural doshas with non-demolition remedial solutions for your property.', class: 'service-vaastu', link: '/contact' },
  { id: 'vaastu-consultation', name: 'Vaastu Consultation', category: 'vaastu', mark: '🗣', desc: 'One-on-one personalized consultation with an expert to resolve directional challenges for residences, plots, and offices.', class: 'service-vaastu', link: '/services/vaastu' },
  { id: 'vedic-numerology', name: 'Vedic Numerology', category: 'numerology', mark: '🕉', desc: 'Sacred numerical wisdom rooted in Vedic scripture to guide planetary alignment, career moves, and personal milestones.', class: 'service-numerology', link: '/contact' },
  { id: 'pronology', name: 'Pronology', category: 'numerology', mark: '🔤', desc: 'The science of phonetics and sound vibrations. Discover how the spoken pronunciation of your name influences life outcomes.', class: 'service-crystal', link: '/contact' },
  { id: 'business-numerology', name: 'Business Numerology', category: 'numerology', mark: '💼', desc: 'Strategic brand naming, logo color balance, and auspicious incorporation date analysis for commercial triumph.', class: 'service-numerology', link: '/contact' },
  { id: 'phone-numerology', name: 'Phone Numerology', category: 'numerology', mark: '📱', desc: 'Calculate and identify the most auspicious numerical frequency for your personal and commercial mobile numbers.', class: 'service-numerology', link: '/contact' },
  { id: 'aura-boosting', name: 'Aura Boosting', category: 'energy', mark: '✨', desc: 'Sacred techniques and remedial rituals to cleanse psychic heaviness, fortify your shield, and magnetize positivity.', class: 'service-crystal', link: '/contact' },
  { id: 'remedies', name: 'Remedies & Yantras', category: 'vaastu', mark: '🌿', desc: 'Customized consecrated remedies, energized copper yantras, and physical corrections for domestic and trade peace.', class: 'service-vaastu', link: '/contact' }
];

export default function Services() {
  const [services, setServices] = useState(defaultServices);
  const [selectedFilter, setSelectedFilter] = useState('all');

  useEffect(() => {
    fetch(`${API_URL}/services.php`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          const mappedData = data.map(s => {
            const nameLower = (s.name || '').toLowerCase();
            let cat = 'numerology';
            if (nameLower.includes('vaastu')) cat = 'vaastu';
            else if (nameLower.includes('aura') || nameLower.includes('crystal') || nameLower.includes('energy')) cat = 'energy';

            return {
              id: s.id,
              name: s.name,
              category: cat,
              mark: s.mark,
              desc: s.description,
              class: s.css_class,
              link: s.link,
              image: s.image_url
            };
          });
          setServices(mappedData);
        }
      })
      .catch(() => {});
  }, []);

  const filterTabs = [
    { id: 'all', label: 'All Services', icon: '✦' },
    { id: 'numerology', label: 'Numerology & Pronology', icon: '∞' },
    { id: 'vaastu', label: 'Vaastu Consultations', icon: '⌂' },
    { id: 'energy', label: 'Aura & Energy Balancing', icon: '✧' }
  ];

  const filteredServices = useMemo(() => {
    if (selectedFilter === 'all') return services;
    return services.filter(s => s.category === selectedFilter);
  }, [services, selectedFilter]);

  const getWhatsAppLink = (serviceName) => {
    const text = encodeURIComponent(`Hello SRIONE! I would like to inquire and consult regarding your "${serviceName}" service.`);
    return `https://wa.me/919705131915?text=${text}`;
  };

  return (
    <section className="section">
      {/* Header Banner */}
      <div className="section-heading" style={{
        marginBottom: '40px',
        padding: '30px 24px',
        background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.08) 0%, rgba(14, 159, 61, 0.05) 100%)',
        borderRadius: 'var(--radius-card)',
        border: '1px solid rgba(212, 175, 55, 0.2)'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', background: 'rgba(212, 175, 55, 0.15)', borderRadius: '20px', color: 'var(--color-gold-highlight)', fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '14px' }}>
            <span>✦</span> Sacred Practices & Guidance
          </div>
          <h1 style={{ margin: '0 0 10px 0', fontSize: 'clamp(2.4rem, 5vw, 3.8rem)', fontWeight: '900', letterSpacing: '-0.03em' }}>
            Transformative <span style={{ color: 'var(--color-gold-highlight)' }}>Consultations</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '640px', margin: 0, fontSize: '1.05rem', lineHeight: '1.6' }}>
            Ancient Vedic insight, spatial orientation, and numerical frequencies curated to unlock auspicious growth for individuals and enterprises.
          </p>
        </div>
      </div>

      {/* Category Tabs Filter */}
      <div style={{
        display: 'flex',
        gap: '10px',
        overflowX: 'auto',
        paddingBottom: '8px',
        marginBottom: '36px',
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        {filterTabs.map(tab => {
          const isSelected = selectedFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 22px',
                borderRadius: '30px',
                border: isSelected ? '1px solid var(--color-gold)' : '1px solid var(--border-subtle)',
                background: isSelected ? 'linear-gradient(135deg, var(--color-gold), #b8942b)' : 'var(--bg-card)',
                color: isSelected ? 'var(--color-navy)' : 'var(--text-primary)',
                fontWeight: '800',
                fontSize: '0.9rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
                boxShadow: isSelected ? '0 4px 15px rgba(212, 175, 55, 0.3)' : 'none'
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Services Grid */}
      <div className="services-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '26px' }}>
        {filteredServices.map(s => {
          const hasDedicatedPage = s.link && s.link.startsWith('/services/');
          const whatsappUrl = getWhatsAppLink(s.name);

          return (
            <div
              key={s.id}
              className="service-card"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-card)',
                padding: '28px',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.25s, border-color 0.25s, box-shadow 0.25s',
                position: 'relative'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--color-gold)';
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.25)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Image or Icon Area */}
              {s.image ? (
                <div style={{ height: '170px', width: '100%', borderRadius: '12px', overflow: 'hidden', marginBottom: '20px', border: '1px solid var(--border-subtle)' }}>
                  <img src={`${API_URL.replace('/api', '')}/${s.image}`} alt={s.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ) : (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(14, 159, 61, 0.12) 100%)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  color: 'var(--color-gold-highlight)',
                  fontSize: '1.8rem',
                  marginBottom: '20px'
                }}>
                  {s.mark}
                </div>
              )}

              {/* Title & Description */}
              <h3 style={{ margin: '0 0 10px 0', fontSize: '1.4rem', fontWeight: '800', color: '#ffffff' }}>
                {s.name}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', margin: '0 0 24px 0', flexGrow: 1 }}>
                {s.desc}
              </p>

              {/* Action Buttons Row */}
              <div style={{ marginTop: 'auto', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {hasDedicatedPage && (
                  <Link
                    to={s.link}
                    style={{
                      flex: '1 1 auto',
                      textAlign: 'center',
                      padding: '10px 16px',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid var(--border-subtle)',
                      color: '#ffffff',
                      textDecoration: 'none',
                      fontWeight: '800',
                      fontSize: '0.85rem'
                    }}
                  >
                    View Details ↗
                  </Link>
                )}

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    flex: '1 1 auto',
                    textAlign: 'center',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    background: '#25D366',
                    color: '#ffffff',
                    textDecoration: 'none',
                    fontWeight: '800',
                    fontSize: '0.85rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 12px rgba(37, 211, 102, 0.25)'
                  }}
                >
                  💬 Book on WhatsApp
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
