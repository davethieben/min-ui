using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace MinUiSample.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WeatherForecastController : ControllerBase
    {
        private static readonly string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        private readonly ILogger<WeatherForecastController> _logger;

        public WeatherForecastController(ILogger<WeatherForecastController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public IEnumerable<WeatherForecast> Get(int? location)
        {
            var rng = new Random();
            return Enumerable.Range(1, 5).Select(index => new WeatherForecast
            {
                Date = DateTime.Now.AddDays(index),
                TemperatureC = rng.Next(-20, 55),
                Summary = Summaries[rng.Next(Summaries.Length)]
            })
            .ToArray();
        }

        [HttpGet("locations")]
        public IEnumerable<WeatherLocation> Locations()
        {
            return new WeatherLocation[]
            {
                new WeatherLocation{ LocationId=1, Name="Dayton, OH" },
                new WeatherLocation{ LocationId=2, Name="Cleveland, OH" },
                new WeatherLocation{ LocationId=3, Name="New York, NY" },
                new WeatherLocation{ LocationId=4, Name="Kansas City, MS" },
                new WeatherLocation{ LocationId=5, Name="Seattle, WA" },
            };
        }


    }
}
