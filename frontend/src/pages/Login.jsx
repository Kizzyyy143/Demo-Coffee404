import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Coffee, Lock, User, AlertCircle, Shield, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loading) return;
    setError('');
    const result = await login(username.trim(), password);
    if (result.success) {
      const requestedPath = location.state?.from?.pathname;
      const destination = result.user.role === 'admin'
        ? requestedPath?.startsWith('/admin') ? requestedPath : '/admin'
        : '/menu';
      navigate(destination, { replace: true });
    } else {
      setError(typeof result.error === 'string' ? result.error : 'We could not sign you in. Check your details and try again.');
    }
  };

  const handleFillDemoAdmin = () => {
    setUsername('admin');
    setPassword('admin123');
    setError('');
  };

  return (
    <main className="auth-page login-page">
      <section className="auth-card login-card" aria-labelledby="login-title">
        <Link to="/" className="auth-brand" aria-label="Coffee-404 home">
          <span className="auth-icon-wrap"><Coffee size={25} aria-hidden="true" /></span>
          <span>Coffee-404</span>
        </Link>

        <div className="auth-header">
          <p className="auth-eyebrow">WELCOME BACK</p>
          <h1 id="login-title">Sign in to your account</h1>
          <p>Order your favorites and manage your Coffee-404 account.</p>
        </div>

        {error && (
          <div className="auth-error-banner" role="alert">
            <AlertCircle size={18} aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="login-username">Username</label>
            <div className="input-with-icon">
              <User size={18} className="input-icon" aria-hidden="true" />
              <input id="login-username" type="text" autoComplete="username" required autoFocus placeholder="Enter your username" value={username} onChange={(event) => setUsername(event.target.value)} />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" aria-hidden="true" />
              <input id="login-password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" required placeholder="Enter your password" value={password} onChange={(event) => setPassword(event.target.value)} />
              <button type="button" className="password-toggle" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-auth-submit">
            <span>{loading ? 'Signing in…' : 'Sign in'}</span>
            {!loading && <ArrowRight size={18} aria-hidden="true" />}
          </button>
        </form>

        <div className="demo-credentials-box">
          <div className="demo-header"><Shield size={16} aria-hidden="true" /><span>Demo account</span></div>
          <p>Use the sample administrator account to explore the dashboard.</p>
          <button type="button" onClick={handleFillDemoAdmin} className="btn-fill-demo">Fill demo credentials</button>
        </div>

        <div className="auth-footer-links">
          <span>New to Coffee-404?</span>
          <Link to="/register" className="auth-switch-link">Create an account</Link>
        </div>
      </section>
    </main>
  );
};

export default Login;
