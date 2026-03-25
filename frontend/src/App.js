// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import Home               from './pages/Home';
import Register          from './pages/Register';
import SignIn            from './pages/SignIn';
import MyProfile         from './pages/MyProfile';
import ManageAccounts    from './pages/ManageAccounts';
import EditAccount       from './pages/EditAccount';
import CreateAccount      from './pages/CreateAccount';
import ViewAccount        from './pages/ViewAccount';
import AccountDetails     from './pages/AccountDetails';
import Deposit            from './pages/Deposit';
import Withdraw           from './pages/Withdraw';
import TransactionHistory from './pages/TransactionHistory';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"                               element={<Home />} />
        <Route path="/register"                       element={<Register />} />
        <Route path="/signin"                         element={<SignIn />} />
        <Route path="/profile"                        element={<MyProfile />} />
        <Route path="/manage-accounts"                element={<ManageAccounts />} />
        <Route path="/edit-account/:id"               element={<EditAccount />} />
        <Route path="/create-account"                 element={<CreateAccount />} />
        <Route path="/view-account"                   element={<ViewAccount />} />
        <Route path="/account/:id"                    element={<AccountDetails />} />
        <Route path="/account/:id/deposit"            element={<Deposit />} />
        <Route path="/account/:id/withdraw"           element={<Withdraw />} />
        <Route path="/account/:id/transactions"       element={<TransactionHistory />} />
        {/* Catch-all → home */}
        <Route path="*"                               element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
