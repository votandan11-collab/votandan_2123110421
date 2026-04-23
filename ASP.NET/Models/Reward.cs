using System.ComponentModel.DataAnnotations;

namespace ASP.NET.Models
{
    public class Reward
    {
        public int Id { get; set; }

        [Required]
        public string RewardName { get; set; }

        [Required]
        public int PointsRequired { get; set; }

        // Bổ sung theo nghiệp vụ 4.2 trong file Word
        public int StockQuantity { get; set; }
    }
}