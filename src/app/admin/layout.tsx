import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = createAdminClient();
  const { count } = await admin.from("reports").select("*", { count: "exact", head: true });

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link className="brand" href="/admin" aria-label="CivicFix, inicio">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 40 40" fill="none">
              <path
                d="M20 3 34 9v10c0 9-5.7 14.6-14 18C11.7 33.6 6 28 6 19V9l14-6Z"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="m13 20 4.5 4.5L27 15"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="20" cy="13" r="2" fill="currentColor" />
            </svg>
          </span>
          <span className="brand-copy">
            <strong>CivicFix</strong>
            <small>ADMIN PANEL</small>
          </span>
        </Link>

        <div className="nav-caption">Principal</div>
        <nav className="side-nav" aria-label="Navegación principal">
          <Link className="side-link is-active" href="/admin">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect x="6" y="3" width="12" height="18" rx="2" />
              <path d="M9 7h6M9 11h6M9 15h4" />
            </svg>
            <span>Reportes</span>
            <span className="nav-count">{count ?? 0}</span>
          </Link>
          <Link className="side-link" href="/admin/usuarios">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="9" cy="8" r="3" />
              <path d="M3 20v-2a6 6 0 0 1 12 0v2M16 5.5a3 3 0 0 1 0 5.8M18 14a5 5 0 0 1 3 4.6V20" />
            </svg>
            <span>Usuarios</span>
          </Link>
          <span className="side-link side-link--muted" aria-disabled="true">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 17h16M7 17v-5m5 5V7m5 10v-8" />
            </svg>
            <span>Cuadrillas</span>
            <span className="nav-count nav-count--green">6</span>
          </span>
          <span className="side-link side-link--muted" aria-disabled="true">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 20v-6M10 20V8M16 20V4M22 20v-9" />
            </svg>
            <span>Estadísticas</span>
          </span>
          <span className="side-link side-link--muted" aria-disabled="true">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="3" />
              <path
                d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.7a8 8 0 0 1-1.5.9l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.5-.9l-1.7.7-1.4-2.4 1.4-1.1a8 8 0 0 1 0-1.8l-1.4-1.1 1.4-2.4 1.7.7a8 8 0 0 1 1.5-.9l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.5.9l1.7-.7 1.4 2.4-1.4 1.1a8 8 0 0 1 0 1.7Z"
                transform="translate(-1 -1) scale(1.08)"
              />
            </svg>
            <span>Configuración</span>
          </span>
        </nav>

        <div className="nav-caption nav-caption--system">Sistema</div>
        <nav className="side-nav side-nav--secondary" aria-label="Ayuda">
          <span className="side-link side-link--muted">Soporte</span>
          <span className="side-link side-link--muted">Documentación</span>
        </nav>

        <div className="sidebar-user">
          <span className="avatar">OP</span>
          <span className="user-copy">
            <strong>Obras Públicas</strong>
            <small>Panel administrativo</small>
          </span>
          <span className="online-dot" title="En línea" />
        </div>
      </aside>

      <div className="workspace">
        <header className="topbar">
          <div className="topbar-title">
            <span className="topbar-kicker">Zona Metropolitana</span>
            <strong>Centro de operaciones</strong>
          </div>
        </header>
        <main className="main-content">{children}</main>
        <footer className="app-footer">
          <span>CivicFix · Gestión de servicios urbanos</span>
          <span>Zona Metropolitana</span>
        </footer>
      </div>
    </div>
  );
}
