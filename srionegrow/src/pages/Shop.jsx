import { Link } from 'react-router-dom';
import { products } from '../data/products';

export default function Shop() {
  return (
    <section className="section shop-page">
      <div className="shop-hero">
        <div className="eyebrow">SRIONE Beyond Calculation</div>
        <h1>Curated energy for <span>the next move.</span></h1>
      </div>
      <div className="catalog">
        {products.map((product, idx) => (
          <Link to={`/shop/${idx}`} key={idx} className="product-card" style={{display: 'block', textDecoration: 'none'}}>
            <article className="product">
              <div className="product-art">
                {product.image ? <img src={`/${product.image}`} alt={product.name} /> : product.icon}
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
    </section>
  );
}
