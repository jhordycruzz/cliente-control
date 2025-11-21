// frontend/src/components/facturas/FacturasTable.jsx

function badgeClase(estado) {
  switch (estado) {
    case "PAGADA":
      return "bg-green-100 text-green-800";
    case "VENCIDA":
      return "bg-red-100 text-red-800";
    default:
      return "bg-yellow-50 text-yellow-800";
  }
}

export default function FacturasTable({
  facturas,
  onEdit,
  onDelete,
  onCambiarEstado,
}) {
  if (!facturas.length) {
    return (
      <div className="bg-white shadow rounded-lg p-4">
        <p className="text-sm text-gray-500">No hay facturas registradas.</p>
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
              Periodo
            </th>
            <th className="px-3 py-2 text-left font-semibold text-gray-700">
              Emisión / Vence
            </th>
            <th className="px-3 py-2 text-left font-semibold text-gray-700">
              Monto
            </th>
            <th className="px-3 py-2 text-left font-semibold text-gray-700">
              Estado
            </th>
            <th className="px-3 py-2 text-right font-semibold text-gray-700">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {facturas.map((f) => (
            <tr key={f.id} className="hover:bg-gray-50">
              <td className="px-3 py-2 text-gray-800">
                {f.cliente_dni} - {f.cliente_nombre}
              </td>
              <td className="px-3 py-2 text-gray-700">
                {f.periodo_desde} → {f.periodo_hasta}
              </td>
              <td className="px-3 py-2 text-gray-700">
                {f.fecha_emision} / {f.fecha_vencimiento}
              </td>
              <td className="px-3 py-2 text-gray-800">
                S/ {Number(f.monto).toFixed(2)}
              </td>
              <td className="px-3 py-2">
                <span
                  className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${badgeClase(
                    f.estado,
                  )}`}
                >
                  {f.estado}
                </span>
              </td>
              <td className="px-3 py-2 text-right space-x-2">
                {f.estado !== "PAGADA" && (
                  <button
                    onClick={() => onCambiarEstado(f.id, "PAGADA")}
                    className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                  >
                    Marcar pagada
                  </button>
                )}
                <button
                  onClick={() => onEdit(f)}
                  className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100"
                >
                  Editar
                </button>
                <button
                  onClick={() => onDelete(f.id)}
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
