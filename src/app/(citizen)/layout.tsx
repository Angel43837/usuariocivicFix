import Link from "next/link";
import { logoutAction } from "@/lib/actions/auth";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function CitizenLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const displayName = (user?.user_metadata?.display_name as string | undefined) ?? user?.email ?? null;

  return (
    <div className="citizen-body">
      <div className="citizen-shell">
        <div className="citizen-topbar">Ayuntamiento de Maravatío, Michoacán · Atención Ciudadana</div>
        <header className="citizen-header">
          <Link className="citizen-brand" href="/reportar">
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
            <span className="citizen-brand-copy">
              <strong>CivicFix</strong>
              <small>PORTAL CIUDADANO</small>
            </span>
          </Link>

          <nav className="citizen-nav" aria-label="Navegación ciudadana">
            <Link href="/reportar">Nuevo reporte</Link>
            {user && <Link href="/mis-reportes">Mis reportes</Link>}
          </nav>

          <div className="citizen-auth">
            {user ? (
              <>
                <span className="citizen-user">Hola, {displayName}</span>
                <form action={logoutAction}>
                  <button className="button button--quiet" type="submit">
                    Salir
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link className="button button--quiet" href="/iniciar-sesion">
                  Iniciar sesión
                </Link>
                <Link className="button button--primary" href="/registro">
                  Registrarme
                </Link>
              </>
            )}
          </div>
        </header>

        <main className="citizen-main">{children}</main>

        <footer className="citizen-footer">
          <span>CivicFix · Dirección de Obras Públicas, Maravatío</span>
          <span>Portal ciudadano de reportes urbanos</span>
        </footer>
      </div>
    </div>
  );
}
