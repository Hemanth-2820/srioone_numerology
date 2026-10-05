import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { API_URL } from '../config';
import { products as localProducts } from '../data/products';
import { useCart } from '../context/CartContext';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('desc');

  useEffect(() => {
    // Try to fetch from DB
    fetch(`${API_URL}/products.php?id=${id}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.name) {
          setProduct({
            id: data.id,
            name: data.name,
            group: data.category,
            price: data.price.toString().startsWith('₹') || data.price.toString().startsWith('$') ? data.price : `₹${data.price}`,
            image: data.image_url,
            icon: data.icon,
            isDb: true
          });
        } else {
          // Fallback to local
          setProduct({ ...localProducts[id], id, isDb: false });
        }
      })
      .catch(() => {
        // Fallback to local
        if (localProducts[id]) {
           setProduct({ ...localProducts[id], id, isDb: false });
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={{ padding: '100px', textAlign: 'center' }}>Loading...</div>;
  if (!product) return <div style={{ padding: '100px', textAlign: 'center' }}>Product not found</div>;

  return (
    <section className="section product-detail-page">
      <Link className="back-link" to="/shop">← Back to Shop</Link>
      
      <div className="product-detail-grid" className="grid-responsive-2col" style={{ alignItems: 'start' }}>
        
        {/* Left: Image Box */}
        <div className="product-image-container" style={{ position: 'sticky', top: '100px' }}>
          {product.image ? (
             <img className="product-large-image" src={product.isDb ? `${API_URL.replace('/api', '')}/${product.image}` : `/${product.image}`} alt={product.name} style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', borderRadius: 'var(--radius-container)', border: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)' }} />
          ) : (
             <div className="product-large-icon" style={{ width: '100%', aspectRatio: '1/1', display: 'grid', placeItems: 'center', fontSize: '5rem', background: 'var(--color-pista)', borderRadius: 'var(--radius-container)' }}>{product.icon}</div>
          )}
        </div>

        {/* Right: Info & Extra Content */}
        <div className="product-info-panel">
          <div className="eyebrow">SRIONE / {product.group}</div>
          <h1 className="product-title" style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', margin: '10px 0', lineHeight: '1.1' }}>{product.name}</h1>
          <div className="product-price-tag" style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--text-primary)', marginBottom: '30px' }}>
            {product.price}
          </div>
          
          <div className="product-action-group" style={{ display: 'flex', gap: '16px', marginBottom: '50px' }}>
            <button className="btn btn-primary btn-buy-now" style={{ flex: 1, padding: '16px', fontSize: '1.1rem' }} onClick={() => { addToCart(product); navigate('/checkout'); }}>Buy Now</button>
            <button className="btn btn-add-cart" style={{ flex: 1, padding: '16px', fontSize: '1.1rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }} onClick={() => addToCart(product)}>Add to Cart</button>
          </div>

          {/* Enriched Content Tabs */}
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '20px' }}>
             <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
               <button onClick={() => setActiveTab('desc')} style={{ background: 'transparent', border: 'none', fontWeight: '800', cursor: 'pointer', color: activeTab === 'desc' ? 'var(--text-primary)' : 'var(--text-secondary)' }}>Description</button>
               <button onClick={() => setActiveTab('shipping')} style={{ background: 'transparent', border: 'none', fontWeight: '800', cursor: 'pointer', color: activeTab === 'shipping' ? 'var(--text-primary)' : 'var(--text-secondary)' }}>Shipping</button>
               <button onClick={() => setActiveTab('guarantee')} style={{ background: 'transparent', border: 'none', fontWeight: '800', cursor: 'pointer', color: activeTab === 'guarantee' ? 'var(--text-primary)' : 'var(--text-secondary)' }}>Authenticity</button>
             </div>

             <div style={{ minHeight: '150px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
               {activeTab === 'desc' && (
                 <div>
                   <p style={{ marginBottom: '10px' }}>This exquisite {product.name} has been meticulously sourced to ensure the highest harmonious resonance. Ideal for balancing your space and personal aura.</p>
                   <ul style={{ paddingLeft: '20px' }}>
                     <li>Premium grade {product.group} quality</li>
                     <li>Hand-selected by SRIONE experts</li>
                     <li>Enhances positive numeric vibrations</li>
                   </ul>
                 </div>
               )}
               {activeTab === 'shipping' && (
                 <div>
                   <p><strong>Standard Delivery:</strong> 3-5 Business Days across India.</p>
                   <p><strong>Express Delivery:</strong> 1-2 Business Days (available at checkout).</p>
                   <p>All items are securely packaged with eco-friendly protective materials to ensure they arrive in pristine condition.</p>
                 </div>
               )}
               {activeTab === 'guarantee' && (
                 <div>
                   <p>At SRIONE, we guarantee the authenticity and purity of all our physical products. Every stone, crystal, and remedy is harmoniously cleansed prior to shipping.</p>
                 </div>
               )}
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
