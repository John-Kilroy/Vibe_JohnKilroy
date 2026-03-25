// src/pages/Home.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Check if user is stored in localStorage
    const user = localStorage.getItem('currentUser');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
  };

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div className="brand__logo">NovaBanc</div>
        {currentUser && (
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: 'var(--muted)' }}>
              Welcome, <button className="back-link" onClick={() => navigate('/profile')} style={{ textDecoration: 'underline', cursor: 'pointer' }}>{currentUser.name}</button>
            </p>
            <button className="btn btn--ghost" onClick={handleLogout} style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
              Sign Out
            </button>
          </div>
        )}
      </div>

      <div className="home-hero">
        <div className="home-hero__divider" />
        <p className="home-hero__subtitle">Simple Banking System</p>
      </div>

      <div className="card">
        <h1 className="section-title">Welcome to NovaBanc</h1>
        <p style={{ color: 'var(--muted)', marginBottom: '28px', fontSize: '0.9rem' }}>
          Manage your accounts, deposits, withdrawals, and transaction history — all in one place.
        </p>

        {currentUser ? (
          <div>
            <div className="home-cta" style={{ marginBottom: '30px' }}>
              <button className="btn btn--primary" onClick={() => navigate('/manage-accounts')}>
                ✦ Manage My Accounts
              </button>
              <button className="btn btn--secondary" onClick={() => navigate('/create-account')}>
                Create New Account
              </button>
            </div>
            
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '25px' }}>
              <h3 style={{ margin: '0 0 15px 0', fontSize: '1rem', color: 'var(--primary)' }}>Quick Actions</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button
                  className="btn btn--ghost"
                  onClick={() => navigate('/view-account')}
                  style={{ fontSize: '0.9rem' }}
                >
                  View Account Details
                </button>
                <button
                  className="btn btn--ghost"
                  onClick={() => navigate('/create-account')}
                  style={{ fontSize: '0.9rem' }}
                >
                  Deposit Funds
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="home-cta">
            <button className="btn btn--primary" onClick={() => navigate('/signin')}>
              ✦ Sign In
            </button>
            <button className="btn btn--ghost" onClick={() => navigate('/register')}>
              Create New Account
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
