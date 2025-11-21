import { useEffect, useState } from "react";
import ClientesPage from "./components/clientes/ClientesPage";
import PlanesPage from "./components/planes/PlanesPage";
import ContratosPage from "./components/contratos/ContratosPage";
import FacturasPage from "./components/facturas/FacturasPage";
import PagosPage from "./components/pagos/PagosPage";
import PortalClientePage from "./components/portal/PortalClientePage";
import PublicLanding from "./components/public/PublicLanding";
import LoginPage from "./components/auth/LoginPage";
import { setAuth, clearAuth, isLoggedIn, getUser } from "./auth";

function App() {
  const [vista, setVista] = useState("public");
  const [logged, setLogged] = useState(isLoggedIn());
  const [user, setUser] = useState(getUser());

  useEffect(() => {
    setLogged(isLoggedIn());
    setUser(getUser());
  }, []);

  const handleLogin = (token, usuario) => {
    setAuth(token, usuario);
    setLogged(true);
    setUser(usuario);
    // después de login puedes mandar al usuario a la vista que quieras:
    setVista("clientes");
  };

  const handleLogout = () => {
    clearAuth();
    setLogged(false);
    setUser(null);
    setVista("public");
  };

  const botonClase = (destino) =>
    `px-3 py-1 rounded ${
      vista === destino ? "bg-slate-700" : "hover:bg-slate-800 bg-transparent"
    }`;

  const esVistaAdmin = ["clientes", "planes", "contratos", "facturas", "pagos", "portal"].includes(
    vista
  );

  return (
    <div className="min-h-screen">
      <header className="bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-semibold">Cyberlink</h1>
          <nav className="flex flex-wrap gap-2 text-sm items-center">
            <button
              onClick={() => setVista("public")}
              className={botonClase("public")}
            >
              Sitio público
            </button>
            <button
              onClick={() => setVista("clientes")}
              className={botonClase("clientes")}
            >
              Admin · Clientes
            </button>
            <button
              onClick={() => setVista("planes")}
              className={botonClase("planes")}
            >
              Admin · Planes
            </button>
            <button
              onClick={() => setVista("contratos")}
              className={botonClase("contratos")}
            >
              Admin · Contratos
            </button>
            <button
              onClick={() => setVista("facturas")}
              className={botonClase("facturas")}
            >
              Admin · Facturas
            </button>
            <button
              onClick={() => setVista("pagos")}
              className={botonClase("pagos")}
            >
              Admin · Pagos
            </button>
            <button
              onClick={() => setVista("portal")}
              className={botonClase("portal")}
            >
              Admin · Portal cliente
            </button>

            {logged && (
              <>
                <span className="ml-3 text-xs text-slate-300">
                  {user?.username || "admin"}
                </span>
                <button
                  onClick={handleLogout}
                  className="ml-2 px-2 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700"
                >
                  Salir
                </button>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="py-0">
        {vista === "public" && <PublicLanding />}

        {esVistaAdmin && !logged && (
          <LoginPage onLogin={handleLogin} />
        )}

        {esVistaAdmin && logged && (
          <>
            {vista === "clientes" && <ClientesPage />}
            {vista === "planes" && <PlanesPage />}
            {vista === "contratos" && <ContratosPage />}
            {vista === "facturas" && <FacturasPage />}
            {vista === "pagos" && <PagosPage />}
            {vista === "portal" && <PortalClientePage />}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
