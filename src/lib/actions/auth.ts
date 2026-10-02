"use server";

import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function registerAction(formData: FormData) {
  const displayName = String(formData.get("displayName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");
  const returnTo = String(formData.get("returnTo") ?? "/mis-reportes");

  const fail = (message: string, path = "/registro") =>
    redirect(`${path}?error=${encodeURIComponent(message)}&returnTo=${encodeURIComponent(returnTo)}`);

  if (!displayName || !email || !password) fail("Completa todos los campos.");
  if (password.length < 6) fail("La contraseña debe tener al menos 6 caracteres.");
  if (password !== confirmPassword) fail("Las contraseñas no coinciden.");

  const admin = createAdminClient();
  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { display_name: displayName },
  });

  if (createError || !created.user) {
    fail(createError?.message ?? "No se pudo crear la cuenta.");
  }

  const supabase = await createClient();
  const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
  if (signInError) {
    fail("Cuenta creada. Inicia sesión.", "/iniciar-sesion");
  }

  redirect(returnTo || "/mis-reportes");
}

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const returnTo = String(formData.get("returnTo") ?? "/mis-reportes");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(
      `/iniciar-sesion?error=${encodeURIComponent("Correo o contraseña incorrectos.")}&returnTo=${encodeURIComponent(returnTo)}`
    );
  }

  redirect(returnTo || "/mis-reportes");
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/iniciar-sesion");
}
