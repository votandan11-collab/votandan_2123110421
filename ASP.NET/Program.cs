using Microsoft.EntityFrameworkCore;
using ASP.NET.Data;
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

// Thử lấy link từ DefaultConnection hoặc DATABASE_URL (Render mặc định)
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
                    ?? builder.Configuration["DATABASE_URL"];

if (!string.IsNullOrEmpty(connectionString))
{
    connectionString = connectionString.Trim();
    if (connectionString.StartsWith("postgres://") || connectionString.StartsWith("postgresql://"))
    {
        try {
            var databaseUri = new Uri(connectionString);
            var userInfo = databaseUri.UserInfo.Split(':');
            var host = databaseUri.Host;
            var port = databaseUri.Port > 0 ? databaseUri.Port : 5432;
            var database = databaseUri.AbsolutePath.TrimStart('/');
            connectionString = $"Host={host};Port={port};Database={database};Username={userInfo[0]};Password={userInfo[1]};SSL Mode=Require;Trust Server Certificate=true";
        } catch (Exception ex) {
            Console.WriteLine("LỖI PARSE URL: " + ex.Message);
        }
    }
}

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString ?? ""));

// Debug an toàn
if (!string.IsNullOrEmpty(connectionString)) {
    try {
        var builderDb = new Npgsql.NpgsqlConnectionStringBuilder(connectionString);
        Console.WriteLine($"--- DATABASE DEBUG --- Host: {builderDb.Host} | DB: {builderDb.Database}");
    } catch { 
        Console.WriteLine("--- DATABASE DEBUG --- Chuỗi kết nối không đúng định dạng key-value.");
    }
}

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy => policy.AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});

var app = builder.Build();
app.UseDeveloperExceptionPage();

// 🔥 TỰ ĐỘNG MIGRATION KHI STARTUP 🔥
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<AppDbContext>();
        // Sử dụng EnsureCreated để tự động tạo Database sạch trên Render
        context.Database.EnsureCreated();
        
        // Cưỡng ép tạo bảng Banners nếu EF Core bỏ qua
        var sql = @"
            CREATE TABLE IF NOT EXISTS ""Banners"" (
                ""Id"" SERIAL PRIMARY KEY,
                ""ImageUrl"" TEXT NOT NULL,
                ""Title"" TEXT NOT NULL,
                ""Description"" TEXT,
                ""IsActive"" BOOLEAN DEFAULT TRUE,
                ""DisplayOrder"" INTEGER DEFAULT 0,
                ""CreatedAt"" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );";
        context.Database.ExecuteSqlRaw(sql);

        // Thêm cột ImageUrl cho Product nếu chưa có
        context.Database.ExecuteSqlRaw("ALTER TABLE \"Products\" ADD COLUMN IF NOT EXISTS \"ImageUrl\" TEXT;");

        Console.WriteLine("--- DATABASE: Đã kiểm tra và khởi tạo bảng thành công ---");
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "Lỗi khi tự động tạo bảng database.");
    }
}

app.UseCors("AllowAll");
// Cấu hình Middleware
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Votandan API V1");
    c.RoutePrefix = string.Empty; 
});
app.UseAuthorization(); // Thêm dòng này nếu bạn có dùng Authorize
app.MapControllers();
app.Run();
