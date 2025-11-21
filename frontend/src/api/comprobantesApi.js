// frontend/src/api/comprobantesApi.js
const API_URL = "http://localhost:3000/api/comprobantes";

export async function uploadComprobante(file, tipo) {
  const formData = new FormData();
  formData.append("archivo", file);
  if (tipo) formData.append("tipo", tipo);

  const res = await fetch(API_URL, {
    method: "POST",
    body: formData, // NO pongas Content-Type, fetch lo pone solo
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || "Error al subir comprobante");
  }

  return res.json(); // { id, archivo_ruta, archivo_nombre, tipo }
}
