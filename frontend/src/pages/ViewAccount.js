// src/pages/ViewAccount.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ViewAccount() {
  const navigate = useNavigate();
  const [accountId, setAccountId] = useState('');
  const [error, setError] = useState('');

  const handleGo = () => {
    const id = parseInt(accountId);
    if (!id || id <= 0) {
      setError('Please enter a valid Account ID.');
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

        {error && <div className="alert alert--error">{error}</div>}

        <div className="form-group">
          <label htmlFor="accountId">Account ID</label>
          <input
            id="accountId"
            type="number"
            min="1"
            placeholder="e.g. 1"
            value={accountId}
            onChange={(e) => { setError(''); setAccountId(e.target.value); }}
            onKeyDown={(e) => e.key === 'Enter' && handleGo()}
          />
        </div>

        <button className="btn btn--primary" onClick={handleGo}>
          Load Account →
        </button>
      </div>
    </div>
  );
}
