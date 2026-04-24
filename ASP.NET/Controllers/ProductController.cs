using Microsoft.AspNetCore.Mvc;
using ASP.NET.Data;
using ASP.NET.Models;
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

        // 🔍 LẤY TẤT CẢ
        [HttpGet]
        public IActionResult GetAll()
        {
            var products = _context.Products
                .OrderByDescending(p => p.IsActive)
                .ToList();
            return Ok(products);
        }

        // ➕ THÊM MỚI SẢN PHẨM
        [HttpPost]
        public IActionResult Create([FromBody] Product product)
        {
            try {
                product.CreatedAt = DateTime.UtcNow;
                _context.Products.Add(product);
                _context.SaveChanges();
                return Ok(product);
            } catch (Exception ex) {
                // Trả về lỗi chi tiết để debug
                return StatusCode(500, ex.InnerException?.Message ?? ex.Message);
            }
        }

        // ✏️ CẬP NHẬT
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Product p, [FromQuery] string adminName)
        {
            var product = _context.Products.Find(id);
            if (product == null) return NotFound("Không tìm thấy sản phẩm");

            product.Name = p.Name;
            product.Price = p.Price;
            product.Stock = p.Stock;
            product.CategoryId = p.CategoryId;
            product.ImageUrl = p.ImageUrl;
            product.DiscountRate = p.DiscountRate;
            product.IsActive = p.IsActive;

            product.UpdatedAt = DateTime.UtcNow;
            product.UpdatedBy = string.IsNullOrEmpty(adminName) ? "Admin" : adminName;

            try {
                _context.SaveChanges();
                return Ok(new { Message = "Cập nhật thành công", Product = product });
            } catch (Exception ex) {
                return StatusCode(500, ex.InnerException?.Message ?? ex.Message);
            }
        }

        // ❌ XÓA SẢN PHẨM
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var product = _context.Products.Find(id);
            if (product == null) return NotFound();

            try {
                _context.Products.Remove(product);
                _context.SaveChanges();
                return Ok("Xóa thành công");
            } catch (Exception ex) {
                return StatusCode(500, $"Không thể xóa: {ex.Message}");
            }
        }
    }
}