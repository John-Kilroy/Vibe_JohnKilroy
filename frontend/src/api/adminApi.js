// src/api/adminApi.js  –  Admin CRUD endpoints
const BASE = '/api/admin';

function authHeaders(token) {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
}

async function handleResponse(res) {
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'An error occurred.');
  return data;
}

export const getCustomers = (token) =>
  fetch(`${BASE}/customers`, { headers: authHeaders(token) }).then(handleResponse);

export const getCustomer = (token, id) =>
  fetch(`${BASE}/customers/${id}`, { headers: authHeaders(token) }).then(handleResponse);

export const updateCustomer = (token, id, data) =>
  fetch(`${BASE}/customers/${id}`, {
    method : 'PUT',
    headers: authHeaders(token),
    body   : JSON.stringify(data),
  }).then(handleResponse);

export const deleteCustomer = (token, id) =>
  fetch(`${BASE}/customers/${id}`, {
    method : 'DELETE',
    headers: authHeaders(token),
  }).then(handleResponse);

export const getCustomerAccounts = (token, userId) =>
  fetch(`${BASE}/customers/${userId}/accounts`, { headers: authHeaders(token) }).then(handleResponse);

export const updateAccount = (token, accountId, data) =>
  fetch(`${BASE}/accounts/${accountId}`, {
    method : 'PUT',
    headers: authHeaders(token),
    body   : JSON.stringify(data),
  }).then(handleResponse);

export const deleteAccount = (token, accountId) =>
  fetch(`${BASE}/accounts/${accountId}`, {
    method : 'DELETE',
    headers: authHeaders(token),
  }).then(handleResponse);
