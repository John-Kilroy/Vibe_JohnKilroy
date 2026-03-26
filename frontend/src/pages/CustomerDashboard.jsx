// src/pages/CustomerDashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();

  const [accounts, setAccounts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');

  useEffect(() => {
    fetch('/api/customer/accounts', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        setAccounts(data);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [token]);

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <div className="page">
      <div className="home-hero">
        <div className="brand__logo">NovaBanc</div>
        <div className="home-hero__divider" />
      </div>

      <div className="card card--wide">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h1 className="section-title" style={{ marginBottom: 0, borderBottom: 'none', paddingBottom: 0 }}>
            My Accounts
          </h1>
          <button className="btn btn--ghost" style={{ width: 'auto' }} onClick={handleLogout}>
            Sign Out
          </button>
        </div>

        <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '24px' }}>
          Welcome back, {user?.name}
        </p>

        {error   && <div className="alert alert--error">{error}</div>}
        {loading && <div className="spinner-wrap">Loading accounts…</div>}

        {!loading && !error && accounts.length === 0 && (
          <div className="empty-state">
            No accounts yet. Open your first account below.
          </div>
        )}

        {!loading && accounts.length > 0 && (
          <table className="txn-table" style={{ marginBottom: '24px' }}>
            <thead>
              <tr>
                <th>Type</th>
                <th>Balance</th>
                <th>Opened</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {accounts.map(acc => (
                <tr key={acc.account_id}>
                  <td>{acc.account_type}</td>
                  <td className="amount--deposit">${acc.balance.toFixed(2)}</td>
                  <td style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>
                    {new Date(acc.created_at).toLocaleDateString()}
                  </td>
                  <td>
                    <button
                      className="btn btn--secondary"
                      style={{ padding: '6px 14px', fontSize: '0.75rem' }}
                      onClick={() => navigate(`/account/${acc.account_id}`)}
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <button
          className="btn btn--primary"
          onClick={() => navigate('/create-account')}
        >
          + Open New Account
        </button>
      </div>
    </div>
  );
}
