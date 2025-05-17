
import { useEffect, useState } from "react";
import { Cloud, CloudRain, CloudLightning, Sun, Thermometer, Wind, Droplets } from "lucide-react";

interface WeatherData {
  temp: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: React.ElementType;
  lastUpdated: Date;
}

const LiveWeatherWidget = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getWeatherIcon = (condition: string) => {
    const conditions = condition.toLowerCase();
    if (conditions.includes('rain') || conditions.includes('shower')) {
      return CloudRain;
    } else if (conditions.includes('thunder') || conditions.includes('lightning') || conditions.includes('storm')) {
      return CloudLightning;
    } else if (conditions.includes('clear') || conditions.includes('sunny')) {
      return Sun;
    } else {
      return Cloud;
    }
  };

  const fetchWeather = () => {
    // In a real app, this would be an API call to a weather service
    // For this demo, we'll simulate weather data
    const conditions = [
      "Partly Cloudy", 
      "Light Rain", 
      "Thunderstorms", 
      "Clear Skies",
      "Cloudy",
      "Heavy Rain"
    ];
    
    const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
    const randomTemp = Math.floor(Math.random() * 25) + 60; // 60-85°F
    const randomHumidity = Math.floor(Math.random() * 50) + 30; // 30-80%
    const randomWind = Math.floor(Math.random() * 15) + 1; // 1-15 mph
    
    let description = "";
    if (randomCondition === "Partly Cloudy") {
      description = "Partly cloudy with a chance of rain later";
    } else if (randomCondition === "Light Rain") {
      description = "Light rain showers, bring an umbrella";
    } else if (randomCondition === "Thunderstorms") {
      description = "Thunderstorms expected, stay indoors if possible";
    } else if (randomCondition === "Clear Skies") {
      description = "Clear skies and pleasant conditions";
    } else if (randomCondition === "Cloudy") {
      description = "Overcast with clouds, no precipitation expected";
    } else {
      description = "Heavy rain with possible flooding in low areas";
    }
    
    setWeather({
      temp: randomTemp,
      condition: randomCondition,
      humidity: randomHumidity,
      windSpeed: randomWind,
      description: description,
      icon: getWeatherIcon(randomCondition),
      lastUpdated: new Date()
    });
    
    setIsLoading(false);
  };

  useEffect(() => {
    // Initial fetch
    fetchWeather();
    
    // Set up interval for real-time updates (every 60 seconds)
    const interval = setInterval(() => {
      fetchWeather();
    }, 60000);
    
    // Clean up interval
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="bg-muted animate-pulse h-32 rounded-xl"></div>
    );
  }

  if (!weather) {
    return (
      <div className="bg-secondary p-4 rounded-xl text-foreground">
        <p className="text-center">Weather data unavailable</p>
      </div>
    );
  }

  const timeString = weather.lastUpdated.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="bg-gradient-to-r from-blue-500 to-blue-700 p-4 rounded-xl text-white shadow-lg relative">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center">
            <weather.icon className="h-10 w-10 mr-3" />
            <div>
              <h2 className="font-bold text-2xl">{weather.temp}°F</h2>
              <p className="text-sm opacity-90">{weather.condition}</p>
            </div>
          </div>
          <p className="text-sm mt-2 opacity-90">{weather.description}</p>
        </div>
        <div className="space-y-2">
          <div className="flex items-center text-xs">
            <Wind className="h-3 w-3 mr-1" />
            <span>Wind: {weather.windSpeed} mph</span>
          </div>
          <div className="flex items-center text-xs">
            <Droplets className="h-3 w-3 mr-1" />
            <span>Humidity: {weather.humidity}%</span>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-1 right-2 text-xs opacity-70 flex items-center">
        <span>Updated {timeString}</span>
      </div>
    </div>
  );
};

export default LiveWeatherWidget;
