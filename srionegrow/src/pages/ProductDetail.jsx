import { useParams, Link, useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const product = products[id];

  if (!product) return <div>Product not found</div>;

  return (
    <section className="section product-detail-page">
      <Link className="back-link" to="/shop">← Back to Shop</Link>
      <div className="product-detail-grid">
        <div className="product-image-container">
          {product.image ? <img className="product-large-image" src={`/${product.image}`} alt={product.name} /> : <div className="product-large-icon">{product.icon}</div>}
        </div>
        <div className="product-info-panel">
          <div className="eyebrow">SRIONE / {product.group}</div>
          <h1 className="product-title">{product.name}</h1>
          <div className="product-price-tag">
            <span className="price-amount">{product.price}</span>
          </div>
          <div className="product-action-group">
            <button className="btn btn-primary btn-buy-now" onClick={() => { addToCart({ ...product, id }); navigate('/checkout'); }}>Buy Now</button>
            <button className="btn btn-add-cart" onClick={() => addToCart({ ...product, id })}>Add to Cart</button>
          </div>
        </div>
      </div>
    </section>
  );
}
