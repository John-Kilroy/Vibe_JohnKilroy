// src/pages/TransactionHistory.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getTransactions } from '../api/bankApi';

export default function TransactionHistory() {
  const { id }   = useParams();
  const navigate = useNavigate();

  const [txns, setTxns]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    getTransactions(id)
      .then(setTxns)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const fmt = (iso) =>
    new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    });

  const fmtTime = (iso) =>
    new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const totals = (type) =>
    txns.filter((t) => t.type === type).reduce((s, t) => s + t.amount, 0);

  return (
    <div className="page">
      <button className="back-link" onClick={() => navigate(`/account/${id}`)}>← Account Details</button>
      <div className="brand"><div className="brand__logo">NovaBanc</div></div>

      <div className="card card--wide">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '24px', borderBottom: '1px solid rgba(201,168,76,0.2)', paddingBottom: '12px' }}>
          <h2 className="section-title" style={{ margin: 0, border: 'none', padding: 0 }}>
            Transaction History
          </h2>
          <span className="mono">{id}</span>
        </div>

        {loading && <div className="spinner-wrap">Loading transactions…</div>}
        {error   && <div className="alert alert--error">{error}</div>}

        {!loading && !error && txns.length === 0 && (
          <div className="empty-state">No transactions yet.</div>
        )}

        {!loading && txns.length > 0 && (
          <>
            {/* Summary strip */}
            <div style={{
              display: 'flex', gap: '20px', marginBottom: '24px',
              background: 'rgba(201,168,76,0.06)', borderRadius: '8px', padding: '16px 20px',
            }}>
              <div>
                <div style={{ fontSize: '0.7rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '4px' }}>Total Deposits</div>
                <div style={{ color: 'var(--green)', fontFamily: 'var(--font-display)', fontSize: '1.2rem' }}>
                  +${totals('DEPOSIT').toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
              </div>
              <div style={{ width: '1px', background: 'rgba(255,255,255,0.07)' }} />
              <div>
                <div style={{ fontSize: '0.7rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '4px' }}>Total Withdrawals</div>
                <div style={{ color: '#e88', fontFamily: 'var(--font-display)', fontSize: '1.2rem' }}>
                  -${totals('WITHDRAWAL').toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
              </div>
              <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                <div style={{ fontSize: '0.7rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '4px' }}>Total</div>
                <div style={{ color: 'var(--cream)', fontFamily: 'var(--font-display)', fontSize: '1.2rem' }}>{txns.length}</div>
              </div>
            </div>

            <table className="txn-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Transaction ID</th>
                </tr>
              </thead>
              <tbody>
                {txns.map((t) => {
                  const isDeposit = t.type === 'DEPOSIT';
                  return (
                    <tr key={t.txn_id}>
                      <td>
                        <span className={`badge badge--${isDeposit ? 'deposit' : 'withdrawal'}`}>
                          {t.type}
                        </span>
                      </td>
                      <td className={`amount--${isDeposit ? 'deposit' : 'withdrawal'}`}>
                        {isDeposit ? '+' : '-'}${t.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td style={{ color: 'var(--text)' }}>{fmt(t.date)}</td>
                      <td style={{ color: 'var(--muted)' }}>{fmtTime(t.date)}</td>
                      <td><span className="mono">{t.txn_id}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
}
