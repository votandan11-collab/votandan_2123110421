using System;

namespace ASP.NET.Models
{
    public class Order
    {
        public int Id { get; set; }

        public int CustomerId { get; set; }

        public decimal TotalAmount { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public Customer Customer { get; set; }
    }
}