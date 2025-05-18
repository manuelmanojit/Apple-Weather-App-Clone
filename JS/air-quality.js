import { getWeather } from "./main.js";

function getAirQuality(forecastData) {
  const aqi = forecastData.airQuality;
  let resp;
  if (aqi === 1) return (resp = "Good");
  if (aqi === 2) return (resp = "Moderate");
  if (aqi === 3) return (resp = "Unhealthy for Sensitive Groups");
  if (aqi === 4) return (resp = "Unhealthy");
  if (aqi === 5) return (resp = "Very Unhealthy");
  if (aqi === 6) return (resp = "Hazardous");
  resp = "Invalid AQI value";
  return resp;
}

console.log(airQuality(5));

export { getAirQuality };
