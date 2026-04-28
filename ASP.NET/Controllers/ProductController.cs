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
            // Lấy dữ liệu sản phẩm (bỏ Include để tránh lỗi JSON vòng lặp)
            var products = _context.Products.ToList();
            return Ok(products);
        }

        [HttpPost]
        public IActionResult Create([FromBody] Product product, [FromQuery] string? adminName = null)
        {
            try {
                var categoryExists = _context.Categories.Any(c => c.Id == product.CategoryId);
                if (!categoryExists) return BadRequest("Danh mục không tồn tại.");

                product.CreatedAt = DateTime.UtcNow;
                _context.Products.Add(product);
                
                // GHI LOG
                _context.ActivityLogs.Add(new ActivityLog {
                    AdminName = adminName ?? "Admin",
                    Action = "CREATE",
                    EntityName = "Product",
                    Details = $"Tạo sản phẩm mới: {product.Name}, Giá: {product.Price}",
                    CreatedAt = DateTime.UtcNow
                });

                _context.SaveChanges();
                return Ok(product);
            } catch (Exception ex) {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Product p, [FromQuery] string? adminName = null)
        {
            var product = _context.Products.Find(id);
            if (product == null) return NotFound();

            string oldDetails = $"Tên: {product.Name}, Giá: {product.Price}";

            product.Name = p.Name;
            product.Price = p.Price;
            product.Stock = p.Stock;
            product.CategoryId = p.CategoryId;
            product.ImageUrl = p.ImageUrl;
            product.DiscountRate = p.DiscountRate;
            product.IsActive = p.IsActive;
            product.UpdatedAt = DateTime.UtcNow;
            product.UpdatedBy = adminName ?? "Admin";

            // GHI LOG
            _context.ActivityLogs.Add(new ActivityLog {
                AdminName = adminName ?? "Admin",
                Action = "UPDATE",
                EntityName = "Product",
                Details = $"Sửa sản phẩm #{id}. Cũ: {oldDetails} -> Mới: {product.Name}, {product.Price}",
                CreatedAt = DateTime.UtcNow
            });

            _context.SaveChanges();
            return Ok(product);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id, [FromQuery] string? adminName = null)
        {
            var product = _context.Products.Find(id);
            if (product == null) return NotFound();
            
            // GHI LOG
            _context.ActivityLogs.Add(new ActivityLog {
                AdminName = adminName ?? "Admin",
                Action = "DELETE",
                EntityName = "Product",
                Details = $"Xóa sản phẩm: {product.Name} (ID: {id})",
                CreatedAt = DateTime.UtcNow
            });

            _context.Products.Remove(product);
            _context.SaveChanges();
            return Ok();
        }
    }
}