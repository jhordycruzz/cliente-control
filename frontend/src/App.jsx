import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:4000/api";

function App() {
  const [token, setToken] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // LOGIN
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState("");

  // CLIENTES / FACTURAS
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [invoices, setInvoices] = useState([]);

  // FORM CLIENTE
  const [clientForm, setClientForm] = useState({
    dni: "",
    name: "",
    phone: "",
    email: "",
    address: "",
    plan_amount: 30,
    contract_date: "",
  });

  // FORM FACTURA MANUAL
  const [invoiceForm, setInvoiceForm] = useState({
    date: "",
    amount: "",
  });

  // Al iniciar, revisar si hay token y usuario guardado
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (savedToken) {
      setToken(savedToken);
      axios.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }
      fetchClients();
    }
  }, []);

  // Cargar clientes
  const fetchClients = async () => {
    try {
      const res = await axios.get(`${API_URL}/clients`);
      setClients(res.data);
      if (res.data.length > 0 && !selectedClient) {
        handleSelectClient(res.data[0]);
      }
    } catch (err) {
      console.error("Error al cargar clientes:", err);
    }
  };

  // Seleccionar cliente
  const handleSelectClient = async (client) => {
    setSelectedClient(client);
    try {
      const res = await axios.get(`${API_URL}/clients/${client.id}/invoices`);
      setInvoices(res.data);
    } catch (err) {
      console.error("Error al cargar facturas:", err);
    }
  };

  // ===== LOGIN =====

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");

    try {
      const res = await axios.post(`${API_URL}/login`, loginForm);
      const { token, user } = res.data;

      setToken(token);
      setCurrentUser(user);

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      await fetchClients();
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 401) {
        setLoginError("Usuario o contraseña incorrectos");
      } else {
        setLoginError("Error al iniciar sesión");
      }
    }
  };

  const handleLogout = () => {
    setToken(null);
    setCurrentUser(null);
    setClients([]);
    setSelectedClient(null);
    setInvoices([]);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
  };

  // ===== FORM CLIENTE =====

  const handleClientFormChange = (e) => {
    const { name, value } = e.target;
    setClientForm((prev) => ({
      ...prev,
      [name]: name === "plan_amount" ? Number(value) : value,
    }));
  };

  const handleCreateClient = async (e) => {
    e.preventDefault();
    if (!clientForm.dni.trim() || !clientForm.name.trim()) return;

    try {
      await axios.post(`${API_URL}/clients`, clientForm);
      setClientForm({
        dni: "",
        name: "",
        phone: "",
        email: "",
        address: "",
        plan_amount: 30,
        contract_date: "",
      });
      await fetchClients();
    } catch (err) {
      console.error("Error al crear cliente:", err);
      alert("Error al crear cliente (revisa backend/BD en consola).");
    }
  };

  // ===== FORM FACTURA MANUAL =====

  const handleInvoiceFormChange = (e) => {
    const { name, value } = e.target;
    setInvoiceForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    if (!selectedClient) return;
    if (!invoiceForm.date || !invoiceForm.amount) return;

    try {
      await axios.post(`${API_URL}/clients/${selectedClient.id}/invoices`, {
        date: invoiceForm.date,
        amount: Number(invoiceForm.amount),
      });
      setInvoiceForm({ date: "", amount: "" });
      await handleSelectClient(selectedClient);
      await fetchClients();
    } catch (err) {
      console.error("Error al crear factura:", err);
    }
  };

  const handlePayInvoice = async (invoiceId) => {
    try {
      await axios.put(`${API_URL}/invoices/${invoiceId}/pay`);
      await handleSelectClient(selectedClient);
      await fetchClients();
    } catch (err) {
      console.error("Error al pagar factura:", err);
    }
  };

  const handleDeleteInvoice = async (invoiceId) => {
    try {
      await axios.delete(`${API_URL}/invoices/${invoiceId}`);
      await handleSelectClient(selectedClient);
      await fetchClients();
    } catch (err) {
      console.error("Error al eliminar factura:", err);
    }
  };

  const badgeClass = (status) =>
    status === "DEUDOR"
      ? "inline-flex items-center rounded-full bg-red-100 text-red-700 px-2 py-0.5 text-xs font-semibold"
      : "inline-flex items-center rounded-full bg-emerald-100 text-emerald-700 px-2 py-0.5 text-xs font-semibold";

  // ========== VISTA LOGIN ==========
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
        <div className="w-80 rounded-2xl bg-slate-900 border border-slate-700 shadow-xl p-6">
          <h2 className="text-center text-lg font-semibold mb-4">
            Login administrador
          </h2>
          <form
            onSubmit={handleLoginSubmit}
            className="flex flex-col gap-3 text-sm"
          >
            <input
              type="text"
              name="username"
              placeholder="Usuario"
              value={loginForm.username}
              onChange={handleLoginChange}
              className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={loginForm.password}
              onChange={handleLoginChange}
              className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            {loginError && (
              <div className="text-xs text-red-400">{loginError}</div>
            )}
            <button
              type="submit"
              className="mt-1 w-full rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold py-2 transition"
            >
              Entrar
            </button>
          </form>
          <p className="mt-4 text-[11px] text-slate-400 text-center">
            Usuario por defecto: <span className="font-semibold">admin</span>
            <br />
            Contraseña: <span className="font-semibold">admin123</span>
          </p>
        </div>
      </div>
    );
  }

  // ========== VISTA INICIO (OPCIÓN: REGISTRAR CLIENTE) ==========
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Top bar */}
      <header className="fixed top-0 left-0 right-0 z-10 bg-slate-900 border-b border-slate-800 px-4 py-2 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold">Inicio – Control de clientes</p>
          {currentUser && (
            <p className="text-[11px] text-slate-400">
              Sesión: <span className="font-semibold">{currentUser.username}</span> (
              {currentUser.role})
            </p>
          )}
        </div>
        <button
          onClick={handleLogout}
          className="text-xs rounded-lg bg-slate-800 px-3 py-1 hover:bg-red-500 hover:text-white transition"
        >
          Cerrar sesión
        </button>
      </header>

      <main className="flex pt-12 min-h-screen">
        {/* Columna izquierda: lista + registro de clientes */}
        <section className="w-full md:w-1/3 border-r border-slate-800 p-4 space-y-4">
          <h2 className="text-lg font-semibold mb-2">
            Opción 1: Registrar nuevo cliente
          </h2>

          {/* Lista de clientes */}
          <ul className="space-y-2 max-h-[45vh] overflow-y-auto pr-1 text-sm">
            {clients.map((client) => (
              <li
                key={client.id}
                onClick={() => handleSelectClient(client)}
                className={`cursor-pointer rounded-xl border px-3 py-2 ${
                  selectedClient && selectedClient.id === client.id
                    ? "border-cyan-400 bg-slate-800"
                    : "border-slate-800 bg-slate-900 hover:border-cyan-500/60"
                }`}
              >
                <strong className="block text-sm">{client.name}</strong>
                <p className="text-xs text-slate-300">
                  DNI: {client.dni || "-"} · Cel: {client.phone || "-"}
                </p>
                <p className="text-xs text-slate-300">
                  Plan: S/ {client.plan_amount || 0} · Contrato:{" "}
                  {client.contract_date || "-"}
                </p>
                <p className="text-xs text-slate-300 flex items-center gap-2 mt-1">
                  Deuda: S/ {client.debt?.toFixed(2)}{" "}
                  <span className={badgeClass(client.status)}>
                    {client.status}
                  </span>
                </p>
              </li>
            ))}
            {clients.length === 0 && (
              <li className="text-xs text-slate-400">
                No hay clientes registrados.
              </li>
            )}
          </ul>

          {/* Formulario de registro de cliente */}
          <div className="border-t border-slate-800 pt-3">
            <h3 className="text-sm font-semibold mb-2">Registrar nuevo cliente</h3>
            <form
              onSubmit={handleCreateClient}
              className="flex flex-col gap-2 text-sm"
            >
              <input
                type="text"
                name="dni"
                placeholder="DNI *"
                value={clientForm.dni}
                onChange={handleClientFormChange}
                className="rounded-lg bg-slate-900 border border-slate-700 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <input
                type="text"
                name="name"
                placeholder="Nombres completos *"
                value={clientForm.name}
                onChange={handleClientFormChange}
                className="rounded-lg bg-slate-900 border border-slate-700 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <input
                type="text"
                name="phone"
                placeholder="Celular"
                value={clientForm.phone}
                onChange={handleClientFormChange}
                className="rounded-lg bg-slate-900 border border-slate-700 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <input
                type="email"
                name="email"
                placeholder="Email (opcional)"
                value={clientForm.email}
                onChange={handleClientFormChange}
                className="rounded-lg bg-slate-900 border border-slate-700 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <input
                type="text"
                name="address"
                placeholder="Dirección (opcional)"
                value={clientForm.address}
                onChange={handleClientFormChange}
                className="rounded-lg bg-slate-900 border border-slate-700 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />

              {/* Plan */}
              <div className="text-xs">
                <p className="mb-1 text-slate-200">Plan mensual</p>
                <div className="flex gap-3">
                  {[30, 50, 100].map((plan) => (
                    <label key={plan} className="flex items-center gap-1">
                      <input
                        type="radio"
                        name="plan_amount"
                        value={plan}
                        checked={clientForm.plan_amount === plan}
                        onChange={handleClientFormChange}
                      />
                      <span>S/ {plan}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Fecha de contrato */}
              <div className="text-xs">
                <p className="mb-1 text-slate-200">Fecha de contrato</p>
                <input
                  type="date"
                  name="contract_date"
                  value={clientForm.contract_date}
                  onChange={handleClientFormChange}
                  className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <button
                type="submit"
                className="mt-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold py-1.5 text-sm transition"
              >
                Guardar cliente
              </button>
            </form>
          </div>
        </section>

        {/* Columna derecha: facturas del cliente seleccionado */}
        <section className="flex-1 p-4">
          {selectedClient ? (
            <>
              <h2 className="text-lg font-semibold mb-1">
                Facturas de {selectedClient.name}
              </h2>
              <p className="text-xs text-slate-300 mb-3">
                Plan: S/ {selectedClient.plan_amount || 0} · Contrato:{" "}
                {selectedClient.contract_date || "-"}
              </p>

              <div className="overflow-x-auto text-sm">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-slate-700 text-xs text-slate-400">
                      <th className="text-left py-2">Fecha</th>
                      <th className="text-right py-2">Monto</th>
                      <th className="text-center py-2">Estado</th>
                      <th className="text-center py-2">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((inv) => (
                      <tr
                        key={inv.id}
                        className="border-b border-slate-800 last:border-0"
                      >
                        <td className="py-1.5">{inv.date}</td>
                        <td className="py-1.5 text-right">
                          S/ {inv.amount.toFixed(2)}
                        </td>
                        <td className="py-1.5 text-center">
                          {inv.paid ? "PAGADA" : "PENDIENTE"}
                        </td>
                        <td className="py-1.5 text-center space-x-2">
                          {!inv.paid && (
                            <button
                              onClick={() => handlePayInvoice(inv.id)}
                              className="text-xs rounded-lg bg-emerald-500/80 hover:bg-emerald-400 text-slate-900 px-2 py-1"
                            >
                              Marcar pagada
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteInvoice(inv.id)}
                            className="text-xs rounded-lg bg-red-500/80 hover:bg-red-400 text-slate-900 px-2 py-1"
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                    {invoices.length === 0 && (
                      <tr>
                        <td
                          colSpan="4"
                          className="text-center text-xs text-slate-400 py-3"
                        >
                          Sin facturas
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 max-w-xs">
                <h3 className="text-sm font-semibold mb-2">
                  Crear factura manual
                </h3>
                <form
                  onSubmit={handleCreateInvoice}
                  className="flex flex-col gap-2 text-sm"
                >
                  <input
                    type="date"
                    name="date"
                    value={invoiceForm.date}
                    onChange={handleInvoiceFormChange}
                    className="rounded-lg bg-slate-900 border border-slate-700 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                  <input
                    type="number"
                    name="amount"
                    placeholder="Monto"
                    value={invoiceForm.amount}
                    onChange={handleInvoiceFormChange}
                    step="0.01"
                    className="rounded-lg bg-slate-900 border border-slate-700 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                  <button
                    type="submit"
                    className="mt-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold py-1.5 text-sm transition"
                  >
                    Guardar factura
                  </button>
                </form>
              </div>
            </>
          ) : (
            <p className="text-sm text-slate-300">
              Selecciona un cliente o registra uno nuevo en la columna izquierda.
            </p>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
