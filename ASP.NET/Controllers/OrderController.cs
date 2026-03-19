using ASP.NET.Data;
using ASP.NET.Models;
using Microsoft.AspNetCore.Mvc;


namespace YourProjectName.Controllers
{
    public class OrderController : Controller
    {
        private readonly AppDbContext _context;

        public OrderController(AppDbContext context)
        {
            _context = context;
        }

        public IActionResult Create(Order order)
        {
            var customer = _context.Customers.Find(order.CustomerId);

            if (customer == null)
                return Content("Không tìm thấy khách hàng");

            // FIX lỗi decimal * double
            double multiplier = 1;

            if (customer.Level == "VIP") multiplier = 1.2;
            if (customer.Level == "Gold") multiplier = 1.5;

            int points = (int)((double)order.TotalAmount / 1000 * multiplier);

            // Cộng điểm
            customer.TotalPoints += points;

            // Update Level
            if (customer.TotalPoints >= 5000)
                customer.Level = "Gold";
            else if (customer.TotalPoints >= 1000)
                customer.Level = "VIP";
            else
                customer.Level = "Normal";

            // Lưu lịch sử
            _context.PointsHistories.Add(new PointsHistory
            {
                CustomerId = customer.Id,
                Points = points,
                Type = "Add",
                Description = "Mua hàng"
            });

            _context.Orders.Add(order);
            _context.SaveChanges();

            return RedirectToAction("Index");
        }
    }
}