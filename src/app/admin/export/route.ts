import type { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

function escapeCsv(value: string) {
  return `"${value.replace(/"/g, '""')}"`;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const estado = searchParams.get("estado") ?? "";
  const categoria = searchParams.get("categoria") ?? "";
  const busqueda = searchParams.get("busqueda") ?? "";

  const admin = createAdminClient();
  let query = admin.from("reports").select("*");
  if (estado) query = query.eq("status", estado);
  if (categoria) query = query.eq("category", categoria);
  if (busqueda) {
    query = query.or(
      `folio.ilike.%${busqueda}%,location.ilike.%${busqueda}%,category.ilike.%${busqueda}%`
    );
  }
  const { data } = await query.order("created_at", { ascending: false });

  let csv = "Folio,Categoría,Ubicación,Prioridad,Fecha,Estatus,Cuadrilla\r\n";
  for (const report of data ?? []) {
    csv +=
      [
        report.folio,
        report.category,
        report.location,
        report.priority,
        new Date(report.created_at).toISOString().slice(0, 10),
        report.status,
        report.crew ?? "",
      ]
        .map(escapeCsv)
        .join(",") + "\r\n";
  }

  return new Response(`﻿${csv}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="civicfix-reportes.csv"',
    },
  });
}
