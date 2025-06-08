import {
  getClearConditions,
  getPartlyCloudyConditions,
  getSunnyConditions,
  getCloudyConditions,
  getRainyConditions,
  getSnowyConditions,
} from "../get-weather-conditions.js";

// ✅ REFACTORED
function getDate(forecastData, currentDay) {
  // to be used in the loop
  const day = forecastData.futureForecast[currentDay].date;
  const date = new Date(day);
  const name = date.toLocaleDateString("en-US", { weekday: "short" });

  return name;
}

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

function createWeatherIcon(forecastData, forecast, day) {
  const conditions = forecastData.futureForecast[
    forecast.indexOf(day)
  ].day.condition.text
    .trim()
    .toLowerCase();
  const iconContainer = document.createElement("div");
  iconContainer.classList.add("forecast-icon-container");
  const weatherIcon = document.createElement("img");
  weatherIcon.classList.add("weather-icon");
  iconContainer.appendChild(weatherIcon);

  weatherIcon.src = ""; // set empty icon to begin with to allow update

  if (getClearConditions().includes(conditions)) {
    weatherIcon.src = "../SVGs/clear-night.svg";
    weatherIcon.style.width = "12px";
    return iconContainer;
  }
  if (getPartlyCloudyConditions().includes(conditions)) {
    weatherIcon.src = "../SVGs/partly-sunny.svg";
    weatherIcon.style.width = "22px";
    return iconContainer;
  }

  if (getSunnyConditions().includes(conditions)) {
    weatherIcon.src = "../SVGs/sunny.svg";
    weatherIcon.style.width = "16px";
    return iconContainer;
  }
  if (getCloudyConditions().includes(conditions)) {
    weatherIcon.src = "../SVGs/cloudy.svg";
    return iconContainer;
  }
  if (getRainyConditions().includes(conditions)) {
    weatherIcon.src = "../SVGs/rainy.svg";
    return iconContainer;
  }
  if (getSnowyConditions().includes(conditions)) {
    weatherIcon.src = "../SVGs/snowy.svg";
    return iconContainer;
  }
  if (!weatherIcon.src) {
    console.warn("⚠️ No icon matched for condition:", conditions);
    return iconContainer;
  }
}
// function createWeatherIcon(forecastData, forecast, day) {
//   const conditions =
//     forecastData.futureForecast[forecast.indexOf(day)].day.condition.text;
//   const iconContainer = document.createElement("div");
//   iconContainer.classList.add("forecast-icon-container");
//   const weatherIcon = chooseWeatherIcon(conditions);
//   iconContainer.appendChild(weatherIcon);
//   return iconContainer;
// }

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
    const dayContainer = document.createElement("div");
    dayContainer.classList.add("horizontal-container");

    //📆 DISPLAY DAY
    const currentDayName = getDate(forecastData, forecast.indexOf(day));
    const dayName = createDayName(forecast, day, currentDayName);

    //🌥️ DISPLAY ICON
    const weatherIcon = createWeatherIcon(forecastData, forecast, day);

    //🟢 DISPLAY MINIMUM TEMPERATURE
    const forecastMinTemp = Math.round(
      forecastData.futureForecast[forecast.indexOf(day)].day.mintemp_c
    );
    const [minArrow, minTemp] = createMinimumTemp(forecastMinTemp);

    //🔴 DISPLAY MAXIMUM TEMPERATURE
    const forecastMaxTemp = Math.round(
      forecastData.futureForecast[forecast.indexOf(day)].day.maxtemp_c
    );
    const [maxArrow, maxTemp] = createMaximumTemp(forecastMaxTemp);

    dayContainer.append(
      dayName,
      weatherIcon,
      minArrow,
      minTemp,
      maxArrow,
      maxTemp
    );
    forecastContainer.appendChild(dayContainer);
  }
}

export { setFutureForecast };
