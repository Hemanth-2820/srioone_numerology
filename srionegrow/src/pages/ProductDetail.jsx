import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { API_URL } from '../config';
import { products as localProducts, getProductDescription, getProductSpecs } from '../data/products';
import { useCart } from '../context/CartContext';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('desc');
  const [quantity, setQuantity] = useState(1);
  const [addedToast, setAddedToast] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/products.php?id=${id}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.name) {
          const uniqueDesc = data.description || getProductDescription(data.name);
          const defaultSpecs = getProductSpecs(data.name, data.category);
          setProduct({
            id: data.id,
            name: data.name,
            group: data.category,
            rawPrice: parseFloat(data.price),
            price: data.price.toString().startsWith('₹') || data.price.toString().startsWith('$') ? data.price : `₹${data.price}`,
            image: data.image_url,
            icon: data.icon,
            description: uniqueDesc,
            material: data.material || defaultSpecs.material,
            purpose: data.purpose || defaultSpecs.purpose,
            care: data.care || defaultSpecs.care,
            isDb: true
          });
        } else {
          const local = localProducts[id] || localProducts.find(p => p.name === id || p.id == id);
          if (local) {
            const raw = parseFloat(local.price.replace(/[^0-9.-]+/g, ''));
            setProduct({
              ...local,
              id,
              rawPrice: raw,
              description: getProductDescription(local.name),
              isDb: false
            });
          }
        }
      })
      .catch(() => {
        const local = localProducts[id] || localProducts.find(p => p.name === id || p.id == id);
        if (local) {
          const raw = parseFloat(local.price.replace(/[^0-9.-]+/g, ''));
          setProduct({
            ...local,
            id,
            rawPrice: raw,
            description: getProductDescription(local.name),
            isDb: false
          });
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={{ padding: '120px 20px', textAlign: 'center', fontSize: '1.2rem', color: 'var(--text-secondary)' }}>Loading sacred specimen...</div>;
  if (!product) return <div style={{ padding: '120px 20px', textAlign: 'center', fontSize: '1.2rem', color: 'var(--text-secondary)' }}>Product not found. <Link to="/shop" style={{ color: 'var(--color-gold-highlight)', textDecoration: 'underline' }}>Return to Shop</Link></div>;

  const uniqueDesc = product.description || getProductDescription(product.name);
  const specs = getProductSpecs(product.name, product.group);
  const numericPrice = product.rawPrice || parseFloat(product.price.replace(/[^0-9.]/g, '') || '799');
  const originalPrice = Math.round(numericPrice * 1.35); // Anchor original price 35% higher

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

  const whatsappInquiryUrl = `https://wa.me/919705131915?text=${encodeURIComponent(`Hello SRIONE! I am inquiring about "${product.name}" (Price: ${product.price}). Can you guide me on its suitability and consecration?`)}`;

  return (
    <section className="section product-detail-page">
      {/* Toast Notification */}
      {addedToast && (
        <div style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          zIndex: 9999,
          background: 'var(--color-emerald)',
          color: '#ffffff',
          padding: '14px 24px',
          borderRadius: '30px',
          fontWeight: '800',
          boxShadow: '0 12px 36px rgba(14, 159, 61, 0.4)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span>✓</span> Added {quantity} × {product.name} to Cart!
        </div>
      )}

      {/* Navigation Breadcrumb */}
      <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
        <Link to="/shop" style={{ color: 'var(--color-gold-highlight)', textDecoration: 'none', fontWeight: '700' }}>← Back to Shop</Link>
        <span>/</span>
        <span>{product.group || 'Collection'}</span>
        <span>/</span>
        <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{product.name}</span>
      </div>
      
      <div className="product-detail-grid grid-responsive-2col" style={{ alignItems: 'start', gap: '48px' }}>
        
        {/* Left: Product Image Box */}
        <div className="product-image-container" style={{ position: 'sticky', top: '100px', background: 'var(--bg-card)', borderRadius: 'var(--radius-container)', padding: '24px', border: '1px solid var(--border-subtle)' }}>
          {product.image ? (
             <img 
               className="product-large-image" 
               src={product.isDb ? `${API_URL.replace('/api', '')}/${product.image}` : `/${product.image}`} 
               alt={product.name} 
               style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }} 
             />
          ) : (
             <div className="product-large-icon" style={{ width: '100%', aspectRatio: '1/1', display: 'grid', placeItems: 'center', fontSize: '6rem', background: 'var(--bg-secondary)', borderRadius: '14px', color: 'var(--color-gold-highlight)' }}>
               {product.icon || '✦'}
             </div>
          )}
          
          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-around', color: 'var(--text-muted)', fontSize: '0.82rem', textAlign: 'center' }}>
            <span>🌿 100% Genuine Specimen</span>
            <span>•</span>
            <span>✨ Energized & Cleansed</span>
            <span>•</span>
            <span>🇮🇳 All-India Shipping</span>
          </div>
        </div>

        {/* Right: Info, Price, Quantity & Tabs */}
        <div className="product-info-panel">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', background: 'rgba(212, 175, 55, 0.15)', borderRadius: '20px', color: 'var(--color-gold-highlight)', fontSize: '0.78rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
            SRIONE / {product.group || 'Sacred Collection'}
          </div>

          <h1 className="product-title" style={{ fontSize: 'clamp(2.2rem, 4vw, 3.4rem)', margin: '0 0 16px 0', lineHeight: '1.1', fontWeight: '900', color: '#ffffff' }}>
            {product.name}
          </h1>

          {/* Pricing Row with Anchored Original Price & Discount */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px', marginBottom: '18px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--color-gold-highlight)' }}>
              {product.price}
            </span>
            <span style={{ fontSize: '1.3rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
              ₹{originalPrice}
            </span>
            <span style={{ padding: '4px 10px', background: 'rgba(14, 159, 61, 0.2)', border: '1px solid var(--color-emerald)', color: '#4caf50', borderRadius: '6px', fontSize: '0.82rem', fontWeight: '800' }}>
              Save 35%
            </span>
          </div>

          {/* Value Badges */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '28px' }}>
            <span style={{ padding: '6px 12px', background: 'var(--bg-secondary)', borderRadius: '6px', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', fontSize: '0.82rem', fontWeight: '600' }}>
              🚚 Free Express Delivery
            </span>
            <span style={{ padding: '6px 12px', background: 'var(--bg-secondary)', borderRadius: '6px', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', fontSize: '0.82rem', fontWeight: '600' }}>
              🔒 100% Secure Checkout (PhonePe)
            </span>
            <span style={{ padding: '6px 12px', background: 'var(--bg-secondary)', borderRadius: '6px', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', fontSize: '0.82rem', fontWeight: '600' }}>
              🙏 Temple & Puja Cleansed
            </span>
          </div>

          {/* Quantity Stepper */}
          <div style={{ marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontWeight: '800', color: '#ffffff', fontSize: '0.95rem' }}>Quantity:</span>
            <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid var(--border-subtle)', borderRadius: '8px', background: 'var(--bg-secondary)', overflow: 'hidden' }}>
              <button 
                type="button"
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                style={{ padding: '8px 16px', background: 'transparent', border: 'none', color: '#ffffff', fontSize: '1.2rem', cursor: 'pointer', fontWeight: 'bold' }}
              >
                −
              </button>
              <span style={{ padding: '0 16px', fontWeight: '800', fontSize: '1.1rem', color: '#ffffff', minWidth: '24px', textAlign: 'center' }}>
                {quantity}
              </span>
              <button 
                type="button"
                onClick={() => setQuantity(prev => prev + 1)}
                style={{ padding: '8px 16px', background: 'transparent', border: 'none', color: '#ffffff', fontSize: '1.2rem', cursor: 'pointer', fontWeight: 'bold' }}
              >
                +
              </button>
            </div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Subtotal: <b>₹{(numericPrice * quantity).toFixed(0)}</b>
            </span>
          </div>
          
          {/* Action Group: Buy Now & Add to Cart */}
          <div className="product-action-group" style={{ display: 'flex', gap: '14px', marginBottom: '20px' }}>
            <button 
              className="btn btn-primary" 
              style={{ flex: 1, padding: '16px 24px', fontSize: '1.1rem', fontWeight: '900', color: 'var(--color-navy)', boxShadow: '0 8px 24px rgba(212, 175, 55, 0.3)' }} 
              onClick={handleBuyNow}
            >
              ⚡ Buy Now
            </button>
            <button 
              className="btn" 
              style={{ flex: 1, padding: '16px 24px', fontSize: '1.1rem', fontWeight: '800', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }} 
              onClick={handleAddToCart}
            >
              🛒 Add to Cart
            </button>
          </div>

          {/* Ask on WhatsApp Link */}
          <div style={{ marginBottom: '40px', textAlign: 'center' }}>
            <a
              href={whatsappInquiryUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                color: '#25D366',
                textDecoration: 'none',
                fontWeight: '700',
                fontSize: '0.92rem',
                padding: '8px 16px',
                borderRadius: '20px',
                background: 'rgba(37, 211, 102, 0.1)',
                border: '1px solid rgba(37, 211, 102, 0.25)'
              }}
            >
              <span>💬</span> Ask about this item on WhatsApp
            </a>
          </div>

          {/* Content Tabs */}
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '24px' }}>
             <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px', overflowX: 'auto' }}>
               <button 
                 onClick={() => setActiveTab('desc')} 
                 style={{ 
                   padding: '8px 18px', 
                   background: activeTab === 'desc' ? 'var(--color-gold)' : 'transparent', 
                   color: activeTab === 'desc' ? 'var(--color-navy)' : 'var(--text-secondary)',
                   border: 'none', 
                   borderRadius: '20px',
                   fontWeight: '800', 
                   fontSize: '0.9rem',
                   cursor: 'pointer',
                   transition: 'all 0.2s'
                 }}
               >
                 Description & Specs
               </button>
               <button 
                 onClick={() => setActiveTab('shipping')} 
                 style={{ 
                   padding: '8px 18px', 
                   background: activeTab === 'shipping' ? 'var(--color-gold)' : 'transparent', 
                   color: activeTab === 'shipping' ? 'var(--color-navy)' : 'var(--text-secondary)',
                   border: 'none', 
                   borderRadius: '20px',
                   fontWeight: '800', 
                   fontSize: '0.9rem',
                   cursor: 'pointer',
                   transition: 'all 0.2s'
                 }}
               >
                 Shipping & Packaging
               </button>
               <button 
                 onClick={() => setActiveTab('guarantee')} 
                 style={{ 
                   padding: '8px 18px', 
                   background: activeTab === 'guarantee' ? 'var(--color-gold)' : 'transparent', 
                   color: activeTab === 'guarantee' ? 'var(--color-navy)' : 'var(--text-secondary)',
                   border: 'none', 
                   borderRadius: '20px',
                   fontWeight: '800', 
                   fontSize: '0.9rem',
                   cursor: 'pointer',
                   transition: 'all 0.2s'
                 }}
               >
                 Purity & Consecration
               </button>
             </div>

             <div style={{ minHeight: '160px', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
               {activeTab === 'desc' && (
                 <div>
                   <p style={{ marginBottom: '22px', fontSize: '1.05rem', color: '#ffffff', lineHeight: '1.75' }}>
                     {uniqueDesc}
                   </p>
                   
                   {specs && (
                     <div style={{ marginTop: '20px', border: '1px solid var(--border-subtle)', borderRadius: '12px', overflow: 'hidden', background: 'var(--bg-secondary)' }}>
                       <div style={{ padding: '12px 18px', background: 'rgba(255, 255, 255, 0.04)', borderBottom: '1px solid var(--border-subtle)', fontWeight: '800', color: 'var(--color-gold-highlight)', fontSize: '0.86rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                         ✦ Authentic Specifications & Ritual Guidance
                       </div>
                       <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.92rem', textAlign: 'left' }}>
                         <tbody>
                           <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                             <td style={{ padding: '12px 18px', color: 'var(--text-secondary)', width: '38%', fontWeight: '700' }}>Item Name</td>
                             <td style={{ padding: '12px 18px', color: '#ffffff', fontWeight: '800' }}>{product.name}</td>
                           </tr>
                           <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                             <td style={{ padding: '12px 18px', color: 'var(--text-secondary)', fontWeight: '700' }}>Classification</td>
                             <td style={{ padding: '12px 18px', color: '#ffffff' }}>Religious & Spiritual Devotional / {product.group || 'Remedies'}</td>
                           </tr>
                           <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                             <td style={{ padding: '12px 18px', color: 'var(--text-secondary)', fontWeight: '700' }}>Primary Material</td>
                             <td style={{ padding: '12px 18px', color: 'var(--color-gold-highlight)', fontWeight: '700' }}>{product.material || specs?.material}</td>
                           </tr>
                           <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                             <td style={{ padding: '12px 18px', color: 'var(--text-secondary)', fontWeight: '700' }}>Traditional Purpose</td>
                             <td style={{ padding: '12px 18px', color: '#ffffff' }}>{product.purpose || specs?.purpose}</td>
                           </tr>
                           <tr>
                             <td style={{ padding: '12px 18px', color: 'var(--text-secondary)', fontWeight: '700' }}>Care & Cleansing</td>
                             <td style={{ padding: '12px 18px', color: '#ffffff' }}>{product.care || specs?.care}</td>
                           </tr>
                         </tbody>
                       </table>
                     </div>
                   )}

                   <div style={{ marginTop: '18px', padding: '12px 16px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-subtle)', fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                     ℹ️ <em>Sold strictly as an authentic religious, spiritual, and aesthetic specimen. We make no medical or supernatural guarantees. Individual spiritual experiences may vary.</em>
                   </div>
                 </div>
               )}

               {activeTab === 'shipping' && (
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.95rem' }}>
                   <p>🚚 <strong>Standard Delivery:</strong> 3–5 business days across India via insured courier services.</p>
                   <p>⚡ <strong>Express Dispatch:</strong> Orders placed before 1:00 PM IST are processed and dispatched within 24 hours.</p>
                   <p>📦 <strong>Protective Packaging:</strong> All crystals, mala beads, and sacred items are safely nestled in eco-friendly bubble cushions and sealed boxes to preserve pristine energetic purity during transit.</p>
                 </div>
               )}

               {activeTab === 'guarantee' && (
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.95rem' }}>
                   <p>✦ <strong>100% Genuine Specimen:</strong> We guarantee the authenticity and natural origin of every stone and consecrated wood piece shipped from SRIONE.</p>
                   <p>🙏 <strong>Spiritual Purification:</strong> Every item is traditionally cleansed with sacred smoke and mantra chants prior to packaging.</p>
                   <p>🛡️ <strong>Direct Recourse:</strong> Should your parcel arrive damaged or defective in any way, our dedicated support team resolves replacements immediately.</p>
                 </div>
               )}
             </div>
          </div>
        </div>

      </div>
    </section>
  );
}
