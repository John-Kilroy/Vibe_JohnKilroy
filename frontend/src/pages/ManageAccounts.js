// src/pages/ManageAccounts.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserAccounts, deleteAccount } from '../api/bankApi';

export default function ManageAccounts() {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (!user) {
      navigate('/signin');
      return;
    }
    const parsedUser = JSON.parse(user);
    setCurrentUser(parsedUser);
    loadAccounts(parsedUser.user_id);
  }, [navigate]);

  const loadAccounts = async (userId) => {
    try {
      setLoading(true);
      const data = await getUserAccounts(userId);
      setAccounts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (accountId) => {
    if (!window.confirm('Are you sure you want to delete this account?')) return;

    try {
      await deleteAccount(accountId);
      setAccounts(accounts.filter(acc => acc.account_id !== accountId));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  return (
    <div className="page">
      <button className="back-link" onClick={() => navigate('/')}>← Back to Home</button>
      <div className="brand"><div className="brand__logo">NovaBanc</div></div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 className="section-title">Manage Your Accounts</h2>
        <button className="btn btn--ghost" onClick={handleLogout} style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
          Sign Out
        </button>
      </div>

      {error && <div className="alert alert--error">{error}</div>}

      {loading ? (
        <p style={{ textAlign: 'center', color: 'var(--muted)' }}>Loading accounts...</p>
      ) : accounts.length === 0 ? (
        <div className="card">
          <p style={{ textAlign: 'center', color: 'var(--muted)' }}>No accounts yet. Create one to get started!</p>
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button className="btn btn--primary" onClick={() => navigate('/create-account')}>
              ✦ Create New Account
            </button>
          </div>
        </div>
      ) : (
        <div>
          {accounts.map(account => (
            <div key={account.account_id} className="card" style={{ marginBottom: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <h3 style={{ margin: '0 0 10px 0', color: 'var(--primary)' }}>
                    {account.account_type} Account
                  </h3>
                  <p style={{ margin: '5px 0', color: 'var(--muted)', fontSize: '0.9rem' }}>
                    Account ID: {account.account_id}
                  </p>
                  <p style={{ margin: '5px 0', fontSize: '1.2rem', fontWeight: '600' }}>
                    Balance: ${account.balance.toFixed(2)}
                  </p>
                  <p style={{ margin: '5px 0', color: 'var(--muted)', fontSize: '0.85rem' }}>
                    Created: {new Date(account.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                  <button
                    className="btn btn--primary"
                    onClick={() => navigate(`/account/${account.account_id}`)}
                    style={{ padding: '8px 12px', fontSize: '0.85rem', minWidth: '100px' }}
                  >
                    View Details
                  </button>
                  <button
                    className="btn btn--secondary"
                    onClick={() => navigate(`/edit-account/${account.account_id}`)}
                    style={{ padding: '8px 12px', fontSize: '0.85rem', minWidth: '100px' }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn--secondary"
                    onClick={() => navigate(`/account/${account.account_id}/deposit`)}
                    style={{ padding: '8px 12px', fontSize: '0.85rem', minWidth: '100px' }}
                  >
                    Deposit
                  </button>
                  <button
                    className="btn btn--secondary"
                    onClick={() => navigate(`/account/${account.account_id}/withdraw`)}
                    style={{ padding: '8px 12px', fontSize: '0.85rem', minWidth: '100px' }}
                  >
                    Withdraw
                  </button>
                  <button
                    className="btn btn--ghost"
                    onClick={() => handleDelete(account.account_id)}
                    style={{ padding: '8px 12px', fontSize: '0.85rem', minWidth: '100px', color: '#d9534f' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button className="btn btn--primary" onClick={() => navigate('/create-account')}>
              ✦ Create New Account
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
