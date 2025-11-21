// frontend/src/components/facturas/FacturasPage.jsx
import { useEffect, useState } from "react";
import { getFacturas, createFactura, updateFactura, deleteFactura, cambiarEstadoFactura } from "../../api/facturasApi";
import { getContratos } from "../../api/contratosApi";
import FacturaForm from "./FacturaForm";
import FacturasTable from "./FacturasTable";

export default function FacturasPage() {
  const [facturas, setFacturas] = useState([]);
  const [contratos, setContratos] = useState([]);
  const [facturaEditando, setFacturaEditando] = useState(null);
  const [loading, setLoading] = useState(false);

  const cargarFacturas = async () => {
    try {
      setLoading(true);
      const data = await getFacturas();
      setFacturas(data);
    } catch (err) {
      console.error(err);
      alert("Error al cargar facturas");
    } finally {
      setLoading(false);
    }
  };

  const cargarContratos = async () => {
    try {
      const data = await getContratos();
      setContratos(data);
    } catch (err) {
      console.error(err);
      alert("Error al cargar contratos");
    }
  };

  useEffect(() => {
    cargarFacturas();
    cargarContratos();
  }, []);

  const handleGuardar = async (values) => {
    try {
      if (facturaEditando) {
        await updateFactura(facturaEditando.id, values);
      } else {
        await createFactura(values);
      }
      setFacturaEditando(null);
      await cargarFacturas();
    } catch (err) {
      console.error(err);
      alert(err.message || "Error al guardar factura");
    }
  };

  const handleEditar = (factura) => {
    setFacturaEditando(factura);
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta factura?")) return;
    try {
      await deleteFactura(id);
      await cargarFacturas();
    } catch (err) {
      console.error(err);
      alert(err.message || "Error al eliminar factura");
    }
  };

  const handleCambiarEstado = async (id, nuevoEstado) => {
    try {
      await cambiarEstadoFactura(id, nuevoEstado);
      await cargarFacturas();
    } catch (err) {
      console.error(err);
      alert(err.message || "Error al cambiar estado");
    }
  };

  // ✅ WhatsApp
  const handleEnviarWhatsApp = (factura) => {
    if (!factura.cliente_telefono) {
      alert("Este cliente no tiene teléfono registrado.");
      return;
    }

    const telefonoLimpio = factura.cliente_telefono.replace(/[^0-9]/g, "");
    const codigoPais = "51"; // Perú

    const telefonoIntl = telefonoLimpio.startsWith(codigoPais)
      ? telefonoLimpio
      : codigoPais + telefonoLimpio;

    const texto = encodeURIComponent(
      `Hola ${factura.cliente_nombre},\n\n` +
        `Te enviamos el detalle de tu factura de internet Cyberlink:\n\n` +
        `Periodo: ${factura.periodo_desde} a ${factura.periodo_hasta}\n` +
        `Monto: S/ ${Number(factura.monto).toFixed(2)}\n` +
        `Vencimiento: ${factura.fecha_vencimiento}\n` +
        `Estado: ${factura.estado}\n\n` +
        `Por favor, realiza tu pago a nuestras cuentas habituales.\n` +
        `Gracias por confiar en Cyberlink.`
    );

    const url = `https://wa.me/${telefonoIntl}?text=${texto}`;
    window.open(url, "_blank");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Facturas</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <FacturaForm
            contratos={contratos}
            onSubmit={handleGuardar}
            initialData={facturaEditando}
            onCancel={() => setFacturaEditando(null)}
          />
        </div>

        <div>
          {loading ? (
            <p className="text-sm text-gray-500">Cargando facturas...</p>
          ) : (
            <FacturasTable
              facturas={facturas}
              onEdit={handleEditar}
              onDelete={handleEliminar}
              onCambiarEstado={handleCambiarEstado}
              onEnviarWhatsApp={handleEnviarWhatsApp}  // 👈 aquí se pasa
            />
          )}
        </div>
      </div>
    </div>
  );
}
