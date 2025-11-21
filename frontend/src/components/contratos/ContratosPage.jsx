// frontend/src/components/contratos/ContratosPage.jsx
import { useEffect, useState } from "react";
import {
  getContratos,
  createContrato,
  updateContrato,
  deleteContrato,
} from "../../api/contratosApi";
import { getClientes } from "../../api/clientesApi";
import { getPlanes } from "../../api/planesApi";
import ContratoForm from "./ContratoForm";
import ContratosTable from "./ContratosTable";

export default function ContratosPage() {
  const [contratos, setContratos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [planes, setPlanes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingAux, setLoadingAux] = useState(true);
  const [error, setError] = useState("");
  const [contratoEditando, setContratoEditando] = useState(null);

  const cargarContratos = async () => {
    try {
      setLoading(true);
      const data = await getContratos();
      setContratos(data);
      setError("");
    } catch (err) {
      console.error(err);
      setError(err.message || "Error al cargar contratos");
    } finally {
      setLoading(false);
    }
  };

  const cargarClientesYPlanes = async () => {
    try {
      setLoadingAux(true);
      const [c, p] = await Promise.all([getClientes(), getPlanes()]);
      setClientes(c);
      setPlanes(p);
    } catch (err) {
      console.error(err);
      setError("Error al cargar clientes/planes");
    } finally {
      setLoadingAux(false);
    }
  };

  useEffect(() => {
    cargarContratos();
    cargarClientesYPlanes();
  }, []);

  const handleGuardar = async (formData) => {
    try {
      if (contratoEditando) {
        await updateContrato(contratoEditando.id, formData);
      } else {
        await createContrato(formData);
      }
      setContratoEditando(null);
      await cargarContratos();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEditar = (contrato) => setContratoEditando(contrato);
  const handleCancelarEdicion = () => setContratoEditando(null);

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este contrato?")) return;
    try {
      await deleteContrato(id);
      await cargarContratos();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Contratos</h2>
        {error && (
          <span className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-1 rounded">
            {error}
          </span>
        )}
      </div>

      {loadingAux ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <ContratoForm
              clientes={clientes}
              planes={planes}
              onSubmit={handleGuardar}
              initialData={contratoEditando}
              onCancel={handleCancelarEdicion}
            />
          </div>
          <div className="lg:col-span-2">
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500" />
              </div>
            ) : (
              <ContratosTable
                contratos={contratos}
                onEdit={handleEditar}
                onDelete={handleEliminar}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
