using ASP.NET.Data;
using ASP.NET.Models;
using Microsoft.AspNetCore.Mvc;

namespace ASP.NET.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CustomersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CustomersController(AppDbContext context)
        {
            _context = context;
        }

        // 🔍 GET ALL
        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(_context.Customers.ToList());
        }

        // 🔍 GET BY ID
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var customer = _context.Customers.Find(id);
            if (customer == null) return NotFound();
            return Ok(customer);
        }

        // ➕ CREATE
        [HttpPost]
        public IActionResult Create(Customer customer)
        {
            customer.TotalPoints = 0;
            customer.Level = "Normal";

            _context.Customers.Add(customer);
            _context.SaveChanges();

            return Ok(customer);
        }

        // ✏️ UPDATE
        [HttpPut("{id}")]
        public IActionResult Update(int id, Customer c)
        {
            var customer = _context.Customers.Find(id);
            if (customer == null) return NotFound();

            customer.Name = c.Name;
            customer.Email = c.Email;

            _context.SaveChanges();

            return Ok(customer);
        }

        // ❌ DELETE
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var customer = _context.Customers.Find(id);
            if (customer == null) return NotFound();

            _context.Customers.Remove(customer);
            _context.SaveChanges();

            return Ok("Xóa thành công");
        }

        // 📝 REGISTER
        [HttpPost("register")]
        public IActionResult Register([FromBody] Customer request)
        {
            if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
                return BadRequest("Email và Mật khẩu không được để trống");

            var exist = _context.Customers.FirstOrDefault(c => c.Email == request.Email);
            if (exist != null) return BadRequest("Email này đã được sử dụng");

            request.TotalPoints = 0;
            request.Level = "Normal";

            _context.Customers.Add(request);
            _context.SaveChanges();

            return Ok(new { Message = "Đăng ký thành công!", user = new { id = request.Id, email = request.Email, name = request.Name } });
        }

        // 🔐 LOGIN (dùng DTO riêng để tránh lỗi 400 thiếu trường)
        [HttpPost("login")]
        public IActionResult Login([FromBody] CustomerLoginRequest request)
        {
            if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
                return BadRequest("Thông tin đăng nhập không hợp lệ");

            var user = _context.Customers.FirstOrDefault(c => c.Email == request.Email && c.Password == request.Password);
            if (user == null) return Unauthorized("Sai email hoặc mật khẩu");

            return Ok(new
            {
                user.Id,
                user.Name,
                user.Email,
                user.Level,
                user.TotalPoints,
                Token = "fake-jwt-" + user.Id + "-" + Guid.NewGuid().ToString().Substring(0, 8)
            });
        }
    }

    // DTO dành riêng cho Login (chỉ cần Email + Password)
    public class CustomerLoginRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}