// frontend/src/api/facturasApi.js
const API_URL = "http://localhost:3000/api/facturas";

export async function getFacturas() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Error al obtener facturas");
  return res.json();
}

export async function getFacturasPorCliente(clienteId) {
  const res = await fetch(`${API_URL}/cliente/${clienteId}`);
  if (!res.ok) throw new Error("Error al obtener facturas del cliente");
  return res.json();
}

export async function createFactura(data) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || "Error al crear factura");
  }
  return res.json();
}

export async function updateFactura(id, data) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || "Error al actualizar factura");
  }
  return res.json();
}

export async function updateEstadoFactura(id, estado) {
  const res = await fetch(`${API_URL}/${id}/estado`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ estado }),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || "Error al cambiar estado de factura");
  }
  return res.json();
}

export async function deleteFactura(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Error al eliminar factura");
  return res.json();
}
