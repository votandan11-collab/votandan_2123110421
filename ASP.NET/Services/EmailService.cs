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
            var smtpServer = emailSettings["SmtpServer"];
            var smtpPort = int.Parse(emailSettings["SmtpPort"] ?? "587");
            var senderEmail = emailSettings["SenderEmail"];
            var senderName = emailSettings["SenderName"];
            var password = emailSettings["Password"];

            var client = new SmtpClient(smtpServer, smtpPort)
            {
                Credentials = new NetworkCredential(senderEmail, password),
                EnableSsl = true
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress(senderEmail!, senderName),
                Subject = subject,
                Body = body,
                IsBodyHtml = true
            };

            mailMessage.To.Add(toEmail);

            await client.SendMailAsync(mailMessage);
        }
    }
}
