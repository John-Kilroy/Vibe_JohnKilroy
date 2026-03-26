// src/api/authApi.js  –  Auth endpoints
const BASE = '/api/auth';

async function handleResponse(res) {
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'An error occurred.');
  return data;
}

export const register = (name, email, password) =>
  fetch(`${BASE}/register`, {
    method : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body   : JSON.stringify({ name, email, password }),
  }).then(handleResponse);

export const login = (email, password) =>
  fetch(`${BASE}/login`, {
    method : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body   : JSON.stringify({ email, password }),
  }).then(handleResponse);
