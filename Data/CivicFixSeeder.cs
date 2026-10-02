using CivicFix.Models;
using Microsoft.EntityFrameworkCore;

namespace CivicFix.Data;

public static class CivicFixSeeder
{
    public static async Task SeedAsync(CivicFixContext database)
    {
        if (await database.Reports.AnyAsync())
        {
            return;
        }

        var today = DateTime.UtcNow.Date;
        database.Reports.AddRange(
            new CivicReport { Folio = "CF-2026-00441", Category = "Vialidad", Location = "Av. Insurgentes Sur 1234, Del Valle", Priority = "Alta", Status = "Pendiente", Description = "Bache profundo junto al cruce peatonal.", CitizenName = "María Torres", CreatedAt = today.AddDays(-4) },
            new CivicReport { Folio = "CF-2026-00439", Category = "Alumbrado", Location = "Calle Reforma 89, Col. Juárez", Priority = "Media", Status = "En Proceso", Description = "Luminaria apagada desde hace tres noches.", CitizenName = "Luis Mendoza", Crew = "Cuadrilla A-7", CreatedAt = today.AddDays(-4).AddHours(-2) },
            new CivicReport { Folio = "CF-2026-00438", Category = "Limpieza", Location = "Parque España, Hipódromo", Priority = "Baja", Status = "Resuelto", Description = "Acumulación de residuos junto a las bancas.", CitizenName = "Ana Ruiz", Crew = "Cuadrilla C-2", CreatedAt = today.AddDays(-5), ResolvedAt = today.AddDays(-2) },
            new CivicReport { Folio = "CF-2026-00437", Category = "Vialidad", Location = "Eje Central 52, Centro", Priority = "Alta", Status = "Pendiente", Description = "Semáforo peatonal no enciende.", CitizenName = "Carlos León", CreatedAt = today.AddDays(-3) },
            new CivicReport { Folio = "CF-2026-00436", Category = "Agua", Location = "Calle Sonora 118, Roma Norte", Priority = "Alta", Status = "En Proceso", Description = "Fuga de agua en banqueta.", CitizenName = "Elena Ríos", Crew = "Cuadrilla B-4", CreatedAt = today.AddDays(-3).AddHours(-4) },
            new CivicReport { Folio = "CF-2026-00435", Category = "Alumbrado", Location = "Av. Universidad 302, Narvarte", Priority = "Media", Status = "Resuelto", Description = "Poste de luz intermitente.", CitizenName = "Jorge Lara", Crew = "Cuadrilla A-7", CreatedAt = today.AddDays(-6), ResolvedAt = today.AddDays(-1) },
            new CivicReport { Folio = "CF-2026-00434", Category = "Vialidad", Location = "Calle Orizaba 44, Roma Norte", Priority = "Media", Status = "Pendiente", Description = "Banqueta levantada por raíces.", CitizenName = "Sofía Vega", CreatedAt = today.AddDays(-2) },
            new CivicReport { Folio = "CF-2026-00433", Category = "Limpieza", Location = "Mercado Medellín, Roma Sur", Priority = "Baja", Status = "Resuelto", Description = "Contenedor de basura desbordado.", CitizenName = "Pedro Gil", Crew = "Cuadrilla C-2", CreatedAt = today.AddDays(-7), ResolvedAt = today.AddDays(-3) },
            new CivicReport { Folio = "CF-2026-00432", Category = "Agua", Location = "Calz. de Tlalpan 711, Álamos", Priority = "Alta", Status = "Pendiente", Description = "Registro de agua sin tapa.", CitizenName = "Laura Neri", CreatedAt = today.AddDays(-1) },
            new CivicReport { Folio = "CF-2026-00431", Category = "Alumbrado", Location = "Calle Durango 210, Roma Norte", Priority = "Media", Status = "En Proceso", Description = "Dos luminarias fuera de servicio.", CitizenName = "Raúl Ponce", Crew = "Cuadrilla A-7", CreatedAt = today.AddDays(-2).AddHours(-3) },
            new CivicReport { Folio = "CF-2026-00430", Category = "Vialidad", Location = "Av. Patriotismo 610, San Pedro de los Pinos", Priority = "Baja", Status = "Cancelado", Description = "Reporte duplicado de otro folio.", CitizenName = "Nora Cruz", CreatedAt = today.AddDays(-8) },
            new CivicReport { Folio = "CF-2026-00429", Category = "Parques", Location = "Jardín Pushkin, Roma Norte", Priority = "Media", Status = "Resuelto", Description = "Juego infantil necesita reparación.", CitizenName = "Diego Solís", Crew = "Cuadrilla P-1", CreatedAt = today.AddDays(-9), ResolvedAt = today.AddDays(-4) });

        await database.SaveChangesAsync();
    }
}