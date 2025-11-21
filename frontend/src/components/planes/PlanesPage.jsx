// frontend/src/components/planes/PlanesPage.jsx
import { useEffect, useState } from "react";
import {
  getPlanes,
  createPlan,
  updatePlan,
  deletePlan,
} from "../../api/planesApi";
import PlanForm from "./PlanForm";
import PlanesTable from "./PlanesTable";

export default function PlanesPage() {
  const [planes, setPlanes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [planEditando, setPlanEditando] = useState(null);

  const cargarPlanes = async () => {
    try {
      setLoading(true);
      const data = await getPlanes();
      setPlanes(data);
      setError("");
    } catch (err) {
      console.error(err);
      setError(err.message || "Error al cargar planes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPlanes();
  }, []);

  const handleGuardar = async (formData) => {
    try {
      if (planEditando) {
        await updatePlan(planEditando.id, formData);
      } else {
        await createPlan(formData);
      }
      setPlanEditando(null);
      await cargarPlanes();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEditar = (plan) => setPlanEditando(plan);
  const handleCancelarEdicion = () => setPlanEditando(null);

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este plan?")) return;
    try {
      await deletePlan(id);
      await cargarPlanes();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Planes de Internet</h2>
        {error && (
          <span className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-1 rounded">
            {error}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <PlanForm
            onSubmit={handleGuardar}
            initialData={planEditando}
            onCancel={handleCancelarEdicion}
          />
        </div>
        <div className="lg:col-span-2">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500" />
            </div>
          ) : (
            <PlanesTable
              planes={planes}
              onEdit={handleEditar}
              onDelete={handleEliminar}
            />
          )}
        </div>
      </div>
    </div>
  );
}
