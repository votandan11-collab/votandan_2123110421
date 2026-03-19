using System;

namespace ASP.NET.Models
{
    public class PointsHistory
    {
        public int Id { get; set; }

        public int CustomerId { get; set; }

        public int Points { get; set; }

        public string Type { get; set; }

        public string Description { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public Customer Customer { get; set; }
    }
}