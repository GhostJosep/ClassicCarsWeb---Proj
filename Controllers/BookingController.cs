using Microsoft.AspNetCore.Mvc;
using ClassicCarsWeb.Models;

namespace ClassicCarsWeb.Controllers
{
    public class BookingController : Controller
    {
        private readonly AppDbContext _context;

        // THIS IS THE MISSING PIECE: The Constructor
        public BookingController(AppDbContext context)
        {
            _context = context;
        }

        public IActionResult Dashboard()
        {
            var bookings = _context.TestDriveRequests.ToList();
            return View(bookings);
        }
    }
}