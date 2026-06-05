using MailKit.Net.Smtp;
using MimeKit;

namespace ClassicCarsWeb.Services
{
    public class EmailService
    {
     public void SendEmail(string toEmail, string carModel, string bookingDate)
{
    var message = new MimeMessage();
    message.From.Add(new MailboxAddress("ClassicCars Admin", "classic.carsgg67@gmail.com"));
    message.To.Add(new MailboxAddress("Customer", toEmail));
    message.Subject = "Your Test Drive Booking Confirmation";

    var bodyBuilder = new BodyBuilder();
    bodyBuilder.TextBody = $@"
Hello,

Thank you for choosing Classic Cars! Your test drive booking has been confirmed.

Booking Details:
----------------
Car Model: {carModel}
Date: {bookingDate}

We look forward to seeing you soon!
Best regards,
The Classic Cars Team";

    message.Body = bodyBuilder.ToMessageBody();

    using var client = new SmtpClient();
    client.Connect("smtp.gmail.com", 587, false);
    client.Authenticate("classic.carsgg67@gmail.com", "anpjzaaohnjtixxq");
    client.Send(message);
    client.Disconnect(true);
}
    }
}