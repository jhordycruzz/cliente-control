// frontend/src/components/clientes/ClientesTable.jsx

export default function ClientesTable({ clientes, onEdit, onDelete }) {
  if (!clientes.length) {
    return (
      <div className="bg-white shadow rounded-lg p-4">
        <p className="text-sm text-gray-500">No hay clientes registrados.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 py-2 text-left font-semibold text-gray-700">
              DNI
            </th>
            <th className="px-3 py-2 text-left font-semibold text-gray-700">
              Nombre
            </th>
            <th className="px-3 py-2 text-left font-semibold text-gray-700">
              Teléfono
            </th>
            <th className="px-3 py-2 text-left font-semibold text-gray-700">
              Email
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
          {clientes.map((c) => (
            <tr key={c.id} className="hover:bg-gray-50">
              <td className="px-3 py-2 text-gray-800">{c.dni}</td>
              <td className="px-3 py-2 text-gray-800">
                {c.nombres} {c.apellidos}
              </td>
              <td className="px-3 py-2 text-gray-700">{c.telefono}</td>
              <td className="px-3 py-2 text-gray-700">{c.email}</td>
              <td className="px-3 py-2">
                <span
                  className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                    c.estado === "ACTIVO"
                      ? "bg-green-100 text-green-800"
                      : c.estado === "SUSPENDIDO"
                      ? "bg-yellow-100 text-yellow-800"
                      : c.estado === "BAJA"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {c.estado}
                </span>
              </td>
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
