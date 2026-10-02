"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { CATEGORIES, PRIORITIES, type ReportPriority } from "@/lib/types";

const PHOTO_EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export async function createReportAction(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/iniciar-sesion?returnTo=${encodeURIComponent("/reportar")}`);
  }

  const citizenName = String(formData.get("citizenName") ?? "").trim();
  const category = String(formData.get("category") ?? "");
  const location = String(formData.get("location") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const priority = String(formData.get("priority") ?? "Media");
  const latitudeRaw = formData.get("latitude");
  const longitudeRaw = formData.get("longitude");
  const photo = formData.get("photo") as File | null;

  const errors: string[] = [];
  if (!citizenName) errors.push("Escribe tu nombre.");
  if (!(CATEGORIES as readonly string[]).includes(category)) errors.push("Elige una categoría válida.");
  if (!location) errors.push("Describe dónde ocurre el problema.");
  if (description.length < 12) errors.push("La descripción debe tener al menos 12 caracteres.");
  if (!PRIORITIES.includes(priority as ReportPriority)) errors.push("Elige una prioridad válida.");

  const admin = createAdminClient();
  let photoPath: string | null = null;

  if (photo && photo.size > 0) {
    const extension = PHOTO_EXTENSIONS[photo.type];
    if (!extension || photo.size > 5 * 1024 * 1024) {
      errors.push("Adjunta una imagen JPG, PNG o WEBP de hasta 5 MB.");
    } else {
      const fileName = `${randomUUID()}.${extension}`;
      const { error: uploadError } = await admin.storage
        .from("report-photos")
        .upload(fileName, photo, { contentType: photo.type });

      if (uploadError) {
        errors.push("No se pudo subir la fotografía.");
      } else {
        photoPath = admin.storage.from("report-photos").getPublicUrl(fileName).data.publicUrl;
      }
    }
  }

  if (errors.length > 0) {
    redirect(`/reportar?error=${encodeURIComponent(errors.join(" "))}`);
  }

  const folio = `CF-${new Date().getUTCFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

  const { error: insertError } = await admin.from("reports").insert({
    folio,
    category,
    location,
    priority,
    description,
    citizen_name: citizenName,
    user_id: user.id,
    status: "Pendiente",
    photo_path: photoPath,
    latitude: latitudeRaw ? Number(latitudeRaw) : null,
    longitude: longitudeRaw ? Number(longitudeRaw) : null,
  });

  if (insertError) {
    redirect(`/reportar?error=${encodeURIComponent("No se pudo guardar el reporte.")}`);
  }

  redirect(`/confirmacion?folio=${encodeURIComponent(folio)}`);
}

export async function assignAction(id: number, returnTo: string) {
  const admin = createAdminClient();
  await admin
    .from("reports")
    .update({ status: "En Proceso", crew: "Cuadrilla A-7" })
    .eq("id", id)
    .eq("status", "Pendiente");

  revalidatePath("/admin");
  redirect(returnTo || "/admin");
}

export async function resolveAction(id: number, returnTo: string) {
  const admin = createAdminClient();
  await admin
    .from("reports")
    .update({ status: "Resuelto", resolved_at: new Date().toISOString() })
    .eq("id", id)
    .in("status", ["Pendiente", "En Proceso"]);

  revalidatePath("/admin");
  redirect(returnTo || "/admin");
}
