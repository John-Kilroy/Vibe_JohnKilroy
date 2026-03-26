// src/api/bankApi.js  –  Centralised fetch helpers
// MongoDB IDs are 24-char hex strings (ObjectId), not integers.

const BASE = '/api/accounts';

function getHeaders() {
  const token = localStorage.getItem('nb_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handleResponse(res) {
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'An error occurred.');
  return data;
}

export const createAccount = (name, email, accountType) =>
  fetch(`${BASE}/`, {
    method : 'POST',
    headers: getHeaders(),
    body   : JSON.stringify({ name, email, account_type: accountType }),
  }).then(handleResponse);

export const getAccount = (id) =>
  fetch(`${BASE}/${id}`, { headers: getHeaders() }).then(handleResponse);

export const deposit = (id, amount) =>
  fetch(`${BASE}/${id}/deposit`, {
    method : 'POST',
    headers: getHeaders(),
    body   : JSON.stringify({ amount }),
  }).then(handleResponse);

export const withdraw = (id, amount) =>
  fetch(`${BASE}/${id}/withdraw`, {
    method : 'POST',
    headers: getHeaders(),
    body   : JSON.stringify({ amount }),
  }).then(handleResponse);

export const getTransactions = (id) =>
  fetch(`${BASE}/${id}/transactions`, { headers: getHeaders() }).then(handleResponse);
