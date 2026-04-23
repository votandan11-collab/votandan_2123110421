using Microsoft.AspNetCore.Mvc;
using ASP.NET.Data;
using ASP.NET.Models;
using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace ASP.NET.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RewardController : ControllerBase
    {
        private readonly AppDbContext _context;
        public RewardController(AppDbContext context) => _context = context;

        // 🎁 1. LẤY DANH SÁCH QUÀ TẶNG (Chỉ lấy quà còn trong kho)
        [HttpGet]
        public IActionResult GetAll()
        {
            var rewards = _context.Rewards
                .Where(r => r.StockQuantity > 0)
                .ToList();
            return Ok(rewards);
        }

        // 🔍 2. LẤY CHI TIẾT QUÀ TẶNG THEO ID
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var reward = _context.Rewards.Find(id);
            if (reward == null) return NotFound("Không tìm thấy quà tặng");
            return Ok(reward);
        }

        // 🎁 3. ĐỔI QUÀ (Nghiệp vụ 4.2)
        [HttpPost("redeem")]
        public IActionResult Redeem(int customerId, int rewardId)
        {
            // Sử dụng Transaction để đảm bảo an toàn dữ liệu (Atomic operation)
            using (var transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    var customer = _context.Customers.Find(customerId);
                    var reward = _context.Rewards.Find(rewardId);

                    if (customer == null || reward == null)
                        return NotFound("Không tìm thấy khách hàng hoặc quà");

                    // Kiểm tra điều kiện đổi quà
                    if (customer.TotalPoints < reward.PointsRequired)
                        return BadRequest("Bạn không đủ điểm để đổi món quà này!");

                    if (reward.StockQuantity <= 0)
                        return BadRequest("Quà tặng này đã hết hàng!");

                    // THỰC HIỆN ĐỔI
                    customer.TotalPoints -= reward.PointsRequired; // Trừ điểm khách hàng
                    reward.StockQuantity -= 1; // Giảm số lượng trong kho

                    // Ghi vào lịch sử điểm (Sử dụng Model PointsHistory đã thống nhất)
                    var history = new PointsHistory
                    {
                        CustomerId = customer.Id,
                        Points = reward.PointsRequired,
                        Type = "Subtract", // Loại trừ điểm
                        Description = $"Đổi quà: {reward.RewardName}",
                        CreatedAt = DateTime.Now
                    };

                    _context.PointsHistories.Add(history);

                    _context.SaveChanges();
                    transaction.Commit(); // Lưu mọi thay đổi thành công

                    return Ok(new
                    {
                        Message = "Đổi quà thành công!",
                        Gift = reward.RewardName,
                        CurrentPoints = customer.TotalPoints,
                        RemainingStock = reward.StockQuantity
                    });
                }
                catch (Exception ex)
                {
                    transaction.Rollback(); // Nếu có bất kỳ lỗi gì, trả lại dữ liệu ban đầu
                    return BadRequest($"Có lỗi xảy ra: {ex.Message}");
                }
            }
        }

        // ➕ 4. THÊM QUÀ MỚI (Admin dùng)
        [HttpPost]
        public IActionResult Create(Reward reward)
        {
            if (reward == null) return BadRequest("Dữ liệu quà tặng không hợp lệ");

            _context.Rewards.Add(reward);
            _context.SaveChanges();
            return Ok(new { Message = "Thêm quà tặng thành công", Data = reward });
        }

        // ✏️ 5. CẬP NHẬT THÔNG TIN QUÀ TẶNG
        [HttpPut("{id}")]
        public IActionResult Update(int id, Reward updatedReward)
        {
            var reward = _context.Rewards.Find(id);
            if (reward == null) return NotFound("Không tìm thấy quà tặng để cập nhật");

            reward.RewardName = updatedReward.RewardName;
            reward.PointsRequired = updatedReward.PointsRequired;
            reward.StockQuantity = updatedReward.StockQuantity;

            _context.SaveChanges();
            return Ok(new { Message = "Cập nhật quà tặng thành công", Data = reward });
        }

        // ❌ 6. XÓA QUÀ TẶNG
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var reward = _context.Rewards.Find(id);
            if (reward == null) return NotFound("Không tìm thấy quà tặng");

            _context.Rewards.Remove(reward);
            _context.SaveChanges();
            return Ok("Đã xóa quà tặng khỏi hệ thống");
        }
    }
}