using CivicFix.Data;
using CivicFix.Models;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllersWithViews();
builder.Services.AddDbContext<CivicFixContext>(options =>
{
    var provider = builder.Configuration["Database:Provider"] ?? "Postgres";
    if (provider.Equals("InMemory", StringComparison.OrdinalIgnoreCase))
    {
        options.UseInMemoryDatabase("CivicFixDemo");
    }
    else if (provider.Equals("Postgres", StringComparison.OrdinalIgnoreCase))
    {
        var connectionString = builder.Configuration.GetConnectionString("CivicFix");
        options.UseNpgsql(connectionString);
    }
    else if (provider.Equals("SqlServer", StringComparison.OrdinalIgnoreCase))
    {
        var connectionString = builder.Configuration.GetConnectionString("CivicFix");
        options.UseSqlServer(connectionString);
    }
    else
    {
        throw new InvalidOperationException($"Proveedor de base de datos no compatible: {provider}");
    }
});

builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    options.Password.RequireNonAlphanumeric = false;
})
    .AddEntityFrameworkStores<CivicFixContext>()
    .AddDefaultTokenProviders();

builder.Services.ConfigureApplicationCookie(options =>
{
    options.LoginPath = "/Account/Login";
    options.AccessDeniedPath = "/Account/Login";
});

var app = builder.Build();

var forwardedHeadersOptions = new ForwardedHeadersOptions
{
    ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
};
forwardedHeadersOptions.KnownIPNetworks.Clear();
forwardedHeadersOptions.KnownProxies.Clear();
app.UseForwardedHeaders(forwardedHeadersOptions);

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
    app.UseHttpsRedirection();
}

var siteMode = app.Configuration["Site:Mode"] ?? "Full";
var adminOnlyControllers = new HashSet<string>(StringComparer.OrdinalIgnoreCase) { "Home", "Users" };
var citizenOnlyControllers = new HashSet<string>(StringComparer.OrdinalIgnoreCase) { "Account", "Reports" };

app.UseRouting();

app.Use(async (context, next) =>
{
    var controllerName = context.GetEndpoint()?.Metadata.GetMetadata<ControllerActionDescriptor>()?.ControllerName;
    var actionName = context.GetEndpoint()?.Metadata.GetMetadata<ControllerActionDescriptor>()?.ActionName;
    var isBlocked = controllerName is not null && actionName != "Error" &&
        ((siteMode == "Admin" && citizenOnlyControllers.Contains(controllerName)) ||
         (siteMode == "Citizen" && adminOnlyControllers.Contains(controllerName)));

    if (isBlocked)
    {
        context.Response.StatusCode = StatusCodes.Status404NotFound;
        return;
    }

    await next();
});

app.UseAuthentication();
app.UseAuthorization();
app.UseStaticFiles();

if (siteMode == "Citizen")
{
    app.MapGet("/", () => Results.Redirect("/Reports/Create"));
}

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}")
    .WithStaticAssets();

await using (var scope = app.Services.CreateAsyncScope())
{
    var database = scope.ServiceProvider.GetRequiredService<CivicFixContext>();
    await database.Database.MigrateAsync();
    if (app.Environment.IsDevelopment())
    {
        await CivicFixSeeder.SeedAsync(database);
    }
}

app.Run();
