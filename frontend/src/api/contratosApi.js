// frontend/src/api/contratosApi.js
const API_URL = "http://localhost:3000/api/contratos";

export async function getContratos() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Error al obtener contratos");
  return res.json();
}

export async function createContrato(data) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || "Error al crear contrato");
  }
  return res.json();
}

export async function updateContrato(id, data) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || "Error al actualizar contrato");
  }
  return res.json();
}

export async function deleteContrato(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Error al eliminar contrato");
  return res.json();
}
