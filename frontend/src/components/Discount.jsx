import { useState } from 'react';
import { Check, Copy, Percent, Tag, X } from 'lucide-react';

export const PROMO_LIST = [
  { code: 'WELCOME10', title: 'Welcome offer', description: 'Save 10% on your order', discountPercent: 10, color: 'amber', minimum: 0 },
  { code: 'COFFEE15', title: 'Coffee break', description: 'Save 15% on orders over $10', discountPercent: 15, color: 'emerald', minimum: 10 },
  { code: 'SWEET20', title: 'A little something extra', description: 'Save 20% on orders over $20', discountPercent: 20, color: 'purple', minimum: 20 },
];

export default function Discount({ subtotal = 0, onApplyPromo = () => {}, activeCode = '', readOnly = false }) {
  const [code, setCode] = useState(activeCode);
  const [message, setMessage] = useState(null);

  const applyPromo = (value) => {
    const normalizedCode = value.trim().toUpperCase();
    const promo = PROMO_LIST.find((item) => item.code === normalizedCode);

    if (!promo) {
      setMessage({ type: 'error', text: 'That code is not valid. Please check it and try again.' });
      return;
    }
    if (subtotal < promo.minimum) {
      setMessage({ type: 'error', text: `Add items to reach the $${promo.minimum.toFixed(2)} minimum for this offer.` });
      return;
    }

    setCode(promo.code);
    setMessage({ type: 'success', text: `${promo.discountPercent}% discount applied to your order.` });
    onApplyPromo(promo);
  };

  const copyCode = async (promoCode) => {
    try {
      await navigator.clipboard.writeText(promoCode);
      setMessage({ type: 'success', text: `${promoCode} copied to clipboard.` });
    } catch {
      setMessage({ type: 'success', text: `Use code ${promoCode} at checkout.` });
    }
    setCode(promoCode);
  };

  return (
    <section className="khmer-discount-wrapper discount-modern" aria-labelledby="discount-title">
      <div className="discount-header">
        <div className="discount-title-group">
          <span className="discount-icon-badge"><Percent size={18} /></span>
          <div>
            <h2 className="discount-title-km" id="discount-title">Offers for you</h2>
            <p className="discount-title-en">{readOnly ? 'Explore current savings and copy a code for checkout.' : 'Add a promo code or choose an offer below.'}</p>
          </div>
        </div>
      </div>

      {!readOnly && <form className="promo-input-container" onSubmit={(event) => { event.preventDefault(); applyPromo(code); }}>
        <label className="discount-field-label" htmlFor="promo-code">Promo code</label>
        <div className="promo-field-box">
          <Tag className="promo-field-icon" size={18} aria-hidden="true" />
          <input
            id="promo-code"
            className="promo-text-input"
            aria-label="Promo code"
            placeholder="Enter your code"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            autoComplete="off"
          />
          <button className="btn-apply-voucher" type="submit">Apply code</button>
        </div>
        {message && (
          <div className={`promo-status-alert ${message.type}`} role="status">
            {message.type === 'success' ? <Check size={16} /> : <X size={16} />}
            <span>{message.text}</span>
          </div>
        )}
      </form>}

      <div className="vouchers-cards-grid">
        {PROMO_LIST.map((promo) => {
          const isApplied = activeCode === promo.code;
          const isEligible = subtotal >= promo.minimum;
          return (
            <article className={`voucher-card voucher-${promo.color}${isApplied ? ' selected' : ''}`} key={promo.code}>
              <div className="voucher-left">
                <span className="voucher-badge-tag">{promo.discountPercent}% OFF</span>
                <h3 className="voucher-name-km">{promo.title}</h3>
                <p className="voucher-desc-en">{promo.description}</p>
                {!readOnly && isEligible && <span className="savings-preview">You save ${(subtotal * promo.discountPercent / 100).toFixed(2)}</span>}
              </div>
              <div className="voucher-right">
                <button className="voucher-code-pill" type="button" onClick={() => copyCode(promo.code)} aria-label={`Copy promo code ${promo.code}`}>
                  {promo.code}<Copy className="copy-icon" size={14} aria-hidden="true" />
                </button>
                {!readOnly && <button className={`btn-voucher-use${isApplied ? ' applied' : ''}`} type="button" onClick={() => applyPromo(promo.code)} disabled={!isEligible}>
                  {isApplied ? 'Applied' : 'Use offer'}
                </button>}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
