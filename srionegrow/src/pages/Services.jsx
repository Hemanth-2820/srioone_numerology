import { Link } from 'react-router-dom';

const services = [
  {
    id: 'numerology',
    name: 'Numerology',
    mark: '∞',
    desc: 'Explore the patterns and meanings held in numbers to bring clarity to your path.',
    class: 'service-numerology',
    link: '/services/numerology'
  },
  {
    id: 'vaastu',
    name: 'Vaastu',
    mark: '⌂',
    desc: 'Shape balanced spaces that support harmony, intention and positive energy.',
    class: 'service-vaastu',
    link: '/services/vaastu'
  },
  {
    id: 'crystal-healing',
    name: 'Crystal Healing',
    mark: '◇',
    desc: 'Reconnect with calm, focus and grounded energy through intentional crystal work.',
    class: 'service-crystal',
    link: '/services/crystal-healing'
  },
  {
    id: 'aura-scanning',
    name: 'Aura Scanning',
    mark: '✧',
    desc: 'Discover and analyze the energetic field surrounding you for deeper self-awareness.',
    class: 'service-numerology',
    link: '/contact'
  },
  {
    id: 'numerology-report',
    name: 'Numerology Report',
    mark: '📄',
    desc: 'A detailed, comprehensive written breakdown of your personal numbers and timelines.',
    class: 'service-numerology',
    link: '/contact'
  },
  {
    id: 'vaastu-report',
    name: 'Vaastu Report',
    mark: '📑',
    desc: 'A complete spatial analysis report detailing the energetic flow of your environment.',
    class: 'service-vaastu',
    link: '/contact'
  },
  {
    id: 'vaastu-consultation',
    name: 'Vaastu Consultation',
    mark: '🗣',
    desc: 'One-on-one sessions to discuss and resolve specific spatial energy challenges.',
    class: 'service-vaastu',
    link: '/services/vaastu'
  },
  {
    id: 'vedic-numerology',
    name: 'Vedic Numerology',
    mark: '🕉',
    desc: 'Ancient numeric wisdom drawn from Vedic traditions to guide your life choices.',
    class: 'service-numerology',
    link: '/contact'
  },
  {
    id: 'pronology',
    name: 'Pronology',
    mark: '🔤',
    desc: 'The science of sound vibrations. Discover how the pronunciation of your name affects you.',
    class: 'service-crystal',
    link: '/contact'
  },
  {
    id: 'business-numerology',
    name: 'Business Numerology',
    mark: '💼',
    desc: 'Numeric strategy and name-alignment for commercial success and business growth.',
    class: 'service-numerology',
    link: '/contact'
  },
  {
    id: 'phone-numerology',
    name: 'Phone Numerology',
    mark: '📱',
    desc: 'Find the optimal energetic frequency for your personal and business contact numbers.',
    class: 'service-numerology',
    link: '/contact'
  },
  {
    id: 'aura-boosting',
    name: 'Aura Boosting',
    mark: '✨',
    desc: 'Targeted practices and techniques to cleanse, expand, and strengthen your aura.',
    class: 'service-crystal',
    link: '/contact'
  },
  {
    id: 'remedies',
    name: 'Remedies',
    mark: '🌿',
    desc: 'Personalized, actionable steps and physical items for restoring energetic balance.',
    class: 'service-vaastu',
    link: '/contact'
  }
];

export default function Services() {
  return (
    <section className="section">
      <div className="section-heading">
        <div>
          <div className="eyebrow">What we make</div>
          <h2>Built for the next move.</h2>
        </div>
        <p>Focused services for brands and individuals navigating a world that is changing shape.</p>
      </div>
      <div className="services-grid">
        {services.map(s => (
          <Link key={s.id} className={`glass-card service-card service-link ${s.class}`} to={s.link}>
            <div className="service-mark">{s.mark}</div>
            <h3>{s.name}</h3>
            <p>{s.desc}</p>
            <span className="service-cta">Explore service <span aria-hidden="true">↗</span></span>
          </Link>
        ))}
      </div>
    </section>
  );
}
