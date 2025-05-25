import { getDate } from "./main.js";
import {
  getClearConditions,
  getPartlyCloudyConditions,
  getSunnyConditions,
  getCloudyConditions,
  getRainyConditions,
  getSnowyConditions,
} from "./get-weather-conditions.js";

function createDayName(forecast, day, currentDayName) {
  const dayName = document.createElement("span");
  dayName.classList.add("forecast-day");
  if (forecast.indexOf(day) !== 0) {
    dayName.textContent = currentDayName;
  } else {
    dayName.textContent = "Today";
  }

  return dayName;
}

function setWeatherIcon(conditions) {
  const weatherIcon = document.createElement("img");
  weatherIcon.classList.add("weather-icon");

  let iconSet = false; // track if an icon was matched
  const cond = conditions.trim().toLowerCase();

  weatherIcon.src = ""; // set empty icon to begin with to allow update

  if (getClearConditions().includes(cond)) {
    weatherIcon.src = "../SVGs/clear-night.svg";
    weatherIcon.style.width = "12px";
    iconSet = true;
  }
  if (getPartlyCloudyConditions().includes(cond)) {
    weatherIcon.src = "../SVGs/partly-sunny.svg";
    weatherIcon.style.width = "22px";
    iconSet = true;
  }

  if (getSunnyConditions().includes(cond)) {
    weatherIcon.src = "../SVGs/sunny.svg";
    weatherIcon.style.width = "16px";
    iconSet = true;
  }
  if (getCloudyConditions().includes(cond)) {
    weatherIcon.src = "../SVGs/cloudy.svg";
    iconSet = true;
  }
  if (getRainyConditions().includes(cond)) {
    weatherIcon.src = "../SVGs/rainy.svg";
    iconSet = true;
  }
  if (getSnowyConditions().includes(cond)) {
    weatherIcon.src = "../SVGs/snowy.svg";
    iconSet = true;
  }
  if (!iconSet) {
    console.warn("⚠️ No icon matched for condition:", cond);
  }

  return weatherIcon;
}

function createWeatherIcon(forecastData, forecast, day) {
  const conditions =
    forecastData.futureForecast[forecast.indexOf(day)].day.condition.text;
  const iconContainer = document.createElement("div");
  iconContainer.classList.add("forecast-icon-container");
  const weatherIcon = setWeatherIcon(conditions);
  iconContainer.appendChild(weatherIcon);
  return iconContainer;
}

function createMinimumTemp(forecastMinTemp) {
  //"MIN" ARROW
  const minArrow = document.createElement("span");
  minArrow.classList.add("material-symbols-outlined", "temperature-down-arrow");
  const minText = document.createTextNode("arrow_drop_down");
  minArrow.appendChild(minText);
  //ACTUAL TEMPERATURE
  const minTemp = document.createElement("span");
  minTemp.classList.add("min-temperature");
  const minTempText = document.createTextNode(`${forecastMinTemp}°`);
  minTemp.appendChild(minTempText);
  return [minArrow, minTemp];
}

function createMaximumTemp(forecastMaxTemp) {
  //"MAX" ARROW
  const maxArrow = document.createElement("span");
  maxArrow.classList.add("material-symbols-outlined", "temperature-up-arrow");
  const maxText = document.createTextNode("arrow_drop_up");
  maxArrow.appendChild(maxText);
  //ACTUAL TEMPERATURE
  const maxTemp = document.createElement("span");
  maxTemp.classList.add("max-temperature");
  const maxTempText = document.createTextNode(`${forecastMaxTemp}°`);
  maxTemp.appendChild(maxTempText);

  return [maxArrow, maxTemp];
}

function setFutureForecast(forecastData) {
  //STORE FORECAST ARRAY
  const forecast = forecastData.futureForecast;
  const forecastContainer = document.querySelector(".forecast-container");

  forecastContainer.innerHTML = "";

  for (const day of forecast) {
    //SEPARATE HORIZONTAL CONTAINERS
    if (forecast.indexOf(day) !== 0) {
      const hr = document.createElement("hr");
      forecastContainer.appendChild(hr);
    }
    //CREATE MAIN CONTAINER
    const horizontalContainer = document.createElement("div");
    horizontalContainer.classList.add("horizontal-container");

    //📆 DISPLAY DAY
    const currentDayName = getDate(forecastData, forecast.indexOf(day));
    const dayName = createDayName(forecast, day, currentDayName);
    horizontalContainer.appendChild(dayName);

    //🌥️ DISPLAY ICON
    const weatherIcon = createWeatherIcon(forecastData, forecast, day);
    horizontalContainer.appendChild(weatherIcon);

    //🟢 DISPLAY MINIMUM TEMPERATURE
    const forecastMinTemp = Math.round(
      forecastData.futureForecast[forecast.indexOf(day)].day.mintemp_c
    );
    const [minArrow, minTemp] = createMinimumTemp(forecastMinTemp);
    horizontalContainer.appendChild(minArrow);
    horizontalContainer.appendChild(minTemp);

    //🔴 DISPLAY MAXIMUM TEMPERATURE
    const forecastMaxTemp = Math.round(
      forecastData.futureForecast[forecast.indexOf(day)].day.maxtemp_c
    );
    const [maxArrow, maxTemp] = createMaximumTemp(forecastMaxTemp);
    horizontalContainer.appendChild(maxArrow);
    horizontalContainer.appendChild(maxTemp);

    //APPEND TO MAIN CONTAINER
    forecastContainer.appendChild(horizontalContainer);
  }
}

export { setFutureForecast };
