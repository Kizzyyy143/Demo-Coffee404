import React, { useState } from 'react';
import { X, Plus, Minus, ShoppingBag, Coffee, Flame, Snowflake, Milk } from 'lucide-react';
import { useCart } from '../context/CartContext';
import PercentSugar from './PercentSugar';
import { formatUSD, formatKHR, DRINK_TYPES } from '../services/khmerUtils';

const ProductModal = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState('Medium');
  const [sugar, setSugar] = useState('100%');
  const [tempType, setTempType] = useState('iced');

  if (!product) return null;

  const sizeMultipliers = {
    Small: -0.5,
    Medium: 0.0,
    Large: 0.75,
  };

  const tempExtra = tempType === 'frappe' ? 0.5 : 0;
  const unitPrice = Math.max(0, product.price + sizeMultipliers[size] + tempExtra);
  const finalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    addToCart(
      {
        ...product,
        price: unitPrice,
      },
      quantity,
      {
        size,
        sugar,
        tempType: tempType === 'hot' ? 'ក្តៅ (Hot)' : tempType === 'frappe' ? 'ក្រឡុក (Frappe)' : 'ទឹកកក (Iced)',
      }
    );
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        <div className="modal-grid">
          <div className="modal-image-col">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="modal-img"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/images/coffee-1.png';
                }}
              />
            ) : (
              <div className="modal-placeholder">
                <Coffee size={64} />
              </div>
            )}
          </div>

          <div className="modal-info-col">
            <span className="card-top-tag">កាហ្វេប្រចាំហាង • Specialty Coffee</span>
            <h2 className="modal-title-km">{product.name}</h2>
            <p className="modal-desc">{product.description}</p>

            {/* Price Preview in USD & KHR */}
            <div className="modal-price-dual">
              <span className="price-usd">{formatUSD(unitPrice)}</span>
              <span className="price-khr ml-2">({formatKHR(unitPrice)})</span>
            </div>

            {/* Temperature Type: Hot / Iced / Frappe */}
            <div className="option-group-km">
              <label className="option-label-km">
                <span>ប្រភេទភេសជ្ជៈ</span>
                <span className="text-muted text-xs">/ Beverage Type</span>
              </label>
              <div className="option-buttons">
                {DRINK_TYPES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    className={`btn-option-pill ${tempType === t.id ? 'active' : ''}`}
                    onClick={() => setTempType(t.id)}
                  >
                    <span>{t.icon} {t.labelKm}</span>
                    <span className="text-xs opacity-75"> ({t.labelEn}{t.extraPrice ? ' +$0.50' : ''})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Cup Size */}
            <div className="option-group-km">
              <label className="option-label-km">
                <span>ទំហំកែវ</span>
                <span className="text-muted text-xs">/ Cup Size</span>
              </label>
              <div className="option-buttons">
                {[
                  { id: 'Small', labelKm: 'តូច', labelEn: 'Small', note: '-$0.50' },
                  { id: 'Medium', labelKm: 'មធ្យម', labelEn: 'Medium', note: 'ស្តង់ដារ' },
                  { id: 'Large', labelKm: 'ធំ', labelEn: 'Large', note: '+$0.75' },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    className={`btn-option-pill ${size === s.id ? 'active' : ''}`}
                    onClick={() => setSize(s.id)}
                  >
                    <span>{s.labelKm}</span>
                    <span className="text-xs opacity-75"> ({s.labelEn} • {s.note})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Percent Sugar Selector Component */}
            <PercentSugar
              value={sugar}
              onChange={(newSugar) => setSugar(newSugar)}
              compact={true}
              showDetails={true}
            />

            {/* Modal Actions */}
            <div className="modal-footer-action-km">
              <div className="quantity-control">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="btn-qty"
                >
                  <Minus size={16} />
                </button>
                <span className="qty-value">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="btn-qty"
                >
                  <Plus size={16} />
                </button>
              </div>

              <button
                type="button"
                className="btn-modal-add-km"
                onClick={handleAddToCart}
              >
                <ShoppingBag size={18} />
                <span>
                  ដាក់ក្នុងកន្ត្រក • {formatUSD(finalPrice)} ({formatKHR(finalPrice)})
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
