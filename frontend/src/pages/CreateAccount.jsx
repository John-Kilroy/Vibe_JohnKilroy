// src/pages/CreateAccount.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createAccount } from '../api/bankApi';
import { useAuth } from '../context/AuthContext';

export default function CreateAccount() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const isCustomer = user?.role === 'customer';
  const backPath   = isCustomer ? '/dashboard' : '/admin/customers';

  const [form, setForm]       = useState({ name: '', email: '', accountType: 'SAVINGS' });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    setError('');
    // Admins must provide name + email; customers use their own from the token
    if (!isCustomer && (!form.name.trim() || !form.email.trim())) {
      setError('Name and email are required.');
      return;
    }
    setLoading(true);
    try {
      const account = await createAccount(form.name, form.email, form.accountType);
      navigate(`/account/${account.account_id}`, {
        state: { success: 'Account created successfully!' },
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <button className="back-link" onClick={() => navigate(backPath)}>← Back</button>
      <div className="brand"><div className="brand__logo">NovaBanc</div></div>

      <div className="card">
        <h2 className="section-title">Open an Account</h2>

        {error && <div className="alert alert--error">{error}</div>}

        {/* Admins specify the customer; customers use their own identity */}
        {isCustomer ? (
          <div className="detail-row" style={{ marginBottom: '20px' }}>
            <span className="detail-row__label">Account Holder</span>
            <span className="detail-row__value">{user.name}</span>
          </div>
        ) : (
          <>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name" name="name" type="text" placeholder="Jane Smith"
                value={form.name} onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email" name="email" type="email" placeholder="jane@example.com"
                value={form.email} onChange={handleChange}
              />
            </div>
          </>
        )}

        <div className="form-group">
          <label htmlFor="accountType">Account Type</label>
          <select id="accountType" name="accountType" value={form.accountType} onChange={handleChange}>
            <option value="SAVINGS">Savings</option>
            <option value="CHECKING">Checking</option>
            <option value="FIXED_DEPOSIT">Fixed Deposit</option>
          </select>
        </div>

        <button className="btn btn--primary" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Creating…' : 'Create Account'}
        </button>
      </div>
    </div>
  );
}
