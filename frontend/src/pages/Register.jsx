import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Coffee, Lock, User, Mail, Phone, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const formatError = (error) => {
  if (typeof error === 'string') return error;
  if (Array.isArray(error)) {
    return error.map((item) => {
      const message = item?.msg || item?.message;
      const field = Array.isArray(item?.loc) ? item.loc[item.loc.length - 1] : null;
      return message ? `${field ? `${field}: ` : ''}${message}` : '';
    }).filter(Boolean).join(' ')
      || 'Please check the information you entered and try again.';
  }
  if (error && typeof error === 'object') {
    return formatError(error.detail || error.message);
  }
  return 'We could not create your account. Please try again.';
};

const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', full_name: '', phone: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!success) return undefined;
    const redirectTimer = window.setTimeout(() => navigate('/login', { replace: true }), 1800);
    return () => window.clearTimeout(redirectTimer);
  }, [success, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loading || success) return;
    setError('');

    const payload = {
      ...formData,
      username: formData.username.trim(),
      email: formData.email.trim().toLowerCase(),
      full_name: formData.full_name.trim(),
      phone: formData.phone.trim(),
    };
    if (payload.full_name.length < 2) {
      setError('Enter your full name using at least 2 characters.');
      return;
    }
    if (payload.password.length < 8) {
      setError('Use a password with at least 8 characters.');
      return;
    }

    const result = await register(payload);
    if (result.success) setSuccess(true);
    else setError(formatError(result.error));
  };

  return (
    <main className="auth-page register-page">
      <section className="auth-card register-card" aria-labelledby="register-title">
        <Link to="/" className="auth-brand" aria-label="Coffee-404 home">
          <span className="auth-icon-wrap"><Coffee size={25} aria-hidden="true" /></span>
          <span>Coffee-404</span>
        </Link>

        <div className="auth-header">
          <p className="auth-eyebrow">JOIN COFFEE-404</p>
          <h1 id="register-title">Create your account</h1>
          <p>Save your details and make ordering easier.</p>
        </div>

        {error && <div className="auth-error-banner" role="alert"><AlertCircle size={18} aria-hidden="true" /><span>{error}</span></div>}
        {success && <div className="auth-success-banner" role="status"><CheckCircle size={18} aria-hidden="true" /><span>Account created. Taking you to sign in… <Link to="/login">Sign in now</Link></span></div>}

        <form onSubmit={handleSubmit} className="auth-form register-form">
          <div className="form-group">
            <label htmlFor="register-username">Username *</label>
            <div className="input-with-icon"><User size={18} className="input-icon" aria-hidden="true" /><input id="register-username" type="text" name="username" autoComplete="username" required minLength={3} maxLength={50} placeholder="Choose a username" value={formData.username} onChange={handleChange} disabled={success} /></div>
          </div>

          <div className="form-group">
            <label htmlFor="register-email">Email address *</label>
            <div className="input-with-icon"><Mail size={18} className="input-icon" aria-hidden="true" /><input id="register-email" type="email" name="email" autoComplete="email" required maxLength={254} placeholder="you@example.com" value={formData.email} onChange={handleChange} disabled={success} /></div>
          </div>

          <div className="form-group">
            <label htmlFor="register-name">Full name *</label>
            <input id="register-name" type="text" name="full_name" autoComplete="name" required minLength={2} maxLength={100} placeholder="Your full name" value={formData.full_name} onChange={handleChange} disabled={success} />
          </div>

          <div className="form-group">
            <label htmlFor="register-phone">Phone number</label>
            <div className="input-with-icon"><Phone size={18} className="input-icon" aria-hidden="true" /><input id="register-phone" type="tel" name="phone" autoComplete="tel" maxLength={30} placeholder="012 345 678" value={formData.phone} onChange={handleChange} disabled={success} /></div>
          </div>

          <div className="form-group register-password-group">
            <label htmlFor="register-password">Password *</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" aria-hidden="true" />
              <input id="register-password" type={showPassword ? 'text' : 'password'} name="password" autoComplete="new-password" required minLength={8} placeholder="At least 8 characters" value={formData.password} onChange={handleChange} disabled={success} />
              <button type="button" className="password-toggle" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
            </div>
            <span className="register-field-hint">Use at least 8 characters.</span>
          </div>

          <button type="submit" disabled={loading || success} className="btn-auth-submit">
            <span>{loading ? 'Creating account…' : success ? 'Account created' : 'Create account'}</span>
            {!loading && !success && <CheckCircle size={18} aria-hidden="true" />}
          </button>
        </form>

        <div className="auth-footer-links"><span>Already have an account?</span><Link to="/login" className="auth-switch-link">Sign in</Link></div>
      </section>
    </main>
  );
};

export default Register;
