// src/api/bankApi.js  –  Centralised API calls
const BASE = '/api/accounts';
const USER_BASE = '/api/users';

async function handleResponse(res) {
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'An error occurred.');
  return data;
}

export const createAccount = (name, email, accountType) =>
  fetch(BASE, {
    method : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body   : JSON.stringify({ name, email, account_type: accountType }),
  }).then(handleResponse);

export const createAccountForUser = (userId, accountType) =>
  fetch(`${BASE}/create-for-user/${userId}`, {
    method : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body   : JSON.stringify({ account_type: accountType }),
  }).then(handleResponse);

export const getAccount = (id) =>
  fetch(`${BASE}/${id}`).then(handleResponse);

export const deposit = (id, amount) =>
  fetch(`${BASE}/${id}/deposit`, {
    method : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body   : JSON.stringify({ amount }),
  }).then(handleResponse);

export const withdraw = (id, amount) =>
  fetch(`${BASE}/${id}/withdraw`, {
    method : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body   : JSON.stringify({ amount }),
  }).then(handleResponse);

export const getTransactions = (id) =>
  fetch(`${BASE}/${id}/transactions`).then(handleResponse);

// ── User Authentication ──────────────────────────────────────
export const registerUser = (name, email, password) =>
  fetch(`${USER_BASE}/register`, {
    method : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body   : JSON.stringify({ name, email, password }),
  }).then(handleResponse);

export const signInUser = (email, password) =>
  fetch(`${USER_BASE}/signin`, {
    method : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body   : JSON.stringify({ email, password }),
  }).then(handleResponse);

// ── Account CRUD Operations ──────────────────────────────────
export const getUserAccounts = (userId) =>
  fetch(`${BASE}/user/${userId}`).then(handleResponse);

export const updateAccount = (accountId, accountType) =>
  fetch(`${BASE}/${accountId}`, {
    method : 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body   : JSON.stringify({ account_type: accountType }),
  }).then(handleResponse);

export const deleteAccount = (accountId) =>
  fetch(`${BASE}/${accountId}`, {
    method : 'DELETE',
  }).then(res => {
    if (!res.ok) throw new Error('Failed to delete account');
    return { success: true };
  });
