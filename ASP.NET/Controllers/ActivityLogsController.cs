using Microsoft.AspNetCore.Mvc;
using ASP.NET.Data;
using ASP.NET.Models;
using System;
using System.Linq;

namespace ASP.NET.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ActivityLogsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ActivityLogsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var logs = _context.ActivityLogs
                .OrderByDescending(l => l.CreatedAt)
                .Take(200)
                .ToList();
            return Ok(logs);
        }

        // Helper method to add logs from other controllers
        [NonAction]
        public void LogActivity(string adminName, string action, string entity, string details)
        {
            try {
                var log = new ActivityLog
                {
                    AdminName = string.IsNullOrEmpty(adminName) ? "Admin" : adminName,
                    Action = action,
                    EntityName = entity,
                    Details = details,
                    CreatedAt = DateTime.UtcNow
                };
                _context.ActivityLogs.Add(log);
                _context.SaveChanges();
            } catch {
                // Ignore log errors to prevent blocking main business logic
            }
        }
    }
}
