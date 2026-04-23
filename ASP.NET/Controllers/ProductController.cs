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

        // 🔍 LẤY TẤT CẢ (Ưu tiên món đang bán lên trước)
        [HttpGet]
        public IActionResult GetAll()
        {
            var products = _context.Products
                .OrderByDescending(p => p.IsActive)
                .ThenBy(p => p.Category)
                .ToList();
            return Ok(products);
        }

        // ➕ THÊM MỚI SẢN PHẨM
        [HttpPost]
        public IActionResult Create(Product product)
        {
            product.CreatedAt = DateTime.Now;
            _context.Products.Add(product);
            _context.SaveChanges();
            return Ok(product);
        }

        // ✏️ CẬP NHẬT (Có nghiệp vụ lưu vết người sửa)
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Product p, [FromQuery] string adminName)
        {
            var product = _context.Products.Find(id);
            if (product == null) return NotFound("Không tìm thấy sản phẩm");

            // Cập nhật thông tin
            product.Name = p.Name;
            product.Price = p.Price;
            product.Stock = p.Stock;
            product.Category = p.Category;
            product.IsActive = p.IsActive;

            // NGHIỆP VỤ: Lưu vết ai sửa giá hoặc kho
            product.UpdatedAt = DateTime.Now;
            product.UpdatedBy = string.IsNullOrEmpty(adminName) ? "Admin_Kho" : adminName;

            _context.SaveChanges();
            return Ok(new
            {
                Message = "Cập nhật sản phẩm thành công",
                UpdatedBy = product.UpdatedBy,
                Time = product.UpdatedAt
            });
        }

        // ❌ XÓA SẢN PHẨM
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var product = _context.Products.Find(id);
            if (product == null) return NotFound();

            _context.Products.Remove(product);
            _context.SaveChanges();
            return Ok("Xóa thành công");
        }
    }
}