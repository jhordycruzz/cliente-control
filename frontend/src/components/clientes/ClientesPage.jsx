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

  const handleGuardar = async (formData) => {
    try {
      if (clienteEditando) {
        await updateCliente(clienteEditando.id, formData);
      } else {
        await createCliente(formData);
      }
      setClienteEditando(null);
      await cargarClientes();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEditarClick = (cliente) => {
    setClienteEditando(cliente);
  };

  const handleCancelarEdicion = () => {
    setClienteEditando(null);
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
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">
          Gestión de clientes
        </h2>
        {error && (
          <span className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-1 rounded">
            {error}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ClienteForm
            onSubmit={handleGuardar}
            initialData={clienteEditando}
            onCancel={handleCancelarEdicion}
          />
        </div>

        <div className="lg:col-span-2">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500" />
            </div>
          ) : (
            <ClientesTable
              clientes={clientes}
              onEdit={handleEditarClick}
              onDelete={handleEliminarClick}
            />
          )}
        </div>
      </div>
    </div>
  );
}
