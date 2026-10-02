import Link from "next/link";

export default async function ConfirmacionPage({
  searchParams,
}: {
  searchParams: Promise<{ folio?: string }>;
}) {
  const { folio } = await searchParams;

  return (
    <section className="confirmation-panel">
      <span className="confirmation-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path d="m5 12 4.5 4.5L19 7" />
        </svg>
      </span>
      <p className="eyebrow">Atención ciudadana</p>
      <h1>Reporte recibido</h1>
      <p>Tu folio quedó registrado y está pendiente de revisión.</p>
      <div className="confirmation-folio">
        <span>Folio de seguimiento</span>
        <strong>{folio}</strong>
      </div>
      <Link className="button button--primary" href="/mis-reportes">
        Ver mis reportes
      </Link>
    </section>
  );
}
