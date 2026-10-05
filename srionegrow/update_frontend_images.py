import os

workspace = r'c:\Users\DELL\Documents\srioone_numerology\srionegrow'

services_file = os.path.join(workspace, 'src/pages/Services.jsx')
with open(services_file, 'r', encoding='utf-8') as f:
    services = f.read()

# Map image_url
services = services.replace('link: s.link', 'link: s.link,\n            image: s.image_url')

# Render image in service grid
old_render = """          <Link key={s.id} className={`glass-card service-card service-link ${s.class}`} to={s.link}>
            <div className="service-mark">{s.mark}</div>"""
new_render = """          <Link key={s.id} className={`glass-card service-card service-link ${s.class}`} to={s.link}>
            {s.image ? (
              <img src={`${API_URL.replace('/api', '')}/${s.image}`} alt={s.name} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
            ) : (
              <div className="service-mark">{s.mark}</div>
            )}"""
services = services.replace(old_render, new_render)

with open(services_file, 'w', encoding='utf-8') as f:
    f.write(services)


home_file = os.path.join(workspace, 'src/pages/Home.jsx')
with open(home_file, 'r', encoding='utf-8') as f:
    home = f.read()

old_featured = """          <div className="services-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
            
            <Link className="premium-service-card" to="/services/numerology" style={{ textDecoration: 'none' }}>
              <div className="premium-service-icon" style={{ background: 'var(--color-lemon)' }}>
                <span style={{ fontSize: '2rem' }}>∞</span>
              </div>
              <h3 style={{ fontSize: '1.8rem', marginBottom: '15px', color: 'var(--text-primary)' }}>Numerology</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.6', flexGrow: 1 }}>Decode the cosmic blueprint hidden in your numbers. Gain absolute clarity on your life path, career timing, and personal relationships.</p>
              <div className="premium-service-cta">Explore Numerology <span className="arrow">→</span></div>
            </Link>

            <Link className="premium-service-card" to="/services/vaastu" style={{ textDecoration: 'none' }}>
              <div className="premium-service-icon" style={{ background: 'var(--color-pista)' }}>
                <span style={{ fontSize: '2rem' }}>⌂</span>
              </div>
              <h3 style={{ fontSize: '1.8rem', marginBottom: '15px', color: 'var(--text-primary)' }}>Vaastu Shastra</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.6', flexGrow: 1 }}>Harmonize your living and working spaces. We optimize the flow of natural harmony to attract abundance, health, and profound peace.</p>
              <div className="premium-service-cta">Explore Vaastu <span className="arrow">→</span></div>
            </Link>

            <Link className="premium-service-card" to="/services/crystal-balancing" style={{ textDecoration: 'none' }}>
              <div className="premium-service-icon" style={{ background: 'var(--color-light-peach)' }}>
                <span style={{ fontSize: '2rem' }}>◇</span>
              </div>
              <h3 style={{ fontSize: '1.8rem', marginBottom: '15px', color: 'var(--text-primary)' }}>Crystal Balancing</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.6', flexGrow: 1 }}>Restore your internal vibration. Cleanse your aura and balance your chakras using the ancient, stable frequencies of natural Earth crystals.</p>
              <div className="premium-service-cta">Explore Crystal Balancing <span className="arrow">→</span></div>
            </Link>

          </div>"""

# I need to fetch services in Home.jsx and render them dynamically!
if 'const [services' not in home:
    home = home.replace("export default function Home() {", "import { useState, useEffect } from 'react';\nimport { API_URL } from '../config';\n\nexport default function Home() {\n  const [services, setServices] = useState([]);\n\n  useEffect(() => {\n    fetch(`${API_URL}/services.php`)\n      .then(res => res.json())\n      .then(data => {\n        if (data && data.length > 0) setServices(data.slice(0, 3));\n      });\n  }, []);")

new_featured = """          <div className="services-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
            {services.length > 0 ? services.map(s => (
              <Link key={s.id} className="premium-service-card" to={s.link} style={{ textDecoration: 'none' }}>
                {s.image_url ? (
                  <img src={`${API_URL.replace('/api', '')}/${s.image_url}`} alt={s.name} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                ) : (
                  <div className={`premium-service-icon ${s.css_class}`} style={{ background: 'var(--bg-secondary)' }}>
                    <span style={{ fontSize: '2rem' }}>{s.mark}</span>
                  </div>
                )}
                <h3 style={{ fontSize: '1.8rem', marginBottom: '15px', color: 'var(--text-primary)' }}>{s.name}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.6', flexGrow: 1 }}>{s.description}</p>
                <div className="premium-service-cta">Explore {s.name} <span className="arrow">→</span></div>
              </Link>
            )) : (
              <div style={{ textAlign: 'center', gridColumn: '1 / -1' }}>Loading featured services...</div>
            )}
          </div>"""

home = home.replace(old_featured, new_featured)
with open(home_file, 'w', encoding='utf-8') as f:
    f.write(home)

print("Updated Services.jsx and Home.jsx")
