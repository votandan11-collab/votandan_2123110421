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
        public DbSet<Product> Products { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<Store> Stores { get; set; }
        public DbSet<Employee> Employees { get; set; }
        public DbSet<Banner> Banners { get; set; }
        public DbSet<ActivityLog> ActivityLogs { get; set; }
    }
}