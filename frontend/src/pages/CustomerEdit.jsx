// src/pages/CustomerEdit.jsx  –  Admin: edit a customer's details
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getCustomer, updateCustomer } from '../api/adminApi';

export default function CustomerEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [name,    setName]    = useState('');
  const [email,   setEmail]   = useState('');
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    getCustomer(token, id)
      .then(c => { setName(c.name); setEmail(c.email); })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [token, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    setSaving(true);
    try {
      await updateCustomer(token, id, { name, email });
      setSuccess('Customer updated successfully.');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page">
      <div className="home-hero">
        <div className="brand__logo">NovaBanc</div>
        <div className="home-hero__divider" />
      </div>

      <div className="card">
        <button className="back-link" onClick={() => navigate('/admin/customers')}>
          ← All Customers
        </button>
        <h1 className="section-title">Edit Customer</h1>

        {error   && <div className="alert alert--error">{error}</div>}
        {success && <div className="alert alert--success">{success}</div>}

        {loading ? (
          <div className="spinner-wrap">Loading…</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="btn-row">
              <button className="btn btn--primary" type="submit" disabled={saving}>
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => navigate(`/admin/customers/${id}/accounts`)}
              >
                View Accounts
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
