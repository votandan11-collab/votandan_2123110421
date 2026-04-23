using System.ComponentModel.DataAnnotations;

namespace ASP.NET.Models
{
    public class Payment
    {
        [Key]
        public int Id { get; set; }
        public int OrderId { get; set; }
        public double Amount { get; set; }
        public string PaymentMethod { get; set; } // Ví dụ: "Tiền mặt", "Chuyển khoản", "Ví điện tử"
        public string Status { get; set; } // "Pending", "Completed", "Failed"
        public DateTime PaymentDate { get; set; } = DateTime.Now;

        // Navigation property
        public virtual Order? Order { get; set; }
    }
}