import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { Report } from "@/lib/types";

const dateFormat = new Intl.DateTimeFormat("es-MX", { day: "2-digit", month: "short", year: "numeric" });

export default async function MisReportesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/iniciar-sesion?returnTo=${encodeURIComponent("/mis-reportes")}`);
  }

  const admin = createAdminClient();
  const { data: reports } = await admin
    .from("reports")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const rows = (reports ?? []) as Report[];

  return (
    <>
      <section className="page-heading">
        <div>
          <p className="eyebrow">
            Mi cuenta <span className="eyebrow-dot"></span> Seguimiento personal
          </p>
          <h1>Mis reportes</h1>
          <p className="heading-date">Folios que registraste con tu cuenta.</p>
        </div>
        <a className="button button--primary top-create" href="/reportar">
          <span aria-hidden="true">+</span>
          <span>Nuevo reporte</span>
        </a>
      </section>

      <section className="reports-panel">
        <div className="panel-heading">
          <div className="panel-title-block">
            <div className="panel-title-row">
              <h2>Tus folios</h2>
              <span className="result-count">{rows.length}</span>
            </div>
            <p>Estado actual de cada reporte que enviaste</p>
          </div>
        </div>

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
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="empty-state">
                    Todavía no tienes reportes registrados.
                  </td>
                </tr>
              )}
              {rows.map((report) => (
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="table-caption">
          <span>
            Mostrando <strong>{rows.length}</strong> reportes propios
          </span>
          <span>Datos de tu cuenta</span>
        </div>
      </section>
    </>
  );
}
