import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Coffee, ArrowRight, Sparkles, Award, ShieldCheck, HeartHandshake, RefreshCw } from 'lucide-react';
import { productsAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import Discount from '../components/Discount';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchFeatured = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      const data = await productsAPI.getAll();
      const availableProducts = Array.isArray(data) ? data.filter((product) => product.is_available !== false) : [];
      setFeaturedProducts(availableProducts.slice(0, 4));
    } catch (error) {
      console.error('Failed to load featured products', error);
      setLoadError('Featured drinks are unavailable right now. Please try again.');
      setFeaturedProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeatured();
  }, [fetchFeatured]);

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge-km"><Sparkles size={16} aria-hidden="true" /><span>Specialty coffee · BKK1, Phnom Penh</span></div>
          <h1 className="hero-headline-km">Coffee worth<br />slowing down for.</h1>
          <p className="hero-description-km">Thoughtfully roasted beans, carefully brewed drinks, and a welcoming neighborhood café. Find your next favorite at Coffee-404.</p>
          <div className="hero-cta-group">
            <Link to="/menu" className="btn-hero-order"><span>Explore the menu</span><ArrowRight size={18} /></Link>
            <Link to="/menu" className="btn-hero-menu"><span>Order your coffee</span></Link>
          </div>
          <div className="hero-perks-khmer">
            <div className="perk-pill"><Award size={18} aria-hidden="true" /><span>Carefully selected beans</span></div>
            <div className="perk-pill"><ShieldCheck size={18} aria-hidden="true" /><span>Made fresh to order</span></div>
            <div className="perk-pill"><HeartHandshake size={18} aria-hidden="true" /><span>A warm local welcome</span></div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-image-wrapper">
            <img src="/images/coffee-2.png" alt="Freshly prepared latte at Coffee-404" className="hero-main-img" />
            <div className="floating-card rating-card"><span className="rating-num">Made fresh</span><span className="rating-text">Brewed with care, one cup at a time</span></div>
            <div className="floating-card roast-card"><Coffee size={20} aria-hidden="true" /><span>Your neighborhood coffee stop</span></div>
          </div>
        </div>
      </section>

      <section className="featured-section">
        <div className="section-header">
          <span className="section-kicker">FROM OUR MENU</span>
          <h2 className="section-title">House favorites</h2>
          <p className="section-subtitle">A few good places to start. Your next favorite is waiting.</p>
        </div>

        {loading ? (
          <div className="home-products-message" role="status">Loading featured drinks…</div>
        ) : loadError ? (
          <div className="home-products-message home-products-error" role="alert"><span>{loadError}</span><button type="button" onClick={fetchFeatured}><RefreshCw size={15} /> Retry</button></div>
        ) : featuredProducts.length ? (
          <div className="products-grid">
            {featuredProducts.map((product) => <ProductCard key={product.id} product={product} onSelect={setSelectedProduct} />)}
          </div>
        ) : (
          <div className="home-products-message">Our menu is being updated. Please check back soon.</div>
        )}

        <div className="view-more-container">
          <Link to="/menu" className="btn-view-all"><span>View the full menu</span><ArrowRight size={16} /></Link>
        </div>
      </section>

      <section className="home-promo-section">
        <Discount readOnly subtotal={0} />
      </section>

      <section className="story-banner">
        <div className="story-card">
          <div className="story-text">
            <span className="section-kicker">OUR APPROACH</span>
            <h2>Good coffee. Made with care.</h2>
            <p>We believe a great cup starts with good ingredients and a little attention to detail. Stop by, take a seat, and enjoy coffee made at your pace.</p>
            <Link to="/menu" className="btn-primary">Find your next favorite</Link>
          </div>
          <div className="story-image"><img src="/images/coffee-1.png" alt="Coffee brewed fresh at Coffee-404" loading="lazy" /></div>
        </div>
      </section>

      {selectedProduct && <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
    </div>
  );
};

export default Home;
