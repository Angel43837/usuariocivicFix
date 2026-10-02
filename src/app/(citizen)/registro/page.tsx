import Link from "next/link";
import { registerAction } from "@/lib/actions/auth";

export default async function RegisterPage({
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
            Mi cuenta <span className="eyebrow-dot"></span> Registro
          </p>
          <h1>Crea tu cuenta</h1>
          <p className="heading-date">Regístrate para llevar seguimiento de tus reportes.</p>
        </div>
      </section>

      <section className="form-panel">
        <div className="form-panel-heading">
          <span className="form-step">01</span>
          <div>
            <h2>Datos de la cuenta</h2>
            <p>Usarás tu correo para iniciar sesión.</p>
          </div>
        </div>

        <form action={registerAction} className="report-form">
          <input type="hidden" name="returnTo" value={returnTo ?? "/mis-reportes"} />
          {error && <div className="validation-summary">{error}</div>}
          <div className="form-grid">
            <div className="field field--wide">
              <label htmlFor="displayName">Nombre</label>
              <input id="displayName" name="displayName" autoComplete="name" placeholder="Tu nombre" required />
            </div>
            <div className="field field--wide">
              <label htmlFor="email">Correo electrónico</label>
              <input id="email" name="email" type="email" autoComplete="email" placeholder="tu@correo.com" required />
            </div>
            <div className="field">
              <label htmlFor="password">Contraseña</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                placeholder="Mínimo 6 caracteres"
                minLength={6}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="confirmPassword">Confirmar contraseña</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                placeholder="Repite la contraseña"
                required
              />
            </div>
          </div>
          <div className="form-actions">
            <Link className="button button--quiet" href={`/iniciar-sesion${nextParam}`}>
              Ya tengo cuenta
            </Link>
            <button className="button button--primary" type="submit">
              Crear cuenta <span aria-hidden="true">→</span>
            </button>
          </div>
        </form>
      </section>
    </>
  );
}
