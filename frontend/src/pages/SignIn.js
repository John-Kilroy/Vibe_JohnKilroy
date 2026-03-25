// src/pages/SignIn.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInUser } from '../api/bankApi';

export default function SignIn() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.email.trim() || !form.password.trim()) {
      setError('Email and password are required.');
      return;
    }

    setLoading(true);
    try {
      const response = await signInUser(form.email, form.password);
      if (response.status === 'success' && response.user) {
        // Store user info in localStorage for session management
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        navigate('/', { state: { success: `Welcome back, ${response.user.name}!` } });
      } else {
        setError(response.message || 'Sign in failed. Please try again.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <button className="back-link" onClick={() => navigate('/')}>← Back</button>
      <div className="brand"><div className="brand__logo">NovaBanc</div></div>

      <div className="card">
        <h2 className="section-title">Sign In</h2>

        {error && <div className="alert alert--error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="jane@example.com"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <button className="btn btn--primary" type="submit" disabled={loading}>
            {loading ? 'Signing in...' : '✦ Sign In'}
          </button>
        </form>

        <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.9rem' }}>
          Don't have an account?{' '}
          <button
            className="back-link"
            onClick={() => navigate('/register')}
            style={{ cursor: 'pointer', textDecoration: 'underline' }}
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
}
