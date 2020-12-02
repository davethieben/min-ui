using System;

namespace MinUiSample
{
    public class WeatherForecast
    {
        public DateTime Date { get; set; }

        public int TemperatureC { get; set; }

        public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);

        public string Summary { get; set; }
    }

    public class WeatherLocation
    {
        public int LocationId { get; set; }

        public string Name { get; set; }

        public long Latitude { get; set; }

        public long Longitude { get; set; }

    }
}
