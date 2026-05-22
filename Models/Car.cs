namespace ClassicCarsWeb.Models
{
    public class Car
    {
        public int ID { get; set; }
        public string Title { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public int Year { get; set; }
        public string Make { get; set; } = string.Empty;
        public string Engine { get; set; } = string.Empty;
        public string Horsepower { get; set; } = string.Empty;
       public string Transmission { get; set; }
    public string DriveType { get; set; }
    public string BodyStyle { get; set; }
    public string EstimatedValue { get; set; }
    }
}