import React from 'react';
import { Coffee, MapPin, Phone, Mail, Clock, Heart, QrCode, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="site-footer">
    <div className="footer-container">
      <div className="footer-col brand-col">
        <Link to="/" className="footer-brand" aria-label="Coffee-404 home">
          <span className="footer-logo-mark"><Coffee size={23} aria-hidden="true" /></span>
          <span className="footer-brand-km">Coffee-404</span>
        </Link>
        <p className="footer-desc">
          Specialty coffee, thoughtfully roasted and freshly brewed in Phnom Penh. Stop by for your daily cup or discover a new favorite.
        </p>
        <div className="footer-socials" aria-label="Social channels">
          <span className="social-pill">Instagram</span>
          <span className="social-pill">Facebook</span>
          <span className="social-pill">Telegram</span>
        </div>
      </div>

      <nav className="footer-col" aria-label="Footer navigation">
        <h2 className="footer-heading">Explore</h2>
        <ul className="footer-links">
          <li><Link to="/">Home <ArrowUpRight size={14} /></Link></li>
          <li><Link to="/menu">Our menu <ArrowUpRight size={14} /></Link></li>
          <li><Link to="/cart">Shopping cart <ArrowUpRight size={14} /></Link></li>
          <li><Link to="/login">Your account <ArrowUpRight size={14} /></Link></li>
          <li><Link to="/admin">Admin portal <ArrowUpRight size={14} /></Link></li>
        </ul>
      </nav>

      <section className="footer-col" aria-labelledby="footer-hours-heading">
        <h2 className="footer-heading" id="footer-hours-heading">Visit us</h2>
        <ul className="footer-hours">
          <li><Clock size={17} aria-hidden="true" /><span>Monday–Friday<strong>6:30 AM–8:30 PM</strong></span></li>
          <li><Clock size={17} aria-hidden="true" /><span>Saturday–Sunday<strong>6:30 AM–9:30 PM</strong></span></li>
        </ul>
        <p className="footer-payment"><QrCode size={16} aria-hidden="true" /> KHQR, Bakong and ABA accepted</p>
      </section>

      <section className="footer-col" aria-labelledby="footer-contact-heading">
        <h2 className="footer-heading" id="footer-contact-heading">Get in touch</h2>
        <ul className="footer-contact">
          <li><MapPin size={17} aria-hidden="true" /><span>Street 57, BKK1<br />Phnom Penh, Cambodia</span></li>
          <li><Phone size={17} aria-hidden="true" /><a href="tel:+85523888404">+855 23 888 404</a></li>
          <li><Mail size={17} aria-hidden="true" /><a href="mailto:contact@cafearoma-kh.com">contact@cafearoma-kh.com</a></li>
        </ul>
      </section>
    </div>

    <div className="footer-bottom">
      <p>© {new Date().getFullYear()} Coffee-404. All rights reserved.</p>
      <p className="made-with">Made with <Heart size={14} aria-label="love" /> in Phnom Penh</p>
    </div>
  </footer>
);

export default Footer;
