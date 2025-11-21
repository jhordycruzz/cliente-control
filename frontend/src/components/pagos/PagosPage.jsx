// src/components/pagos/PagosPage.jsx
import { useEffect, useState } from "react";
import { getPagos, createPago, updatePago, deletePago } from "../../api/pagosApi";
import { uploadComprobante } from "../../api/comprobantesApi";
import { getClientes } from "../../api/clientesApi";
import { getFacturas } from "../../api/facturasApi";
import PagoForm from "./PagoForm";
import PagosTable from "./PagosTable";

export default function PagosPage() {
  const [pagos, setPagos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(true);
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
      const [clientesData, facturasData] = await Promise.all([
        getClientes(),
        getFacturas(),
      ]);
      setClientes(clientesData);
      setFacturas(facturasData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    cargarPagos();
    cargarClientesYFacturas();
  }, []);

  const manejarGuardar = async (pago, comprobanteFile) => {
    try {
      setLoading(true);

      let pagoGuardado;
      if (pago.id) {
        pagoGuardado = await updatePago(pago.id, pago);
      } else {
        pagoGuardado = await createPago(pago);
      }

      if (comprobanteFile) {
        await uploadComprobante(pagoGuardado.id, comprobanteFile);
      }

      await cargarPagos();
      setPagoEditando(null);
    } catch (err) {
      console.error(err);
      setError(err.message || "Error al guardar pago");
    } finally {
      setLoading(false);
    }
  };

  const manejarEditar = (pago) => {
    setPagoEditando(pago);
  };

  const manejarEliminar = async (id) => {
    if (!confirm("¿Eliminar este pago?")) return;

    try {
      setLoading(true);
      await deletePago(id);
      await cargarPagos();
    } catch (err) {
      console.error(err);
      setError(err.message || "Error al eliminar pago");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-2">Pagos</h2>

      {error && (
        <div className="bg-red-900/30 border border-red-700 text-red-200 px-3 py-2 rounded">
          {error}
        </div>
      )}

      <PagoForm
        onGuardar={manejarGuardar}
        clientes={clientes}
        facturas={facturas}
        pagoEditando={pagoEditando}
        onCancelarEdicion={() => setPagoEditando(null)}
        loading={loading}
      />

      <PagosTable
        pagos={pagos}
        onEditar={manejarEditar}
        onEliminar={manejarEliminar}
        loading={loading}
      />
    </div>
  );
}
