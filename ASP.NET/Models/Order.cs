using System;

namespace ASP.NET.Models
{
    public class Order
    {
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public decimal TotalAmount { get; set; }

        // Giữ nguyên trường của bạn
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        // BỔ SUNG 2 DÒNG NÀY:
        public DateTime? UpdatedAt { get; set; }
        public string? UpdatedBy { get; set; }

        public Customer? Customer { get; set; }
    }
}