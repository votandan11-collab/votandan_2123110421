using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ASP.NET.Models
{
    public class Category
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; } // Ví dụ: Trà sữa, Cà phê, Topping

        public string? Description { get; set; }

        // Liên kết: Một danh mục có nhiều sản phẩm
        public virtual ICollection<Product>? Products { get; set; }
    }
}