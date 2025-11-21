// frontend/src/components/public/PublicLanding.jsx
import { useEffect, useState } from "react";
import { getPlanes } from "../../api/planesApi";
import { getClientePorDni, createCliente } from "../../api/clientesApi";
import { getFacturasPorCliente } from "../../api/facturasApi";
import { getPagosPorCliente } from "../../api/pagosApi";

export default function PublicLanding() {
  const [planes, setPlanes] = useState([]);
  const [loadingPlanes, setLoadingPlanes] = useState(true);

  // Consulta por DNI
  const [dni, setDni] = useState("");
  const [cliente, setCliente] = useState(null);
  const [facturas, setFacturas] = useState([]);
  const [pagos, setPagos] = useState([]);
  const [loadingConsulta, setLoadingConsulta] = useState(false);
  const [consultaError, setConsultaError] = useState("");

  // Formulario "Quiero contratar"
  const [contactForm, setContactForm] = useState({
    dni: "",
    nombres: "",
    apellidos: "",
    telefono: "",
    email: "",
    direccion: "",
    plan_id: "",
  });
  const [enviandoContacto, setEnviandoContacto] = useState(false);
  const [contactoOk, setContactoOk] = useState("");
  const [contactoError, setContactoError] = useState("");

  useEffect(() => {
    const cargarPlanes = async () => {
      try {
        setLoadingPlanes(true);
        const data = await getPlanes();
        setPlanes(data.filter((p) => p.activo)); // solo planes activos
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingPlanes(false);
      }
    };
    cargarPlanes();
  }, []);

  const handleConsultar = async (e) => {
    e.preventDefault();
    const cleanDni = dni.trim();
    if (!cleanDni) {
      setConsultaError("Ingresa tu número de DNI");
      return;
    }

    try {
      setLoadingConsulta(true);
      setConsultaError("");
      setCliente(null);
      setFacturas([]);
      setPagos([]);

      const cli = await getClientePorDni(cleanDni);
      setCliente(cli);

      const [facturasData, pagosData] = await Promise.all([
        getFacturasPorCliente(cli.id),
        getPagosPorCliente(cli.id),
      ]);

      setFacturas(facturasData);
      setPagos(pagosData);
    } catch (err) {
      console.error(err);
      setConsultaError(err.message || "Error al buscar información");
    } finally {
      setLoadingConsulta(false);
    }
  };

  const totalFacturado = facturas.reduce(
    (acc, f) => acc + Number(f.monto || 0),
    0
  );
  const totalPagado = pagos.reduce(
    (acc, p) => acc + Number(p.monto || 0),
    0
  );
  const totalPendiente = totalFacturado - totalPagado;

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEnviarContacto = async (e) => {
    e.preventDefault();
    setContactoOk("");
    setContactoError("");

    const { dni, nombres, apellidos } = contactForm;
    if (!dni.trim() || !nombres.trim() || !apellidos.trim()) {
      setContactoError("DNI, nombres y apellidos son obligatorios");
      return;
    }

    try {
      setEnviandoContacto(true);

      // Registramos al cliente como PROSPECTO
      await createCliente({
        dni: contactForm.dni.trim(),
        nombres: contactForm.nombres.trim(),
        apellidos: contactForm.apellidos.trim(),
        telefono: contactForm.telefono.trim() || null,
        email: contactForm.email.trim() || null,
        direccion:
          contactForm.direccion.trim() ||
          (contactForm.plan_id
            ? `Interesado en plan ID ${contactForm.plan_id}`
            : null),
        estado: "PROSPECTO",
      });

      setContactoOk(
        "¡Gracias! Hemos recibido tu solicitud. Nos pondremos en contacto contigo pronto."
      );
      setContactForm({
        dni: "",
        nombres: "",
        apellidos: "",
        telefono: "",
        email: "",
        direccion: "",
        plan_id: "",
      });
    } catch (err) {
      console.error(err);
      setContactoError(
        err.message || "Ocurrió un error al enviar tu solicitud"
      );
    } finally {
      setEnviandoContacto(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-slate-900 to-slate-950" />
        <div className="max-w-5xl mx-auto px-4 py-16 relative z-10 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1">
            <p className="text-cyan-400 text-xs font-semibold uppercase tracking-[0.2em] mb-2">
              INTERNET FIBRA ÓPTICA
            </p>
            <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-4">
              Cyberlink
              <span className="block text-cyan-400">
                Conéctate sin límites.
              </span>
            </h1>
            <p className="text-sm md:text-base text-slate-300 mb-4">
              Planes de internet estables, pensados para tu hogar y negocio en
              tu zona. Soporte rápido y atención cercana.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="#planes"
                className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md bg-cyan-500 text-slate-950 hover:bg-cyan-400"
              >
                Ver planes
              </a>
              <a
                href="#contacto"
                className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md border border-slate-600 hover:border-cyan-400 hover:text-cyan-300"
              >
                Quiero contratar
              </a>
            </div>
          </div>
          <div className="flex-1">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-xl">
              <p className="text-xs text-slate-400 mb-1">¿Ya eres cliente?</p>
              <h2 className="text-base font-semibold mb-3">
                Consulta tu estado con tu DNI
              </h2>
              <form onSubmit={handleConsultar} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300">
                    Número de DNI
                  </label>
                  <input
                    type="text"
                    value={dni}
                    onChange={(e) => setDni(e.target.value)}
                    className="mt-1 block w-full rounded-md border-slate-700 bg-slate-900 text-sm text-slate-100 shadow-sm focus:border-cyan-400 focus:ring-cyan-400"
                    placeholder="Ej: 12345678"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loadingConsulta}
                  className="w-full inline-flex justify-center items-center px-3 py-1.5 rounded-md text-sm font-medium bg-cyan-500 text-slate-950 hover:bg-cyan-400 disabled:opacity-60"
                >
                  {loadingConsulta ? "Consultando..." : "Consultar estado"}
                </button>
                {consultaError && (
                  <p className="text-xs text-red-400 bg-red-950/40 border border-red-800 px-2 py-1 rounded">
                    {consultaError}
                  </p>
                )}
              </form>

              {/* Resultado resumido dentro del recuadro */}
              {cliente && (
                <div className="mt-4 border-t border-slate-800 pt-3 space-y-2">
                  <p className="text-xs text-slate-400">
                    Resultado para:{" "}
                    <span className="font-semibold text-slate-100">
                      {cliente.nombres} {cliente.apellidos}
                    </span>
                  </p>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="bg-slate-900 rounded-md p-2">
                      <p className="text-slate-400 text-[11px]">
                        Total facturado
                      </p>
                      <p className="text-slate-50 font-semibold">
                        S/ {totalFacturado.toFixed(2)}
                      </p>
                    </div>
                    <div className="bg-slate-900 rounded-md p-2">
                      <p className="text-slate-400 text-[11px]">
                        Total pagado
                      </p>
                      <p className="text-emerald-400 font-semibold">
                        S/ {totalPagado.toFixed(2)}
                      </p>
                    </div>
                    <div className="bg-slate-900 rounded-md p-2">
                      <p className="text-slate-400 text-[11px]">
                        Pendiente
                      </p>
                      <p
                        className={`font-semibold ${
                          totalPendiente > 0
                            ? "text-red-400"
                            : totalPendiente < 0
                            ? "text-emerald-400"
                            : "text-slate-50"
                        }`}
                      >
                        S/ {totalPendiente.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <a
                    href="#detalle-consulta"
                    className="text-[11px] text-cyan-300 hover:text-cyan-200 underline"
                  >
                    Ver detalle de facturas y pagos
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* PLANES */}
      <section id="planes" className="max-w-5xl mx-auto px-4 py-10">
        <h2 className="text-xl font-bold text-slate-50 mb-2">
          Planes pensados para ti
        </h2>
        <p className="text-sm text-slate-400 mb-4">
          Elige el plan que mejor se adapte a tu hogar o negocio.
        </p>

        {loadingPlanes ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-400" />
          </div>
        ) : planes.length === 0 ? (
          <p className="text-sm text-slate-400">
            Próximamente publicaremos nuestros planes aquí.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {planes.map((p) => (
              <div
                key={p.id}
                className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 flex flex-col"
              >
                <h3 className="text-base font-semibold text-slate-50">
                  {p.nombre}
                </h3>
                <p className="text-sm text-cyan-300 mt-1">{p.velocidad}</p>
                <p className="mt-2 text-2xl font-bold text-slate-50">
                  S/ {Number(p.precio_mensual).toFixed(2)}
                  <span className="text-xs font-normal text-slate-400 ml-1">
                    /mes
                  </span>
                </p>
                <p className="mt-2 text-xs text-slate-400 flex-1">
                  Conexión estable, soporte local y asistencia rápida.
                </p>
                <button
                  type="button"
                  onClick={() =>
                    setContactForm((prev) => ({
                      ...prev,
                      plan_id: p.id.toString(),
                    }))
                  }
                  className="mt-4 inline-flex justify-center items-center px-3 py-1.5 rounded-md text-sm font-medium bg-cyan-500 text-slate-950 hover:bg-cyan-400"
                >
                  Quiero este plan
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* FORMULARIO DE CONTACTO / SOLICITAR INSTALACIÓN */}
      <section
        id="contacto"
        className="max-w-5xl mx-auto px-4 pb-12 grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        <div>
          <h2 className="text-xl font-bold text-slate-50 mb-2">
            Solicita tu conexión Cyberlink
          </h2>
          <p className="text-sm text-slate-400 mb-3">
            Déjanos tus datos y uno de nuestros asesores te contactará para
            coordinar la instalación y resolver cualquier duda.
          </p>
          <ul className="text-sm text-slate-300 space-y-1">
            <li>• Internet estable para streaming, clases y trabajo remoto.</li>
            <li>• Atención rápida por WhatsApp o llamada.</li>
            <li>• Cobertura en tu zona (consúltanos).</li>
          </ul>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-4">
          <form onSubmit={handleEnviarContacto} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300">
                  DNI *
                </label>
                <input
                  type="text"
                  name="dni"
                  value={contactForm.dni}
                  onChange={handleContactChange}
                  className="mt-1 block w-full rounded-md border-slate-700 bg-slate-950 text-sm text-slate-100 shadow-sm focus:border-cyan-400 focus:ring-cyan-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300">
                  Teléfono
                </label>
                <input
                  type="text"
                  name="telefono"
                  value={contactForm.telefono}
                  onChange={handleContactChange}
                  className="mt-1 block w-full rounded-md border-slate-700 bg-slate-950 text-sm text-slate-100 shadow-sm focus:border-cyan-400 focus:ring-cyan-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300">
                  Nombres *
                </label>
                <input
                  type="text"
                  name="nombres"
                  value={contactForm.nombres}
                  onChange={handleContactChange}
                  className="mt-1 block w-full rounded-md border-slate-700 bg-slate-950 text-sm text-slate-100 shadow-sm focus:border-cyan-400 focus:ring-cyan-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300">
                  Apellidos *
                </label>
                <input
                  type="text"
                  name="apellidos"
                  value={contactForm.apellidos}
                  onChange={handleContactChange}
                  className="mt-1 block w-full rounded-md border-slate-700 bg-slate-950 text-sm text-slate-100 shadow-sm focus:border-cyan-400 focus:ring-cyan-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={contactForm.email}
                onChange={handleContactChange}
                className="mt-1 block w-full rounded-md border-slate-700 bg-slate-950 text-sm text-slate-100 shadow-sm focus:border-cyan-400 focus:ring-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300">
                Dirección (referencias, zona, etc.)
              </label>
              <input
                type="text"
                name="direccion"
                value={contactForm.direccion}
                onChange={handleContactChange}
                className="mt-1 block w-full rounded-md border-slate-700 bg-slate-950 text-sm text-slate-100 shadow-sm focus:border-cyan-400 focus:ring-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300">
                Plan de interés
              </label>
              <select
                name="plan_id"
                value={contactForm.plan_id}
                onChange={handleContactChange}
                className="mt-1 block w-full rounded-md border-slate-700 bg-slate-950 text-sm text-slate-100 shadow-sm focus:border-cyan-400 focus:ring-cyan-400"
              >
                <option value="">No estoy seguro</option>
                {planes.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre} — {p.velocidad} (S/{" "}
                    {Number(p.precio_mensual).toFixed(2)})
                  </option>
                ))}
              </select>
            </div>

            {contactoError && (
              <p className="text-xs text-red-400 bg-red-950/40 border border-red-800 px-2 py-1 rounded">
                {contactoError}
              </p>
            )}
            {contactoOk && (
              <p className="text-xs text-emerald-300 bg-emerald-950/40 border border-emerald-800 px-2 py-1 rounded">
                {contactoOk}
              </p>
            )}

            <button
              type="submit"
              disabled={enviandoContacto}
              className="w-full inline-flex justify-center items-center px-3 py-1.5 rounded-md text-sm font-medium bg-cyan-500 text-slate-950 hover:bg-cyan-400 disabled:opacity-60"
            >
              {enviandoContacto ? "Enviando..." : "Enviar solicitud"}
            </button>
          </form>
        </div>
      </section>

      {/* DETALLE CONSULTA ABAJO */}
      {cliente && (
        <section
          id="detalle-consulta"
          className="max-w-5xl mx-auto px-4 pb-12 space-y-6"
        >
          <h2 className="text-lg font-bold text-slate-50">
            Detalle de facturas y pagos
          </h2>

          {/* Facturas */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-slate-200 mb-2">
              Facturas
            </h3>
            {facturas.length === 0 ? (
              <p className="text-xs text-slate-400">
                No se encontraron facturas registradas.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs">
                  <thead className="bg-slate-950/60">
                    <tr>
                      <th className="px-2 py-1 text-left font-semibold text-slate-300">
                        Periodo
                      </th>
                      <th className="px-2 py-1 text-left font-semibold text-slate-300">
                        Emisión / Vence
                      </th>
                      <th className="px-2 py-1 text-left font-semibold text-slate-300">
                        Monto
                      </th>
                      <th className="px-2 py-1 text-left font-semibold text-slate-300">
                        Estado
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {facturas.map((f) => (
                      <tr key={f.id}>
                        <td className="px-2 py-1 text-slate-200">
                          {f.periodo_desde} → {f.periodo_hasta}
                        </td>
                        <td className="px-2 py-1 text-slate-300">
                          {f.fecha_emision} / {f.fecha_vencimiento}
                        </td>
                        <td className="px-2 py-1 text-slate-100">
                          S/ {Number(f.monto).toFixed(2)}
                        </td>
                        <td className="px-2 py-1">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium ${
                              f.estado === "PAGADA"
                                ? "bg-emerald-900/50 text-emerald-300"
                                : f.estado === "VENCIDA"
                                ? "bg-red-900/40 text-red-300"
                                : "bg-yellow-900/40 text-yellow-200"
                            }`}
                          >
                            {f.estado}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pagos */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-slate-200 mb-2">
              Pagos
            </h3>
            {pagos.length === 0 ? (
              <p className="text-xs text-slate-400">
                No se encontraron pagos registrados.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs">
                  <thead className="bg-slate-950/60">
                    <tr>
                      <th className="px-2 py-1 text-left font-semibold text-slate-300">
                        Fecha
                      </th>
                      <th className="px-2 py-1 text-left font-semibold text-slate-300">
                        Monto
                      </th>
                      <th className="px-2 py-1 text-left font-semibold text-slate-300">
                        Método
                      </th>
                      <th className="px-2 py-1 text-left font-semibold text-slate-300">
                        Referencia
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {pagos.map((p) => (
                      <tr key={p.id}>
                        <td className="px-2 py-1 text-slate-300">
                          {p.fecha_pago}
                        </td>
                        <td className="px-2 py-1 text-slate-100">
                          S/ {Number(p.monto).toFixed(2)}
                        </td>
                        <td className="px-2 py-1 text-slate-300">
                          {p.metodo_pago}
                        </td>
                        <td className="px-2 py-1 text-slate-300">
                          {p.referencia}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
