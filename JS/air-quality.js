import { getWeather } from "./main.js";

function airQuality(air) {
  const aqi = air;
  let resp;
  if (aqi >= 0 && aqi <= 50) return (resp = "Good");
  if (aqi >= 51 && aqi <= 100) return (resp = "Moderate");
  if (aqi >= 101 && aqi <= 150)
    return (resp = "Unhealthy for Sensitive Groups");
  if (aqi >= 151 && aqi <= 200) return (resp = "Unhealthy");
  if (aqi >= 201 && aqi <= 300) return (resp = "Very Unhealthy");
  if (aqi >= 301 && aqi <= 500) return (resp = "Hazardous");
  resp = "Invalid AQI value";
  return resp;
}
