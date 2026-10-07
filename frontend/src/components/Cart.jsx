import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatUSD, formatKHR } from '../services/khmerUtils';

const Cart = () => {
  const { cartItems, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, totalAmount, totalCount } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isCartOpen) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsCartOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen, setIsCartOpen]);

  if (!isCartOpen) return null;

  const closeAndNavigate = (path) => {
    setIsCartOpen(false);
    navigate(path);
  };

  return (
    <div className="cart-drawer-overlay" onClick={() => setIsCartOpen(false)}>
      <aside className="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-drawer-title" onClick={(event) => event.stopPropagation()}>
        <div className="cart-drawer-header">
          <div className="header-title-wrap">
            <span className="cart-drawer-icon"><ShoppingBag size={20} aria-hidden="true" /></span>
            <div>
              <h2 id="cart-drawer-title">Your cart <span className="cart-count">{totalCount}</span></h2>
              <span className="cart-drawer-brand">Coffee-404</span>
            </div>
          </div>
          <button type="button" className="cart-close-btn" onClick={() => setIsCartOpen(false)} aria-label="Close cart">
            <X size={20} />
          </button>
        </div>

        <div className="cart-drawer-body">
          {cartItems.length === 0 ? (
            <div className="empty-cart-view">
              <span className="empty-cart-icon-wrap"><ShoppingBag size={32} aria-hidden="true" /></span>
              <h3>Your cart is empty</h3>
              <p>Find your next favorite coffee on our menu.</p>
              <button type="button" className="btn-browse-menu" onClick={() => closeAndNavigate('/menu')}>Browse the menu</button>
            </div>
          ) : (
            <div className="cart-items-list">
              {cartItems.map((item, index) => (
                <article key={`${item.id}-${index}`} className="cart-item-row">
                  <img
                    src={item.image_url || '/images/coffee-1.png'}
                    alt={item.name}
                    className="cart-item-img"
                    onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = '/images/coffee-1.png'; }}
                  />
                  <div className="cart-item-details">
                    <h3 className="cart-item-name">{item.name}</h3>
                    <span className="cart-item-specs-km">{item.size || 'Medium'} · {item.sugar || '100%'} sugar{item.tempType ? ` · ${item.tempType}` : ''}</span>
                    <div className="cart-item-price-col">
                      <span className="cart-item-price">{formatUSD(item.price * item.quantity)}</span>
                      <span className="cart-item-khr">{formatKHR(item.price * item.quantity)}</span>
                    </div>
                    <div className="cart-item-actions">
                      <div className="qty-stepper" aria-label={`Quantity for ${item.name}`}>
                        <button type="button" onClick={() => updateQuantity(index, item.quantity - 1)} className="stepper-btn" aria-label={`Decrease ${item.name} quantity`}><Minus size={14} /></button>
                        <span className="stepper-val" aria-live="polite">{item.quantity}</span>
                        <button type="button" onClick={() => updateQuantity(index, item.quantity + 1)} className="stepper-btn" aria-label={`Increase ${item.name} quantity`}><Plus size={14} /></button>
                      </div>
                      <button type="button" onClick={() => removeFromCart(index)} className="btn-remove-item" aria-label={`Remove ${item.name}`} title="Remove item"><Trash2 size={16} /></button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="subtotal-row">
              <span>Subtotal</span>
              <div className="cart-subtotal-value"><strong>{formatUSD(totalAmount)}</strong><span>{formatKHR(totalAmount)}</span></div>
            </div>
            <p className="taxes-note">Delivery and discounts are calculated at checkout.</p>
            <div className="cart-footer-buttons">
              <button type="button" className="btn-view-cart-full" onClick={() => closeAndNavigate('/cart')}>View cart</button>
              <button type="button" className="btn-checkout-drawer" onClick={() => closeAndNavigate('/checkout')}><span>Checkout</span><ArrowRight size={18} /></button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
};

export default Cart;
