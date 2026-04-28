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
    public class RewardsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public RewardsController(AppDbContext context)
        {
            _context = context;
        }

        // 🎁 1. Lấy danh sách quà tặng
        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(_context.Rewards.ToList());
        }

        // 🛒 2. Thực hiện đổi quà
        [HttpPost("redeem")]
        public IActionResult Redeem([FromBody] RedeemRequest request)
        {
            using (var transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    var customer = _context.Customers.Find(request.CustomerId);
                    var reward = _context.Rewards.Find(request.RewardId);

                    if (customer == null || reward == null)
                        return NotFound("Khách hàng hoặc quà tặng không tồn tại");

                    if (customer.TotalPoints < reward.PointsRequired)
                        return BadRequest("Bạn không đủ điểm để đổi món quà này");

                    if (reward.StockQuantity <= 0)
                        return BadRequest("Món quà này đã hết hàng");

                    // TRỪ ĐIỂM KHÁCH HÀNG
                    customer.TotalPoints -= reward.PointsRequired;

                    // TRỪ KHO QUÀ
                    reward.StockQuantity -= 1;

                    // LƯU LỊCH SỬ ĐIỂM (Type: Subtract)
                    var history = new PointsHistory
                    {
                        CustomerId = customer.Id,
                        Points = reward.PointsRequired,
                        Type = "Subtract",
                        Description = $"Đổi quà: {reward.RewardName}",
                        CreatedAt = DateTime.UtcNow
                    };
                    _context.PointsHistories.Add(history);

                    _context.SaveChanges();
                    transaction.Commit();

                    return Ok(new { 
                        Message = "Đổi quà thành công!", 
                        NewPoints = customer.TotalPoints 
                    });
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    return StatusCode(500, $"Lỗi hệ thống: {ex.Message}");
                }
            }
        }

        // ➕ 3. Thêm quà tặng mới
        [HttpPost]
        public IActionResult Create([FromBody] Reward reward)
        {
            if (reward == null) return BadRequest("Dữ liệu không hợp lệ");
            _context.Rewards.Add(reward);
            _context.SaveChanges();
            return Ok(reward);
        }

        // ✏️ 4. Cập nhật quà tặng
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Reward updatedReward)
        {
            var reward = _context.Rewards.Find(id);
            if (reward == null) return NotFound("Không tìm thấy quà tặng");

            reward.RewardName = updatedReward.RewardName;
            reward.PointsRequired = updatedReward.PointsRequired;
            reward.StockQuantity = updatedReward.StockQuantity;

            _context.SaveChanges();
            return Ok(reward);
        }

        // ❌ 5. Xóa quà tặng
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var reward = _context.Rewards.Find(id);
            if (reward == null) return NotFound("Không tìm thấy quà tặng");

            _context.Rewards.Remove(reward);
            _context.SaveChanges();
            return Ok(new { Message = "Đã xóa quà tặng thành công" });
        }
    }

    public class RedeemRequest
    {
        public int CustomerId { get; set; }
        public int RewardId { get; set; }
    }
}
