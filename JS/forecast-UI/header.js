function setHeader(forecastData) {
  const city = document.querySelector("header .city");
  city.textContent = forecastData.city;

  const temperature = document.querySelector("header .temperature");
  temperature.textContent = `${forecastData.temperature}°`;

  const condition = document.querySelector("header .condition");
  condition.textContent = forecastData.conditions;

  const maxTemp = document.querySelector(".max-min .max");
  maxTemp.textContent = `${forecastData.tempMax}°`;

  const minTemp = document.querySelector(".max-min .min");
  minTemp.textContent = `${forecastData.tempMin}°`;
}

export { setHeader };
