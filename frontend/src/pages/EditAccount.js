// src/pages/EditAccount.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAccount, updateAccount } from '../api/bankApi';

export default function EditAccount() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [account, setAccount] = useState(null);
  const [accountType, setAccountType] = useState('SAVINGS');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (!user) {
      navigate('/signin');
      return;
    }
    loadAccount();
  }, [id, navigate]);

  const loadAccount = async () => {
    try {
      setLoading(true);
      const data = await getAccount(parseInt(id));
      setAccount(data);
      setAccountType(data.account_type);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (accountType === account.account_type) {
      setError('No changes made.');
      return;
    }

    setSaving(true);
    try {
      const updated = await updateAccount(parseInt(id), accountType);
      setAccount(updated);
      setSuccess('Account updated successfully!');
      setTimeout(() => navigate('/manage-accounts'), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="page"><p style={{ textAlign: 'center' }}>Loading account...</p></div>;
  }

  return (
    <div className="page">
      <button className="back-link" onClick={() => navigate('/manage-accounts')}>← Back</button>
      <div className="brand"><div className="brand__logo">NovaBanc</div></div>

      <div className="card">
        <h2 className="section-title">Edit Account</h2>

        {error && <div className="alert alert--error">{error}</div>}
        {success && <div className="alert alert--success">{success}</div>}

        {account && (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Account ID</label>
              <p style={{ margin: '0', fontSize: '1.1rem', fontWeight: '600' }}>{account.account_id}</p>
            </div>

            <div className="form-group">
              <label style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Current Balance</label>
              <p style={{ margin: '0', fontSize: '1.1rem', fontWeight: '600' }}>${account.balance.toFixed(2)}</p>
            </div>

            <div className="form-group">
              <label htmlFor="accountType">Account Type</label>
              <select
                id="accountType"
                value={accountType}
                onChange={(e) => setAccountType(e.target.value)}
              >
                <option value="SAVINGS">Savings</option>
                <option value="CHECKING">Checking</option>
                <option value="FIXED_DEPOSIT">Fixed Deposit</option>
              </select>
            </div>

            <div className="form-group">
              <label style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Created On</label>
              <p style={{ margin: '0', fontSize: '0.95rem' }}>
                {new Date(account.created_at).toLocaleDateString()}
              </p>
            </div>

            <button className="btn btn--primary" type="submit" disabled={saving}>
              {saving ? 'Saving...' : '✦ Save Changes'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
