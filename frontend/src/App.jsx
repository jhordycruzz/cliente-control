import { useState } from "react";
import ClientesPage from "./components/clientes/ClientesPage";
import PlanesPage from "./components/planes/PlanesPage";
import ContratosPage from "./components/contratos/ContratosPage";

function App() {
  const [vista, setVista] = useState("clientes");

  const botonClase = (destino) =>
    `px-3 py-1 rounded ${
      vista === destino ? "bg-slate-700" : "hover:bg-slate-800 bg-transparent"
    }`;

  return (
    <div className="min-h-screen">
      <header className="bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-semibold">
            Sistema de Control — Cyberlink
          </h1>
          <nav className="flex gap-2 text-sm">
            <button
              onClick={() => setVista("clientes")}
              className={botonClase("clientes")}
            >
              Clientes
            </button>
            <button
              onClick={() => setVista("planes")}
              className={botonClase("planes")}
            >
              Planes
            </button>
            <button
              onClick={() => setVista("contratos")}
              className={botonClase("contratos")}
            >
              Contratos
            </button>
          </nav>
        </div>
      </header>

      <main className="py-4">
        {vista === "clientes" && <ClientesPage />}
        {vista === "planes" && <PlanesPage />}
        {vista === "contratos" && <ContratosPage />}
      </main>
    </div>
  );
}

export default App;
