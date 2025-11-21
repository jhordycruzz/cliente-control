// frontend/src/api/clientesApi.js
const API_URL = "http://localhost:3000/api/clientes";

export async function getClientes() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Error al obtener clientes");
  return res.json();
}

export async function createCliente(data) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || "Error al crear cliente");
  }
  return res.json();
}

export async function updateCliente(id, data) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || "Error al actualizar cliente");
  }
  return res.json();
}

export async function deleteCliente(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Error al eliminar cliente");
  return res.json();
}

export async function getClientePorDni(dni) {
  const res = await fetch(`${API_URL}/dni/${dni}`);
  if (res.status === 404) {
    throw new Error("Cliente no encontrado");
  }
  if (!res.ok) throw new Error("Error al buscar cliente por DNI");
  return res.json();
}
