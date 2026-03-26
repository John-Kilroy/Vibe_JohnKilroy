// src/pages/Home.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

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
          Manage your accounts, deposits, withdrawals, and transaction history — all in one place.
        </p>
        <div className="home-cta">
          <button className="btn btn--primary" onClick={() => navigate('/create-account')}>
            ✦ Create New Account
          </button>
          <button className="btn btn--ghost" onClick={() => navigate('/view-account')}>
            View Existing Account
          </button>
        </div>
      </div>
    </div>
  );
}
