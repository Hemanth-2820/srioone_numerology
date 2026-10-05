import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '../config';
import { products as localProducts } from '../data/products';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOption, setSortOption] = useState('default');

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

  return (
    <section className="section shop-page">
      <div className="shop-hero" style={{ marginBottom: '40px' }}>
        <div className="eyebrow">SRIONE Beyond Calculation</div>
        <h1>Curated harmony for <span>the next move.</span></h1>
      </div>

      <div className="shop-tools" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '30px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '40px' }}>
        
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', flex: '1 1 auto' }}>
          <input 
            type="text" 
            placeholder="🔍 Search products..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: '12px 20px', borderRadius: '30px', border: '1px solid var(--border-subtle)', background: 'var(--bg-primary)', minWidth: '250px', fontSize: '1rem' }}
          />
          
          <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '5px' }}>
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{ 
                  padding: '8px 18px', 
                  borderRadius: '30px', 
                  border: selectedCategory === cat ? '1px solid #111' : '1px solid var(--border-subtle)', 
                  background: selectedCategory === cat ? '#111' : 'transparent', 
                  color: selectedCategory === cat ? 'var(--color-saffron)' : '#111',
                  fontWeight: '700',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <select 
          value={sortOption} 
          onChange={(e) => setSortOption(e.target.value)}
          style={{ padding: '12px 20px', borderRadius: '30px', border: '1px solid var(--border-subtle)', background: 'var(--bg-primary)', fontWeight: '700', cursor: 'pointer' }}
        >
          <option value="default">Sort by: Default</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="name_asc">Name: A to Z</option>
        </select>
      </div>

      {filteredProducts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
          No products found matching your criteria.
        </div>
      ) : (
        <div className="catalog">
          {filteredProducts.map((product) => (
            <Link to={`/shop/${product.id}`} key={product.id} className="product-card" style={{display: 'block', textDecoration: 'none'}}>
              <article className="product">
                <div className="product-art">
                  {product.image ? (
                     <img src={product.isDb ? `${API_URL.replace('/api', '')}/${product.image}` : `/${product.image}`} alt={product.name} />
                  ) : (
                     product.icon
                  )}
                </div>
                <div className="category">{product.group}</div>
                <h2>{product.name}</h2>
                <div className="product-bottom">
                  <div className="product-pricing">
                    <span className="price">{product.price}</span>
                  </div>
                  <button className="enquire" type="button">View Details ↗</button>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
