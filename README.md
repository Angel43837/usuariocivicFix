# CivicFix

Panel web de gestión de reportes ciudadanos, construido con ASP.NET Core MVC, C#, Razor, JavaScript y Entity Framework Core. La pantalla de administración toma como referencia la captura compartida; no había un archivo `.pptx` disponible en el workspace.

## Ejecutar

Requiere el SDK .NET 10.

```powershell
dotnet restore
dotnet run
```

En desarrollo se usa EF Core InMemory con 12 reportes de muestra. Los cambios sobreviven entre solicitudes, pero se reinician al apagar la aplicación. Abre la URL local que muestra `dotnet run` y usa **Nuevo reporte** para probar el formulario ciudadano.

## Usar SQL Server

El proveedor `Microsoft.EntityFrameworkCore.SqlServer` y la cadena de conexión están configurados en `appsettings.json`. Para usar SQL Server, cambia `Database:Provider` a `SqlServer` en `appsettings.Development.json` y configura `ConnectionStrings:CivicFix` con tu instancia. La cadena incluida apunta a SQL Server LocalDB (`(localdb)\MSSQLLocalDB`), que debe estar instalado.

El esquema inicial se crea con `EnsureCreated`. Antes de desplegar, configura autenticación y roles, mueve secretos fuera de los archivos de configuración y reemplaza `EnsureCreated` por migraciones de EF Core.

## Funciones incluidas

- Panel con métricas, filtros por estado y categoría, búsqueda y exportación CSV.
- Asignación de reportes pendientes y resolución de reportes en proceso.
- Formulario ciudadano con categoría, prioridad, selección de punto en mapa OpenStreetMap, geolocalización y foto JPG, PNG o WEBP de hasta 5 MB.
- Diseño responsive basado en el prototipo visual adjunto.

El mapa usa Leaflet y mosaicos de OpenStreetMap; requiere conexión a internet. Si el mapa no está disponible, el formulario conserva la captura manual de dirección.