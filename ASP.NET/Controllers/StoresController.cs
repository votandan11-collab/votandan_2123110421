using Microsoft.AspNetCore.Mvc;
using ASP.NET.Data;
using ASP.NET.Models;
using Microsoft.EntityFrameworkCore;

namespace ASP.NET.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StoresController : ControllerBase
    {
        private readonly AppDbContext _context;

        public StoresController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await _context.Stores.ToListAsync());

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var store = await _context.Stores.FindAsync(id);
            return store == null ? NotFound("Không tìm thấy chi nhánh") : Ok(store);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Store store)
        {
            _context.Stores.Add(store);
            await _context.SaveChangesAsync();
            return Ok(new { Message = "Thêm chi nhánh thành công", Data = store });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Store store)
        {
            var exist = await _context.Stores.FindAsync(id);
            if (exist == null) return NotFound();

            exist.StoreName = store.StoreName;
            exist.Address = store.Address;
            exist.Hotline = store.Hotline;

            await _context.SaveChangesAsync();
            return Ok("Cập nhật chi nhánh thành công");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var store = await _context.Stores.FindAsync(id);
            if (store == null) return NotFound();
            _context.Stores.Remove(store);
            await _context.SaveChangesAsync();
            return Ok("Đã xóa chi nhánh");
        }
    }
}