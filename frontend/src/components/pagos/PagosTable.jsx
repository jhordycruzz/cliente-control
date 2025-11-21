// src/components/pagos/PagosTable.jsx
export default function PagosTable({ pagos, onEditar, onEliminar, loading }) {
  return (
    <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-3 sm:p-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-base sm:text-lg font-semibold">Listado de pagos</h2>
        {loading && (
          <span className="text-xs sm:text-sm text-slate-300">Cargando...</span>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[640px] w-full text-xs sm:text-sm">
          <thead>
            <tr className="bg-slate-900/70">
              <th className="px-2 py-2 text-left">Cliente</th>
              <th className="px-2 py-2 text-left">Factura</th>
              <th className="px-2 py-2 text-left">Fecha</th>
              <th className="px-2 py-2 text-right">Monto</th>
              <th className="px-2 py-2 text-left">Método</th>
              <th className="px-2 py-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pagos.length === 0 && !loading && (
              <tr>
                <td
                  colSpan={6}
                  className="px-2 py-3 text-center text-slate-300"
                >
                  No hay pagos registrados.
                </td>
              </tr>
            )}

            {pagos.map((p) => (
              <tr key={p.id} className="border-t border-slate-700">
                <td className="px-2 py-2">{p.clienteNombre}</td>
                <td className="px-2 py-2">{p.facturaNumero}</td>
                <td className="px-2 py-2">{p.fecha}</td>
                <td className="px-2 py-2 text-right">
                  {Number(p.monto).toFixed(2)}
                </td>
                <td className="px-2 py-2">{p.metodoPago}</td>
                <td className="px-2 py-2">
                  <div className="flex justify-center gap-1">
                    <button
                      onClick={() => onEditar(p)}
                      className="px-2 py-0.5 rounded bg-sky-600 hover:bg-sky-500 text-[11px] sm:text-xs"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => onEliminar(p.id)}
                      className="px-2 py-0.5 rounded bg-red-600 hover:bg-red-500 text-[11px] sm:text-xs"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
