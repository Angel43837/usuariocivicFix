import { redirect } from "next/navigation";
import ReportFormFields from "@/components/ReportFormFields";
import { createReportAction } from "@/lib/actions/reports";
import { createClient } from "@/lib/supabase/server";

export default async function ReportarPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/iniciar-sesion?returnTo=${encodeURIComponent("/reportar")}`);
  }

  const displayName = (user.user_metadata?.display_name as string | undefined) ?? "";

  return (
    <>
      <section className="page-heading page-heading--form">
        <div>
          <p className="eyebrow">
            Atención ciudadana <span className="eyebrow-dot"></span> Nuevo folio
          </p>
          <h1>Reportar un problema</h1>
          <p className="heading-date">Describe el servicio urbano que necesita atención.</p>
        </div>
      </section>

      <section className="form-panel">
        <div className="form-panel-heading">
          <span className="form-step">01</span>
          <div>
            <h2>Detalles del reporte</h2>
            <p>Los campos marcados son necesarios para dar seguimiento.</p>
          </div>
        </div>

        <form action={createReportAction} className="report-form">
          <ReportFormFields initialName={displayName} error={error} />
          <div className="form-actions">
            <button className="button button--primary" type="submit">
              Enviar reporte <span aria-hidden="true">→</span>
            </button>
          </div>
        </form>
      </section>
    </>
  );
}
