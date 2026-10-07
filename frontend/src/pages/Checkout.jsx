import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, CreditCard, Banknote, QrCode, ArrowLeft, Coffee, X, ArrowRight, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ordersAPI, paymentsAPI } from '../services/api';
import { formatUSD, formatKHR } from '../services/khmerUtils';
import Discount from '../components/Discount';

const DELIVERY_FEE = 1.25;
const FREE_DELIVERY_MINIMUM = 15;

const Checkout = () => {
  const { cartItems, totalAmount, clearCart, activePromo, setActivePromo } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: user?.username || '',
    email: user?.email || '',
    phone: '',
    district: 'Boeung Keng Kang (BKK1)',
    address: '',
    paymentMethod: 'KHQR',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [showKHQRModal, setShowKHQRModal] = useState(false);
  const [error, setError] = useState('');
  const deliveryFee = totalAmount >= FREE_DELIVERY_MINIMUM ? 0 : DELIVERY_FEE;
  const discountAmount = activePromo ? (totalAmount * activePromo.discountPercent) / 100 : 0;
  const orderTotal = Math.max(0, totalAmount - discountAmount + deliveryFee);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    if (error) setError('');
  };

  const handlePlaceOrder = async (event) => {
    event?.preventDefault();
    if (loading || cartItems.length === 0) return;
    if (formData.paymentMethod === 'KHQR' && !showKHQRModal) {
      setShowKHQRModal(true);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const orderPayload = {
        customer_name: formData.name.trim(),
        notes: `Email: ${formData.email.trim() || 'Not provided'} | Phone: ${formData.phone.trim()} | District: ${formData.district} | Address: ${formData.address.trim() || 'Pickup'} | Payment: ${formData.paymentMethod} | Customer notes: ${formData.notes.trim() || 'None'} | Delivery fee: ${deliveryFee.toFixed(2)} | Promo: ${activePromo?.code || 'None'}`,
        discount_code: activePromo?.code || null,
        items: cartItems.map((item) => ({
          product_id: item.id,
          product_name: `${item.name} (${item.size || 'Medium'}, ${item.sugar || '100%'} sugar${item.tempType ? `, ${item.tempType}` : ''})`,
          quantity: item.quantity,
          unit_price: item.price,
        })),
      };

      const orderResult = await ordersAPI.create(orderPayload);
      try {
        await paymentsAPI.create({
          order_id: orderResult.id,
          amount: orderTotal,
          payment_method: formData.paymentMethod,
          status: 'Pending',
        });
      } catch (paymentError) {
        console.warn('Order was created, but payment logging failed:', paymentError);
      }

      setCompletedOrder({ ...orderResult, total_amount: orderTotal });
      setShowKHQRModal(false);
      clearCart();
    } catch (orderError) {
      console.error('Checkout failed:', orderError);
      setError(orderError.response?.data?.detail || 'We could not place your order. Your cart is still saved. Please try again.');
      setShowKHQRModal(false);
    } finally {
      setLoading(false);
    }
  };

  if (completedOrder) {
    return (
      <main className="checkout-success-page">
        <section className="success-card">
          <CheckCircle2 size={56} className="success-icon" aria-hidden="true" />
          <p className="checkout-eyebrow">COFFEE-404</p>
          <h1>Order received</h1>
          <p className="success-sub">Thanks, {formData.name}. We’re preparing your order and will contact you if needed.</p>
          <div className="success-order-info"><span>Order number</span><strong>{completedOrder.order_number || `#${completedOrder.id}`}</strong></div>
          <div className="success-total"><span>Order total</span><strong>{formatUSD(completedOrder.total_amount)} <small>{formatKHR(completedOrder.total_amount)}</small></strong></div>
          <div className="success-actions">
            <Link to="/menu" className="btn-primary">Order more</Link>
            <Link to="/" className="btn-secondary">Back home</Link>
          </div>
        </section>
      </main>
    );
  }

  if (cartItems.length === 0) {
    return (
      <main className="cart-page-empty">
        <div className="empty-content">
          <Coffee size={44} className="text-amber-600" aria-hidden="true" />
          <h2>Your cart is empty</h2>
          <p>Add something from the Coffee-404 menu to continue.</p>
          <Link to="/menu" className="btn-primary">Browse the menu</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <div className="checkout-container">
        <button type="button" onClick={() => navigate('/cart')} className="btn-back"><ArrowLeft size={16} /> Back to cart</button>
        <header className="checkout-page-header">
          <p className="checkout-eyebrow">COFFEE-404</p>
          <h1 className="checkout-title">Checkout</h1>
          <p>Delivery details and payment</p>
        </header>

        <form onSubmit={handlePlaceOrder} className="checkout-grid">
          <div className="checkout-form-col">
            <section className="checkout-section-box">
              <h2 className="checkout-section-title">Contact and delivery</h2>
              <div className="form-group-row">
                <div className="form-group">
                  <label htmlFor="checkout-name">Full name *</label>
                  <input id="checkout-name" type="text" name="name" autoComplete="name" required value={formData.name} onChange={handleChange} placeholder="Your name" />
                </div>
                <div className="form-group">
                  <label htmlFor="checkout-email">Email address</label>
                  <input id="checkout-email" type="email" name="email" autoComplete="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="checkout-phone">Phone number *</label>
                <input id="checkout-phone" type="tel" name="phone" autoComplete="tel" required value={formData.phone} onChange={handleChange} placeholder="012 345 678" />
              </div>
              <div className="form-group-row">
                <div className="form-group">
                  <label htmlFor="checkout-district">District *</label>
                  <select id="checkout-district" name="district" required value={formData.district} onChange={handleChange}>
                    <option>Boeung Keng Kang (BKK1)</option>
                    <option>Toul Kork</option>
                    <option>Daun Penh</option>
                    <option>Chamkarmon</option>
                    <option>Prampir Makara</option>
                    <option>Chroy Changvar</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="checkout-address">Street address or pickup details</label>
                  <input id="checkout-address" type="text" name="address" autoComplete="street-address" value={formData.address} onChange={handleChange} placeholder="Street, building, or pickup" />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="checkout-notes">Order notes</label>
                <textarea id="checkout-notes" name="notes" rows={3} value={formData.notes} onChange={handleChange} placeholder="Anything we should know?" />
              </div>
            </section>

            <section className="checkout-section-box">
              <h2 className="checkout-section-title">Payment method</h2>
              <div className="payment-options-grid">
                <label className={`payment-option-card ${formData.paymentMethod === 'KHQR' ? 'active' : ''}`}>
                  <input type="radio" name="paymentMethod" value="KHQR" checked={formData.paymentMethod === 'KHQR'} onChange={handleChange} />
                  <QrCode size={25} aria-hidden="true" />
                  <span className="payment-title">KHQR / Bakong / ABA</span>
                  <span className="payment-description">Mobile banking</span>
                </label>
                <label className={`payment-option-card ${formData.paymentMethod === 'Credit Card' ? 'active' : ''}`}>
                  <input type="radio" name="paymentMethod" value="Credit Card" checked={formData.paymentMethod === 'Credit Card'} onChange={handleChange} />
                  <CreditCard size={25} aria-hidden="true" />
                  <span className="payment-title">Credit or debit card</span>
                  <span className="payment-description">Visa or Mastercard</span>
                </label>
                <label className={`payment-option-card ${formData.paymentMethod === 'Cash' ? 'active' : ''}`}>
                  <input type="radio" name="paymentMethod" value="Cash" checked={formData.paymentMethod === 'Cash'} onChange={handleChange} />
                  <Banknote size={25} aria-hidden="true" />
                  <span className="payment-title">Cash on delivery</span>
                  <span className="payment-description">Pay when your order arrives</span>
                </label>
              </div>
            </section>
          </div>

          <aside className="checkout-sidebar-col" aria-label="Order summary">
            <section className="order-review-card">
              <h2>Order summary <span>({cartItems.length})</span></h2>
              <div className="checkout-discount-wrap">
                <Discount onApplyPromo={setActivePromo} activeCode={activePromo?.code || ''} subtotal={totalAmount} />
              </div>
              <div className="review-items-list">
                {cartItems.map((item, index) => (
                  <div key={`${item.id}-${index}`} className="review-item-row">
                    <div className="review-item-name"><strong>{item.name}</strong><span>{item.quantity} × {item.size || 'Medium'} · {item.sugar || '100%'} sugar{item.tempType ? ` · ${item.tempType}` : ''}</span></div>
                    <strong>{formatUSD(item.price * item.quantity)}</strong>
                  </div>
                ))}
              </div>
              <div className="review-totals">
                <div className="review-line"><span>Subtotal</span><span>{formatUSD(totalAmount)}</span></div>
                {activePromo && <div className="review-line checkout-discount-line"><span>{activePromo.code} ({activePromo.discountPercent}% off)</span><span>−{formatUSD(discountAmount)}</span></div>}
                <div className="review-line"><span>Delivery</span><span>{deliveryFee === 0 ? 'Free' : formatUSD(deliveryFee)}</span></div>
                <div className="review-line total-highlight"><strong>Total due</strong><div><strong>{formatUSD(orderTotal)}</strong><small>{formatKHR(orderTotal)}</small></div></div>
              </div>

              {error && <div className="checkout-error" role="alert"><AlertCircle size={17} /><span>{error}</span></div>}

              <button type="submit" disabled={loading} className="btn-place-order">
                {loading ? 'Placing your order…' : formData.paymentMethod === 'KHQR' ? `Continue to payment · ${formatUSD(orderTotal)}` : `Place order · ${formatUSD(orderTotal)}`}
                {!loading && <ArrowRight size={18} aria-hidden="true" />}
              </button>
              <p className="checkout-secure-note">Your cart stays saved if checkout cannot be completed.</p>
            </section>
          </aside>
        </form>
      </div>

      {showKHQRModal && (
        <div className="modal-overlay" onClick={() => !loading && setShowKHQRModal(false)}>
          <section className="khqr-modal-card checkout-payment-modal" role="dialog" aria-modal="true" aria-labelledby="khqr-modal-title" onClick={(event) => event.stopPropagation()}>
            <div className="khqr-modal-header">
              <h2 id="khqr-modal-title">KHQR payment</h2>
              <button type="button" onClick={() => setShowKHQRModal(false)} className="checkout-modal-close" aria-label="Close payment dialog"><X size={20} /></button>
            </div>
            <div className="khqr-box-inner">
              <span className="checkout-payment-hint">Scan with your mobile banking app</span>
              <div className="qr-code-placeholder"><QrCode size={112} aria-label="Demo QR code placeholder" /><span>COFFEE-404</span></div>
              <div className="checkout-qr-total"><strong>{formatUSD(orderTotal)}</strong><span>{formatKHR(orderTotal)}</span></div>
              <p className="checkout-demo-note">Demo checkout: this screen does not generate a bank payment QR code.</p>
            </div>
            {error && <div className="checkout-error" role="alert">{error}</div>}
            <button type="button" className="btn-primary checkout-confirm-button" disabled={loading} onClick={() => handlePlaceOrder()}>{loading ? 'Placing order…' : 'Confirm demo order'}</button>
          </section>
        </div>
      )}
    </main>
  );
};

export default Checkout;
