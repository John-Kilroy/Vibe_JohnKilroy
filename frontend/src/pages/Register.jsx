// src/pages/Register.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { register as apiRegister } from '../api/authApi';

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!/^[a-zA-Z0-9]{6,}$/.test(password)) {
      setError('Password must be at least 6 alphanumeric characters (letters and numbers only).');
      return;
    }
    setLoading(true);
    try {
      const { token, user } = await apiRegister(name, email, password);
      login(token, user);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="home-hero">
        <div className="brand__logo">NovaBanc</div>
        <div className="home-hero__divider" />
      </div>

      <div className="card">
        <h1 className="section-title">Create Account</h1>

        {error && <div className="alert alert--error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Jane Smith"
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Min. 6 characters"
              required
            />
          </div>
          <button className="btn btn--primary" type="submit" disabled={loading}>
            {loading ? 'Creating account…' : 'Register'}
          </button>
        </form>

        <p style={{ marginTop: '20px', fontSize: '0.85rem', color: 'var(--muted)', textAlign: 'center' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--gold)' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
