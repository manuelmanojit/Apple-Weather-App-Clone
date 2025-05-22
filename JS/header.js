async function setHeader(forecastData) {
  const city = document.querySelector("header .city");
  city.innerHTML = "";
  const cityText = document.createTextNode(forecastData.city);
  city.appendChild(cityText);

  const temperature = document.querySelector("header .temperature");
  temperature.innerHTML = "";
  const tempText = document.createTextNode(`${forecastData.temperature}°`);
  temperature.appendChild(tempText);

  const condition = document.querySelector("header .condition");
  condition.innerHTML = "";
  const condText = document.createTextNode(forecastData.conditions);
  condition.appendChild(condText);

  const maxTemp = document.querySelector(".max-min .max");
  maxTemp.innerHTML = "";
  const maxText = document.createTextNode(`${forecastData.tempMax}°`);
  maxTemp.appendChild(maxText);

  const minTemp = document.querySelector(".max-min .min");
  minTemp.innerHTML = "";
  const minText = document.createTextNode(`${forecastData.tempMin}°`);
  minTemp.appendChild(minText);
}

export { setHeader };
