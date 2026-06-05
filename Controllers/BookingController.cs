using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using ClassicCarsWeb.Models;
using System.Linq;

namespace ClassicCarsWeb.Controllers
{
    public class BookingController : Controller
    {
        private readonly AppDbContext _context;

        public BookingController(AppDbContext context)
        {
            _context = context;
        }

       public IActionResult Dashboard()
{

    if (HttpContext.Session.GetString("IsAdmin") != "True")
    {
        return RedirectToAction("Login", "Admin");
    }
    
    return View(_context.TestDriveRequests.ToList());
}
   [HttpPost]
[ValidateAntiForgeryToken]
public IActionResult ConfirmBooking(TestDriveRequest request)
{
    if (ModelState.IsValid)
    {
        _context.TestDriveRequests.Add(request);
        _context.SaveChanges();

        TempData["BookingConfirmed"] = true; 
        
        return RedirectToAction("Index", "Home");
    }
    return RedirectToAction("Index", "Home");
}

        [HttpPost]
        public IActionResult DeleteBooking(int id)
        {
            var booking = _context.TestDriveRequests.Find(id);
            if (booking != null)
            {
                _context.TestDriveRequests.Remove(booking);
                _context.SaveChanges();
            }
            return RedirectToAction("Dashboard");
        }
    }
}