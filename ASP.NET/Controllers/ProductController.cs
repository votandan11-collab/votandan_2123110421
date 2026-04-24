using Microsoft.AspNetCore.Mvc;
using ASP.NET.Data;
using ASP.NET.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;

namespace ASP.NET.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProductController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            // Lấy kèm thông tin Category để hiển thị bên Admin
            var products = _context.Products.Include(p => p.Category).ToList();
            return Ok(products);
        }

        [HttpPost]
        public IActionResult Create([FromBody] Product product)
        {
            try {
                // Kiểm tra xem CategoryId có tồn tại không
                var categoryExists = _context.Categories.Any(c => c.Id == product.CategoryId);
                if (!categoryExists) return BadRequest("Danh mục (Nhà mạng) không tồn tại. Vui lòng chọn lại.");

                product.CreatedAt = DateTime.UtcNow;
                _context.Products.Add(product);
                _context.SaveChanges();
                return Ok(product);
            } catch (Exception ex) {
                return StatusCode(500, ex.InnerException?.Message ?? ex.Message);
            }
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Product p)
        {
            var product = _context.Products.Find(id);
            if (product == null) return NotFound();

            product.Name = p.Name;
            product.Price = p.Price;
            product.Stock = p.Stock;
            product.CategoryId = p.CategoryId;
            product.ImageUrl = p.ImageUrl;
            product.DiscountRate = p.DiscountRate;
            product.IsActive = p.IsActive;
            product.UpdatedAt = DateTime.UtcNow;

            try {
                _context.SaveChanges();
                return Ok(product);
            } catch (Exception ex) {
                return StatusCode(500, ex.InnerException?.Message ?? ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var product = _context.Products.Find(id);
            if (product == null) return NotFound();
            _context.Products.Remove(product);
            _context.SaveChanges();
            return Ok();
        }
    }
}