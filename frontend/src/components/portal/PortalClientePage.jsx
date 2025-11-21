// frontend/src/components/portal/PortalClientePage.jsx
import { useState } from "react";
import { getClientePorDni } from "../../api/clientesApi";
import { getFacturasPorCliente } from "../../api/facturasApi";
import { getPagosPorCliente } from "../../api/pagosApi";

export default function PortalClientePage() {
  const [dni, setDni] = useState("");
  const [cliente, setCliente] = useState(null);
  const [facturas, setFacturas] = useState([]);
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleBuscar = async (e) => {
    e.preventDefault();
    const cleanDni = dni.trim();
    if (!cleanDni) {
      setError("Ingresa tu número de DNI");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setCliente(null);
      setFacturas([]);
      setPagos([]);

      const clienteData = await getClientePorDni(cleanDni);
      setCliente(clienteData);

      const [facturasData, pagosData] = await Promise.all([
        getFacturasPorCliente(clienteData.id),
        getPagosPorCliente(clienteData.id),
      ]);

      setFacturas(facturasData);
      setPagos(pagosData);
    } catch (err) {
      console.error(err);
      setError(err.message || "Error al buscar información");
    } finally {
      setLoading(false);
    }
  };

  const totalFacturado = facturas.reduce(
    (acc, f) => acc + Number(f.monto || 0),
    0
  );
  const totalPagado = pagos.reduce(
    (acc, p) => acc + Number(p.monto || 0),
    0
  );
  const totalPendiente = totalFacturado - totalPagado;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800">
          Portal de Cliente — Cyberlink
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Consulta tu estado de facturación ingresando tu número de DNI.
        </p>
      </div>

      {/* Buscador por DNI */}
      <form
        onSubmit={handleBuscar}
        className="bg-white shadow rounded-lg p-4 mb-6 max-w-md mx-auto"
      >
        <label className="block text-sm font-medium text-gray-700">
          Número de DNI
        </label>
        <div className="mt-1 flex gap-2">
          <input
            type="text"
            value={dni}
            onChange={(e) => setDni(e.target.value)}
            className="flex-1 rounded-md border-gray-300 shadow-sm text-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Ej: 12345678"
          />
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Buscando..." : "Consultar"}
          </button>
        </div>
        {error && (
          <p className="mt-2 text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-1 rounded">
            {error}
          </p>
        )}
      </form>

      {/* Resultado */}
      {cliente && (
        <div className="space-y-6">
          {/* Datos del cliente */}
          <div className="bg-white shadow rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Datos del cliente
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <div>
                <span className="font-medium text-gray-600">DNI:</span>{" "}
                <span className="text-gray-800">{cliente.dni}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Nombre:</span>{" "}
                <span className="text-gray-800">
                  {cliente.nombres} {cliente.apellidos}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Teléfono:</span>{" "}
                <span className="text-gray-800">{cliente.telefono}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Email:</span>{" "}
                <span className="text-gray-800">{cliente.email}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="font-medium text-gray-600">Dirección:</span>{" "}
                <span className="text-gray-800">{cliente.direccion}</span>
              </div>
            </div>
          </div>

          {/* Resumen de deuda */}
          <div className="bg-white shadow rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Resumen de facturación
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div className="border rounded-lg p-3">
                <p className="text-xs text-gray-500">Total facturado</p>
                <p className="text-lg font-semibold text-gray-800">
                  S/ {totalFacturado.toFixed(2)}
                </p>
              </div>
              <div className="border rounded-lg p-3">
                <p className="text-xs text-gray-500">Total pagado</p>
                <p className="text-lg font-semibold text-emerald-700">
                  S/ {totalPagado.toFixed(2)}
                </p>
              </div>
              <div className="border rounded-lg p-3">
                <p className="text-xs text-gray-500">Saldo pendiente</p>
                <p
                  className={`text-lg font-semibold ${
                    totalPendiente > 0
                      ? "text-red-600"
                      : totalPendiente < 0
                      ? "text-emerald-700"
                      : "text-gray-800"
                  }`}
                >
                  S/ {totalPendiente.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Lista de facturas */}
          <div className="bg-white shadow rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Historial de facturas
            </h3>
            {facturas.length === 0 ? (
              <p className="text-xs text-gray-500">
                No se encontraron facturas para este cliente.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-2 py-1 text-left font-semibold text-gray-700">
                        Periodo
                      </th>
                      <th className="px-2 py-1 text-left font-semibold text-gray-700">
                        Emisión / Vence
                      </th>
                      <th className="px-2 py-1 text-left font-semibold text-gray-700">
                        Monto
                      </th>
                      <th className="px-2 py-1 text-left font-semibold text-gray-700">
                        Estado
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {facturas.map((f) => (
                      <tr key={f.id}>
                        <td className="px-2 py-1 text-gray-700">
                          {f.periodo_desde} → {f.periodo_hasta}
                        </td>
                        <td className="px-2 py-1 text-gray-700">
                          {f.fecha_emision} / {f.fecha_vencimiento}
                        </td>
                        <td className="px-2 py-1 text-gray-800">
                          S/ {Number(f.monto).toFixed(2)}
                        </td>
                        <td className="px-2 py-1">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium ${
                              f.estado === "PAGADA"
                                ? "bg-emerald-100 text-emerald-800"
                                : f.estado === "VENCIDA"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-50 text-yellow-800"
                            }`}
                          >
                            {f.estado}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pagos recientes */}
          <div className="bg-white shadow rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Pagos registrados
            </h3>
            {pagos.length === 0 ? (
              <p className="text-xs text-gray-500">
                No se encontraron pagos registrados.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-2 py-1 text-left font-semibold text-gray-700">
                        Fecha
                      </th>
                      <th className="px-2 py-1 text-left font-semibold text-gray-700">
                        Monto
                      </th>
                      <th className="px-2 py-1 text-left font-semibold text-gray-700">
                        Método
                      </th>
                      <th className="px-2 py-1 text-left font-semibold text-gray-700">
                        Referencia
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {pagos.map((p) => (
                      <tr key={p.id}>
                        <td className="px-2 py-1 text-gray-700">
                          {p.fecha_pago}
                        </td>
                        <td className="px-2 py-1 text-gray-800">
                          S/ {Number(p.monto).toFixed(2)}
                        </td>
                        <td className="px-2 py-1 text-gray-700">
                          {p.metodo_pago}
                        </td>
                        <td className="px-2 py-1 text-gray-700">
                          {p.referencia}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
