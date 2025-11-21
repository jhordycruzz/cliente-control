// frontend/src/components/planes/PlanesTable.jsx

export default function PlanesTable({ planes, onEdit, onDelete }) {
  if (!planes.length) {
    return (
      <div className="bg-white shadow rounded-lg p-4">
        <p className="text-sm text-gray-500">No hay planes registrados.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 py-2 text-left font-semibold text-gray-700">
              Nombre
            </th>
            <th className="px-3 py-2 text-left font-semibold text-gray-700">
              Velocidad
            </th>
            <th className="px-3 py-2 text-left font-semibold text-gray-700">
              Precio mensual
            </th>
            <th className="px-3 py-2 text-left font-semibold text-gray-700">
              Tipo
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
          {planes.map((p) => (
            <tr key={p.id} className="hover:bg-gray-50">
              <td className="px-3 py-2 text-gray-800">{p.nombre}</td>
              <td className="px-3 py-2 text-gray-700">{p.velocidad}</td>
              <td className="px-3 py-2 text-gray-700">
                S/ {Number(p.precio_mensual).toFixed(2)}
              </td>
              <td className="px-3 py-2 text-gray-700">{p.tipo}</td>
              <td className="px-3 py-2">
                <span
                  className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                    p.activo
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {p.activo ? "ACTIVO" : "INACTIVO"}
                </span>
              </td>
              <td className="px-3 py-2 text-right space-x-2">
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
