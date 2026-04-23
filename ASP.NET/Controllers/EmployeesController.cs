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
    }
}