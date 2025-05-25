import { getCurrentHour, formatTime } from "./main.js";
import { isNight, getSunriseTime, getSunsetTime } from "./day-or-night.js";
import {
  getClearConditions,
  getPartlyCloudyConditions,
  getSunnyConditions,
  getCloudyConditions,
  getRainyConditions,
  getSnowyConditions,
} from "./get-weather-conditions.js";

// ✅ REFACTORED
function getSunriseAndSunsetFullTime(forecastData) {
  // formatTime returns 24-hour time hh:mm format
  // "09:28 PM" becomes "21:28"
  const sunriseTime = forecastData.sunrise;
  const sunsetTime = forecastData.sunset;

  const sunrise = formatTime(sunriseTime);
  const sunset = formatTime(sunsetTime);

  return [sunrise, sunset];
}

// ✅ REFACTORED
function setHour(forecastData, getNextHour, i) {
  const sunriseHour = getSunriseTime(forecastData);
  const sunsetHour = getSunsetTime(forecastData);
  const [fullSunriseTime, fullSunsetTime] =
    getSunriseAndSunsetFullTime(forecastData);

  const time = document.createElement("p");
  time.classList.add("slider-time");

  //The current time is always "Now", and it is set to the first loop iteration
  if (i === 0) time.textContent = "Now";
  //The "05" or "19" hour is replaced with the hh:mm at sunrise/sunset time
  else if (getNextHour === sunriseHour) time.textContent = fullSunriseTime;
  else if (getNextHour === sunsetHour) time.textContent = fullSunsetTime;
  //The rest is set normally as 00 to 23
  else time.textContent = getNextHour.toString().padStart(2, "0");

  return time;
}

// ✅ REFACTORED
function setWeatherIcon(
  forecastData,
  getNextHour,
  weatherConditions,
  nightStatus
) {
  const sunriseHour = getSunriseTime(forecastData);
  const sunsetHour = getSunsetTime(forecastData);

  const weatherIcon = document.createElement("img");
  weatherIcon.classList.add("weather-icon");

  const conditions = weatherConditions.trim().toLowerCase();

  // Set empty icon to begin with to allow update
  weatherIcon.src = "";

  if (getNextHour === sunriseHour) {
    weatherIcon.src = "../SVGs/sunrise.svg";
    weatherIcon.style.width = "22px";
  } else if (getNextHour === sunsetHour) {
    weatherIcon.src = "../SVGs/sunset.svg";
    weatherIcon.style.width = "22px";
  } else if (getClearConditions().includes(conditions)) {
    weatherIcon.src = "../SVGs/clear-night.svg";
    weatherIcon.style.width = "12px";
  } else if (getPartlyCloudyConditions().includes(conditions)) {
    if (nightStatus) weatherIcon.src = "../SVGs/partly-clear-night.svg";
    else if (!nightStatus) {
      weatherIcon.src = "../SVGs/partly-sunny.svg";
      weatherIcon.style.width = "22px";
    }
  } else if (getSunnyConditions().includes(conditions)) {
    weatherIcon.src = "../SVGs/sunny.svg";
    weatherIcon.style.width = "16px";
  } else if (getCloudyConditions().includes(conditions)) {
    weatherIcon.src = "../SVGs/cloudy.svg";
  } else if (getRainyConditions().includes(conditions)) {
    weatherIcon.src = "../SVGs/rainy.svg";
  } else if (getSnowyConditions().includes(conditions)) {
    weatherIcon.src = "../SVGs/snowy.svg";
  } else if (!weatherIcon.src) {
    console.warn("No icon matched for:", conditions);
    weatherIcon.src = "../SVGs/partly-sunny.svg";
  }

  return weatherIcon;
}

// ✅ REFACTORED
function setTemperature(forecastData, getNextHour) {
  const sunriseHour = getSunriseTime(forecastData);
  const sunsetHour = getSunsetTime(forecastData);

  const temperature = document.createElement("p");
  temperature.classList.add("slider-temperature");

  if (getNextHour === sunriseHour) temperature.textContent = "Sunrise";
  else if (getNextHour === sunsetHour) temperature.textContent = "Sunset";
  else {
    temperature.textContent = `${Math.round(
      forecastData.hourlyForecast[getNextHour].temp_c
    )}°`;
  }
  return temperature;
}

// ✅ REFACTORED
function setSliderTrio(forecastData) {
  // Slider Trio: column-oriented flexbox consiting of:
  // 1. Time (top) 2. Weather icon (center) and 3. Temperature (bottom)
  const currentHour = getCurrentHour(forecastData);
  const sliderContents = document.querySelector(".slider-contents");

  // Clear the existing content by setting innerHTML to an empty string
  sliderContents.innerHTML = "";

  //Loop 24 times to generate one trio for each hour of the day
  for (let i = 0; i < 24; i++) {
    const sliderTrio = document.createElement("div");
    sliderTrio.classList.add("slider-trio");
    // Return the remainder of the modulus operation to ensure that the hour stays within the range of 0-23
    const getNextHour = (currentHour + i) % 24;

    //⏰ GET TIME
    const sliderTime = setHour(forecastData, getNextHour, i);

    //🌥️ DISPLAY ICON
    const night = isNight(forecastData, getNextHour);
    const conditions = forecastData.hourlyForecast[getNextHour].condition.text;
    const weatherIcon = setWeatherIcon(
      forecastData,
      getNextHour,
      conditions,
      night
    );

    //🌡️ DISPLAY TEMPERATURE
    const sliderTemperature = setTemperature(forecastData, getNextHour);

    sliderTrio.append(sliderTime, weatherIcon, sliderTemperature);
    sliderContents.appendChild(sliderTrio);
  }
}

export { setSliderTrio, setWeatherIcon };
