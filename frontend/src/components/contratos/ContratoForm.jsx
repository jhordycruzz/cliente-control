// frontend/src/components/contratos/ContratoForm.jsx
import { useEffect, useState } from "react";

const ESTADOS = ["PENDIENTE", "ACTIVO", "SUSPENDIDO", "CANCELADO"];
const CICLOS = ["MENSUAL", "TRIMESTRAL", "ANUAL"];

const initialForm = {
  cliente_id: "",
  plan_id: "",
  fecha_alta: "",
  fecha_baja: "",
  estado: "PENDIENTE",
  ciclo_facturacion: "MENSUAL",
  metodo_pago: "",
};

export default function ContratoForm({
  clientes,
  planes,
  onSubmit,
  initialData,
  onCancel,
}) {
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (initialData) {
      setForm({
        cliente_id: initialData.cliente_id?.toString() || "",
        plan_id: initialData.plan_id?.toString() || "",
        fecha_alta: initialData.fecha_alta || "",
        fecha_baja: initialData.fecha_baja || "",
        estado: initialData.estado || "PENDIENTE",
        ciclo_facturacion: initialData.ciclo_facturacion || "MENSUAL",
        metodo_pago: initialData.metodo_pago || "",
      });
    } else {
      setForm(initialForm);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.cliente_id || !form.plan_id || !form.fecha_alta) {
      alert("Cliente, plan y fecha de alta son obligatorios");
      return;
    }

    onSubmit({
      ...form,
      cliente_id: Number(form.cliente_id),
      plan_id: Number(form.plan_id),
      fecha_baja: form.fecha_baja || null,
    });
  };

  const isEditing = Boolean(initialData);

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">
        {isEditing ? "Editar contrato" : "Nuevo contrato"}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Cliente
          </label>
          <select
            name="cliente_id"
            value={form.cliente_id}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Seleccionar cliente</option>
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.dni} - {c.nombres} {c.apellidos}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Plan
          </label>
          <select
            name="plan_id"
            value={form.plan_id}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Seleccionar plan</option>
            {planes.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre} ({p.velocidad}) - S/ {p.precio_mensual}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Fecha de alta
            </label>
            <input
              type="date"
              name="fecha_alta"
              value={form.fecha_alta}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Fecha de baja
            </label>
            <input
              type="date"
              name="fecha_baja"
              value={form.fecha_baja}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Ciclo de facturación
            </label>
            <select
              name="ciclo_facturacion"
              value={form.ciclo_facturacion}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {CICLOS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Método de pago
          </label>
          <input
            type="text"
            name="metodo_pago"
            value={form.metodo_pago}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="YAPE, EFECTIVO, TRANSFERENCIA…"
          />
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
