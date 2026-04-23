using System.ComponentModel.DataAnnotations;

namespace ASP.NET.Models
{
    public class Store
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string StoreName { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string Hotline { get; set; } = string.Empty;
    }
}