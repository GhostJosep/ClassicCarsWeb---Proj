using Microsoft.EntityFrameworkCore;
using ClassicCarsWeb.Models;

var builder = WebApplication.CreateBuilder(args);

// Register DB Context
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=ClassicCars.db"));

builder.Services.AddControllersWithViews();

var app = builder.Build();

// AUTOMATIC DATA SEEDING
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    
    // FORCE RESET: This clears out the old database so the new one matches your code
    dbContext.Database.EnsureDeleted(); 
    dbContext.Database.EnsureCreated();
    
    // Seed the data from cars.json
    AppDbContext.SeedData(dbContext);
}

app.UseStaticFiles();
app.UseRouting();
app.MapControllerRoute(name: "default", pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();