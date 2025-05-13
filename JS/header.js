import { getWeather } from "./main.js";

async function setHeader(forecastData) {
  const forecast = await getWeather();

  const city = document.querySelector("header .city");
  const text = document.createTextNode(forecast.city);
  city.appendChild(text);
  console.log(text);
}

export { setHeader };
