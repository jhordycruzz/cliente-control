// src/components/pagos/PagoForm.jsx
import { useEffect, useState } from "react";

export default function PagoForm({
  onGuardar,
  clientes,
  facturas,
  pagoEditando,
  onCancelarEdicion,
  loading,
}) {
  const [form, setForm] = useState({
    clienteId: "",
    facturaId: "",
    fecha: "",
    monto: "",
    metodoPago: "",
  });
  const [comprobanteFile, setComprobanteFile] = useState(null);

  useEffect(() => {
    if (pagoEditando) {
      setForm({
        clienteId: pagoEditando.clienteId || "",
        facturaId: pagoEditando.facturaId || "",
        fecha: pagoEditando.fecha || "",
        monto: pagoEditando.monto || "",
        metodoPago: pagoEditando.metodoPago || "",
      });
    } else {
      setForm({
        clienteId: "",
        facturaId: "",
        fecha: "",
        monto: "",
        metodoPago: "",
      });
      setComprobanteFile(null);
    }
  }, [pagoEditando]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onGuardar({ ...form, id: pagoEditando?.id }, comprobanteFile);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-slate-800/60 border border-slate-700 rounded-lg p-3 sm:p-4 space-y-3"
    >
      <h2 className="text-base sm:text-lg font-semibold">
        {pagoEditando ? "Editar pago" : "Registrar pago"}
      </h2>

      {/* GRID RESPONSIVE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs sm:text-sm">Cliente</label>
          <select
            name="clienteId"
            value={form.clienteId}
            onChange={handleChange}
            className="w-full rounded-md bg-slate-900 border border-slate-700 px-2 py-1 text-sm"
          >
            <option value="">Seleccione...</option>
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs sm:text-sm">Factura</label>
          <select
            name="facturaId"
            value={form.facturaId}
            onChange={handleChange}
            className="w-full rounded-md bg-slate-900 border border-slate-700 px-2 py-1 text-sm"
          >
            <option value="">Seleccione...</option>
            {facturas.map((f) => (
              <option key={f.id} value={f.id}>
                {f.numero}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs sm:text-sm">Fecha</label>
          <input
            type="date"
            name="fecha"
            value={form.fecha}
            onChange={handleChange}
            className="w-full rounded-md bg-slate-900 border border-slate-700 px-2 py-1 text-sm"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs sm:text-sm">Monto</label>
          <input
            type="number"
            name="monto"
            value={form.monto}
            onChange={handleChange}
            className="w-full rounded-md bg-slate-900 border border-slate-700 px-2 py-1 text-sm"
          />
        </div>

        <div className="space-y-1 md:col-span-2">
          <label className="text-xs sm:text-sm">Método de pago</label>
          <input
            type="text"
            name="metodoPago"
            value={form.metodoPago}
            onChange={handleChange}
            className="w-full rounded-md bg-slate-900 border border-slate-700 px-2 py-1 text-sm"
          />
        </div>

        <div className="space-y-1 md:col-span-2">
          <label className="text-xs sm:text-sm">Comprobante (opcional)</label>
          <input
            type="file"
            onChange={(e) => setComprobanteFile(e.target.files[0] || null)}
            className="block w-full text-xs sm:text-sm"
          />
        </div>
      </div>

      {/* BOTONES */}
      <div className="flex flex-col sm:flex-row gap-2 justify-end">
        {pagoEditando && (
          <button
            type="button"
            onClick={onCancelarEdicion}
            className="px-3 py-1 rounded bg-slate-700 text-xs sm:text-sm hover:bg-slate-600"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="px-3 py-1 rounded bg-emerald-600 text-xs sm:text-sm hover:bg-emerald-500 disabled:opacity-60"
        >
          {loading ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </form>
  );
}
