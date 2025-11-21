// frontend/src/api/authApi.js
import { API_BASE_URL } from "./config";
const API_URL = `${API_BASE_URL}/auth`;

export async function login(username, password) {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || "Error al iniciar sesión");
  }

  return res.json(); // { token, user }
}

