using System;
using System.ComponentModel.DataAnnotations;

namespace ASP.NET.Models
{
    public class ActivityLog
    {
        public int Id { get; set; }
        
        [Required]
        public string AdminName { get; set; }
        
        [Required]
        public string Action { get; set; } // "CREATE", "UPDATE", "DELETE"
        
        [Required]
        public string EntityName { get; set; } // "Product", "Reward", "Order", etc.
        
        public string Details { get; set; } // e.g. "Updated price of Product #1"
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
