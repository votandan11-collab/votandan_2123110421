using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ASP.NET.Models
{
    public class PointsHistory
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int CustomerId { get; set; }

        [Required]
        public int Points { get; set; }

        [Required]
        [StringLength(20)]
        public string Type { get; set; } // "Add" (Cộng) hoặc "Subtract" (Trừ)

        [StringLength(255)]
        public string Description { get; set; } // Ví dụ: "Tích điểm đơn hàng", "Đổi trà sữa"

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        // Thiết lập mối quan hệ với bảng Customer
        [ForeignKey("CustomerId")]
        public virtual Customer? Customer { get; set; }
    }
}