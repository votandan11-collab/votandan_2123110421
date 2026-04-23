using Microsoft.AspNetCore.Mvc;
using ASP.NET.Data;
using ASP.NET.Models;
using Microsoft.EntityFrameworkCore;

namespace ASP.NET.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrderItemsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OrderItemsController(AppDbContext context)
        {
            _context = context;
        }

        // Lấy chi tiết các món của một đơn hàng cụ thể
        [HttpGet("order/{orderId}")]
        public async Task<IActionResult> GetByOrder(int orderId)
        {
            var items = await _context.OrderItems
                .Include(i => i.Product)
                .Where(i => i.OrderId == orderId)
                .ToListAsync();
            return Ok(items);
        }

        [HttpPost]
        public async Task<IActionResult> AddItem(OrderItem item)
        {
            // Kiểm tra tồn kho trước khi thêm món
            var product = await _context.Products.FindAsync(item.ProductId);
            if (product == null || product.Stock < item.Quantity)
                return BadRequest("Sản phẩm không tồn tại hoặc hết hàng");

            _context.OrderItems.Add(item);

            // Cập nhật tồn kho tự động
            product.Stock -= item.Quantity;

            await _context.SaveChangesAsync();
            return Ok("Đã thêm món vào đơn hàng");
        }
    }
}