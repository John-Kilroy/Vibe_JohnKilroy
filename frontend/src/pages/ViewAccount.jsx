// src/pages/ViewAccount.jsx
// MongoDB account IDs are 24-character hex ObjectId strings, not integers.
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const OBJECT_ID_REGEX = /^[a-f\d]{24}$/i;

export default function ViewAccount() {
  const navigate  = useNavigate();
  const [accountId, setAccountId] = useState('');
  const [error, setError]         = useState('');

  const handleGo = () => {
    const id = accountId.trim();
    if (!OBJECT_ID_REGEX.test(id)) {
      setError('Please enter a valid 24-character MongoDB Account ID.');
      return;
    }
    navigate(`/account/${id}`);
  };

  return (
    <div className="page">
      <button className="back-link" onClick={() => navigate('/')}>← Back</button>
      <div className="brand"><div className="brand__logo">NovaBanc</div></div>

      <div className="card">
        <h2 className="section-title">View Account</h2>

        <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '20px' }}>
          Enter the 24-character Account ID returned when the account was created.
        </p>

        {error && <div className="alert alert--error">{error}</div>}

        <div className="form-group">
          <label htmlFor="accountId">Account ID</label>
          <input
            id="accountId"
            type="text"
            placeholder="e.g. 6650a3f2c1b4e800123abcde"
            value={accountId}
            onChange={(e) => { setError(''); setAccountId(e.target.value); }}
            onKeyDown={(e) => e.key === 'Enter' && handleGo()}
            style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}
          />
        </div>

        <button className="btn btn--primary" onClick={handleGo}>
          Load Account →
        </button>
      </div>
    </div>
  );
}
