// frontend/src/components/pagos/PagosPage.jsx
import { useEffect, useState } from "react";
import {
  getPagos,
  createPago,
  updatePago,
  deletePago,
} from "../../api/pagosApi";
import { uploadComprobante } from "../../api/comprobantesApi";
import { getClientes } from "../../api/clientesApi";
import { getFacturas } from "../../api/facturasApi";
//import PagoForm from "./PagoForm";
import PagosTable from "./PagosTable";

export default function PagosPage() {
  const [pagos, setPagos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingAux, setLoadingAux] = useState(true);
  const [error, setError] = useState("");
  const [pagoEditando, setPagoEditando] = useState(null);

  const cargarPagos = async () => {
    try {
      setLoading(true);
      const data = await getPagos();
      setPagos(data);
      setError("");
    } catch (err) {
      console.error(err);
      setError(err.message || "Error al cargar pagos");
    } finally {
      setLoading(false);
    }
  };

  const cargarClientesYFacturas = async () => {
    try {
      setLoadingAux(true);
      const [c, f] = await Promise.all([getClientes(), getFacturas()]);
      setClientes(c);
      setFacturas(f);
    } catch (err) {
      console.error(err);
      setError("Error al cargar clientes/facturas");
    } finally {
      setLoadingAux(false);
    }
  };

  useEffect(() => {
    cargarPagos();
    cargarClientesYFacturas();
  }, []);

  const handleGuardar = async (formData) => {
    try {
      let comprobante_id = formData.comprobante_id || null;

      // Si hay archivo nuevo, subir comprobante primero
      if (formData.comprobanteFile) {
        const resp = await uploadComprobante(
          formData.comprobanteFile,
          formData.tipo_comprobante
        );
        comprobante_id = resp.id;
      }

      const payload = {
        factura_id: Number(formData.factura_id),
        cliente_id: Number(formData.cliente_id),
        fecha_pago: formData.fecha_pago,
        monto: Number(formData.monto),
        metodo_pago: formData.metodo_pago || null,
        referencia: formData.referencia || null,
        comprobante_id,
      };

      if (pagoEditando) {
        await updatePago(pagoEditando.id, payload);
      } else {
        await createPago(payload);
      }

      setPagoEditando(null);
      await cargarPagos();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEditar = (pago) => setPagoEditando(pago);
  const handleCancelarEdicion = () => setPagoEditando(null);

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este pago?")) return;
    try {
      await deletePago(id);
      await cargarPagos();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Pagos</h2>
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
            <PagoForm
              clientes={clientes}
              facturas={facturas}
              onSubmit={handleGuardar}
              initialData={pagoEditando}
              onCancel={handleCancelarEdicion}
            />
          </div>
          <div className="lg:col-span-2">
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500" />
              </div>
            ) : (
              <PagosTable
                pagos={pagos}
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
