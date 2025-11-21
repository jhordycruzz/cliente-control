// frontend/src/components/pagos/PagoForm.jsx
import { useEffect, useMemo, useState } from "react";

const METODOS = ["YAPE", "EFECTIVO", "TRANSFERENCIA", "DEPOSITO"];
const TIPOS_COMPROBANTE = ["YAPE", "DEPOSITO", "TRANSFERENCIA"];

const initialForm = {
  factura_id: "",
  cliente_id: "",
  fecha_pago: "",
  monto: "",
  metodo_pago: "YAPE",
  referencia: "",
  tipo_comprobante: "YAPE",
  comprobanteFile: null,
  comprobante_id: null, // por si editas uno que ya tiene comprobante
};

export default function PagoForm({
  clientes,
  facturas,
  onSubmit,
  initialData,
  onCancel,
}) {
  const [form, setForm] = useState(initialForm);

  // Mapa facturaId -> factura para obtener cliente_id automáticamente
  const facturasPorId = useMemo(() => {
    const map = {};
    facturas.forEach((f) => {
      map[f.id] = f;
    });
    return map;
  }, [facturas]);

  useEffect(() => {
    if (initialData) {
      setForm({
        factura_id: initialData.factura_id?.toString() || "",
        cliente_id: initialData.cliente_id?.toString() || "",
        fecha_pago: initialData.fecha_pago || "",
        monto: initialData.monto ?? "",
        metodo_pago: initialData.metodo_pago || "YAPE",
        referencia: initialData.referencia || "",
        tipo_comprobante: initialData.comprobante_tipo || "YAPE",
        comprobanteFile: null,
        comprobante_id: initialData.comprobante_id || null,
      });
    } else {
      setForm(initialForm);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (name === "factura_id") {
      const facturaId = value;
      const factura = facturasPorId[Number(facturaId)];
      setForm((prev) => ({
        ...prev,
        factura_id: facturaId,
        cliente_id: factura ? factura.cliente_id.toString() : "",
        monto:
          !initialData && factura ? String(factura.monto ?? "") : prev.monto,
      }));
    } else if (type === "file") {
      setForm((prev) => ({
        ...prev,
        comprobanteFile: files && files.length > 0 ? files[0] : null,
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { factura_id, cliente_id, fecha_pago, monto } = form;

    if (!factura_id || !cliente_id || !fecha_pago || !monto) {
      alert("Factura, cliente, fecha de pago y monto son obligatorios");
      return;
    }

    onSubmit(form);
  };

  const isEditing = Boolean(initialData);

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">
        {isEditing ? "Editar pago" : "Registrar pago"}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Factura */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Factura
          </label>
          <select
            name="factura_id"
            value={form.factura_id}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Seleccionar factura</option>
            {facturas.map((f) => (
              <option key={f.id} value={f.id}>
                #{f.id} — {f.cliente_nombre} — S/ {f.monto} ({f.periodo_desde} →{" "}
                {f.periodo_hasta})
              </option>
            ))}
          </select>
        </div>

        {/* Cliente (solo lectura) */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Cliente
          </label>
          <input
            type="text"
            readOnly
            value={
              form.cliente_id
                ? (() => {
                    const cli = clientes.find(
                      (c) => c.id === Number(form.cliente_id)
                    );
                    return cli
                      ? `${cli.dni} - ${cli.nombres} ${cli.apellidos}`
                      : "";
                  })()
                : ""
            }
            className="mt-1 block w-full rounded-md border-gray-200 bg-gray-50 text-sm text-gray-700"
          />
        </div>

        {/* Fecha + monto */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Fecha de pago
            </label>
            <input
              type="date"
              name="fecha_pago"
              value={form.fecha_pago}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Monto (S/)
            </label>
            <input
              type="number"
              step="0.01"
              name="monto"
              value={form.monto}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        {/* Método + referencia */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Método de pago
            </label>
            <select
              name="metodo_pago"
              value={form.metodo_pago}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {METODOS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Referencia / N° operación
            </label>
            <input
              type="text"
              name="referencia"
              value={form.referencia}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Código de operación, voucher, etc."
            />
          </div>
        </div>

        {/* Comprobante */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tipo de comprobante
          </label>
          <select
            name="tipo_comprobante"
            value={form.tipo_comprobante}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {TIPOS_COMPROBANTE.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Archivo comprobante (captura Yape / depósito)
          </label>
          <input
            type="file"
            name="comprobanteFile"
            accept="image/*,.pdf"
            onChange={handleChange}
            className="mt-1 block w-full text-sm text-gray-700
                       file:mr-2 file:py-1 file:px-3
                       file:rounded-md file:border-0
                       file:text-sm file:font-semibold
                       file:bg-blue-50 file:text-blue-700
                       hover:file:bg-blue-100"
          />
          {isEditing && form.comprobante_id && (
            <p className="mt-1 text-xs text-gray-500">
              Ya existe un comprobante asociado. Si subes uno nuevo, se
              vinculará ese nuevo comprobante al pago.
            </p>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {isEditing ? "Actualizar" : "Guardar pago"}
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
