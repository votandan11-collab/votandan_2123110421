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
    public class PaymentController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PaymentController(AppDbContext context)
        {
            _context = context;
        }

        // 🔍 1. LẤY DANH SÁCH THANH TOÁN
        [HttpGet]
        public IActionResult GetAll()
        {
            var payments = _context.Payments
                .Include(p => p.Order)
                .OrderByDescending(p => p.PaymentDate)
                .ToList();
            return Ok(payments);
        }

        // 🔍 2. LẤY CHI TIẾT THANH TOÁN THEO ID
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var payment = _context.Payments.Find(id);
            if (payment == null) return NotFound("Không tìm thấy giao dịch thanh toán");
            return Ok(payment);
        }

        // 💰 3. TẠO THANH TOÁN MỚI (Xử lý nghiệp vụ tích điểm)
        [HttpPost("process")]
        public IActionResult ProcessPayment(int orderId, string method)
        {
            using (var transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    var order = _context.Orders.Include(o => o.Customer).FirstOrDefault(o => o.Id == orderId);
                    if (order == null) return NotFound("Đơn hàng không tồn tại");

                    // Tạo thanh toán
                    var payment = new Payment
                    {
                        OrderId = orderId,
                        Amount = (double)order.TotalAmount,
                        PaymentMethod = method,
                        Status = "Completed",
                        PaymentDate = DateTime.Now
                    };
                    _context.Payments.Add(payment);

                    // Logic tích điểm (Sửa lỗi ép kiểu decimal)
                    decimal multiplier = order.Customer.Level switch
                    {
                        "Diamond" => 2.0m,
                        "Gold" => 1.5m,
                        "VIP" => 1.2m,
                        _ => 1.0m
                    };

                    int pointsToAdd = (int)(order.TotalAmount / 1000 * multiplier);
                    order.Customer.TotalPoints += pointsToAdd;

                    // Lưu lịch sử điểm
                    _context.PointsHistories.Add(new PointsHistory
                    {
                        CustomerId = order.CustomerId,
                        Points = pointsToAdd,
                        Type = "Add",
                        Description = $"Tích điểm từ đơn hàng #{orderId}",
                        CreatedAt = DateTime.Now
                    });

                    _context.SaveChanges();
                    transaction.Commit();

                    return Ok(new { Message = "Thanh toán và tích điểm thành công", PaymentId = payment.Id });
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    return BadRequest("Lỗi: " + ex.Message);
                }
            }
        }

        // ✏️ 4. CẬP NHẬT THÔNG TIN THANH TOÁN
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Payment updatedPayment)
        {
            var payment = _context.Payments.Find(id);
            if (payment == null) return NotFound("Không tìm thấy bản ghi thanh toán");

            // Chỉ cho phép sửa phương thức hoặc trạng thái (Hạn chế sửa số tiền)
            payment.PaymentMethod = updatedPayment.PaymentMethod;
            payment.Status = updatedPayment.Status;

            _context.SaveChanges();
            return Ok(new { Message = "Cập nhật thành công", Data = payment });
        }

        // ❌ 5. XÓA BẢN GHI THANH TOÁN
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var payment = _context.Payments.Find(id);
            if (payment == null) return NotFound("Bản ghi không tồn tại");

            _context.Payments.Remove(payment);
            _context.SaveChanges();

            return Ok(new { Message = $"Đã xóa giao dịch thanh toán ID: {id}" });
        }
    }
}