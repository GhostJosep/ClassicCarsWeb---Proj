namespace ClassicCarsWeb.Models

{
public class TestDriveRequest
{
    public int Id { get; set; }
    public string? CustomerName { get; set; } // Added '?'
    public string? CarModel { get; set; }     // Added '?'
    public DateTime BookingDate { get; set; }
}
}