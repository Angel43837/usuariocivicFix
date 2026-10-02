import { assignAction, resolveAction } from "@/lib/actions/reports";
import { createAdminClient } from "@/lib/supabase/admin";
import { CATEGORIES } from "@/lib/types";
import type { Report } from "@/lib/types";

const dateFormat = new Intl.DateTimeFormat("es-MX", { day: "2-digit", month: "short", year: "numeric" });
const STATUSES = ["Pendiente", "En Proceso", "Resuelto", "Cancelado"] as const;

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string; categoria?: string; busqueda?: string }>;
}) {
  const { estado = "", categoria = "", busqueda = "" } = await searchParams;
  const admin = createAdminClient();

  const [{ count: totalCount }, { count: resolvedCount }, { count: pendingCount }, { count: inProgressCount }] =
    await Promise.all([
      admin.from("reports").select("*", { count: "exact", head: true }),
      admin.from("reports").select("*", { count: "exact", head: true }).eq("status", "Resuelto"),
      admin.from("reports").select("*", { count: "exact", head: true }).eq("status", "Pendiente"),
      admin.from("reports").select("*", { count: "exact", head: true }).eq("status", "En Proceso"),
    ]);

  let query = admin.from("reports").select("*");
  if (estado) query = query.eq("status", estado);
  if (categoria) query = query.eq("category", categoria);
  if (busqueda) {
    query = query.or(
      `folio.ilike.%${busqueda}%,location.ilike.%${busqueda}%,category.ilike.%${busqueda}%`
    );
  }
  const { data: reportsData } = await query.order("created_at", { ascending: false });
  const reports = (reportsData ?? []) as Report[];

  const total = totalCount ?? 0;
  const resolved = resolvedCount ?? 0;
  const pending = pendingCount ?? 0;
  const inProgress = inProgressCount ?? 0;
  const resolvedPercent = total === 0 ? 0 : Math.round((resolved * 100) / total);
  const pendingPercent = total === 0 ? 0 : Math.round((pending * 100) / total);
  const inProgressPercent = total === 0 ? 0 : Math.round((inProgress * 100) / total);

  const returnParams = new URLSearchParams();
  if (estado) returnParams.set("estado", estado);
  if (categoria) returnParams.set("categoria", categoria);
  if (busqueda) returnParams.set("busqueda", busqueda);
  const returnTo = `/admin${returnParams.toString() ? `?${returnParams.toString()}` : ""}`;

  const exportParams = new URLSearchParams(returnParams);
  const todayLabel = new Intl.DateTimeFormat("es-MX", {
    weekday: "long",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date());

  function tabHref(nextEstado: string) {
    const params = new URLSearchParams();
    if (nextEstado) params.set("estado", nextEstado);
    if (categoria) params.set("categoria", categoria);
    if (busqueda) params.set("busqueda", busqueda);
    return `/admin${params.toString() ? `?${params.toString()}` : ""}`;
  }

  return (
    <>
      <section className="page-heading">
        <div>
          <p className="eyebrow">
            Operación diaria <span className="eyebrow-dot"></span> Zona Metropolitana
          </p>
          <h1>Gestión de reportes</h1>
          <p className="heading-date">
            {todayLabel} <span>·</span> Seguimiento ciudadano
          </p>
        </div>
        <div className="heading-note">
          <span className="live-indicator"></span> Actualizado al momento
        </div>
      </section>

      <section className="metrics-grid" aria-label="Resumen de reportes">
        <article className="metric-card metric-card--blue">
          <div className="metric-top">
            <span className="metric-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="16" rx="2.5" />
                <path d="M7 9h10M7 13h7" />
              </svg>
            </span>
            <span className="metric-trend">Últimos 30 días</span>
          </div>
          <strong className="metric-value">{total}</strong>
          <span className="metric-label">Total de reportes</span>
          <div className="metric-track">
            <span style={{ width: "100%" }}></span>
          </div>
        </article>
        <article className="metric-card metric-card--green">
          <div className="metric-top">
            <span className="metric-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" />
                <path d="m8 12 2.7 2.7L16.5 9" />
              </svg>
            </span>
            <span className="metric-trend">{resolvedPercent}% del total</span>
          </div>
          <strong className="metric-value">{resolved}</strong>
          <span className="metric-label">Resueltos</span>
          <div className="metric-track">
            <span style={{ width: `${resolvedPercent}%` }}></span>
          </div>
        </article>
        <article className="metric-card metric-card--orange">
          <div className="metric-top">
            <span className="metric-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v6M12 16.5v.1" />
              </svg>
            </span>
            <span className="metric-trend">Requieren atención</span>
          </div>
          <strong className="metric-value">{pending}</strong>
          <span className="metric-label">Pendientes</span>
          <div className="metric-track">
            <span style={{ width: `${pendingPercent}%` }}></span>
          </div>
        </article>
        <article className="metric-card metric-card--sky">
          <div className="metric-top">
            <span className="metric-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3.5 2" />
              </svg>
            </span>
            <span className="metric-trend">Cuadrillas activas</span>
          </div>
          <strong className="metric-value">{inProgress}</strong>
          <span className="metric-label">En proceso</span>
          <div className="metric-track">
            <span style={{ width: `${inProgressPercent}%` }}></span>
          </div>
        </article>
      </section>

      <section className="reports-panel" aria-labelledby="reports-title">
        <div className="panel-heading">
          <div className="panel-title-block">
            <div className="panel-title-row">
              <h2 id="reports-title">Reportes ciudadanos</h2>
              <span className="result-count">{reports.length}</span>
            </div>
            <p>Folios recientes y seguimiento operativo</p>
          </div>
          <div className="panel-tools">
            <a className="button button--quiet" href={`/admin/export?${exportParams.toString()}`}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 3v12m0 0 4-4m-4 4-4-4M5 17v3h14v-3" />
              </svg>
              Exportar CSV
            </a>
          </div>
        </div>

        <nav className="status-tabs" aria-label="Filtrar por estatus">
          <a className={`status-tab ${estado === "" ? "is-selected" : ""}`} href={tabHref("")}>
            Todos <span>{total}</span>
          </a>
          {STATUSES.map((status) => (
            <a
              key={status}
              className={`status-tab ${estado === status ? "is-selected" : ""}`}
              href={tabHref(status)}
            >
              {status}
            </a>
          ))}
        </nav>

        <form className="filter-bar" action="/admin" method="get">
          <input type="hidden" name="estado" value={estado} />
          <label className="filter-search">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="10.8" cy="10.8" r="6.5" />
              <path d="m16 16 4.5 4.5" />
            </svg>
            <input
              type="search"
              name="busqueda"
              defaultValue={busqueda}
              placeholder="Buscar en reportes"
              aria-label="Buscar en reportes"
            />
          </label>
          <label className="select-wrap">
            <span className="sr-only">Categoría</span>
            <select name="categoria" defaultValue={categoria} aria-label="Filtrar por categoría">
              <option value="">Todas las categorías</option>
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
          <button className="button button--filter" type="submit">
            Aplicar filtros
          </button>
        </form>

        <div className="table-wrap">
          <table className="report-table">
            <thead>
              <tr>
                <th>Folio</th>
                <th>Categoría</th>
                <th>Ubicación</th>
                <th>Prioridad</th>
                <th>Fecha</th>
                <th>Estatus</th>
                <th>Cuadrilla</th>
                <th>
                  <span className="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {reports.length === 0 && (
                <tr>
                  <td colSpan={8} className="empty-state">
                    No hay reportes que coincidan con estos filtros.
                  </td>
                </tr>
              )}
              {reports.map((report) => (
                <tr key={report.id}>
                  <td>
                    <span className="folio">{report.folio}</span>
                  </td>
                  <td>
                    <span className={`category-tag category-tag--${report.category.toLowerCase()}`}>
                      {report.category}
                    </span>
                  </td>
                  <td>
                    <span className="location-text">{report.location}</span>
                  </td>
                  <td>
                    <span className={`priority priority--${report.priority.toLowerCase()}`}>
                      <i></i>
                      {report.priority}
                    </span>
                  </td>
                  <td className="date-cell">{dateFormat.format(new Date(report.created_at))}</td>
                  <td>
                    <span
                      className={`status-pill status-pill--${report.status.toLowerCase().replace(" ", "-")}`}
                    >
                      <i></i>
                      {report.status}
                    </span>
                  </td>
                  <td className="crew-cell">{report.crew ?? "—"}</td>
                  <td className="action-cell">
                    {report.status === "Pendiente" && (
                      <form action={assignAction.bind(null, report.id, returnTo)}>
                        <button className="row-action row-action--assign" type="submit">
                          Asignar
                        </button>
                      </form>
                    )}
                    {report.status === "En Proceso" && (
                      <form action={resolveAction.bind(null, report.id, returnTo)}>
                        <button className="row-action row-action--resolve" type="submit">
                          Resolver
                        </button>
                      </form>
                    )}
                    {report.status !== "Pendiente" && report.status !== "En Proceso" && (
                      <span className="action-done" aria-label="Sin acciones disponibles">
                        —
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="table-caption">
          <span>
            Mostrando <strong>{reports.length}</strong> de <strong>{total}</strong> reportes
          </span>
          <span>Datos de operación ciudadana</span>
        </div>
      </section>
    </>
  );
}
