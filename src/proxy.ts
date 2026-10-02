import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const ADMIN_PREFIXES = ["/admin"];
const CITIZEN_PREFIXES = ["/iniciar-sesion", "/registro", "/reportar", "/mis-reportes", "/confirmacion"];

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  await supabase.auth.getUser();

  const siteMode = (process.env.SITE_MODE ?? "full").toLowerCase();
  const path = request.nextUrl.pathname;

  if (siteMode === "citizen" && ADMIN_PREFIXES.some((prefix) => path.startsWith(prefix))) {
    return new NextResponse("Not found", { status: 404 });
  }

  if (siteMode === "admin" && CITIZEN_PREFIXES.some((prefix) => path.startsWith(prefix))) {
    return new NextResponse("Not found", { status: 404 });
  }

  if (path === "/") {
    if (siteMode === "admin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    if (siteMode === "citizen") {
      return NextResponse.redirect(new URL("/reportar", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
