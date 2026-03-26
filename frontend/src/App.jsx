// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import Home               from './pages/Home.jsx';
import CreateAccount      from './pages/CreateAccount.jsx';
import ViewAccount        from './pages/ViewAccount.jsx';
import AccountDetails     from './pages/AccountDetails.jsx';
import Deposit            from './pages/Deposit.jsx';
import Withdraw           from './pages/Withdraw.jsx';
import TransactionHistory from './pages/TransactionHistory.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"                          element={<Home />} />
        <Route path="/create-account"            element={<CreateAccount />} />
        <Route path="/view-account"              element={<ViewAccount />} />
        <Route path="/account/:id"               element={<AccountDetails />} />
        <Route path="/account/:id/deposit"       element={<Deposit />} />
        <Route path="/account/:id/withdraw"      element={<Withdraw />} />
        <Route path="/account/:id/transactions"  element={<TransactionHistory />} />
        <Route path="*"                          element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
