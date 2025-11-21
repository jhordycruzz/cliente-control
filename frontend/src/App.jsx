// frontend/src/App.jsx
import ClientesPage from "./components/clientes/ClientesPage";

function App() {
  return (
    <div className="min-h-screen">
      <header className="bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-semibold">
            Sistema de Control de Clientes — Cyberlink
          </h1>
          <span className="text-xs text-slate-300">
            Módulo admin (luego haremos portal cliente)
          </span>
        </div>
      </header>

      <main className="py-4">
        <ClientesPage />
      </main>
    </div>
  );
}

export default App;
