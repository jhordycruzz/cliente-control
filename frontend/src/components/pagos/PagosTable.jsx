// frontend/src/components/pagos/PagosTable.jsx

export default function PagosTable({
  pagos,
  onEdit,
  onDelete,
  onVerComprobante, // opcional
}) {
  if (!pagos || !pagos.length) {
    return (
      <div className="bg-white shadow rounded-lg p-4">
        <p className="text-sm text-gray-500">No hay pagos registrados.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 py-2 text-left font-semibold text-gray-700">
              Cliente
            </th>
            <th className="px-3 py-2 text-left font-semibold text-gray-700">
              Factura
            </th>
            <th className="px-3 py-2 text-left font-semibold text-gray-700">
              Fecha pago
            </th>
            <th className="px-3 py-2 text-left font-semibold text-gray-700">
              Monto
            </th>
            <th className="px-3 py-2 text-left font-semibold text-gray-700">
              Método
            </th>
            <th className="px-3 py-2 text-left font-semibold text-gray-700">
              Referencia
            </th>
            <th className="px-3 py-2 text-right font-semibold text-gray-700">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {pagos.map((p) => (
            <tr key={p.id} className="hover:bg-gray-50">
              <td className="px-3 py-2 text-gray-800">
                {p.cliente_dni} - {p.cliente_nombre}
              </td>
              <td className="px-3 py-2 text-gray-700">
                #{p.factura_id} · {p.factura_periodo_desde} →{" "}
                {p.factura_periodo_hasta}
              </td>
              <td className="px-3 py-2 text-gray-700">{p.fecha_pago}</td>
              <td className="px-3 py-2 text-gray-800">
                S/ {Number(p.monto).toFixed(2)}
              </td>
              <td className="px-3 py-2 text-gray-700">{p.metodo_pago}</td>
              <td className="px-3 py-2 text-gray-700">{p.referencia}</td>
              <td className="px-3 py-2 text-right space-x-2">
                {onVerComprobante && p.comprobante_ruta && (
                  <button
                    onClick={() => onVerComprobante(p)}
                    className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md text-purple-700 bg-purple-50 hover:bg-purple-100"
                  >
                    Ver comprobante
                  </button>
                )}

                <button
                  onClick={() => onEdit(p)}
                  className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100"
                >
                  Editar
                </button>
                <button
                  onClick={() => onDelete(p.id)}
                  className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
