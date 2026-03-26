// src/pages/AdminDashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <div className="page">
      <div className="home-hero">
        <div className="brand__logo">NovaBanc</div>
        <div className="home-hero__divider" />
        <p style={{ fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginTop: '8px' }}>
          Admin Portal
        </p>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h1 className="section-title" style={{ marginBottom: 0, borderBottom: 'none', paddingBottom: 0 }}>
            Welcome, {user?.name}
          </h1>
          <button className="btn btn--ghost" style={{ width: 'auto' }} onClick={handleLogout}>
            Sign Out
          </button>
        </div>

        <div className="home-cta">
          <button className="btn btn--primary" onClick={() => navigate('/admin/customers')}>
            Manage Customers
          </button>
        </div>
      </div>
    </div>
  );
}
