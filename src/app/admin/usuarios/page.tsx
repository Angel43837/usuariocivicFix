import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const dateFormat = new Intl.DateTimeFormat("es-MX", { day: "2-digit", month: "short", year: "numeric" });

export default async function UsersPage() {
  const admin = createAdminClient();
  const { data: usersData } = await admin.auth.admin.listUsers();
  const users = usersData?.users ?? [];

  const { data: reportsData } = await admin.from("reports").select("user_id");
  const countByUser = new Map<string, number>();
  for (const row of reportsData ?? []) {
    if (!row.user_id) continue;
    countByUser.set(row.user_id, (countByUser.get(row.user_id) ?? 0) + 1);
  }

  const rows = users
    .map((user) => ({
      id: user.id,
      displayName: (user.user_metadata?.display_name as string | undefined) ?? user.email ?? "—",
      email: user.email ?? "—",
      createdAt: user.created_at,
      reportCount: countByUser.get(user.id) ?? 0,
    }))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <>
      <section className="page-heading">
        <div>
          <p className="eyebrow">
            Administración <span className="eyebrow-dot"></span> Cuentas registradas
          </p>
          <h1>Usuarios</h1>
          <p className="heading-date">Ciudadanos con cuenta en CivicFix.</p>
        </div>
      </section>

      <section className="reports-panel" aria-labelledby="users-title">
        <div className="panel-heading">
          <div className="panel-title-block">
            <div className="panel-title-row">
              <h2 id="users-title">Cuentas registradas</h2>
              <span className="result-count">{rows.length}</span>
            </div>
            <p>Nombre, correo y actividad de cada persona registrada</p>
          </div>
        </div>

        <div className="table-wrap">
          <table className="report-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Registrado</th>
                <th>Reportes enviados</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td colSpan={4} className="empty-state">
                    Todavía no hay usuarios registrados.
                  </td>
                </tr>
              )}
              {rows.map((user) => (
                <tr key={user.id}>
                  <td>{user.displayName}</td>
                  <td className="crew-cell">{user.email}</td>
                  <td className="date-cell">{dateFormat.format(new Date(user.createdAt))}</td>
                  <td>
                    <span className="result-count">{user.reportCount}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="table-caption">
          <span>
            Mostrando <strong>{rows.length}</strong> usuarios
          </span>
          <span>Datos de cuentas CivicFix</span>
        </div>
      </section>
    </>
  );
}
