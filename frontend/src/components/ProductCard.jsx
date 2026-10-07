import React from 'react';
import { Plus, Eye, Coffee } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatUSD, formatKHR } from '../services/khmerUtils';

const ProductCard = ({ product, onSelect }) => {
  const { addToCart } = useCart();

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    addToCart(product, 1, { size: 'Medium', sugar: '100%', temp: 'Iced' });
  };

  return (
    <div className="product-card" onClick={() => onSelect && onSelect(product)}>
      <div className="product-card-image-wrap">
        <span className="card-top-tag">កាហ្វេប្រចាំហាង</span>
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="product-card-img"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/images/coffee-1.png';
            }}
          />
        ) : (
          <div className="product-placeholder">
            <Coffee size={40} />
          </div>
        )}
        <button
          className="quick-view-btn"
          onClick={(e) => {
            e.stopPropagation();
            onSelect && onSelect(product);
          }}
          title="មើលលម្អិត / Quick View"
        >
          <Eye size={18} />
        </button>
      </div>

      <div className="product-card-content">
        <h3 className="product-card-title">{product.name}</h3>
        <p className="product-card-desc">{product.description}</p>

        <div className="product-card-footer">
          {/* Dual currency in USD and Khmer Riel */}
          <div className="dual-price-display">
            <span className="price-usd">{formatUSD(product.price)}</span>
            <span className="price-khr">{formatKHR(product.price)}</span>
          </div>

          <button
            className="btn-add-cart-km"
            onClick={handleQuickAdd}
            title="បន្ថែមក្នុងកន្ត្រក (Add to Cart)"
          >
            <Plus size={16} />
            <span>កុម្ម៉ង់</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
