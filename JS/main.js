import { setSliderTrio } from "./Slider-card.js";
import { setHeader } from "./header.js";
import { getRainMap } from "./rain-map.js";
import { setFutureForecast } from "./10-day-forecast.js";
import { setVisibility } from "./visibility-km.js";
import { setHumidity } from "./humidity.js";
import { setWind } from "./wind.js";
import { setAirQuality } from "./air-quality.js";
import { getFeelsLike } from "./feels-like.js";
import { setUvIndex } from "./uv-index.js";

const search = document.querySelector(".search");
//THIS IS UPDATING ON GETWEATHER, NOT REQUESTWEATHER
search.addEventListener("keydown", async (e) => {
  if (e.key === "Enter") {
    let newCity = search.value;
    const forecast = await getWeather(newCity);
    await setHomeUI(forecast);
  }
});

async function getWeather(city = "copenhagen") {
  const API = "138593b09da6432e891161652250905";
  const weatherURL = `https://api.weatherapi.com/v1/forecast.json?key=${API}&q=${city}&days=10&aqi=yes&alerts=no`;
  const astronomyURL = `https://api.weatherapi.com/v1/astronomy.json?key=${API}&q=${city}`;
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

  const forecast = {
    conditions: weather.current.condition.text,
    temperature: Math.round(weather.current.temp_c),
    tempMax: Math.round(weather.forecast.forecastday[0].day.maxtemp_c),
    tempMin: Math.round(weather.forecast.forecastday[0].day.mintemp_c),
    feelsLike: Math.round(weather.current.feelslike_c),
    airQuality: weather.current.air_quality["us-epa-index"],
    uvIndex: Math.round(weather.current.uv),
    windSpeed: `${Math.round(weather.current.wind_kph / 3.6)} m/s`,
    windGusts: `${Math.round(weather.current.gust_kph / 3.6)} m/s`,
    windDirection: `${weather.current.wind_degree}° ${weather.current.wind_dir}`,
    visibility: weather.current.vis_km,
    humidity: `${weather.current.humidity}%`,
    dewPoint: Math.round(weather.current.dewpoint_c),
    futureForecast: weather.forecast.forecastday,
    dailyForecast: weather.forecast.forecastday[0],
    hourlyForecast: weather.forecast.forecastday[0].hour,
    cityTimezone: weather.location.tz_id,
    city: weather.location.name,
    longitude: weather.location.lon,
    latitude: weather.location.lat,
    sunrise: astronomy.astronomy.astro.sunrise,
    sunset: astronomy.astronomy.astro.sunset,
  };
  console.log(forecast, weather);
  return forecast;
}

// GET CURRENT HOUR
async function getCurrentHour(forecastData) {
  const timezone = forecastData.cityTimezone;
  const currentDay = new Date();
  const options = { hour: "numeric", timeZone: timezone, hour12: false };
  const currentHour = parseInt(
    new Intl.DateTimeFormat("default", options).format(currentDay)
  );
  return currentHour;
}

async function getDate(forecastData, currentDay) {
  const day = await forecastData.futureForecast[currentDay].date;
  const date = new Date(day);
  const name = date.toLocaleDateString(undefined, { weekday: "short" });
  return name;
}

async function setHomeUI(forecastData) {
  await setHeader(forecastData);
  await setSliderTrio(forecastData);
  await getRainMap(forecastData);
  await setFutureForecast(forecastData);
  setVisibility(forecastData);
  setHumidity(forecastData);
  setWind(forecastData);
  setAirQuality(forecastData);
  await getFeelsLike(forecastData);
  await setUvIndex(forecastData);
}

getWeather().then((forecastData) => {
  setHomeUI(forecastData);
});

export { getCurrentHour, getWeather, getDate };
