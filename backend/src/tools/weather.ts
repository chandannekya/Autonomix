import axios from "axios";

interface WeatherInput {
  location: string;
}

export const fetchWeather = async (input: string): Promise<string> => {
  let location = input.trim();
  
  try {
    // Attempt to parse JSON if the agent sent a structured object
    const parsed = JSON.parse(input);
    if (parsed.location) {
      location = parsed.location;
    }
  } catch {
    // If it's not JSON, just use the raw string
  }

  if (!location) {
    return "Error: Please provide a location (e.g., 'London', 'New York', 'Tokyo').";
  }

  try {
    // 1. Geocoding: Convert city name to coordinates (Open-Meteo Geocoding API - Free, no key)
    const geoResponse = await axios.get("https://geocoding-api.open-meteo.com/v1/search", {
      params: {
        name: location,
        count: 1,
        language: "en",
        format: "json",
      },
      timeout: 5000,
    });

    const results = geoResponse.data.results;
    if (!results || results.length === 0) {
      return `Could not find coordinates for location: "${location}".`;
    }

    const { latitude, longitude, name, admin1, country } = results[0];
    const locationName = [name, admin1, country].filter(Boolean).join(", ");

    // 2. Fetch Weather Data (Open-Meteo Weather API - Free, no key)
    const weatherResponse = await axios.get("https://api.open-meteo.com/v1/forecast", {
      params: {
        latitude,
        longitude,
        current: "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m",
        daily: "weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset",
        timezone: "auto",
      },
      timeout: 5000,
    });

    const current = weatherResponse.data.current;
    const daily = weatherResponse.data.daily;
    const units = weatherResponse.data.current_units;

    // Map WMO weather codes to readable descriptions
    const getWeatherDescription = (code: number) => {
      const codes: Record<number, string> = {
        0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
        45: "Fog", 48: "Depositing rime fog",
        51: "Light drizzle", 53: "Moderate drizzle", 55: "Dense drizzle",
        61: "Slight rain", 63: "Moderate rain", 65: "Heavy rain",
        71: "Slight snow", 73: "Moderate snow", 75: "Heavy snow",
        95: "Thunderstorm", 96: "Thunderstorm with slight hail", 99: "Thunderstorm with heavy hail"
      };
      return codes[code] || "Unknown weather";
    };

    const condition = getWeatherDescription(current.weather_code);
    
    // Format the output for the agent
    return [
      `Current Weather for ${locationName}:`,
      `Condition: ${condition}`,
      `Temperature: ${current.temperature_2m}${units.temperature_2m} (Feels like: ${current.apparent_temperature}${units.apparent_temperature})`,
      `Humidity: ${current.relative_humidity_2m}${units.relative_humidity_2m}`,
      `Wind Speed: ${current.wind_speed_10m}${units.wind_speed_10m}`,
      `Precipitation: ${current.precipitation}${units.precipitation}`,
      ``,
      `Today's Forecast:`,
      `High: ${daily.temperature_2m_max[0]}${units.temperature_2m} / Low: ${daily.temperature_2m_min[0]}${units.temperature_2m}`,
      `Sunrise: ${new Date(daily.sunrise[0]).toLocaleTimeString()} / Sunset: ${new Date(daily.sunset[0]).toLocaleTimeString()}`
    ].join("\n");

  } catch (error: any) {
    console.error("[weather tool] Error:", error.message);
    return `Failed to fetch weather data: ${error.message}`;
  }
};
