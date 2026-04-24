using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ASP.NET.Models
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
        public int Stock { get; set; }
        public string? ImageUrl { get; set; }
        public decimal DiscountRate { get; set; } = 4; // % chiết khấu mặc định là 4%

        // --- PHẦN THAY ĐỔI ĐỂ LIÊN KẾT CATEGORY ---
        public int CategoryId { get; set; }

        [ForeignKey("CategoryId")]
        public virtual Category? Category { get; set; }
        // ------------------------------------------
        public bool IsActive { get; set; } = true; // True: Đang bán, False: Ngừng bán

        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime? UpdatedAt { get; set; }
        public string? UpdatedBy { get; set; }
    }
}