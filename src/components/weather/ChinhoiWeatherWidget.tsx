
import { useState, useEffect } from "react";
import { Cloud, CloudRain, CloudLightning, AlertTriangle, Sun, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface WeatherData {
  current: {
    temp_c: number;
    condition: {
      text: string;
      icon: string;
    };
  };
  forecast: {
    forecastday: Array<{
      date: string;
      day: {
        maxtemp_c: number;
        mintemp_c: number;
        condition: {
          text: string;
        };
      };
    }>;
  };
  alerts?: {
    alert: Array<{
      headline: string;
      severity: string;
    }>;
  };
}

const ChinhoiWeatherWidget = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Chinhoyi, Zimbabwe coordinates
  const CHINHOYI_LATITUDE = -17.3667;
  const CHINHOYI_LONGITUDE = 30.2;
  
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setIsLoading(true);
        
        // First, check if we have recent weather data in the database
        const { data: weatherData, error: dbError } = await supabase
          .from('weather_data')
          .select('*')
          .eq('latitude', CHINHOYI_LATITUDE)
          .eq('longitude', CHINHOYI_LONGITUDE)
          .order('created_at', { ascending: false })
          .limit(1);
        
        // If we have recent data (less than 30 minutes old), use it
        if (weatherData && weatherData.length > 0) {
          const lastUpdate = new Date(weatherData[0].created_at);
          const now = new Date();
          const minutesSinceUpdate = (now.getTime() - lastUpdate.getTime()) / (1000 * 60);
          
          if (minutesSinceUpdate < 30) {
            console.log("Using cached weather data");
            setWeather(weatherData[0].data as WeatherData);
            setIsLoading(false);
            return;
          }
        }
        
        // If we don't have recent data, fetch it from the API
        // In a real app, this would call an edge function to protect the API key
        // For this demo, we'll simulate the weather data
        const simulatedWeatherData: WeatherData = {
          current: {
            temp_c: 28,
            condition: {
              text: "Partly cloudy",
              icon: "//cdn.weatherapi.com/weather/64x64/day/116.png"
            }
          },
          forecast: {
            forecastday: [
              {
                date: new Date().toISOString().split('T')[0],
                day: {
                  maxtemp_c: 32,
                  mintemp_c: 22,
                  condition: {
                    text: "Partly cloudy"
                  }
                }
              }
            ]
          },
          alerts: {
            alert: []
          }
        };
        
        // Store the data in the database for future use
        await supabase
          .from('weather_data')
          .insert({
            latitude: CHINHOYI_LATITUDE,
            longitude: CHINHOYI_LONGITUDE,
            data: simulatedWeatherData,
            expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString()
          });
        
        setWeather(simulatedWeatherData);
        setIsLoading(false);
      } catch (err: any) {
        console.error("Error fetching weather:", err);
        setError("Failed to fetch weather data");
        setIsLoading(false);
        toast.error("Failed to load weather data", {
          description: "Please try again later",
        });
      }
    };
    
    fetchWeatherData();
  }, []);
  
  // Helper function to get weather icon component
  const getWeatherIcon = (condition: string) => {
    const lowercaseCondition = condition.toLowerCase();
    
    if (lowercaseCondition.includes("rain") || lowercaseCondition.includes("drizzle")) {
      return <CloudRain className="h-8 w-8 text-blue-500" />;
    } else if (lowercaseCondition.includes("thunder") || lowercaseCondition.includes("lightning")) {
      return <CloudLightning className="h-8 w-8 text-yellow-500" />;
    } else if (lowercaseCondition.includes("cloud")) {
      return <Cloud className="h-8 w-8 text-gray-500" />;
    } else if (lowercaseCondition.includes("clear") || lowercaseCondition.includes("sunny")) {
      return <Sun className="h-8 w-8 text-yellow-500" />;
    } else {
      return <Cloud className="h-8 w-8 text-gray-500" />;
    }
  };
  
  if (isLoading) {
    return (
      <div className="bg-card rounded-lg p-4 shadow-subtle flex items-center justify-center h-32">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
          <p className="text-sm text-muted-foreground">Loading weather data...</p>
        </div>
      </div>
    );
  }
  
  if (error || !weather) {
    return (
      <div className="bg-card rounded-lg p-4 shadow-subtle">
        <div className="flex items-center space-x-2 text-muted-foreground">
          <AlertTriangle className="h-5 w-5" />
          <p className="text-sm">Weather data unavailable</p>
        </div>
      </div>
    );
  }
  
  const hasAlerts = weather.alerts && weather.alerts.alert.length > 0;
  
  return (
    <div className="bg-card rounded-lg p-4 shadow-subtle">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium">Weather in Chinhoyi, Zimbabwe</h3>
        {hasAlerts && (
          <div className="flex items-center text-crisis-red">
            <AlertTriangle className="h-4 w-4 mr-1" />
            <span className="text-xs font-medium">Weather Alert</span>
          </div>
        )}
      </div>
      
      <div className="flex items-center">
        {getWeatherIcon(weather.current.condition.text)}
        <div className="ml-4">
          <div className="flex items-baseline">
            <span className="text-2xl font-bold">{Math.round(weather.current.temp_c)}°C</span>
            <span className="text-sm text-muted-foreground ml-2">
              {weather.forecast.forecastday[0].day.maxtemp_c}° / {weather.forecast.forecastday[0].day.mintemp_c}°
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{weather.current.condition.text}</p>
        </div>
      </div>
      
      {hasAlerts && (
        <div className="mt-3 bg-crisis-red/10 p-2 rounded-md">
          <p className="text-xs text-crisis-red font-medium">
            {weather.alerts?.alert[0].headline}
          </p>
        </div>
      )}
    </div>
  );
};

export default ChinhoiWeatherWidget;
