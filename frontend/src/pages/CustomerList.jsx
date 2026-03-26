// src/pages/CustomerList.jsx  –  Admin: view and manage all customers
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getCustomers, deleteCustomer } from '../api/adminApi';

export default function CustomerList() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [customers, setCustomers] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState('');

  const load = () => {
    setLoading(true);
    getCustomers(token)
      .then(setCustomers)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, [token]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete customer "${name}" and all their accounts? This cannot be undone.`)) return;
    try {
      await deleteCustomer(token, id);
      setCustomers(prev => prev.filter(c => c.user_id !== id));
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="page">
      <div className="home-hero">
        <div className="brand__logo">NovaBanc</div>
        <div className="home-hero__divider" />
      </div>

      <div className="card card--wide">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h1 className="section-title" style={{ marginBottom: 0, borderBottom: 'none', paddingBottom: 0 }}>
            All Customers
          </h1>
          <button className="btn btn--ghost" style={{ width: 'auto' }} onClick={() => navigate('/admin')}>
            ← Dashboard
          </button>
        </div>

        {error   && <div className="alert alert--error">{error}</div>}
        {loading && <div className="spinner-wrap">Loading customers…</div>}

        {!loading && customers.length === 0 && (
          <div className="empty-state">No customers registered yet.</div>
        )}

        {!loading && customers.length > 0 && (
          <table className="txn-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Accounts</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map(c => (
                <tr key={c.user_id}>
                  <td>{c.name}</td>
                  <td style={{ color: 'var(--muted)' }}>{c.email}</td>
                  <td style={{ textAlign: 'center' }}>{c.account_count}</td>
                  <td style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>
                    {new Date(c.created_at).toLocaleDateString()}
                  </td>
                  <td>
                    <div className="btn-row" style={{ margin: 0 }}>
                      <button
                        className="btn btn--secondary"
                        style={{ padding: '5px 12px', fontSize: '0.72rem' }}
                        onClick={() => navigate(`/admin/customers/${c.user_id}/accounts`)}
                      >
                        Accounts
                      </button>
                      <button
                        className="btn btn--ghost"
                        style={{ padding: '5px 12px', fontSize: '0.72rem' }}
                        onClick={() => navigate(`/admin/customers/${c.user_id}/edit`)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn--danger"
                        style={{ padding: '5px 12px', fontSize: '0.72rem' }}
                        onClick={() => handleDelete(c.user_id, c.name)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
