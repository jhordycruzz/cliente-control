// frontend/src/components/facturas/FacturaForm.jsx
import { useEffect, useMemo, useState } from "react";

const ESTADOS = ["PENDIENTE", "PAGADA", "VENCIDA"];

const initialForm = {
  contrato_id: "",
  cliente_id: "",
  periodo_desde: "",
  periodo_hasta: "",
  fecha_emision: "",
  fecha_vencimiento: "",
  monto: "",
  estado: "PENDIENTE",
};

export default function FacturaForm({
  clientes,
  contratos,
  onSubmit,
  initialData,
  onCancel,
}) {
  const [form, setForm] = useState(initialForm);

  // para buscar contrato seleccionado
  const contratosPorId = useMemo(() => {
    const map = {};
    contratos.forEach((c) => {
      map[c.id] = c;
    });
    return map;
  }, [contratos]);

  useEffect(() => {
    if (initialData) {
      setForm({
        contrato_id: initialData.contrato_id?.toString() || "",
        cliente_id: initialData.cliente_id?.toString() || "",
        periodo_desde: initialData.periodo_desde || "",
        periodo_hasta: initialData.periodo_hasta || "",
        fecha_emision: initialData.fecha_emision || "",
        fecha_vencimiento: initialData.fecha_vencimiento || "",
        monto: initialData.monto ?? "",
        estado: initialData.estado || "PENDIENTE",
      });
    } else {
      setForm(initialForm);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "contrato_id") {
      const contratoId = value;
      const contrato = contratosPorId[Number(contratoId)];
      setForm((prev) => ({
        ...prev,
        contrato_id: contratoId,
        cliente_id: contrato ? contrato.cliente_id.toString() : "",
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const {
      contrato_id,
      cliente_id,
      periodo_desde,
      periodo_hasta,
      fecha_emision,
      fecha_vencimiento,
      monto,
      estado,
    } = form;

    if (
      !contrato_id ||
      !cliente_id ||
      !periodo_desde ||
      !periodo_hasta ||
      !fecha_emision ||
      !fecha_vencimiento ||
      !monto
    ) {
      alert("Todos los campos principales son obligatorios");
      return;
    }

    onSubmit({
      contrato_id: Number(contrato_id),
      cliente_id: Number(cliente_id),
      periodo_desde,
      periodo_hasta,
      fecha_emision,
      fecha_vencimiento,
      monto: Number(monto),
      estado,
    });
  };

  const isEditing = Boolean(initialData);

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">
        {isEditing ? "Editar factura" : "Nueva factura"}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Contrato
          </label>
          <select
            name="contrato_id"
            value={form.contrato_id}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Seleccionar contrato</option>
            {contratos.map((c) => (
              <option key={c.id} value={c.id}>
                #{c.id} — {c.cliente_nombre} — {c.plan_nombre} ({c.velocidad})
              </option>
            ))}
          </select>
        </div>

        {/* Solo lectura del cliente */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Cliente
          </label>
          <input
            type="text"
            readOnly
            value={
              form.cliente_id
                ? (() => {
                    const cli = clientes.find(
                      (cl) => cl.id === Number(form.cliente_id),
                    );
                    return cli
                      ? `${cli.dni} - ${cli.nombres} ${cli.apellidos}`
                      : "";
                  })()
                : ""
            }
            className="mt-1 block w-full rounded-md border-gray-200 bg-gray-50 text-sm text-gray-700"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Periodo desde
            </label>
            <input
              type="date"
              name="periodo_desde"
              value={form.periodo_desde}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Periodo hasta
            </label>
            <input
              type="date"
              name="periodo_hasta"
              value={form.periodo_hasta}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Fecha emisión
            </label>
            <input
              type="date"
              name="fecha_emision"
              value={form.fecha_emision}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Fecha vencimiento
            </label>
            <input
              type="date"
              name="fecha_vencimiento"
              value={form.fecha_vencimiento}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Monto (S/)
            </label>
            <input
              type="number"
              step="0.01"
              name="monto"
              value={form.monto}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Estado
            </label>
            <select
              name="estado"
              value={form.estado}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {ESTADOS.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {isEditing ? "Actualizar" : "Guardar"}
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex items-center px-3 py-1.5 border text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 border-gray-300"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
