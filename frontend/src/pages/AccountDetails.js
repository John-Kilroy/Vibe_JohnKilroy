// src/pages/AccountDetails.js
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { getAccount } from '../api/bankApi';

export default function AccountDetails() {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const location  = useLocation();

  const [account, setAccount]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState(location.state?.success || '');

  useEffect(() => {
    setLoading(true);
    getAccount(id)
      .then(setAccount)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="page">
      <div className="spinner-wrap">Loading account…</div>
    </div>
  );

  return (
    <div className="page">
      <button className="back-link" onClick={() => navigate('/')}>← Home</button>
      <div className="brand"><div className="brand__logo">NovaBanc</div></div>

      <div className="card">
        <h2 className="section-title">Account Details</h2>

        {success && <div className="alert alert--success">{success}</div>}
        {error   && <div className="alert alert--error">{error}</div>}

        {account && (
          <>
            <div className="detail-row">
              <span className="detail-row__label">Account ID</span>
              <span className="detail-row__value">#{account.accountId}</span>
            </div>
            <div className="detail-row">
              <span className="detail-row__label">Account Holder</span>
              <span className="detail-row__value">{account.userName}</span>
            </div>
            <div className="detail-row">
              <span className="detail-row__label">Email</span>
              <span className="detail-row__value">{account.email}</span>
            </div>
            <div className="detail-row">
              <span className="detail-row__label">Account Type</span>
              <span className="detail-row__value">{account.accountType}</span>
            </div>
            <div className="detail-row">
              <span className="detail-row__label">Balance</span>
              <span className="detail-row__value detail-row__value--balance">
                ${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-row__label">Opened</span>
              <span className="detail-row__value">
                {new Date(account.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'long', day: 'numeric'
                })}
              </span>
            </div>

            <div className="btn-row" style={{ marginTop: '28px' }}>
              <button
                className="btn btn--primary"
                style={{ flex: 1 }}
                onClick={() => navigate(`/account/${id}/deposit`)}
              >
                Deposit
              </button>
              <button
                className="btn btn--secondary"
                style={{ flex: 1 }}
                onClick={() => navigate(`/account/${id}/withdraw`)}
              >
                Withdraw
              </button>
            </div>
            <div className="btn-row">
              <button
                className="btn btn--ghost"
                style={{ flex: 1 }}
                onClick={() => navigate(`/account/${id}/transactions`)}
              >
                Transaction History
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
