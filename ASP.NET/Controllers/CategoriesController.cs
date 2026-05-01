using Microsoft.AspNetCore.Mvc;
using ASP.NET.Data;
using ASP.NET.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace ASP.NET.Controllers
{
    [ApiController] // Đánh dấu đây là một Web API
    [Route("api/[controller]")] // Đường dẫn sẽ là: /api/Categories
    public class CategoriesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CategoriesController(AppDbContext context)
        {
            _context = context;
        }

        // 🔍 LẤY TẤT CẢ DANH MỤC
        [HttpGet]
        public IActionResult GetAll()
        {
            var categories = _context.Categories.ToList();
            return Ok(categories);
        }

        // 🔍 LẤY CHI TIẾT 1 DANH MỤC THEO ID
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var category = _context.Categories.Find(id);
            if (category == null) return NotFound("Không tìm thấy danh mục");
            return Ok(category);
        }

        // ➕ THÊM DANH MỤC MỚI
        [HttpPost]
        public IActionResult Create([FromBody] Category category, [FromQuery] string? adminName = null)
        {
            if (string.IsNullOrEmpty(category.Name))
                return BadRequest("Tên danh mục không được để trống");

            _context.Categories.Add(category);
            
            // GHI LOG
            _context.ActivityLogs.Add(new ActivityLog {
                AdminName = adminName ?? "Admin",
                Action = "CREATE",
                EntityName = "Category",
                Details = $"Tạo danh mục mới: {category.Name}",
                CreatedAt = System.DateTime.UtcNow
            });

            _context.SaveChanges();
            return Ok(category);
        }

        // ✏️ CẬP NHẬT DANH MỤC
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Category updatedCategory, [FromQuery] string? adminName = null)
        {
            var category = _context.Categories.Find(id);
            if (category == null) return NotFound();

            string oldName = category.Name;
            category.Name = updatedCategory.Name;
            category.Description = updatedCategory.Description;

            // GHI LOG
            _context.ActivityLogs.Add(new ActivityLog {
                AdminName = adminName ?? "Admin",
                Action = "UPDATE",
                EntityName = "Category",
                Details = $"Sửa danh mục #{id}. Cũ: {oldName} -> Mới: {category.Name}",
                CreatedAt = System.DateTime.UtcNow
            });

            _context.SaveChanges();
            return Ok(category);
        }

        // ❌ XÓA DANH MỤC
        [HttpDelete("{id}")]
        public IActionResult Delete(int id, [FromQuery] string? adminName = null)
        {
            var category = _context.Categories.Find(id);
            if (category == null) return NotFound();

            var hasProducts = _context.Products.Any(p => p.CategoryId == id);
            if (hasProducts)
                return BadRequest("Không thể xóa! Danh mục này hiện đang chứa sản phẩm.");

            // GHI LOG
            _context.ActivityLogs.Add(new ActivityLog {
                AdminName = adminName ?? "Admin",
                Action = "DELETE",
                EntityName = "Category",
                Details = $"Xóa danh mục: {category.Name} (ID: {id})",
                CreatedAt = System.DateTime.UtcNow
            });

            _context.Categories.Remove(category);
            _context.SaveChanges();
            return Ok("Đã xóa danh mục thành công");
        }
    }
}