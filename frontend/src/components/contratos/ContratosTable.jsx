// frontend/src/components/contratos/ContratosTable.jsx

export default function ContratosTable({ contratos, onEdit, onDelete }) {
  if (!contratos.length) {
    return (
      <div className="bg-white shadow rounded-lg p-4">
        <p className="text-sm text-gray-500">No hay contratos registrados.</p>
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
              Plan
            </th>
            <th className="px-3 py-2 text-left font-semibold text-gray-700">
              Alta
            </th>
            <th className="px-3 py-2 text-left font-semibold text-gray-700">
              Estado
            </th>
            <th className="px-3 py-2 text-left font-semibold text-gray-700">
              Ciclo
            </th>
            <th className="px-3 py-2 text-left font-semibold text-gray-700">
              Método pago
            </th>
            <th className="px-3 py-2 text-right font-semibold text-gray-700">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {contratos.map((c) => (
            <tr key={c.id} className="hover:bg-gray-50">
              <td className="px-3 py-2 text-gray-800">
                {c.cliente_dni} - {c.cliente_nombre}
              </td>
              <td className="px-3 py-2 text-gray-800">
                {c.plan_nombre} ({c.velocidad}) - S/ {c.precio_mensual}
              </td>
              <td className="px-3 py-2 text-gray-700">{c.fecha_alta}</td>
              <td className="px-3 py-2">
                <span
                  className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                    c.estado === "ACTIVO"
                      ? "bg-green-100 text-green-800"
                      : c.estado === "SUSPENDIDO"
                      ? "bg-yellow-100 text-yellow-800"
                      : c.estado === "CANCELADO"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {c.estado}
                </span>
              </td>
              <td className="px-3 py-2 text-gray-700">
                {c.ciclo_facturacion}
              </td>
              <td className="px-3 py-2 text-gray-700">{c.metodo_pago}</td>
              <td className="px-3 py-2 text-right space-x-2">
                <button
                  onClick={() => onEdit(c)}
                  className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100"
                >
                  Editar
                </button>
                <button
                  onClick={() => onDelete(c.id)}
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
