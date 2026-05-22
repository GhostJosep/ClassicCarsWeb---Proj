using Microsoft.AspNetCore.Mvc;
using System.IO;
using Microsoft.AspNetCore.Hosting;

namespace ClassicCarsWeb.Controllers // Ensure this matches your project namespace
{
    [Route("api/[controller]/[action]")]
    public class DataController : Controller
    {
        private readonly IWebHostEnvironment _env;

        public DataController(IWebHostEnvironment env)
        {
            _env = env;
        }

        [HttpGet]
        public IActionResult GetCars()
        {
            var path = Path.Combine(_env.ContentRootPath, "cars.json");
            
            if (!System.IO.File.Exists(path))
            {
                return NotFound(new { message = "cars.json file not found at " + path });
            }

            var json = System.IO.File.ReadAllText(path);
            
            // Returning as JSON ensures the browser interprets it correctly
            return Content(json, "application/json");
        }
    }
}