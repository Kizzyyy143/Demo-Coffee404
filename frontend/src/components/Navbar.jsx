import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Coffee, ShoppingBag, User, LogOut, Menu as MenuIcon, X, Shield, MapPin, Sparkles, Percent } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { formatKHR, formatUSD } from '../services/khmerUtils';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { totalCount, totalAmount, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      {/* Top Khmer Modern Exchange Rate & Location Ribbon */}
      <div className="top-rate-ribbon">
        <div className="rate-ribbon-content">
          <div className="rate-badge">
            <Sparkles size={14} className="text-amber-400" />
            <span>អត្រាប្តូរប្រាក់: ១ ដុល្លារ = ៤,១០០ រៀល (1 USD = 4,100 KHR)</span>
          </div>
          <div className="rate-location">
            <MapPin size={14} />
            <span>វិថី ៤០៤ បឹងកេងកង ១ ភ្នំពេញ (BKK1, Phnom Penh) • បើក 06:30 - 21:00</span>
          </div>
        </div>
      </div>

      <nav className="navbar">
        <div className="nav-container">
          {/* Brand Logo & Name in Khmer Modern */}
          <Link to="/" className="nav-brand">
            <div className="brand-logo-wrap">
              <Coffee size={26} />
            </div>
            <div className="brand-text-col">
              <span className="brand-name-km">Coffee-404</span>
              <span className="brand-subtitle-en">Specialty Coffee</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
            <Link
              to="/"
              className={`nav-link-item ${location.pathname === '/' ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="km">ទំព័រដើម</span>
              <span className="en">Home</span>
            </Link>

            <Link
              to="/menu"
              className={`nav-link-item ${location.pathname === '/menu' ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="km">ម៉ឺនុយ</span>
              <span className="en">Menu</span>
            </Link>

            <Link
              to="/cart"
              className={`nav-link-item ${location.pathname === '/cart' ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="km">ប័ណ្ណបញ្ចុះតម្លៃ</span>
              <span className="en">Cart</span>
            </Link>

            {isAdmin && (
              <Link
                to="/admin"
                className="admin-nav-pill"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Shield size={15} />
                <span>គ្រប់គ្រង (Admin)</span>
              </Link>
            )}
          </div>

          {/* Actions: Cart & Auth */}
          <div className="nav-actions">
            <button
              className="cart-btn"
              onClick={() => setIsCartOpen(true)}
              aria-label="Open Cart"
              title="កន្ត្រកទំនិញ / Cart"
            >
              <ShoppingBag size={22} />
              {totalCount > 0 && <span className="cart-badge">{totalCount}</span>}
            </button>

            {isAuthenticated ? (
              <div className="user-dropdown">
                <span className="user-greeting">សួស្តី, {user?.username}</span>
                <button onClick={handleLogout} className="btn-logout" title="ចាកចេញ (Logout)">
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="auth-btns">
                <Link to="/login" className="btn-login">ចូលគណនី</Link>
                <Link to="/register" className="btn-register">ចុះឈ្មោះ</Link>
              </div>
            )}

            <button
              className="mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
