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

        // ➕ THÊM DANH MỤC MỚI (Ví dụ: Trà sữa, Cà phê, Đá xay)
        [HttpPost]
        public IActionResult Create([FromBody] Category category)
        {
            if (string.IsNullOrEmpty(category.Name))
                return BadRequest("Tên danh mục không được để trống");

            _context.Categories.Add(category);
            _context.SaveChanges();
            return Ok(category);
        }

        // ✏️ CẬP NHẬT DANH MỤC
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Category updatedCategory)
        {
            var category = _context.Categories.Find(id);
            if (category == null) return NotFound();

            category.Name = updatedCategory.Name;
            category.Description = updatedCategory.Description;

            _context.SaveChanges();
            return Ok(category);
        }

        // ❌ XÓA DANH MỤC (Có kiểm tra nghiệp vụ)
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var category = _context.Categories.Find(id);
            if (category == null) return NotFound();

            // NGHIỆP VỤ: Nếu đang có sản phẩm thuộc danh mục này thì không cho xóa
            // Điều này giúp tránh lỗi dữ liệu "mồ côi" trong Database
            var hasProducts = _context.Products.Any(p => p.CategoryId == id);
            if (hasProducts)
                return BadRequest("Không thể xóa! Danh mục này hiện đang chứa sản phẩm.");

            _context.Categories.Remove(category);
            _context.SaveChanges();
            return Ok("Đã xóa danh mục thành công");
        }
    }
}