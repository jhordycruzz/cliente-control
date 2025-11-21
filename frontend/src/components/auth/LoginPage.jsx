// frontend/src/components/auth/LoginPage.jsx
import { useState } from "react";
import { login } from "../../api/authApi";

export default function LoginPage({ onLogin }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.username || !form.password) {
      setError("Usuario y contraseña son obligatorios");
      return;
    }

    try {
      setLoading(true);
      const data = await login(form.username, form.password);
      onLogin(data.token, data.user);
    } catch (err) {
      setError(err.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center bg-slate-950">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-lg p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-slate-50 mb-1 text-center">
          Panel Cyberlink
        </h2>
        <p className="text-xs text-slate-400 mb-4 text-center">
          Inicia sesión para gestionar clientes y facturación.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-300">
              Usuario
            </label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-slate-700 bg-slate-950 text-sm text-slate-100 shadow-sm focus:border-cyan-400 focus:ring-cyan-400"
              autoComplete="username"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300">
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-slate-700 bg-slate-950 text-sm text-slate-100 shadow-sm focus:border-cyan-400 focus:ring-cyan-400"
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className="text-xs text-red-400 bg-red-950/40 border border-red-800 px-2 py-1 rounded">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex justify-center items-center px-3 py-1.5 rounded-md text-sm font-medium bg-cyan-500 text-slate-950 hover:bg-cyan-400 disabled:opacity-60"
          >
            {loading ? "Ingresando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
