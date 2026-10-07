import React from 'react';
import { Bell, Search, User, LogOut, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = ({ title = 'Dashboard' }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="admin-header">
      <div className="header-left">
        <h1 className="header-title">{title}</h1>
        <p className="header-subtitle">
          <Sparkles size={14} aria-hidden="true" />
          Coffee-404 Management System
        </p>
      </div>

      <div className="header-right">
        <label className="header-search">
          <Search size={18} className="search-icon" aria-hidden="true" />
          <input type="search" aria-label="Search admin dashboard" placeholder="Search the dashboard..." />
        </label>

        <button type="button" className="icon-btn" aria-label="Notifications" title="Notifications">
          <Bell size={20} />
          <span className="notification-dot" aria-hidden="true"></span>
        </button>

        <div className="header-user">
          <div className="user-avatar" aria-hidden="true"><User size={20} /></div>
          <div className="user-info">
            <span className="user-name">{user?.username || 'Admin'}</span>
            <span className="user-role">{user?.role === 'admin' ? 'Administrator' : 'Staff'}</span>
          </div>
          <button type="button" onClick={handleLogout} className="logout-btn" aria-label="Sign out" title="Sign out">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
