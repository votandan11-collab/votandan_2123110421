using Microsoft.AspNetCore.Mvc;
using ASP.NET.Data;
using ASP.NET.Models;

namespace ASP.NET.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CustomersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CustomersController(AppDbContext context)
        {
            _context = context;
        }

        // 🔍 GET ALL
        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(_context.Customers.ToList());
        }

        // 🔍 GET BY ID
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var customer = _context.Customers.Find(id);
            if (customer == null) return NotFound();
            return Ok(customer);
        }

        // ➕ CREATE
        [HttpPost]
        public IActionResult Create(Customer customer)
        {
            customer.TotalPoints = 0;
            customer.Level = "Normal";

            _context.Customers.Add(customer);
            _context.SaveChanges();

            return Ok(customer);
        }

        // ✏️ UPDATE
        [HttpPut("{id}")]
        public IActionResult Update(int id, Customer c)
        {
            var customer = _context.Customers.Find(id);
            if (customer == null) return NotFound();

            customer.Name = c.Name;
            customer.Email = c.Email;

            _context.SaveChanges();

            return Ok(customer);
        }

        // ❌ DELETE
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var customer = _context.Customers.Find(id);
            if (customer == null) return NotFound();

            _context.Customers.Remove(customer);
            _context.SaveChanges();

            return Ok("Xóa thành công");
        }
    }
}