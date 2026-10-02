export type ReportPriority = "Baja" | "Media" | "Alta";
export type ReportStatus = "Pendiente" | "En Proceso" | "Resuelto" | "Cancelado";

export type Report = {
  id: number;
  folio: string;
  category: string;
  location: string;
  priority: ReportPriority;
  status: ReportStatus;
  description: string;
  citizen_name: string;
  user_id: string | null;
  crew: string | null;
  photo_path: string | null;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
  resolved_at: string | null;
};

export const CATEGORIES = ["Alumbrado", "Agua", "Limpieza", "Parques", "Vialidad", "Otro"] as const;
export const PRIORITIES: ReportPriority[] = ["Baja", "Media", "Alta"];
