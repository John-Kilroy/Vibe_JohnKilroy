// src/pages/TransactionHistory.js
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

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  const formatTime = (d) =>
    new Date(d).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="page">
      <button className="back-link" onClick={() => navigate(`/account/${id}`)}>← Account Details</button>
      <div className="brand"><div className="brand__logo">NovaBanc</div></div>

      <div className="card card--wide">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '24px', borderBottom: '1px solid rgba(201,168,76,0.2)', paddingBottom: '12px' }}>
          <h2 className="section-title" style={{ margin: 0, border: 'none', padding: 0 }}>
            Transaction History
          </h2>
          <span style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>Account #{id}</span>
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
              background: 'rgba(201,168,76,0.06)', borderRadius: '8px', padding: '16px 20px'
            }}>
              <div>
                <div style={{ fontSize: '0.7rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '4px' }}>Total Deposits</div>
                <div style={{ color: 'var(--green)', fontFamily: 'var(--font-display)', fontSize: '1.2rem' }}>
                  +${txns
                    .filter(t => t.type === 'DEPOSIT')
                    .reduce((s, t) => s + t.amount, 0)
                    .toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
              </div>
              <div style={{ width: '1px', background: 'rgba(255,255,255,0.07)' }} />
              <div>
                <div style={{ fontSize: '0.7rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '4px' }}>Total Withdrawals</div>
                <div style={{ color: '#e88', fontFamily: 'var(--font-display)', fontSize: '1.2rem' }}>
                  -${txns
                    .filter(t => t.type === 'WITHDRAWAL')
                    .reduce((s, t) => s + t.amount, 0)
                    .toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
              </div>
              <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                <div style={{ fontSize: '0.7rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '4px' }}>Transactions</div>
                <div style={{ color: 'var(--cream)', fontFamily: 'var(--font-display)', fontSize: '1.2rem' }}>{txns.length}</div>
              </div>
            </div>

            <table className="txn-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {txns.map((t) => (
                  <tr key={t.txnId}>
                    <td style={{ color: 'var(--muted)' }}>#{t.txnId}</td>
                    <td>
                      <span className={`badge badge--${t.type === 'DEPOSIT' ? 'deposit' : 'withdrawal'}`}>
                        {t.type}
                      </span>
                    </td>
                    <td className={`amount--${t.type === 'DEPOSIT' ? 'deposit' : 'withdrawal'}`}>
                      {t.type === 'DEPOSIT' ? '+' : '-'}
                      ${t.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td style={{ color: 'var(--text)' }}>{formatDate(t.date)}</td>
                    <td style={{ color: 'var(--muted)' }}>{formatTime(t.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
}
