// frontend/src/api/authApi.js
const API_URL = "http://localhost:3000/api/auth";

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

  // Esperamos: { token, user }
  return res.json();
}
