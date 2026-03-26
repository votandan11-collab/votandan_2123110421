using Microsoft.AspNetCore.Mvc;
using ASP.NET.Data;
using ASP.NET.Models;

namespace ASP.NET.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RewardController : ControllerBase
    {
        private readonly AppDbContext _context;

        public RewardController(AppDbContext context)
        {
            _context = context;
        }

        // 🔍 GET ALL
        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(_context.Rewards.ToList());
        }

        // 🔍 GET BY ID
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var reward = _context.Rewards.Find(id);
            if (reward == null) return NotFound();
            return Ok(reward);
        }

        // ➕ CREATE
        [HttpPost]
        public IActionResult Create(Reward reward)
        {
            _context.Rewards.Add(reward);
            _context.SaveChanges();
            return Ok(reward);
        }

        // ✏️ UPDATE
        [HttpPut("{id}")]
        public IActionResult Update(int id, Reward updatedReward)
        {
            var reward = _context.Rewards.Find(id);
            if (reward == null) return NotFound();

            reward.RewardName = updatedReward.RewardName;
            reward.PointsRequired = updatedReward.PointsRequired;

            _context.SaveChanges();

            return Ok(reward);
        }

        // ❌ DELETE
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var reward = _context.Rewards.Find(id);
            if (reward == null) return NotFound();

            _context.Rewards.Remove(reward);
            _context.SaveChanges();

            return Ok("Xóa thành công");
        }

        // 🎁 REDEEM (đổi quà)
        [HttpPost("redeem")]
        public IActionResult Redeem(int customerId, int rewardId)
        {
            var customer = _context.Customers.Find(customerId);
            var reward = _context.Rewards.Find(rewardId);

            if (customer == null || reward == null)
                return BadRequest("Dữ liệu không hợp lệ");

            if (customer.TotalPoints < reward.PointsRequired)
                return BadRequest("Không đủ điểm");

            customer.TotalPoints -= reward.PointsRequired;

            _context.PointsHistories.Add(new PointsHistory
            {
                CustomerId = customer.Id,
                Points = reward.PointsRequired,
                Type = "Subtract",
                Description = "Đổi quà"
            });

            _context.SaveChanges();

            return Ok("Đổi quà thành công");
        }
    }
}