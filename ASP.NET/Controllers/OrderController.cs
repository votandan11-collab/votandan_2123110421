using Microsoft.AspNetCore.Mvc;
using ASP.NET.Data;
using ASP.NET.Models;

namespace ASP.NET.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrderController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OrderController(AppDbContext context)
        {
            _context = context;
        }

        // 🔍 GET ALL
        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(_context.Orders.ToList());
        }

        // 🔍 GET BY ID
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var order = _context.Orders.Find(id);
            if (order == null) return NotFound();
            return Ok(order);
        }

        // ➕ CREATE
        [HttpPost]
        public IActionResult Create(Order order)
        {
            var customer = _context.Customers.Find(order.CustomerId);
            if (customer == null)
                return BadRequest("Không tìm thấy khách hàng");

            double multiplier = 1;
            if (customer.Level == "VIP") multiplier = 1.2;
            if (customer.Level == "Gold") multiplier = 1.5;

            int points = (int)((double)order.TotalAmount / 1000 * multiplier);

            customer.TotalPoints += points;

            // update level
            if (customer.TotalPoints >= 5000)
                customer.Level = "Gold";
            else if (customer.TotalPoints >= 1000)
                customer.Level = "VIP";
            else
                customer.Level = "Normal";

            _context.PointsHistories.Add(new PointsHistory
            {
                CustomerId = customer.Id,
                Points = points,
                Type = "Add",
                Description = "Mua hàng"
            });

            _context.Orders.Add(order);
            _context.SaveChanges();

            return Ok(order);
        }

        // ✏️ UPDATE
        [HttpPut("{id}")]
        public IActionResult Update(int id, Order updatedOrder)
        {
            var order = _context.Orders.Find(id);
            if (order == null) return NotFound();

            order.TotalAmount = updatedOrder.TotalAmount;
            order.CustomerId = updatedOrder.CustomerId;

            _context.SaveChanges();

            return Ok(order);
        }

        // ❌ DELETE
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var order = _context.Orders.Find(id);
            if (order == null) return NotFound();

            _context.Orders.Remove(order);
            _context.SaveChanges();

            return Ok("Xóa thành công");
        }
    }
}