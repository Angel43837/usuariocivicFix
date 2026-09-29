using CivicFix.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllersWithViews();
builder.Services.AddDbContext<CivicFixContext>(options =>
{
    var provider = builder.Configuration["Database:Provider"] ?? "SqlServer";
    if (provider.Equals("InMemory", StringComparison.OrdinalIgnoreCase))
    {
        options.UseInMemoryDatabase("CivicFixDemo");
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

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
    app.UseHttpsRedirection();
}

app.UseRouting();
app.UseAuthorization();
app.UseStaticFiles();
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}")
    .WithStaticAssets();

await using (var scope = app.Services.CreateAsyncScope())
{
    var database = scope.ServiceProvider.GetRequiredService<CivicFixContext>();
    await database.Database.EnsureCreatedAsync();
    if (app.Environment.IsDevelopment())
    {
        await CivicFixSeeder.SeedAsync(database);
    }
}

app.Run();
