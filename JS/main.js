import { API, BASE_URL } from "./weatherAPI-config.js";
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
import { addCity, showSavedCities } from "./add-city.js";
import { getSidebarStatus } from "./sidebar.js";

const search = document.querySelector(".search");

// DOMContentLoaded loads faster than "load" event
window.addEventListener("DOMContentLoaded", () => {
  // 🧠 Restore sidebar position from localStorage or set default

  // Initial API call triggered with city = "copenhagen"
  firstRun();

  // This function reads the localStorage and creates a card for each city added with "Add"
  showSavedCities();
  search.focus();
  document.documentElement.style.setProperty("--backgroundOpacity", "1");
});

async function firstRun() {
  const sidebarStatus = getSidebarStatus();
  if (sidebarStatus) {
    document.documentElement.style.setProperty(
      "--sidebarLeft",
      sidebarStatus.navBarPosition
    );
    document.documentElement.style.setProperty(
      "--forecastContainerLeft",
      sidebarStatus.forecastContainerPosition
    );
  }

  const lastSelectedCity = localStorage.getItem("lastSelectedCity");

  let city;
  if (lastSelectedCity) city = lastSelectedCity;
  else city = getFirstSavedCity();
  const forecastData = await getWeather(city);
  const addButton = document.querySelector(".add-btn");
  addButton.style.display = "flex";

  let savedCities = JSON.parse(localStorage.getItem("savedCities")) || [];
  const cityExists = savedCities.some(
    (cityData) =>
      cityData.city === forecastData.city &&
      cityData.region === forecastData.region
  );
  if (cityExists) {
    addButton.style.display = "none";
  }

  setHomeUI(forecastData);
}

function getFirstSavedCity() {
  const savedCities = JSON.parse(localStorage.getItem("savedCities")) || [];
  if (savedCities.length === 0) return undefined;
  else {
    return `${savedCities[0].latitude},${savedCities[0].longitude}`;
  }
}

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
    region: location.region,
    cityTimezone: location.tz_id,
    latitude: location.lat,
    longitude: location.lon,

    // --- SUN ---
    sunrise: sun.sunrise,
    sunset: sun.sunset,
  };
}

async function getWeather(city = "copenhagen") {
  console.log(city);
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

  // console.log(forecast, weather);
  return forecast;
}

async function setHomeUI(forecastData) {
  search.focus();
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
  await import("./search-field.js");
  addCity(forecastData);
}

export { getWeather, setHomeUI, getFirstSavedCity };
