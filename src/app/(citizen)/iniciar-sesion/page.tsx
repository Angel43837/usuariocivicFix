import Link from "next/link";
import { loginAction } from "@/lib/actions/auth";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; returnTo?: string }>;
}) {
  const { error, returnTo } = await searchParams;
  const nextParam = returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : "";

  return (
    <>
      <section className="page-heading page-heading--form">
        <div>
          <p className="eyebrow">
            Mi cuenta <span className="eyebrow-dot"></span> Acceso
          </p>
          <h1>Inicia sesión</h1>
          <p className="heading-date">Entra para ver y crear tus reportes.</p>
        </div>
      </section>

      <section className="form-panel">
        <div className="form-panel-heading">
          <span className="form-step">01</span>
          <div>
            <h2>Correo y contraseña</h2>
            <p>Usa los datos con los que te registraste.</p>
          </div>
        </div>

        <form action={loginAction} className="report-form">
          <input type="hidden" name="returnTo" value={returnTo ?? "/mis-reportes"} />
          {error && <div className="validation-summary">{error}</div>}
          <div className="form-grid">
            <div className="field field--wide">
              <label htmlFor="email">Correo electrónico</label>
              <input id="email" name="email" type="email" autoComplete="email" placeholder="tu@correo.com" required />
            </div>
            <div className="field field--wide">
              <label htmlFor="password">Contraseña</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="Tu contraseña"
                required
              />
            </div>
          </div>
          <div className="form-actions">
            <Link className="button button--quiet" href={`/registro${nextParam}`}>
              Crear cuenta
            </Link>
            <button className="button button--primary" type="submit">
              Entrar <span aria-hidden="true">→</span>
            </button>
          </div>
        </form>
      </section>
    </>
  );
}
