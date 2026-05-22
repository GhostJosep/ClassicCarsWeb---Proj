using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using ClassicCarsWeb.Models;
using System.Collections.Generic;
using System.Linq;

namespace ClassicCarsWeb.Controllers
{
    public class HomeController : Controller
    {
        private readonly AppDbContext _context;

        // Constructor to inject the Database Context
        public HomeController(AppDbContext context)
        {
            _context = context;
        }

        public IActionResult Index(string searchQuery, int? yearFrom, int? yearTo, string selectedMake, string sortBy, int page = 1)
        {
            // Pull data from the Database Context instead of JSON
            var filteredCars = _context.Cars.AsQueryable();

            // 1. Filtering
            if (!string.IsNullOrEmpty(searchQuery))
            {
                searchQuery = searchQuery.Trim();
                filteredCars = filteredCars.Where(c => c.Title.Contains(searchQuery));
            }

            if (yearFrom.HasValue)
            {
                filteredCars = filteredCars.Where(c => c.Year >= yearFrom.Value);
            }

            if (yearTo.HasValue)
            {
                filteredCars = filteredCars.Where(c => c.Year <= yearTo.Value);
            }

            if (!string.IsNullOrEmpty(selectedMake))
            {
                filteredCars = filteredCars.Where(c => c.Make == selectedMake);
            }

            // 2. Sorting
            filteredCars = sortBy switch
            {
                "year_asc" => filteredCars.OrderBy(c => c.Year),
                "year_desc" => filteredCars.OrderByDescending(c => c.Year),
                "name_asc" => filteredCars.OrderBy(c => c.Title),
                "name_desc" => filteredCars.OrderByDescending(c => c.Title),
                _ => filteredCars.OrderBy(c => c.Year)
            };

            // 3. Analytics
            var allCars = _context.Cars.ToList();
            if (allCars.Any())
            {
                ViewData["AvgYear"] = (int)System.Math.Round(allCars.Average(c => c.Year));
                ViewData["TopBrand"] = allCars.GroupBy(c => c.Make).OrderByDescending(g => g.Count()).First().Key;
            }

            ViewBag.MakesList = new SelectList(allCars.Select(c => c.Make).Distinct().OrderBy(m => m), selectedMake);

            // 4. Pagination
            int pageSize = 6;
            int totalCarsCount = filteredCars.Count();
            int totalPages = (int)System.Math.Ceiling((double)totalCarsCount / pageSize);

            var pagedList = filteredCars.Skip((page - 1) * pageSize).Take(pageSize).ToList();

            ViewData["TotalCount"] = totalCarsCount;
            ViewData["CurrentPage"] = page;
            ViewData["TotalPages"] = totalPages;

            return View(pagedList);
        }

        // Added Details action to fix your clicking issue
        public IActionResult Details(int id)
        {
            var car = _context.Cars.FirstOrDefault(c => c.ID == id);
            if (car == null) return NotFound();
            return View(car);
        }
    }
}