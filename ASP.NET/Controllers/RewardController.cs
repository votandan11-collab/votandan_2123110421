using ASP.NET.Data;
using ASP.NET.Models;
using Microsoft.AspNetCore.Mvc;


namespace YourProjectName.Controllers
{
    public class RewardController : Controller
    {
        private readonly AppDbContext _context;

        public RewardController(AppDbContext context)
        {
            _context = context;
        }

        public IActionResult Redeem(int customerId, int rewardId)
        {
            var customer = _context.Customers.Find(customerId);
            var reward = _context.Rewards.Find(rewardId);

            if (customer == null || reward == null)
                return Content("Dữ liệu không hợp lệ");

            if (customer.TotalPoints < reward.PointsRequired)
                return Content("Không đủ điểm");

            customer.TotalPoints -= reward.PointsRequired;

            _context.PointsHistories.Add(new PointsHistory
            {
                CustomerId = customer.Id,
                Points = reward.PointsRequired,
                Type = "Subtract",
                Description = "Đổi quà"
            });

            _context.SaveChanges();

            return Content("Đổi quà thành công");
        }
    }
}