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
        public async Task<IActionResult> Create(Employee emp)
        {
            _context.Employees.Add(emp);
            await _context.SaveChangesAsync();
            return Ok(new { Message = "Thêm nhân viên thành công", User = emp.Username });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Employee emp)
        {
            var exist = await _context.Employees.FindAsync(id);
            if (exist == null) return NotFound();

            exist.FullName = emp.FullName;
            exist.Role = emp.Role;
            exist.Password = emp.Password; // Trong thực tế nên mã hóa mật khẩu

            await _context.SaveChangesAsync();
            return Ok("Cập nhật thông tin nhân viên thành công");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var emp = await _context.Employees.FindAsync(id);
            if (emp == null) return NotFound();
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

            // Trong thực hành thực tế nên trả về JWT Token
            return Ok(new
            {
                user.Id,
                user.FullName,
                user.Username,
                user.Role,
                Token = "fake-jwt-token-for-demo-" + user.Username // Placeholder
            });
        }
    }

    public class LoginRequest
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}