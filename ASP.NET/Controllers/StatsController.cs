using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using ASP.NET.Data;
using ASP.NET.Models;

namespace ASP.NET.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StatsController : ControllerBase
    {
        private readonly AppDbContext _context;
        public StatsController(AppDbContext context)
        {
            _context = context;
        }

        public class StatsDto
        {
            public int TotalProducts { get; set; }
            public int TotalOrders { get; set; }
            public long TotalRevenue { get; set; }
            public int TodayOrders { get; set; }
            public object[] MonthlyRevenue { get; set; }
            public object[] OrderStatus { get; set; }
        }

        [HttpGet]
        public async Task<ActionResult<StatsDto>> Get()
        {
            var totalProducts = await _context.Products.CountAsync();
            var totalOrders = await _context.Orders.CountAsync();
            var totalRevenue = await _context.Orders.SumAsync(o => o.TotalAmount);

            // Today orders
            var today = DateTime.UtcNow.Date;
            var todayOrders = await _context.Orders.CountAsync(o => o.CreatedAt >= today);

            // Monthly revenue for last 6 months
            var months = Enumerable.Range(0, 6)
                .Select(i => new {
                    Month = new DateTime(today.Year, today.Month, 1).AddMonths(-i),
                })
                .Reverse()
                .ToList();
            var monthlyRevenue = await Task.WhenAll(months.Select(async m => new {
                month = m.Month.ToString("yyyy-MM"),
                revenue = await _context.Orders
                    .Where(o => o.CreatedAt >= m.Month && o.CreatedAt < m.Month.AddMonths(1))
                    .SumAsync(o => (long?)o.TotalAmount) ?? 0
            }));

            // Order status breakdown
            var statusGroups = await _context.Orders
                .GroupBy(o => o.Status)
                .Select(g => new { status = g.Key, count = g.Count() })
                .ToListAsync();

            var dto = new StatsDto
            {
                TotalProducts = totalProducts,
                TotalOrders = totalOrders,
                TotalRevenue = totalRevenue,
                TodayOrders = todayOrders,
                MonthlyRevenue = monthlyRevenue,
                OrderStatus = statusGroups
            };

            return Ok(dto);
        }
    }
}
