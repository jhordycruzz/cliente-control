// frontend/src/components/planes/PlanForm.jsx
import { useEffect, useState } from "react";

const TIPOS = ["RESIDENCIAL", "EMPRESARIAL"];

const initialForm = {
  nombre: "",
  velocidad: "",
  precio_mensual: "",
  tipo: "RESIDENCIAL",
  activo: true,
};

export default function PlanForm({ onSubmit, initialData, onCancel }) {
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (initialData) {
      setForm({
        nombre: initialData.nombre || "",
        velocidad: initialData.velocidad || "",
        precio_mensual: initialData.precio_mensual ?? "",
        tipo: initialData.tipo || "RESIDENCIAL",
        activo: initialData.activo === 1 || initialData.activo === true,
      });
    } else {
      setForm(initialForm);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nombre || !form.velocidad || !form.precio_mensual) {
      alert("Nombre, velocidad y precio mensual son obligatorios");
      return;
    }

    onSubmit({
      ...form,
      precio_mensual: Number(form.precio_mensual),
    });
  };

  const isEditing = Boolean(initialData);

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">
        {isEditing ? "Editar plan" : "Nuevo plan"}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nombre del plan
          </label>
          <input
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Plan Hogar 50Mb"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Velocidad
          </label>
          <input
            type="text"
            name="velocidad"
            value={form.velocidad}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="50 Mbps"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Precio mensual (S/)
          </label>
          <input
            type="number"
            step="0.01"
            name="precio_mensual"
            value={form.precio_mensual}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tipo
          </label>
          <select
            name="tipo"
            value={form.tipo}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {TIPOS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <input
            id="activo"
            type="checkbox"
            name="activo"
            checked={form.activo}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
          />
          <label htmlFor="activo" className="text-sm text-gray-700">
            Plan activo
          </label>
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
