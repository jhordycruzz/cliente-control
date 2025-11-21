// frontend/src/components/clientes/ClientesPage.jsx
import { useEffect, useState } from "react";
import {
  getClientes,
  createCliente,
  updateCliente,
  deleteCliente,
} from "../../api/clientesApi";
import ClienteForm from "./ClienteForm";
import ClientesTable from "./ClientesTable";

export default function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [clienteEditando, setClienteEditando] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  const cargarClientes = async () => {
    try {
      setLoading(true);
      const data = await getClientes();
      setClientes(data);
      setError("");
    } catch (err) {
      console.error(err);
      setError(err.message || "Error al cargar clientes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  const abrirNuevoCliente = () => {
    setClienteEditando(null);
    setMostrarModal(true);
  };

  const abrirEditarCliente = (cliente) => {
    setClienteEditando(cliente);
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setClienteEditando(null);
    setMostrarModal(false);
  };

  const handleGuardar = async (formData) => {
    try {
      if (clienteEditando) {
        await updateCliente(clienteEditando.id, formData);
      } else {
        await createCliente(formData);
      }
      setClienteEditando(null);
      setMostrarModal(false);
      await cargarClientes();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEliminarClick = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este cliente?")) return;
    try {
      await deleteCliente(id);
      await cargarClientes();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 relative">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Gestión de clientes
          </h2>
          <p className="text-sm text-gray-500">
            Administra los clientes de Cyberlink
          </p>
        </div>

        <div className="flex items-center gap-3">
          {error && (
            <span className="text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-1 rounded">
              {error}
            </span>
          )}
          <button
            onClick={abrirNuevoCliente}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            + Nuevo cliente
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500" />
        </div>
      ) : (
        <ClientesTable
          clientes={clientes}
          onEdit={abrirEditarCliente}
          onDelete={handleEliminarClick}
        />
      )}

      {/* MODAL CREAR / EDITAR */}
      {mostrarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-xl mx-4">
            <div className="flex items-center justify-between border-b px-4 py-2">
              <h3 className="text-base font-semibold text-gray-800">
                {clienteEditando ? "Editar cliente" : "Nuevo cliente"}
              </h3>
              <button
                onClick={cerrarModal}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="p-4">
              <ClienteForm
                onSubmit={handleGuardar}
                initialData={clienteEditando}
                onCancel={cerrarModal}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
