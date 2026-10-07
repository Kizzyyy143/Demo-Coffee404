import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Discount from '../components/Discount';
import { formatUSD, formatKHR } from '../services/khmerUtils';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, totalAmount, activePromo, setActivePromo } = useCart();
  const navigate = useNavigate();

  const deliveryFee = totalAmount >= 15 || totalAmount === 0 ? 0 : 1.25;
  const discountAmount = activePromo ? (totalAmount * activePromo.discountPercent) / 100 : 0;
  const finalTotal = Math.max(0, totalAmount - discountAmount + deliveryFee);

  if (cartItems.length === 0) {
    return (
      <main className="cart-page-empty">
        <div className="empty-content">
          <span className="empty-cart-icon-wrap"><ShoppingBag size={34} aria-hidden="true" /></span>
          <h2>Your cart is empty</h2>
          <p>Explore the Coffee-404 menu and add something you love.</p>
          <Link to="/menu" className="btn-primary">Browse the menu</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="cart-page">
      <div className="cart-page-container">
        <header className="cart-header-title-bar">
          <h1 className="page-title">Your cart <span className="cart-page-count">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}</span></h1>
          <p className="text-muted text-sm">Review your items before checkout.</p>
        </header>

        <div className="cart-layout-grid">
          <section className="cart-items-section" aria-label="Cart items">
            <div className="cart-items-table-header" aria-hidden="true">
              <span>Item</span><span>Price</span><span>Quantity</span><span>Total</span><span></span>
            </div>

            <div className="cart-items-rows">
              {cartItems.map((item, index) => (
                <article key={`${item.id}-${index}`} className="cart-row-item">
                  <div className="item-meta">
                    <img
                      src={item.image_url || '/images/coffee-1.png'}
                      alt={item.name}
                      className="item-thumb"
                      onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = '/images/coffee-1.png'; }}
                    />
                    <div>
                      <h2 className="item-name">{item.name}</h2>
                      <span className="cart-item-specs-km">{item.size || 'Medium'} · {item.sugar || '100%'} sugar{item.tempType ? ` · ${item.tempType}` : ''}</span>
                    </div>
                  </div>

                  <div className="item-unit-price"><span>{formatUSD(item.price)}</span><span className="text-xs text-muted">{formatKHR(item.price)}</span></div>

                  <div className="item-qty-control" aria-label={`Quantity for ${item.name}`}>
                    <button type="button" onClick={() => updateQuantity(index, item.quantity - 1)} className="btn-qty-mini" aria-label={`Decrease ${item.name} quantity`}><Minus size={14} /></button>
                    <span className="qty-val" aria-live="polite">{item.quantity}</span>
                    <button type="button" onClick={() => updateQuantity(index, item.quantity + 1)} className="btn-qty-mini" aria-label={`Increase ${item.name} quantity`}><Plus size={14} /></button>
                  </div>

                  <div className="item-line-total"><span>{formatUSD(item.price * item.quantity)}</span><span className="text-xs text-muted">{formatKHR(item.price * item.quantity)}</span></div>

                  <button type="button" onClick={() => removeFromCart(index)} className="btn-del-item" aria-label={`Remove ${item.name}`} title="Remove item"><Trash2 size={16} /></button>
                </article>
              ))}
            </div>

            <div className="cart-bottom-actions">
              <Link to="/menu" className="btn-continue-shopping"><ArrowLeft size={16} /><span>Continue shopping</span></Link>
              <button type="button" onClick={clearCart} className="btn-clear-cart">Clear cart</button>
            </div>

            <div className="cart-promo-wrap">
              <Discount onApplyPromo={setActivePromo} activeCode={activePromo?.code || ''} subtotal={totalAmount} />
            </div>
          </section>

          <aside className="cart-summary-section" aria-label="Order summary">
            <div className="summary-card">
              <h2>Order summary</h2>
              <div className="summary-line"><span>Subtotal</span><span>{formatUSD(totalAmount)} <small>{formatKHR(totalAmount)}</small></span></div>
              {activePromo && <div className="summary-line discount-line"><span>{activePromo.code} ({activePromo.discountPercent}% off)</span><span>-{formatUSD(discountAmount)}</span></div>}
              <div className="summary-line"><span>Delivery</span><span>{deliveryFee === 0 ? 'Free' : `${formatUSD(deliveryFee)} (${formatKHR(deliveryFee)})`}</span></div>
              <div className="summary-divider" />
              <div className="summary-line total-line"><span>Total due</span><span><strong>{formatUSD(finalTotal)}</strong><small>{formatKHR(finalTotal)}</small></span></div>
              <button type="button" className="btn-proceed-checkout" onClick={() => navigate('/checkout')}><span>Proceed to checkout</span><ArrowRight size={18} /></button>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default CartPage;
