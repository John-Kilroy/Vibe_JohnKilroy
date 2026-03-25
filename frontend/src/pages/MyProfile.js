// src/pages/MyProfile.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function MyProfile() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (!user) {
      navigate('/signin');
      return;
    }
    setCurrentUser(JSON.parse(user));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  return (
    <div className="page">
      <button className="back-link" onClick={() => navigate('/')}>← Back to Home</button>
      <div className="brand"><div className="brand__logo">NovaBanc</div></div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 className="section-title">My Profile</h2>
        <button className="btn btn--ghost" onClick={handleLogout} style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
          Sign Out
        </button>
      </div>

      {currentUser && (
        <div className="card">
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ margin: '0 0 15px 0', fontSize: '1rem', color: 'var(--primary)' }}>Account Information</h3>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '5px' }}>
                Full Name
              </label>
              <p style={{ margin: '0', fontSize: '1.1rem', fontWeight: '600' }}>
                {currentUser.name}
              </p>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '5px' }}>
                Email Address
              </label>
              <p style={{ margin: '0', fontSize: '1.1rem', fontWeight: '600' }}>
                {currentUser.email}
              </p>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '5px' }}>
                User ID
              </label>
              <p style={{ margin: '0', fontSize: '1rem' }}>
                {currentUser.user_id}
              </p>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '5px' }}>
                Member Since
              </label>
              <p style={{ margin: '0', fontSize: '1rem' }}>
                {new Date(currentUser.created_at).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
            <h3 style={{ margin: '0 0 15px 0', fontSize: '1rem', color: 'var(--primary)' }}>Actions</h3>
            <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
              <button
                className="btn btn--primary"
                onClick={() => navigate('/manage-accounts')}
              >
                ✦ Manage My Accounts
              </button>
              <button
                className="btn btn--ghost"
                onClick={() => navigate('/')}
              >
                Return to Home
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
