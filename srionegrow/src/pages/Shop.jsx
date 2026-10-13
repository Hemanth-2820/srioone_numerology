import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '../config';
import { products as localProducts, getProductDescription } from '../data/products';
import { useCart } from '../context/CartContext';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOption, setSortOption] = useState('default');
  const [addedItem, setAddedItem] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    fetch(`${API_URL}/products.php`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
           const mapped = data.map(p => ({
             id: p.id,
             name: p.name,
             group: p.category,
             rawPrice: parseFloat(p.price),
             price: p.price.toString().startsWith('₹') || p.price.toString().startsWith('$') ? p.price : `₹${p.price}`,
             image: p.image_url,
             icon: p.icon,
             description: p.description,
             isDb: true
           }));
           setProducts(mapped);
        } else {
           setProducts(localProducts.map((p, idx) => ({ ...p, id: idx, rawPrice: parseFloat(p.price.replace(/[^0-9.-]+/g,"")), isDb: false })));
        }
      })
      .catch(() => {
        setProducts(localProducts.map((p, idx) => ({ ...p, id: idx, rawPrice: parseFloat(p.price.replace(/[^0-9.-]+/g,"")), isDb: false })));
      });
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.group));
    return ['All', ...Array.from(cats).filter(Boolean)];
  }, [products]);

  const categoryIcons = {
    'All': '✦',
    'Stones': '💎',
    'Bracelets': '📿',
    'Balancing': '⚖️',
    'Accessories': '☸',
    'Vaastu': '⌂',
    'Rashi': '♈'
  };

  const filteredProducts = useMemo(() => {
    let result = products;

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(lower) || (p.group && p.group.toLowerCase().includes(lower)));
    }

    if (selectedCategory !== 'All') {
      result = result.filter(p => p.group === selectedCategory);
    }

    if (sortOption === 'price_asc') {
      result = [...result].sort((a, b) => a.rawPrice - b.rawPrice);
    } else if (sortOption === 'price_desc') {
      result = [...result].sort((a, b) => b.rawPrice - a.rawPrice);
    } else if (sortOption === 'name_asc') {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [products, searchTerm, selectedCategory, sortOption]);

  const handleQuickAdd = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setAddedItem(product.id);
    setTimeout(() => setAddedItem(null), 1800);
  };

  return (
    <section className="section shop-page">
      {/* Toast Alert */}
      {addedItem && (
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
          gap: '10px',
          animation: 'slideInUp 0.3s ease'
        }}>
          <span>✓</span> Added to your cart!
        </div>
      )}

      {/* Hero Header */}
      <div className="shop-hero" style={{
        marginBottom: '36px',
        padding: '30px 24px',
        background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.08) 0%, rgba(14, 159, 61, 0.05) 100%)',
        borderRadius: 'var(--radius-card)',
        border: '1px solid rgba(212, 175, 55, 0.2)'
      }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', background: 'rgba(212, 175, 55, 0.15)', borderRadius: '20px', color: 'var(--color-gold-highlight)', fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '14px' }}>
          <span>✦</span> Sacred Remedial Curations
        </div>
        <h1 style={{ margin: '0 0 10px 0', fontSize: 'clamp(2.4rem, 5vw, 3.8rem)', fontWeight: '900', letterSpacing: '-0.03em' }}>
          Authentic Crystals & <span style={{ color: 'var(--color-gold-highlight)' }}>Sacred Tools</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '640px', margin: 0, fontSize: '1.05rem', lineHeight: '1.6' }}>
          Each specimen is individually selected and energetically aligned for traditional devotion, meditation, and spiritual balance.
        </p>
      </div>

      {/* Toolbar: Search, Categories & Sort */}
      <div className="shop-tools" style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: '24px',
        borderBottom: '1px solid var(--border-subtle)',
        marginBottom: '36px'
      }}>
        
        {/* Search Input */}
        <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: '400px' }}>
          <input 
            type="text" 
            placeholder="Search stones, bracelets, yantras..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 42px 12px 18px',
              borderRadius: '30px',
              border: '1px solid var(--border-subtle)',
              background: 'var(--bg-secondary)',
              color: '#ffffff',
              fontSize: '0.95rem',
              boxSizing: 'border-box'
            }}
          />
          {searchTerm ? (
            <button
              onClick={() => setSearchTerm('')}
              style={{
                position: 'absolute',
                right: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold'
              }}
            >
              ✕
            </button>
          ) : (
            <span style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }}>🔍</span>
          )}
        </div>

        {/* Categories Chips */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', maxWidth: '100%', flex: '2 1 auto' }}>
          {categories.map(cat => {
            const isSelected = selectedCategory === cat;
            const icon = categoryIcons[cat] || '◇';
            return (
              <button 
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{ 
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '9px 18px', 
                  borderRadius: '30px', 
                  border: isSelected ? '1px solid var(--color-gold)' : '1px solid var(--border-subtle)', 
                  background: isSelected ? 'linear-gradient(135deg, var(--color-gold), #b8942b)' : 'var(--bg-card)', 
                  color: isSelected ? 'var(--color-navy)' : 'var(--text-primary)',
                  fontWeight: '800',
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? '0 4px 15px rgba(212, 175, 55, 0.3)' : 'none'
                }}
              >
                <span>{icon}</span>
                <span>{cat}</span>
              </button>
            );
          })}
        </div>

        {/* Sort & Count */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginLeft: 'auto' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.88rem', fontWeight: '600', whiteSpace: 'nowrap' }}>
            {filteredProducts.length} items
          </span>
          <select 
            value={sortOption} 
            onChange={(e) => setSortOption(e.target.value)}
            style={{
              padding: '10px 18px',
              borderRadius: '30px',
              border: '1px solid var(--border-subtle)',
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              fontWeight: '700',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            <option value="default">Sort: Featured</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="name_asc">Name: A to Z</option>
          </select>
        </div>
      </div>

      {/* Catalog Grid */}
      {filteredProducts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', background: 'var(--bg-card)', borderRadius: 'var(--radius-card)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔍</div>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '1.4rem' }}>No products found</h3>
          <p style={{ color: 'var(--text-secondary)', margin: '0 0 24px 0' }}>Try searching for a different keyword or select "All" categories.</p>
          <button onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }} className="btn btn-primary">
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="catalog">
          {filteredProducts.map((product) => {
            const raw = product.rawPrice || 799;
            const originalPrice = Math.round(raw * 1.35); // 35% discount anchor

            return (
              <Link 
                to={`/shop/${product.id}`} 
                key={product.id} 
                className="product-card" 
                style={{ display: 'flex', flexDirection: 'column', height: '100%', textDecoration: 'none' }}
              >
                <article 
                  className="product" 
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.25s, box-shadow 0.25s'
                  }}
                >
                  {/* Category Pill Tag */}
                  <div style={{
                    position: 'absolute',
                    top: '16px',
                    left: '16px',
                    zIndex: 2,
                    padding: '4px 10px',
                    background: 'rgba(27, 36, 48, 0.85)',
                    backdropFilter: 'blur(6px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '20px',
                    color: 'var(--color-gold-highlight)',
                    fontSize: '0.72rem',
                    fontWeight: '800',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em'
                  }}>
                    {product.group || 'Sacred'}
                  </div>

                  {/* Product Art Box */}
                  <div 
                    className="product-art" 
                    style={{
                      height: '240px',
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      overflow: 'hidden',
                      borderRadius: '14px',
                      position: 'relative',
                      background: 'var(--bg-secondary)'
                    }}
                  >
                    {product.image ? (
                       <img 
                         src={product.isDb ? `${API_URL.replace('/api', '')}/${product.image}` : `/${product.image}`} 
                         alt={product.name} 
                         style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }} 
                         onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'}
                         onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                       />
                    ) : (
                       <div style={{ fontSize: '3.8rem' }}>{product.icon || '✦'}</div>
                    )}
                  </div>

                  {/* Title & Description */}
                  <h2 style={{
                    fontSize: '1.15rem',
                    fontWeight: '800',
                    color: '#ffffff',
                    margin: '14px 0 8px',
                    lineHeight: '1.3'
                  }}>
                    {product.name}
                  </h2>

                  <p style={{
                    fontSize: '0.86rem',
                    color: 'var(--text-secondary)',
                    margin: '0 0 16px',
                    lineHeight: '1.5',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    minHeight: '2.6em'
                  }}>
                    {product.description || getProductDescription(product.name)}
                  </p>

                  {/* Price & Action Row */}
                  <div className="product-bottom" style={{
                    marginTop: 'auto',
                    paddingTop: '16px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '10px'
                  }}>
                    {/* Pricing */}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                        <span style={{ fontSize: '1.25rem', fontWeight: '900', color: 'var(--color-gold-highlight)' }}>
                          {product.price}
                        </span>
                        <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                          ₹{originalPrice}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#4caf50', fontWeight: '800', marginTop: '2px' }}>
                        Free Delivery
                      </div>
                    </div>

                    {/* Quick Add Button */}
                    <button
                      onClick={(e) => handleQuickAdd(e, product)}
                      style={{
                        padding: '9px 15px',
                        background: 'var(--color-emerald)',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: '800',
                        fontSize: '0.84rem',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'transform 0.15s, background 0.15s',
                        whiteSpace: 'nowrap'
                      }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      <span>+</span> Cart
                    </button>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
