// frontend/src/api/planesApi.js
const API_URL = "http://localhost:3000/api/planes";

export async function getPlanes() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Error al obtener planes");
  return res.json();
}

export async function createPlan(data) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || "Error al crear plan");
  }
  return res.json();
}

export async function updatePlan(id, data) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || "Error al actualizar plan");
  }
  return res.json();
}

export async function deletePlan(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Error al eliminar plan");
  return res.json();
}
