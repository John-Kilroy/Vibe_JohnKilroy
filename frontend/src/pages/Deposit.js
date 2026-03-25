// src/pages/Deposit.js
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { deposit } from '../api/bankApi';

export default function Deposit() {
  const { id }   = useParams();
  const navigate = useNavigate();

  const [amount, setAmount]   = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleSubmit = async () => {
    setError('');
    const parsed = parseFloat(amount);
    if (!parsed || parsed <= 0) {
      setError('Please enter a positive amount.');
      return;
    }
    setLoading(true);
    try {
      const result = await deposit(id, parsed);
      navigate(`/account/${id}`, {
        state: {
          success: `Deposit of $${parsed.toFixed(2)} successful. New balance: $${result.new_balance.toFixed(2)}`
        }
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <button className="back-link" onClick={() => navigate(`/account/${id}`)}>← Account Details</button>
      <div className="brand"><div className="brand__logo">NovaBanc</div></div>

      <div className="card">
        <h2 className="section-title">Deposit Funds</h2>
        <p style={{ color: 'var(--muted)', fontSize: '0.88rem', marginBottom: '24px' }}>
          Account <strong style={{ color: 'var(--gold)' }}>#{id}</strong>
        </p>

        {error && <div className="alert alert--error">{error}</div>}

        <div className="form-group">
          <label htmlFor="amount">Amount (USD)</label>
          <input
            id="amount"
            type="number"
            min="0.01"
            step="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => { setError(''); setAmount(e.target.value); }}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
        </div>

        {/* Quick-select buttons */}
        <div className="btn-row" style={{ marginBottom: '8px' }}>
          {[100, 500, 1000, 5000].map((v) => (
            <button
              key={v}
              className="btn btn--ghost"
              style={{ flex: 1, padding: '8px 4px', fontSize: '0.78rem' }}
              onClick={() => setAmount(String(v))}
            >
              +${v}
            </button>
          ))}
        </div>

        <button className="btn btn--primary" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Processing…' : 'Confirm Deposit'}
        </button>
      </div>
    </div>
  );
}
