using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using ASP.NET.Data;
using ASP.NET.Models;
using ClosedXML.Excel;
using System.IO;

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
            public decimal TotalRevenue { get; set; }
            public int TodayOrders { get; set; }
            public object[] MonthlyRevenue { get; set; }
            public object[] OrderStatus { get; set; } = new object[0];
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
                    .SumAsync(o => (decimal?)o.TotalAmount) ?? 0m
            }));

            // Order status breakdown (DISABLED: Order model does not have Status property)
            var statusGroups = new object[0];

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

        // 📊 XUẤT EXCEL DOANH THU THÁNG
        [HttpGet("export-revenue")]
        public IActionResult ExportRevenue([FromQuery] int month, [FromQuery] int year)
        {
            var orders = _context.Orders
                .Where(o => o.CreatedAt.Month == month && o.CreatedAt.Year == year)
                .ToList();

            using (var workbook = new XLWorkbook())
            {
                var worksheet = workbook.Worksheets.Add("Doanh Thu");
                
                // Tiêu đề
                worksheet.Cell(1, 1).Value = $"BÁO CÁO DOANH THU THÁNG {month}/{year}";
                worksheet.Cell(1, 1).Style.Font.Bold = true;
                worksheet.Cell(1, 1).Style.Font.FontSize = 16;
                worksheet.Range(1, 1, 1, 4).Merge();

                // Header bảng
                var headers = new string[] { "Mã Đơn", "Ngày Tạo", "Khách Hàng (ID)", "Tổng Tiền (VNĐ)" };
                for (int i = 0; i < headers.Length; i++)
                {
                    var cell = worksheet.Cell(3, i + 1);
                    cell.Value = headers[i];
                    cell.Style.Fill.BackgroundColor = XLColor.LightBlue;
                    cell.Style.Font.Bold = true;
                }

                // Dữ liệu
                int row = 4;
                decimal total = 0;
                foreach (var order in orders)
                {
                    worksheet.Cell(row, 1).Value = order.Id;
                    worksheet.Cell(row, 2).Value = order.CreatedAt.ToString("dd/MM/yyyy HH:mm");
                    worksheet.Cell(row, 3).Value = order.CustomerId;
                    worksheet.Cell(row, 4).Value = order.TotalAmount;
                    
                    total += order.TotalAmount;
                    row++;
                }

                // Tổng cộng
                worksheet.Cell(row + 1, 3).Value = "TỔNG CỘNG:";
                worksheet.Cell(row + 1, 3).Style.Font.Bold = true;
                worksheet.Cell(row + 1, 4).Value = total;
                worksheet.Cell(row + 1, 4).Style.Font.Bold = true;
                worksheet.Cell(row + 1, 4).Style.Font.FontColor = XLColor.Red;

                worksheet.Columns().AdjustToContents();

                using (var stream = new MemoryStream())
                {
                    workbook.SaveAs(stream);
                    var content = stream.ToArray();
                    return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", $"DoanhThu_{month}_{year}.xlsx");
                }
            }
        }
    }
}
