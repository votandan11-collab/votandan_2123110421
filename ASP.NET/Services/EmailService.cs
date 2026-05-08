using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Options;

namespace ASP.NET.Services
{
    public interface IEmailService
    {
        Task SendEmailAsync(string toEmail, string subject, string body);
    }

    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            var emailSettings = _config.GetSection("EmailSettings");
            var smtpServer = emailSettings["SmtpServer"] ?? "smtp.gmail.com";
            var smtpPort = int.Parse(emailSettings["SmtpPort"] ?? "587");
            var senderEmail = emailSettings["SenderEmail"];
            var senderName = emailSettings["SenderName"];
            var password = emailSettings["Password"];

            using (var client = new SmtpClient(smtpServer, smtpPort))
            {
                client.Credentials = new NetworkCredential(senderEmail, password);
                client.EnableSsl = true;
                client.Timeout = 10000; // 10 giây timeout để tránh treo app
                client.DeliveryMethod = SmtpDeliveryMethod.Network;
                client.UseDefaultCredentials = false;

                var mailMessage = new MailMessage
                {
                    From = new MailAddress(senderEmail!, senderName),
                    Subject = subject,
                    Body = body,
                    IsBodyHtml = true
                };

                mailMessage.To.Add(toEmail);

                try {
                    await client.SendMailAsync(mailMessage);
                } catch (Exception ex) {
                    Console.WriteLine($"SMTP ERROR: {ex.Message}");
                    throw new Exception("Không thể kết nối đến máy chủ Email. Vui lòng kiểm tra lại cấu hình Gmail.");
                }
            }
        }
    }
}
