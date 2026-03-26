// src/pages/CustomerAccounts.jsx  –  Admin: view/update/delete accounts for a customer
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getCustomer, getCustomerAccounts, updateAccount, deleteAccount } from '../api/adminApi';

const ACCOUNT_TYPES = ['SAVINGS', 'CHECKING', 'FIXED_DEPOSIT'];

function EditAccountRow({ account, token, onSaved, onDeleted }) {
  const [editing,     setEditing]     = useState(false);
  const [accountType, setAccountType] = useState(account.account_type);
  const [balance,     setBalance]     = useState(account.balance);
  const [saving,      setSaving]      = useState(false);
  const [error,       setError]       = useState('');

  const handleSave = async () => {
    setError(''); setSaving(true);
    try {
      const updated = await updateAccount(token, account.account_id, {
        account_type: accountType,
        balance: parseFloat(balance),
      });
      onSaved(updated);
      setEditing(false);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this account and all its transactions?')) return;
    try {
      await deleteAccount(token, account.account_id);
      onDeleted(account.account_id);
    } catch (e) {
      setError(e.message);
    }
  };

  if (!editing) {
    return (
      <tr>
        <td>{account.account_type}</td>
        <td className="amount--deposit">${account.balance.toFixed(2)}</td>
        <td style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>
          {new Date(account.created_at).toLocaleDateString()}
        </td>
        <td>
          <div className="btn-row" style={{ margin: 0 }}>
            <button
              className="btn btn--ghost"
              style={{ padding: '5px 12px', fontSize: '0.72rem' }}
              onClick={() => setEditing(true)}
            >
              Edit
            </button>
            <button
              className="btn btn--danger"
              style={{ padding: '5px 12px', fontSize: '0.72rem' }}
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
          {error && <p style={{ color: '#e88', fontSize: '0.75rem', marginTop: '4px' }}>{error}</p>}
        </td>
      </tr>
    );
  }

  return (
    <tr style={{ background: 'rgba(201,168,76,0.05)' }}>
      <td>
        <select value={accountType} onChange={e => setAccountType(e.target.value)} style={{ padding: '6px 10px' }}>
          {ACCOUNT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </td>
      <td>
        <input
          type="number"
          step="0.01"
          value={balance}
          onChange={e => setBalance(e.target.value)}
          style={{ padding: '6px 10px', width: '110px' }}
        />
      </td>
      <td></td>
      <td>
        <div className="btn-row" style={{ margin: 0 }}>
          <button
            className="btn btn--primary"
            style={{ padding: '5px 12px', fontSize: '0.72rem' }}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? '…' : 'Save'}
          </button>
          <button
            className="btn btn--ghost"
            style={{ padding: '5px 12px', fontSize: '0.72rem' }}
            onClick={() => { setEditing(false); setError(''); }}
          >
            Cancel
          </button>
        </div>
        {error && <p style={{ color: '#e88', fontSize: '0.75rem', marginTop: '4px' }}>{error}</p>}
      </td>
    </tr>
  );
}

export default function CustomerAccounts() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [customer,  setCustomer]  = useState(null);
  const [accounts,  setAccounts]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState('');

  useEffect(() => {
    Promise.all([
      getCustomer(token, id),
      getCustomerAccounts(token, id),
    ])
      .then(([cust, accs]) => { setCustomer(cust); setAccounts(accs); })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [token, id]);

  const handleSaved   = (updated) => setAccounts(prev => prev.map(a => a.account_id === updated.account_id ? updated : a));
  const handleDeleted = (accId)   => setAccounts(prev => prev.filter(a => a.account_id !== accId));

  return (
    <div className="page">
      <div className="home-hero">
        <div className="brand__logo">NovaBanc</div>
        <div className="home-hero__divider" />
      </div>

      <div className="card card--wide">
        <button className="back-link" onClick={() => navigate('/admin/customers')}>
          ← All Customers
        </button>

        {customer && (
          <div style={{ marginBottom: '20px' }}>
            <h1 className="section-title">{customer.name}'s Accounts</h1>
            <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{customer.email}</p>
          </div>
        )}

        {error   && <div className="alert alert--error">{error}</div>}
        {loading && <div className="spinner-wrap">Loading…</div>}

        {!loading && accounts.length === 0 && (
          <div className="empty-state">This customer has no accounts.</div>
        )}

        {!loading && accounts.length > 0 && (
          <table className="txn-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Balance</th>
                <th>Opened</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map(acc => (
                <EditAccountRow
                  key={acc.account_id}
                  account={acc}
                  token={token}
                  onSaved={handleSaved}
                  onDeleted={handleDeleted}
                />
              ))}
            </tbody>
          </table>
        )}

        <div className="btn-row" style={{ marginTop: '24px' }}>
          <button
            className="btn btn--ghost"
            onClick={() => navigate(`/admin/customers/${id}/edit`)}
          >
            Edit Customer Details
          </button>
        </div>
      </div>
    </div>
  );
}
