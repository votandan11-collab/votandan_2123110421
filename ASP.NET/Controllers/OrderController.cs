using Microsoft.AspNetCore.Mvc;
using ASP.NET.Data;
using ASP.NET.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

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

        // 🔍 1. LẤY DANH SÁCH ĐƠN HÀNG (Kèm thông tin Khách hàng)
        [HttpGet]
        public IActionResult GetAll()
        {
            var orders = _context.Orders
                .Include(o => o.Customer) // Hiển thị chi tiết khách hàng đã mua
                .OrderByDescending(o => o.CreatedAt)
                .ToList();
            return Ok(orders);
        }

        // 🔍 2. LẤY CHI TIẾT ĐƠN HÀNG THEO ID
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var order = _context.Orders
                .Include(o => o.Customer)
                .FirstOrDefault(o => o.Id == id);

            if (order == null) return NotFound("Không tìm thấy đơn hàng");
            return Ok(order);
        }

        // 📊 3. LẤY ĐƠN HÀNG THEO MÃ KHÁCH HÀNG (History)
        [HttpGet("customer/{customerId}")]
        public IActionResult GetByCustomerId(int customerId)
        {
            var orders = _context.Orders
                .Where(o => o.CustomerId == customerId)
                .OrderByDescending(o => o.CreatedAt)
                .ToList();
            return Ok(orders);
        }

        // ➕ 4. NGHIỆP VỤ CHÍNH: TẠO ĐƠN HÀNG & TÍCH ĐIỂM TỰ ĐỘNG
        [HttpPost]
        public IActionResult Create([FromBody] Order order)
        {
            // Kiểm tra dữ liệu đầu vào cơ bản
            if (order == null) return BadRequest("Dữ liệu không hợp lệ");
            if (order.TotalAmount <= 0) return BadRequest("Số tiền đơn hàng phải lớn hơn 0");

            // Sử dụng Transaction để đảm bảo tính toàn vẹn: 
            // Nếu lưu đơn hàng lỗi thì điểm khách hàng không bị cộng và ngược lại.
            using (var transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    var customer = _context.Customers.Find(order.CustomerId);
                    if (customer == null) return NotFound("Khách hàng không tồn tại trong hệ thống");

                    // --- BƯỚC 1: LOGIC TÍCH ĐIỂM ---
                    // Quy tắc: 1.000đ = 1 điểm cơ bản. 
                    // Nhân hệ số theo Level hiện tại của khách.
                    double multiplier = 1.0;
                    if (customer.Level == "VIP") multiplier = 1.2;
                    else if (customer.Level == "Gold") multiplier = 1.5;
                    else if (customer.Level == "Diamond") multiplier = 2.0;

                    int pointsEarned = (int)((double)order.TotalAmount / 1000 * multiplier);

                    // --- BƯỚC 2: CẬP NHẬT ĐIỂM & PHÂN HẠNG MỚI ---
                    customer.TotalPoints += pointsEarned;

                    // Tự động nâng cấp hạng dựa trên tổng điểm mới
                    if (customer.TotalPoints >= 5000) customer.Level = "Diamond";
                    else if (customer.TotalPoints >= 2000) customer.Level = "Gold";
                    else if (customer.TotalPoints >= 500) customer.Level = "VIP";
                    else customer.Level = "Silver";

                    // --- BƯỚC 3: LƯU LỊCH SỬ BIẾN ĐỘNG ĐIỂM ---
                    var pointLog = new PointsHistory
                    {
                        CustomerId = customer.Id,
                        Points = pointsEarned,
                        Type = "Add",
                        Description = $"Tích điểm từ đơn hàng #{DateTime.Now.Ticks % 10000}. Hệ số x{multiplier}",
                        CreatedAt = DateTime.Now
                    };
                    _context.PointsHistories.Add(pointLog);

                    // --- BƯỚC 4: LƯU THÔNG TIN ĐƠN HÀNG ---
                    order.CreatedAt = DateTime.Now;
                    order.UpdatedAt = DateTime.Now;
                    order.UpdatedBy = "System_Auto";
                    _context.Orders.Add(order);

                    // THỰC THI LƯU TẤT CẢ VÀO DB
                    _context.SaveChanges();
                    transaction.Commit();

                    return Ok(new
                    {
                        Message = "Thành công",
                        OrderId = order.Id,
                        PointsEarned = pointsEarned,
                        CurrentTotalPoints = customer.TotalPoints,
                        CurrentLevel = customer.Level
                    });
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    return StatusCode(500, $"Lỗi xử lý đơn hàng: {ex.Message}");
                }
            }
        }

        // ✏️ 5. CẬP NHẬT ĐƠN HÀNG (Có Audit Log)
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Order updatedOrder, [FromQuery] string adminName)
        {
            var order = _context.Orders.Find(id);
            if (order == null) return NotFound("Đơn hàng không tồn tại");

            // Chỉ cho phép cập nhật số tiền hoặc mã khách hàng (nếu sai sót)
            order.TotalAmount = updatedOrder.TotalAmount;
            order.CustomerId = updatedOrder.CustomerId;

            // Ghi lại dấu vết chỉnh sửa
            order.UpdatedAt = DateTime.Now;
            order.UpdatedBy = string.IsNullOrEmpty(adminName) ? "Admin_Anonymous" : adminName;

            _context.SaveChanges();

            return Ok(new
            {
                Message = "Cập nhật đơn hàng thành công",
                LastModified = order.UpdatedAt,
                ModifiedBy = order.UpdatedBy
            });
        }

        // ❌ 6. XÓA ĐƠN HÀNG
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var order = _context.Orders.Find(id);
            if (order == null) return NotFound("Đơn hàng đã xóa hoặc không tồn tại");

            _context.Orders.Remove(order);
            _context.SaveChanges();

            return Ok(new { Message = $"Đã xóa đơn hàng ID: {id}" });
        }
    }
}