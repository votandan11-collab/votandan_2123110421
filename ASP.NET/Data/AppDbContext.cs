using Microsoft.EntityFrameworkCore;
using ASP.NET.Models;

namespace ASP.NET.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<Customer> Customers { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<Reward> Rewards { get; set; }
        public DbSet<PointsHistory> PointsHistories { get; set; }
    }
}