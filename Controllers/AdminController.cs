using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http; 
using ClassicCarsWeb.Models;
using System.Linq;

namespace ClassicCarsWeb.Controllers
{
    public class AdminController : Controller
    {
        private readonly AppDbContext _context;

        public AdminController(AppDbContext context)
        {
            _context = context;
        }

        // SECURED: Only logged-in admins can see this
        public IActionResult Index()
        {
            if (HttpContext.Session.GetString("IsAdmin") != "True")
            {
                return RedirectToAction("Login", "Admin");
            }
            return View(_context.TestDriveRequests.ToList());
        }

        // LOGIN PAGE
        public IActionResult Login() => View();

        [HttpPost]
public IActionResult Login(string username, string password)
{
    // Simple check: Admin and a password
    if (username == "Manager" && password == "admin") 
    {
        HttpContext.Session.SetString("IsAdmin", "True");
        return RedirectToAction("Index", "Admin");
    }
    ViewBag.Error = "Invalid credentials!";
    return View();
}

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult DeleteBooking(int id)
        {
            if (HttpContext.Session.GetString("IsAdmin") != "True")
            {
                return RedirectToAction("Login", "Admin");
            }

            var booking = _context.TestDriveRequests.Find(id);
            if (booking != null)
            {
                _context.TestDriveRequests.Remove(booking);
                _context.SaveChanges();
            }
            return RedirectToAction("Index");
        }
    }
}