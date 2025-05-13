import { setSliderTrio } from "./Slider-card.js";
import { setHeader } from "./header.js";

const search = document.querySelector(".search");
//THIS IS UPDATING ON GETWEATHER, NOT REQUESTWEATHER
search.addEventListener("keydown", async (e) => {
  if (e.key === "Enter") {
    let newCity = search.value;
    const forecast = await getWeather(newCity);
    await setHomeUI(forecast);
    console.log(newCity);
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
    temperature: weather.current.temp_c,
    feelsLike: weather.current["feelslike_c"],
    airQuality: weather.current.air_quality["us-epa-index"],
    uvIndex: weather.current.uv,
    wind: weather.current.wind_kph,
    windDirection: weather.current.humidity,
    sunrise: astronomy.astronomy.astro.sunrise,
    sunset: astronomy.astronomy.astro.sunset,
    dailyForecast: weather.forecast.forecastday[0],
    hourlyForecast: weather.forecast.forecastday[0].hour,
    timezone: weather.location.tz_id,
    city: weather.location.name,
  };
  console.log(weather);
  // console.log(forecast);
  return forecast;
}

// GET CURRENT HOUR
async function getCurrentHour(forecastData) {
  const currentDay = new Date();
  const timezone = await forecastData.timezone;
  const options = { hour: "numeric", timeZone: timezone, hour12: false };
  const currentHour = parseInt(
    new Intl.DateTimeFormat("default", options).format(currentDay)
  );
  return currentHour;
}

async function setHomeUI(forecastData) {
  console.log(forecastData);
  await setHeader(forecastData);
  await setSliderTrio(forecastData);
}

getWeather().then((forecastData) => {
  setHomeUI(forecastData);
});

export { getCurrentHour, getWeather };
