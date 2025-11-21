// frontend/src/components/facturas/FacturasPage.jsx
import { useEffect, useState } from "react";
import {
  getFacturas,
  createFactura,
  updateFactura,
  updateEstadoFactura,
  deleteFactura,
} from "../../api/facturasApi";
import { getClientes } from "../../api/clientesApi";
import { getContratos } from "../../api/contratosApi";
import FacturaForm from "./FacturaForm";
import FacturasTable from "./FacturasTable";

export default function FacturasPage() {
  const [facturas, setFacturas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [contratos, setContratos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingAux, setLoadingAux] = useState(true);
  const [error, setError] = useState("");
  const [facturaEditando, setFacturaEditando] = useState(null);

  const cargarFacturas = async () => {
    try {
      setLoading(true);
      const data = await getFacturas();
      setFacturas(data);
      setError("");
    } catch (err) {
      console.error(err);
      setError(err.message || "Error al cargar facturas");
    } finally {
      setLoading(false);
    }
  };

  const cargarClientesYContratos = async () => {
    try {
      setLoadingAux(true);
      const [c, ctr] = await Promise.all([getClientes(), getContratos()]);
      setClientes(c);
      setContratos(ctr);
    } catch (err) {
      console.error(err);
      setError("Error al cargar clientes/contratos");
    } finally {
      setLoadingAux(false);
    }
  };

  useEffect(() => {
    cargarFacturas();
    cargarClientesYContratos();
  }, []);

  const handleGuardar = async (formData) => {
    try {
      if (facturaEditando) {
        await updateFactura(facturaEditando.id, formData);
      } else {
        await createFactura(formData);
      }
      setFacturaEditando(null);
      await cargarFacturas();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEditar = (factura) => setFacturaEditando(factura);
  const handleCancelarEdicion = () => setFacturaEditando(null);

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta factura?")) return;
    try {
      await deleteFactura(id);
      await cargarFacturas();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCambiarEstado = async (id, nuevoEstado) => {
    try {
      await updateEstadoFactura(id, nuevoEstado);
      await cargarFacturas();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Facturas</h2>
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
            <FacturaForm
              clientes={clientes}
              contratos={contratos}
              onSubmit={handleGuardar}
              initialData={facturaEditando}
              onCancel={handleCancelarEdicion}
            />
          </div>
          <div className="lg:col-span-2">
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500" />
              </div>
            ) : (
              <FacturasTable
                facturas={facturas}
                onEdit={handleEditar}
                onDelete={handleEliminar}
                onCambiarEstado={handleCambiarEstado}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
