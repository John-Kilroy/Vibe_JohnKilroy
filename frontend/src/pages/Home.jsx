// src/pages/Home.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const navigate = useNavigate();
  const { user, ready } = useAuth();

  // Redirect logged-in users to their dashboard
  useEffect(() => {
    if (ready && user) {
      navigate(user.role === 'admin' ? '/admin' : '/dashboard', { replace: true });
    }
  }, [ready, user, navigate]);

  return (
    <div className="page">
      <div className="home-hero">
        <div className="brand__logo">NovaBanc</div>
        <div className="home-hero__divider" />
        <p style={{ fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted)', marginTop: '10px' }}>
          Flask · MongoDB · React
        </p>
      </div>

      <div className="card">
        <h1 className="section-title">Welcome</h1>
        <p style={{ color: 'var(--muted)', marginBottom: '28px', fontSize: '0.9rem' }}>
          Sign in to manage your accounts, or create a new account to get started.
        </p>
        <div className="home-cta">
          <button className="btn btn--primary" onClick={() => navigate('/login')}>
            Sign In
          </button>
          <button className="btn btn--ghost" onClick={() => navigate('/register')}>
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
}
