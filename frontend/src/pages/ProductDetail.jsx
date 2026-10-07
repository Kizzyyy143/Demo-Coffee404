import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, Plus, Minus, Check, Coffee } from 'lucide-react';
import { productsAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import PercentSugar from '../components/PercentSugar';
import { formatUSD, formatKHR, DRINK_TYPES } from '../services/khmerUtils';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState('Medium');
  const [sugar, setSugar] = useState('100%');
  const [tempType, setTempType] = useState('iced');
  const [addedNotice, setAddedNotice] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await productsAPI.getById(id);
        setProduct(data);
      } catch (err) {
        console.error('Failed to load product', err);
        setProduct({
          id: Number(id),
          name: 'Signature Pour-Over Roast',
          price: 4.50,
          description: 'គ្រាប់កាហ្វេពិសេសដាំនៅតំបន់ខ្ពង់រាប រសជាតិឈ្ងុយឆ្ងាញ់បែបធម្មជាតិ Single-origin Ethiopian notes of jasmine & bergamot.',
          image_url: '/images/coffee-1.png',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <div className="detail-loading">កំពុងផ្ទុកទិន្នន័យភេសជ្ជៈ... (Loading delicious details)</div>;
  }

  if (!product) {
    return (
      <div className="product-not-found text-center py-12">
        <h2>រកមិនឃើញមុខទំនិញនេះទេ (Product Not Found)</h2>
        <Link to="/menu" className="btn-primary mt-4">ត្រឡប់ទៅកាន់ម៉ឺនុយ</Link>
      </div>
    );
  }

  const sizeMultipliers = {
    Small: -0.5,
    Medium: 0.0,
    Large: 0.75,
  };

  const tempExtra = tempType === 'frappe' ? 0.5 : 0;
  const unitPrice = Math.max(0, product.price + sizeMultipliers[size] + tempExtra);
  const totalPrice = unitPrice * quantity;

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
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2500);
  };

  return (
    <div className="product-detail-page">
      <div className="detail-container">
        <button onClick={() => navigate(-1)} className="btn-back">
          <ArrowLeft size={18} />
          <span>ត្រឡប់ទៅកាន់ម៉ឺនុយ (Back to Menu)</span>
        </button>

        <div className="detail-card">
          <div className="detail-image-box">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="detail-img"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/images/coffee-1.png';
                }}
              />
            ) : (
              <div className="detail-placeholder">
                <Coffee size={80} />
              </div>
            )}
          </div>

          <div className="detail-info-box">
            <span className="card-top-tag">កាហ្វេប្រចាំហាង • Khmer Modern Roastery</span>
            <h1 className="detail-title">{product.name}</h1>
            <p className="detail-description">{product.description}</p>

            <div className="detail-price-tag">
              <span className="unit-label">តម្លៃ / Price:</span>
              <span className="price-val ml-2">{formatUSD(totalPrice)}</span>
              <span className="price-khr ml-2 font-bold">({formatKHR(totalPrice)})</span>
            </div>

            {/* Customization Section */}
            <div className="customization-section">
              {/* Type: Iced / Hot / Frappe */}
              <div className="custom-group">
                <label className="font-semibold text-sm">ប្រភេទភេសជ្ជៈ / Type</label>
                <div className="chip-options">
                  {DRINK_TYPES.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      className={`btn-custom-chip ${tempType === t.id ? 'active' : ''}`}
                      onClick={() => setTempType(t.id)}
                    >
                      {t.icon} {t.labelKm} ({t.labelEn})
                    </button>
                  ))}
                </div>
              </div>

              {/* Cup Size */}
              <div className="custom-group">
                <label className="font-semibold text-sm">ទំហំកែវ / Cup Size</label>
                <div className="chip-options">
                  {[
                    { id: 'Small', labelKm: 'តូច (Small)' },
                    { id: 'Medium', labelKm: 'មធ្យម (Medium)' },
                    { id: 'Large', labelKm: 'ធំ (Large)' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      className={`btn-custom-chip ${size === s.id ? 'active' : ''}`}
                      onClick={() => setSize(s.id)}
                    >
                      {s.labelKm}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sweetness Selector Component */}
              <PercentSugar
                value={sugar}
                onChange={(sug) => setSugar(sug)}
                compact={false}
                showDetails={true}
              />

              {/* Quantity Picker */}
              <div className="custom-group">
                <label className="font-semibold text-sm">ចំនួនកែវ / Quantity</label>
                <div className="qty-picker">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="qty-btn"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="qty-number">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="qty-btn"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>

            <div className="action-buttons-wrap">
              <button className="btn-add-detail" onClick={handleAddToCart}>
                {addedNotice ? (
                  <>
                    <Check size={18} />
                    <span>បានបន្ថែមក្នុងកន្ត្រក! (Added)</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={18} />
                    <span>
                      បន្ថែមក្នុងកន្ត្រក ({formatUSD(totalPrice)} • {formatKHR(totalPrice)})
                    </span>
                  </>
                )}
              </button>
              <button
                className="btn-checkout-direct"
                onClick={() => {
                  handleAddToCart();
                  navigate('/checkout');
                }}
              >
                កុម្ម៉ង់ & គិតលុយភ្លាមៗ (Instant Checkout)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
