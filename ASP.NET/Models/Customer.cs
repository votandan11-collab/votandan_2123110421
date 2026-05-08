using System.ComponentModel.DataAnnotations;

namespace ASP.NET.Models
{
    public class Customer
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Email { get; set; }

        public string Password { get; set; }

        public int TotalPoints { get; set; } = 0;
        public string Level { get; set; } = "Normal";
        public string? ResetCode { get; set; }
        public DateTime? ResetCodeExpiry { get; set; }
    }
}