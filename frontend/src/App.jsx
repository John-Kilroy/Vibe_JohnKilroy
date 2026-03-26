// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Home               from './pages/Home.jsx';
import Login              from './pages/Login.jsx';
import Register           from './pages/Register.jsx';
import AdminDashboard     from './pages/AdminDashboard.jsx';
import CustomerDashboard  from './pages/CustomerDashboard.jsx';
import CustomerList       from './pages/CustomerList.jsx';
import CustomerEdit       from './pages/CustomerEdit.jsx';
import CustomerAccounts   from './pages/CustomerAccounts.jsx';
import CreateAccount      from './pages/CreateAccount.jsx';
import ViewAccount        from './pages/ViewAccount.jsx';
import AccountDetails     from './pages/AccountDetails.jsx';
import Deposit            from './pages/Deposit.jsx';
import Withdraw           from './pages/Withdraw.jsx';
import TransactionHistory from './pages/TransactionHistory.jsx';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/"         element={<Home />} />
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin */}
          <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/customers" element={<ProtectedRoute adminOnly><CustomerList /></ProtectedRoute>} />
          <Route path="/admin/customers/:id/edit" element={<ProtectedRoute adminOnly><CustomerEdit /></ProtectedRoute>} />
          <Route path="/admin/customers/:id/accounts" element={<ProtectedRoute adminOnly><CustomerAccounts /></ProtectedRoute>} />

          {/* Customer */}
          <Route path="/dashboard" element={<ProtectedRoute><CustomerDashboard /></ProtectedRoute>} />

          {/* Banking (existing) */}
          <Route path="/create-account"            element={<CreateAccount />} />
          <Route path="/view-account"              element={<ViewAccount />} />
          <Route path="/account/:id"               element={<AccountDetails />} />
          <Route path="/account/:id/deposit"       element={<Deposit />} />
          <Route path="/account/:id/withdraw"      element={<Withdraw />} />
          <Route path="/account/:id/transactions"  element={<TransactionHistory />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
