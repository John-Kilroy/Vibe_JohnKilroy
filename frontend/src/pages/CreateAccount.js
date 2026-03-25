// src/pages/CreateAccount.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createAccount, createAccountForUser } from '../api/bankApi';

export default function CreateAccount() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [accountType, setAccountType] = useState('SAVINGS');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (user) {
      const parsedUser = JSON.parse(user);
      setCurrentUser(parsedUser);
      setName(parsedUser.name);
      setEmail(parsedUser.email);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (currentUser) {
      // Authenticated user - simple flow
      setLoading(true);
      try {
        const account = await createAccountForUser(currentUser.user_id, accountType);
        navigate(`/account/${account.account_id}`, { 
          state: { success: 'Account created successfully!' } 
        });
      } catch (err) {
        setError(err.message || 'Failed to create account. Please try again.');
        console.error('Create account error:', err);
      } finally {
        setLoading(false);
      }
    } else {
      // Non-authenticated user - need name and email
      if (!name.trim() || !email.trim()) {
        setError('Name and email are required.');
        return;
      }
      setLoading(true);
      try {
        const account = await createAccount(name, email, accountType);
        navigate(`/account/${account.account_id}`, { 
          state: { success: 'Account created successfully!' } 
        });
      } catch (err) {
        setError(err.message || 'Failed to create account. Please try again.');
        console.error('Create account error:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="page">
      <button className="back-link" onClick={() => navigate('/')}>← Back</button>
      <div className="brand"><div className="brand__logo">NovaBanc</div></div>

      <div className="card">
        <h2 className="section-title">Create New Account</h2>

        {error && <div className="alert alert--error">{error}</div>}

        <form onSubmit={handleSubmit}>
          {!currentUser ? (
            <>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input 
                  id="name" 
                  name="name" 
                  type="text" 
                  placeholder="Jane Smith"
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input 
                  id="email" 
                  name="email" 
                  type="email" 
                  placeholder="jane@example.com"
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                />
              </div>
            </>
          ) : (
            <>
              <div className="form-group">
                <label style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Full Name</label>
                <p style={{ margin: '0', fontSize: '1.1rem', fontWeight: '600' }}>
                  {currentUser.name}
                </p>
              </div>

              <div className="form-group">
                <label style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Email Address</label>
                <p style={{ margin: '0', fontSize: '1rem' }}>
                  {currentUser.email}
                </p>
              </div>
            </>
          )}

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

          <button 
            className="btn btn--primary" 
            type="submit" 
            disabled={loading}
          >
            {loading ? 'Creating...' : '✦ Create Account'}
          </button>
        </form>

        {!currentUser && (
          <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.9rem' }}>
            Already have an account?{' '}
            <button
              className="back-link"
              onClick={() => navigate('/signin')}
              style={{ cursor: 'pointer', textDecoration: 'underline' }}
            >
              Sign In
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
