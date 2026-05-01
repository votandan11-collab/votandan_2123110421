using Microsoft.AspNetCore.Mvc;
using ASP.NET.Data;
using ASP.NET.Models;
using Microsoft.EntityFrameworkCore;

namespace ASP.NET.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public EmployeesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await _context.Employees.ToListAsync());

        [HttpPost]
        public async Task<IActionResult> Create(Employee emp, [FromQuery] string? adminName = null)
        {
            _context.Employees.Add(emp);
            
            // GHI LOG
            _context.ActivityLogs.Add(new ActivityLog {
                AdminName = adminName ?? "Admin",
                Action = "CREATE",
                EntityName = "Employee",
                Details = $"Thêm nhân viên mới: {emp.FullName} ({emp.Username})",
                CreatedAt = System.DateTime.UtcNow
            });

            await _context.SaveChangesAsync();
            return Ok(new { Message = "Thêm nhân viên thành công", User = emp.Username });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Employee emp, [FromQuery] string? adminName = null)
        {
            var exist = await _context.Employees.FindAsync(id);
            if (exist == null) return NotFound();

            string oldName = exist.FullName;
            exist.FullName = emp.FullName;
            exist.Role = emp.Role;
            exist.Password = emp.Password;

            // GHI LOG
            _context.ActivityLogs.Add(new ActivityLog {
                AdminName = adminName ?? "Admin",
                Action = "UPDATE",
                EntityName = "Employee",
                Details = $"Cập nhật nhân viên #{id}. Cũ: {oldName} -> Mới: {exist.FullName}",
                CreatedAt = System.DateTime.UtcNow
            });

            await _context.SaveChangesAsync();
            return Ok("Cập nhật thông tin nhân viên thành công");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id, [FromQuery] string? adminName = null)
        {
            var emp = await _context.Employees.FindAsync(id);
            if (emp == null) return NotFound();

            // GHI LOG
            _context.ActivityLogs.Add(new ActivityLog {
                AdminName = adminName ?? "Admin",
                Action = "DELETE",
                EntityName = "Employee",
                Details = $"Xóa nhân viên: {emp.FullName} (Username: {emp.Username})",
                CreatedAt = System.DateTime.UtcNow
            });

            _context.Employees.Remove(emp);
            await _context.SaveChangesAsync();
            return Ok("Đã xóa nhân viên");
        }

        // 🔐 5. ĐĂNG NHẬP
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (request == null || string.IsNullOrEmpty(request.Username))
                return BadRequest("Thông tin đăng nhập không hợp lệ");

            var user = await _context.Employees
                .FirstOrDefaultAsync(u => u.Username == request.Username && u.Password == request.Password);

            if (user == null)
                return Unauthorized("Sai tài khoản hoặc mật khẩu");

            // Trả về thông tin user và token giả
            return Ok(new
            {
                user.Id,
                user.FullName,
                user.Username,
                user.Role,
                Token = "fake-jwt-token-for-demo-" + user.Username
            });
        }
    }

    public class LoginRequest
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}