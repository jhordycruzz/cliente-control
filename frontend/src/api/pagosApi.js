// frontend/src/api/pagosApi.js
const API_URL = "http://localhost:3000/api/pagos";

export async function getPagos() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Error al obtener pagos");
  return res.json();
}

export async function getPagosPorCliente(clienteId) {
  const res = await fetch(`${API_URL}/cliente/${clienteId}`);
  if (!res.ok) throw new Error("Error al obtener pagos del cliente");
  return res.json();
}

export async function getPagosPorFactura(facturaId) {
  const res = await fetch(`${API_URL}/factura/${facturaId}`);
  if (!res.ok) throw new Error("Error al obtener pagos de la factura");
  return res.json();
}

export async function createPago(data) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || "Error al crear pago");
  }
  return res.json();
}

export async function updatePago(id, data) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || "Error al actualizar pago");
  }
  return res.json();
}

export async function deletePago(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Error al eliminar pago");
  return res.json();
}
