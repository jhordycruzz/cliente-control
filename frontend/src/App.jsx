// src/App.jsx
import { useState } from "react";
import ClientesPage from "./components/clientes/ClientesPage";
import PlanesPage from "./components/planes/PlanesPage";
import ContratosPage from "./components/contratos/ContratosPage";
import FacturasPage from "./components/facturas/FacturasPage";
import PagosPage from "./components/pagos/PagosPage";

function App() {
  const [vista, setVista] = useState("clientes");

  const botonClase = (destino) =>
    `px-3 py-1 rounded text-xs sm:text-sm whitespace-nowrap
     ${vista === destino ? "bg-slate-700 text-white" : "bg-transparent hover:bg-slate-800 text-slate-100"}`;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      {/* HEADER */}
      <header className="border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 py-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-lg sm:text-xl font-semibold">
            Sistema de Control – Cyberlink
          </h1>

          {/* NAV – se vuelve scroll horizontal en pantallas muy chicas */}
          <nav className="overflow-x-auto">
            <div className="flex gap-2">
              <button onClick={() => setVista("clientes")}  className={botonClase("clientes")}>Clientes</button>
              <button onClick={() => setVista("planes")}    className={botonClase("planes")}>Planes</button>
              <button onClick={() => setVista("contratos")} className={botonClase("contratos")}>Contratos</button>
              <button onClick={() => setVista("facturas")}  className={botonClase("facturas")}>Facturas</button>
              <button onClick={() => setVista("pagos")}     className={botonClase("pagos")}>Pagos</button>
            </div>
          </nav>
        </div>
      </header>

      {/* CONTENIDO */}
      <main className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {vista === "clientes"  && <ClientesPage />}
        {vista === "planes"    && <PlanesPage />}
        {vista === "contratos" && <ContratosPage />}
        {vista === "facturas"  && <FacturasPage />}
        {vista === "pagos"     && <PagosPage />}
      </main>
    </div>
  );
}

export default App;
