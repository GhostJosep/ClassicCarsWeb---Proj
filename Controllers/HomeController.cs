using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using ClassicCarsWeb.Models;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;

namespace ClassicCarsWeb.Controllers
{
    public class HomeController : Controller
    {
        // Core helper method that opens, reads, and deserializes the JSON configuration data file safely
        private List<Car> LoadFleetDataFromJson()
        {
            string jsonFilePath = Path.Combine(Directory.GetCurrentDirectory(), "cars.json");
            
            // Fixed CS0119 conflict by explicitly calling System.IO.File
            if (!System.IO.File.Exists(jsonFilePath))
            {
                // Fail-safe container rule if someone deletes the json file by accident
                return new List<Car>();
            }

            // Fixed CS0119 conflict by explicitly calling System.IO.File
            string rawJsonString = System.IO.File.ReadAllText(jsonFilePath);
            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            return JsonSerializer.Deserialize<List<Car>>(rawJsonString, options) ?? new List<Car>();
        }

        public IActionResult Index(string searchQuery, int? yearFrom, int? yearTo, string selectedMake, string sortBy, int page = 1)
        {
            // Dynamically pull all 100 vehicles out of the text file cache storage layer
            List<Car> allCarsFleet = LoadFleetDataFromJson();
            var filteredCars = allCarsFleet.AsQueryable();

            // 1. Advanced Structural Parameter Filtering
            if (!string.IsNullOrEmpty(searchQuery))
            {
                searchQuery = searchQuery.Trim();
                filteredCars = filteredCars.Where(c => c.Title.Contains(searchQuery, System.StringComparison.OrdinalIgnoreCase));
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

            // 2. Performance Sorting Core Matrix
            filteredCars = sortBy switch
            {
                "year_asc" => filteredCars.OrderBy(c => c.Year),
                "year_desc" => filteredCars.OrderByDescending(c => c.Year),
                "name_asc" => filteredCars.OrderBy(c => c.Title),
                "name_desc" => filteredCars.OrderByDescending(c => c.Title),
                _ => filteredCars.OrderBy(c => c.Year)
            };

            // 3. Automated Global Analytics Metrics Engine
            if (allCarsFleet.Any())
            {
                double avgYear = allCarsFleet.Average(c => c.Year);
                var topBrand = allCarsFleet.GroupBy(c => c.Make).OrderByDescending(g => g.Count()).First().Key;
                
                ViewData["AvgYear"] = (int)System.Math.Round(avgYear);
                ViewData["TopBrand"] = topBrand;
            }
            else
            {
                ViewData["AvgYear"] = 0;
                ViewData["TopBrand"] = "None";
            }

            // Extract clean brand string components for the select element options dropdown
            var uniqueMakes = allCarsFleet.Select(c => c.Make).Distinct().OrderBy(m => m).ToList();
            ViewBag.MakesList = new SelectList(uniqueMakes, selectedMake);

            // 4. Multi-Page Scale Pagination Mathematics Engine
            int pageSize = 6; // Shows 6 beautiful vehicle cards per deck page
            int totalCarsCount = filteredCars.Count();
            int totalPages = (int)System.Math.Ceiling((double)totalCarsCount / pageSize);

            if (page < 1) page = 1;
            if (page > totalPages && totalPages > 0) page = totalPages;

            var pagedList = filteredCars.Skip((page - 1) * pageSize).Take(pageSize).ToList();

            // Maintain full navigation query routing parameters layout state across pagination boundaries
            ViewData["TotalCount"] = totalCarsCount;
            ViewData["CurrentPage"] = page;
            ViewData["TotalPages"] = totalPages;
            ViewData["SearchQuery"] = searchQuery;
            ViewData["YearFrom"] = yearFrom;
            ViewData["YearTo"] = yearTo;
            ViewData["SelectedMake"] = selectedMake;
            ViewData["SortBy"] = sortBy;

            return View(pagedList);
        }
    }
}