import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Coffee, Layers, ShoppingBag, Users, UserCheck,
  Package, CreditCard, BarChart3, ArrowLeft, Menu, X,
} from 'lucide-react';

const menuItems = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
  { label: 'Products', path: '/admin/products', icon: Coffee },
  { label: 'Categories', path: '/admin/categories', icon: Layers },
  { label: 'Orders', path: '/admin/orders', icon: ShoppingBag },
  { label: 'Customers', path: '/admin/customers', icon: Users },
  { label: 'Employees', path: '/admin/employees', icon: UserCheck },
  { label: 'Inventory', path: '/admin/inventory', icon: Package },
  { label: 'Payments', path: '/admin/payments', icon: CreditCard },
  { label: 'Reports', path: '/admin/reports', icon: BarChart3 },
];

const Sidebar = () => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <aside className={`admin-sidebar${mobileNavOpen ? ' mobile-open' : ''}`}>
      <div className="sidebar-brand">
        <span className="sidebar-brand-mark"><Coffee size={21} aria-hidden="true" /></span>
        <div className="sidebar-brand-copy">
          <strong>Coffee-404</strong>
          <span className="badge-admin">ADMIN CONSOLE</span>
        </div>
        <button type="button" className="sidebar-mobile-toggle" onClick={() => setMobileNavOpen((open) => !open)} aria-label={mobileNavOpen ? 'Close admin navigation' : 'Open admin navigation'} aria-expanded={mobileNavOpen}>
          {mobileNavOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>

      <nav className="sidebar-nav" aria-label="Admin navigation">
        <p className="sidebar-section-label">WORKSPACE</p>
        {menuItems.map(({ label, path, icon: Icon, exact }) => (
          <NavLink key={path} to={path} end={exact} onClick={() => setMobileNavOpen(false)} className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
            <Icon size={18} aria-hidden="true" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <NavLink to="/" className="back-store-link" onClick={() => setMobileNavOpen(false)}>
          <ArrowLeft size={17} aria-hidden="true" />
          <span>Back to storefront</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
