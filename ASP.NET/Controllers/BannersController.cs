using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ASP.NET.Data;
using ASP.NET.Models;

namespace ASP.NET.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BannersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BannersController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Banners
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Banner>>> GetBanners()
        {
            return await _context.Banners
                .Where(b => b.IsActive)
                .OrderBy(b => b.DisplayOrder)
                .ToListAsync();
        }

        // GET: api/Banners/admin
        [HttpGet("admin")]
        public async Task<ActionResult<IEnumerable<Banner>>> GetAllBanners()
        {
            return await _context.Banners.OrderByDescending(b => b.CreatedAt).ToListAsync();
        }

        // POST: api/Banners
        [HttpPost]
        public async Task<ActionResult<Banner>> CreateBanner(Banner banner, [FromQuery] string? adminName = null)
        {
            _context.Banners.Add(banner);
            
            // GHI LOG
            _context.ActivityLogs.Add(new ActivityLog {
                AdminName = adminName ?? "Admin",
                Action = "CREATE",
                EntityName = "Banner",
                Details = $"Thêm banner quảng cáo: {banner.Title}",
                CreatedAt = System.DateTime.UtcNow
            });

            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetBanners), new { id = banner.Id }, banner);
        }

        // PUT: api/Banners/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBanner(int id, Banner banner, [FromQuery] string? adminName = null)
        {
            if (id != banner.Id) return BadRequest();
            _context.Entry(banner).State = EntityState.Modified;

            // GHI LOG
            _context.ActivityLogs.Add(new ActivityLog {
                AdminName = adminName ?? "Admin",
                Action = "UPDATE",
                EntityName = "Banner",
                Details = $"Cập nhật banner #{id}: {banner.Title}",
                CreatedAt = System.DateTime.UtcNow
            });

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/Banners/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBanner(int id, [FromQuery] string? adminName = null)
        {
            var banner = await _context.Banners.FindAsync(id);
            if (banner == null) return NotFound();

            // GHI LOG
            _context.ActivityLogs.Add(new ActivityLog {
                AdminName = adminName ?? "Admin",
                Action = "DELETE",
                EntityName = "Banner",
                Details = $"Xóa banner: {banner.Title} (ID: {id})",
                CreatedAt = System.DateTime.UtcNow
            });

            _context.Banners.Remove(banner);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
