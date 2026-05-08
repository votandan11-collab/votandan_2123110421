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
        private readonly ASP.NET.Services.IEmailService _emailService;

        public CustomersController(AppDbContext context, ASP.NET.Services.IEmailService emailService)
        {
            _context = context;
            _emailService = emailService;
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
        public IActionResult Create(Customer customer, [FromQuery] string? adminName = null)
        {
            customer.TotalPoints = 0;
            customer.Level = "Normal";

            _context.Customers.Add(customer);

            // GHI LOG
            _context.ActivityLogs.Add(new ActivityLog {
                AdminName = adminName ?? "Admin",
                Action = "CREATE",
                EntityName = "Customer",
                Details = $"Thêm khách hàng mới: {customer.Name} ({customer.Email})",
                CreatedAt = DateTime.UtcNow
            });

            _context.SaveChanges();
            return Ok(customer);
        }

        // ✏️ UPDATE
        [HttpPut("{id}")]
        public IActionResult Update(int id, Customer c, [FromQuery] string? adminName = null)
        {
            var customer = _context.Customers.Find(id);
            if (customer == null) return NotFound();

            string oldInfo = $"{customer.Name} ({customer.Email})";
            customer.Name = c.Name;
            customer.Email = c.Email;

            // GHI LOG
            _context.ActivityLogs.Add(new ActivityLog {
                AdminName = adminName ?? "Admin",
                Action = "UPDATE",
                EntityName = "Customer",
                Details = $"Sửa khách hàng #{id}. Cũ: {oldInfo} -> Mới: {customer.Name} ({customer.Email})",
                CreatedAt = DateTime.UtcNow
            });

            _context.SaveChanges();
            return Ok(customer);
        }

        // ❌ DELETE
        [HttpDelete("{id}")]
        public IActionResult Delete(int id, [FromQuery] string? adminName = null)
        {
            var customer = _context.Customers.Find(id);
            if (customer == null) return NotFound();

            // GHI LOG
            _context.ActivityLogs.Add(new ActivityLog {
                AdminName = adminName ?? "Admin",
                Action = "DELETE",
                EntityName = "Customer",
                Details = $"Xóa khách hàng: {customer.Name} ({customer.Email}) (ID: {id})",
                CreatedAt = DateTime.UtcNow
            });

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
        
        // 🔑 1. GỬI MÃ OTP QUÊN MẬT KHẨU
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            if (string.IsNullOrEmpty(request.Email))
                return BadRequest("Vui lòng nhập Email");

            var user = _context.Customers.FirstOrDefault(c => c.Email == request.Email);
            if (user == null) 
                return NotFound("Email không tồn tại trong hệ thống");

            // Tạo mã OTP 6 số ngẫu nhiên
            string otp = new Random().Next(100000, 999999).ToString();
            user.ResetCode = otp;
            user.ResetCodeExpiry = DateTime.UtcNow.AddMinutes(10); // Hết hạn sau 10 phút
            
            _context.SaveChanges();

            // Gửi Mail
            string subject = otp + " là mã khôi phục mật khẩu của bạn";
            string body = $@"
                <div style='font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 500px;'>
                    <h2 style='color: #6366f1; text-align: center;'>Card Store</h2>
                    <p>Chào <b>{user.Name}</b>,</p>
                    <p>Bạn đã yêu cầu khôi phục mật khẩu. Vui lòng sử dụng mã xác nhận dưới đây để tiếp tục:</p>
                    <div style='text-align: center; margin: 30px 0;'>
                        <span style='font-size: 32px; font-weight: bold; color: #6366f1; letter-spacing: 5px; background: #f3f4f6; padding: 10px 20px; border-radius: 8px; border: 1px solid #e5e7eb;'>{otp}</span>
                    </div>
                    <p style='color: #ef4444; font-size: 0.9rem;'>* Mã này sẽ hết hạn sau 10 phút.</p>
                    <p>Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.</p>
                    <hr style='border: 0; border-top: 1px solid #eee;' />
                    <p style='font-size: 12px; color: #999; text-align: center;'>Đây là email tự động từ hệ thống Card Store.</p>
                </div>";

            try {
                await _emailService.SendEmailAsync(user.Email, subject, body);
                return Ok(new { Message = "Mã xác nhận đã được gửi vào Email của bạn!" });
            } catch (Exception ex) {
                return StatusCode(500, "Lỗi khi gửi Email: " + ex.Message);
            }
        }

        // 🔑 2. XÁC NHẬN MÃ OTP VÀ ĐỔI MẬT KHẨU MỚI
        [HttpPost("reset-password")]
        public IActionResult ResetPassword([FromBody] ResetPasswordRequest request)
        {
            if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Code) || string.IsNullOrEmpty(request.NewPassword))
                return BadRequest("Thông tin không đầy đủ");

            var user = _context.Customers.FirstOrDefault(c => c.Email == request.Email);
            if (user == null) return NotFound("Người dùng không tồn tại");

            // Kiểm tra mã OTP
            if (user.ResetCode != request.Code)
                return BadRequest("Mã xác nhận không chính xác");

            if (user.ResetCodeExpiry < DateTime.UtcNow)
                return BadRequest("Mã xác nhận đã hết hạn");

            // Cập nhật mật khẩu mới
            user.Password = request.NewPassword;
            user.ResetCode = null; // Xóa mã sau khi dùng xong
            user.ResetCodeExpiry = null;
            
            _context.SaveChanges();

            return Ok(new { Message = "Đổi mật khẩu thành công! Bạn có thể đăng nhập ngay." });
        }
    }

    public class CustomerLoginRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class ForgotPasswordRequest
    {
        public string Email { get; set; } = string.Empty;
    }

    public class ResetPasswordRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
    }
}