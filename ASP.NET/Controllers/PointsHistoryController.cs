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
    public class PointsHistoryController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PointsHistoryController(AppDbContext context)
        {
            _context = context;
        }

        // 🔍 1. LẤY TOÀN BỘ LỊCH SỬ (Dành cho Admin)
        [HttpGet]
        public IActionResult GetAll()
        {
            var history = _context.PointsHistories
                .Include(h => h.Customer) // Hiển thị kèm thông tin khách hàng
                .OrderByDescending(h => h.CreatedAt)
                .ToList();
            return Ok(history);
        }

        // 🔍 2. LẤY LỊCH SỬ CỦA MỘT KHÁCH HÀNG CỤ THỂ
        [HttpGet("customer/{customerId}")]
        public IActionResult GetByCustomer(int customerId)
        {
            var history = _context.PointsHistories
                .Where(h => h.CustomerId == customerId)
                .OrderByDescending(h => h.CreatedAt)
                .ToList();

            if (!history.Any()) return NotFound("Không tìm thấy lịch sử cho khách hàng này");
            return Ok(history);
        }

        // ➕ 3. THÊM MỚI LỊCH SỬ (Điều chỉnh điểm thủ công)
        [HttpPost]
        public IActionResult Create([FromBody] PointsHistory history)
        {
            if (history == null) return BadRequest("Dữ liệu không hợp lệ");

            // Kiểm tra khách hàng có tồn tại không
            var customer = _context.Customers.Find(history.CustomerId);
            if (customer == null) return NotFound("Khách hàng không tồn tại");

            // Nếu tạo thủ công, mặc định thời gian là hiện tại
            history.CreatedAt = DateTime.UtcNow;

            _context.PointsHistories.Add(history);
            _context.SaveChanges();

            return Ok(new { Message = "Thêm lịch sử điểm thành công", Data = history });
        }

        // ✏️ 4. SỬA LỊCH SỬ (Dùng để đính chính mô tả hoặc sai sót)
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] PointsHistory updatedHistory)
        {
            var history = _context.PointsHistories.Find(id);
            if (history == null) return NotFound("Không tìm thấy bản ghi lịch sử này");

            // Chỉ cho phép sửa số điểm và mô tả (Hạn chế sửa mã khách hàng)
            history.Points = updatedHistory.Points;
            history.Description = updatedHistory.Description;
            history.Type = updatedHistory.Type;

            // Lưu vết ngày chỉnh sửa (nếu bạn có cột UpdatedAt)
            // history.UpdatedAt = DateTime.Now; 

            _context.SaveChanges();
            return Ok(new { Message = "Cập nhật lịch sử thành công", Data = history });
        }

        // ❌ 5. XÓA LỊCH SỬ
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var history = _context.PointsHistories.Find(id);
            if (history == null) return NotFound("Không tìm thấy bản ghi để xóa");

            _context.PointsHistories.Remove(history);
            _context.SaveChanges();

            return Ok(new { Message = $"Đã xóa bản ghi lịch sử ID: {id}" });
        }
    }
}