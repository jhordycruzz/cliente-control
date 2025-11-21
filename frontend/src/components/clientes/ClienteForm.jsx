// frontend/src/components/clientes/ClienteForm.jsx
import { useEffect, useState } from "react";

const ESTADOS = ["PROSPECTO", "ACTIVO", "SUSPENDIDO", "BAJA"];

const initialForm = {
  dni: "",
  nombres: "",
  apellidos: "",
  telefono: "",
  email: "",
  direccion: "",
  estado: "ACTIVO",
};

export default function ClienteForm({ onSubmit, initialData, onCancel }) {
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (initialData) {
      setForm({
        dni: initialData.dni || "",
        nombres: initialData.nombres || "",
        apellidos: initialData.apellidos || "",
        telefono: initialData.telefono || "",
        email: initialData.email || "",
        direccion: initialData.direccion || "",
        estado: initialData.estado || "ACTIVO",
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
    if (!form.dni || !form.nombres || !form.apellidos) {
      alert("DNI, nombres y apellidos son obligatorios");
      return;
    }
    onSubmit(form);
  };

  const isEditing = Boolean(initialData);

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">
        {isEditing ? "Editar cliente" : "Nuevo cliente"}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              DNI
            </label>
            <input
              type="text"
              name="dni"
              value={form.dni}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nombres
            </label>
            <input
              type="text"
              name="nombres"
              value={form.nombres}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Apellidos
            </label>
            <input
              type="text"
              name="apellidos"
              value={form.apellidos}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Teléfono
            </label>
            <input
              type="text"
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm focus:border-blue-500 focus:ring-blue-500"
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

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Dirección
          </label>
          <input
            type="text"
            name="direccion"
            value={form.direccion}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm focus:border-blue-500 focus:ring-blue-500"
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
