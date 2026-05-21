using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace ClassicCarsWeb.Models
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Car> Cars { get; set; }
        public DbSet<TestDriveRequest> TestDriveRequests { get; set; }

        public static void SeedData(AppDbContext context)
        {
            if (context.Cars.Any()) return;

            string jsonPath = Path.Combine(Directory.GetCurrentDirectory(), "cars.json");
            if (!File.Exists(jsonPath)) return;

            string jsonData = File.ReadAllText(jsonPath);
            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            var cars = JsonSerializer.Deserialize<List<Car>>(jsonData, options);

            if (cars != null)
            {
                context.Cars.AddRange(cars);
                context.SaveChanges();
            }
        }
    }
}