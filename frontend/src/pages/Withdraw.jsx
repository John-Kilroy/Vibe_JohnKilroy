// src/pages/Withdraw.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { withdraw, getAccount } from '../api/bankApi';

export default function Withdraw() {
  const { id }   = useParams();
  const navigate = useNavigate();

  const [amount, setAmount]   = useState('');
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  useEffect(() => {
    getAccount(id).then((acc) => setBalance(acc.balance)).catch(() => {});
  }, [id]);

  const handleSubmit = async () => {
    setError('');
    const parsed = parseFloat(amount);
    if (!parsed || parsed <= 0) {
      setError('Please enter a positive amount.');
      return;
    }
    setLoading(true);
    try {
      const result = await withdraw(id, parsed);
      navigate(`/account/${id}`, {
        state: {
          success: `Withdrawal of $${parsed.toFixed(2)} successful. New balance: $${result.new_balance.toFixed(2)}`,
        },
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
        <h2 className="section-title">Withdraw Funds</h2>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'baseline' }}>
          <span className="mono">{id}</span>
          {balance !== null && (
            <span style={{ color: 'var(--gold)', fontFamily: 'var(--font-display)', fontSize: '1.1rem' }}>
              Available: ${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          )}
        </div>

        {error && <div className="alert alert--error">{error}</div>}

        <div className="form-group">
          <label htmlFor="amount">Amount (USD)</label>
          <input
            id="amount" type="number" min="0.01" step="0.01" placeholder="0.00"
            value={amount}
            onChange={(e) => { setError(''); setAmount(e.target.value); }}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
        </div>

        {/* Quick percentage buttons */}
        {balance !== null && (
          <div className="btn-row" style={{ marginBottom: '10px' }}>
            {[25, 50, 75, 100].map((pct) => (
              <button key={pct} className="btn btn--ghost"
                style={{ flex: 1, padding: '8px 4px', fontSize: '0.78rem' }}
                onClick={() => setAmount(((balance * pct) / 100).toFixed(2))}>
                {pct}%
              </button>
            ))}
          </div>
        )}

        <button className="btn btn--primary" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Processing…' : 'Confirm Withdrawal'}
        </button>
      </div>
    </div>
  );
}
