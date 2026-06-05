namespace ClassicCarsWeb.Models

{
public class TestDriveRequest
{
    public int Id { get; set; }
    public string? CustomerName { get; set; }
    public string? CarModel { get; set; }
    public string? Email { get; set; }       
    public string? PhoneNumber { get; set; }  
    public string? Address { get; set; }      
    public DateTime BookingDate { get; set; }
}
}
