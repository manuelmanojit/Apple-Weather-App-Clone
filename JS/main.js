import { setBackground } from "./set-background.js";
import { setHeader } from "./header.js";
import { setSliderTrio } from "./Slider-card.js";
import { setFutureForecast } from "./10-day-forecast.js";
import { getRainMap } from "./rain-map.js";
import { setAirQuality } from "./air-quality.js";
import { getFeelsLike } from "./feels-like.js";
import { setWind } from "./wind.js";
import { setUvIndex } from "./uv-index.js";
import { moveSunBall } from "./sunset.js";
import { setHumidity } from "./humidity.js";
import { setVisibility } from "./visibility-km.js";

const search = document.querySelector(".search");
//THIS IS UPDATING ON GETWEATHER, NOT REQUESTWEATHER
search.addEventListener("keydown", async (e) => {
  if (e.key === "Enter") {
    let newCity = search.value;
    const forecast = await getWeather(newCity);
    await setHomeUI(forecast);
  }
});

function createForecastData(weather, astronomy) {
  const now = weather.current;
  const today = weather.forecast.forecastday[0];
  const location = weather.location;
  const sun = astronomy.astronomy.astro;

  return {
    // --- NOW ---
    conditions: now.condition.text,
    temperature: Math.round(now.temp_c),
    feelsLike: Math.round(now.feelslike_c),
    airQuality: now.air_quality["us-epa-index"],
    uvIndex: Math.round(now.uv),
    windSpeed: `${Math.round(now.wind_kph / 3.6)} m/s`,
    windGusts: `${Math.round(now.gust_kph / 3.6)} m/s`,
    windDirection: `${now.wind_degree}° ${now.wind_dir}`,
    visibility: now.vis_km,
    humidity: `${now.humidity}%`,
    dewPoint: Math.round(now.dewpoint_c),
    // --- TODAY ---
    tempMax: Math.round(today.day.maxtemp_c),
    tempMin: Math.round(today.day.mintemp_c),
    dailyForecast: today,
    hourlyForecast: today.hour,
    // --- FUTURE ---
    futureForecast: weather.forecast.forecastday,
    // --- LOCATION ---
    city: location.name,
    cityTimezone: location.tz_id,
    longitude: location.lon,
    latitude: location.lat,
    // --- SUN ---
    sunrise: sun.sunrise,
    sunset: sun.sunset,
  };
}

async function getWeather(city = "copenhagen") {
  const API = "e6f33b99dee14f6b96c64046252405";
  const BASE_URL = "https://api.weatherapi.com/v1/";

  const weatherURL = `${BASE_URL}forecast.json?key=${API}&q=${city}&days=10&aqi=yes&alerts=no`;
  const astronomyURL = `${BASE_URL}astronomy.json?key=${API}&q=${city}`;
  //WEATHER REQUEST
  const weatherResp = await fetch(weatherURL);
  if (!weatherResp.ok) {
    throw new Error("Network response not OK");
  }
  const weather = await weatherResp.json();
  //ASTRONOMY REQUEST
  const moonResp = await fetch(astronomyURL);
  if (!moonResp.ok) {
    throw new Error("Network response not OK");
  }
  const astronomy = await moonResp.json();

  const forecast = createForecastData(weather, astronomy);

  console.log(forecast, weather);
  return forecast;
}

// ✅ REFACTORED
function formatTime(timeString) {
  // 9:28 and PM
  const [time, period] = timeString.split(" ");
  // 9 and 28
  let [hour, minutes] = time.split(":").map((value) => Number(value));

  if (period === "AM" && hour === "12") hour = 0;
  if (period === "PM" && hour !== "12") hour += 12;
  //9 into 21 or 09 if AM
  return `${hour.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
}

// ✅ REFACTORED
function getCurrentHour(forecastData) {
  const timezone = forecastData.cityTimezone;
  const currentDay = new Date();

  const options = { hour: "numeric", timeZone: timezone, hour12: false };
  // I need parseInt because Intl.DateTImeFormat returns a string
  const currentHour = parseInt(
    new Intl.DateTimeFormat("default", options).format(currentDay)
  );

  return currentHour;
}

async function setHomeUI(forecastData) {
  setHeader(forecastData);
  setSliderTrio(forecastData);
  setVisibility(forecastData);
  setHumidity(forecastData);
  setWind(forecastData);
  setAirQuality(forecastData);
  getFeelsLike(forecastData);
  setUvIndex(forecastData);
  moveSunBall(forecastData);
  setFutureForecast(forecastData);
  setBackground(forecastData);
  await getRainMap(forecastData);
}

// Initial API call triggered with city = "copenhagen"
getWeather().then((forecastData) => {
  setHomeUI(forecastData);
});

export { getCurrentHour, getWeather, formatTime };
