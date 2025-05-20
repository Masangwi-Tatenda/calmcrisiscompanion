
import { useEffect, useState } from "react";
import { Cloud, CloudRain, CloudLightning, Sun, Thermometer, Wind, Droplets } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface WeatherData {
  temp: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: React.ElementType;
}

const CHINHOYI_COORDS = {
  latitude: -17.3667,
  longitude: 30.2
};

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

  const fetchChinhoiWeather = async () => {
    try {
      // Try to get cached weather data first
      const { data: cachedData, error: cacheError } = await supabase
        .from('weather_data')
        .select()
        .eq('latitude', CHINHOYI_COORDS.latitude)
        .eq('longitude', CHINHOYI_COORDS.longitude)
        .order('created_at', { ascending: false })
        .limit(1);
      
      // Check if we have valid cached data less than 30 minutes old
      const now = new Date();
      const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);
      
      if (cachedData?.[0] && new Date(cachedData[0].created_at) > thirtyMinutesAgo) {
        console.log("Using cached weather data");
        const weatherData = cachedData[0].data as any;
        setWeather({
          temp: weatherData.temp,
          condition: weatherData.condition,
          humidity: weatherData.humidity,
          windSpeed: weatherData.windSpeed,
          description: weatherData.description,
          icon: getWeatherIcon(weatherData.condition)
        });
        setIsLoading(false);
        return;
      }
      
      // For demo purposes, generate simulated weather data for Chinhoyi
      console.log("Generating new weather data for Chinhoyi");
      const conditions = [
        "Partly Cloudy", 
        "Light Rain", 
        "Thunderstorms", 
        "Clear Skies",
        "Cloudy"
      ];
      
      const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
      // Chinhoyi temperature in Celsius (convert to Fahrenheit for display)
      const randomTempCelsius = Math.floor(Math.random() * 15) + 20; // 20-35°C
      const randomTempFahrenheit = Math.round((randomTempCelsius * 9/5) + 32);
      const randomHumidity = Math.floor(Math.random() * 50) + 30; // 30-80%
      const randomWind = Math.floor(Math.random() * 15) + 1; // 1-15 mph
      
      let description = "";
      if (randomCondition === "Partly Cloudy") {
        description = "Partly cloudy conditions in Chinhoyi";
      } else if (randomCondition === "Light Rain") {
        description = "Light rain showers in Chinhoyi, carry an umbrella";
      } else if (randomCondition === "Thunderstorms") {
        description = "Thunderstorms in Chinhoyi area, stay indoors if possible";
      } else if (randomCondition === "Clear Skies") {
        description = "Clear skies and pleasant conditions in Chinhoyi";
      } else {
        description = "Overcast with clouds in Chinhoyi, no rain expected";
      }

      const weatherData = {
        temp: randomTempFahrenheit,
        tempCelsius: randomTempCelsius,
        condition: randomCondition,
        humidity: randomHumidity,
        windSpeed: randomWind,
        description: description,
        location: "Chinhoyi, Zimbabwe"
      };
      
      // Store in weather_data table
      const expires = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour expiry
      await supabase.from('weather_data').insert({
        latitude: CHINHOYI_COORDS.latitude,
        longitude: CHINHOYI_COORDS.longitude,
        data: weatherData,
        expires_at: expires.toISOString()
      });
      
      setWeather({
        temp: randomTempFahrenheit,
        condition: randomCondition,
        humidity: randomHumidity,
        windSpeed: randomWind,
        description: description,
        icon: getWeatherIcon(randomCondition)
      });
      
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchChinhoiWeather();
    
    // Set up interval for updates every 30 minutes
    const interval = setInterval(() => {
      fetchChinhoiWeather();
    }, 1800000); // 30 minutes
    
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

  return (
    <div className="bg-gradient-to-r from-blue-500 to-blue-700 p-4 rounded-xl text-white shadow-lg relative dark:from-blue-700 dark:to-blue-900">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center">
            <weather.icon className="h-10 w-10 mr-3" />
            <div>
              <h2 className="font-bold text-2xl">{weather.temp}°F</h2>
              <p className="text-sm opacity-90">{weather.condition}</p>
            </div>
          </div>
          <p className="text-sm mt-1 opacity-90">{weather.description}</p>
          <p className="text-xs mt-1 opacity-75">Chinhoyi, Zimbabwe</p>
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
    </div>
  );
};

export default LiveWeatherWidget;
