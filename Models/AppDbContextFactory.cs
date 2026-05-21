using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace ClassicCarsWeb.Models
{
    public class AppDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
    {
        public AppDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
            // This is the same connection string you used in Program.cs
            optionsBuilder.UseSqlite("Data Source=ClassicCars.db");

            return new AppDbContext(optionsBuilder.Options);
        }
    }
}