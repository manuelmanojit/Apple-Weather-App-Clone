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
function setHour(weatherContext, i) {
  const { forecastData, sunriseHour, sunsetHour, getNextHour } = weatherContext;

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

function setIconAttributes(weatherIcon, src, width = "18px") {
  weatherIcon.src = src;
  weatherIcon.style.width = width;
}

// ✅ REFACTORED
function setWeatherIcon(weatherContext, weatherConditions, nightStatus) {
  const { sunriseHour, sunsetHour, getNextHour } = weatherContext;

  const icon = document.createElement("img");
  icon.classList.add("weather-icon");

  const conditions = weatherConditions.trim().toLowerCase();

  // Set empty icon to begin with to allow update
  icon.src = "";

  if (getNextHour === sunriseHour) {
    setIconAttributes(icon, "../SVGs/sunrise.svg", "22px");
    return icon;
  }
  if (getNextHour === sunsetHour) {
    setIconAttributes(icon, "../SVGs/sunset.svg", "22px");
    return icon;
  }
  if (getClearConditions().includes(conditions)) {
    setIconAttributes(icon, "../SVGs/clear-night.svg", "12px");
    return icon;
  }
  if (getPartlyCloudyConditions().includes(conditions)) {
    if (nightStatus) setIconAttributes(icon, "../SVGs/partly-clear-night.svg");
    else if (!nightStatus) {
      setIconAttributes(icon, "../SVGs/partly-sunny.svg", "22px");
    }
    return icon;
  }
  if (getSunnyConditions().includes(conditions)) {
    setIconAttributes(icon, "../SVGs/sunny.svg", "16px");
    return icon;
  }
  if (getCloudyConditions().includes(conditions)) {
    setIconAttributes(icon, "../SVGs/cloudy.svg");
    return icon;
  }
  if (getRainyConditions().includes(conditions)) {
    setIconAttributes(icon, "../SVGs/rainy.svg");
    return icon;
  }
  if (getSnowyConditions().includes(conditions)) {
    setIconAttributes(icon, "../SVGs/snowy.svg");
    return icon;
  }
  if (!icon.src) {
    console.warn("No icon matched for:", conditions);
    setIconAttributes(icon, "../SVGs/partly-sunny.svg", "22px");
    return icon;
  }

  return icon;
}

// ✅ REFACTORED
function setTemperature(weatherContext) {
  const { forecastData, sunriseHour, sunsetHour, getNextHour } = weatherContext;
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

  const sunriseHour = getSunriseTime(forecastData);
  const sunsetHour = getSunsetTime(forecastData);

  // Clear the existing content by setting innerHTML to an empty string
  sliderContents.innerHTML = "";

  //Loop 24 times to generate one trio for each hour of the day
  for (let i = 0; i < 24; i++) {
    const sliderTrio = document.createElement("div");
    sliderTrio.classList.add("slider-trio");
    // Return the remainder of the modulus operation to ensure that the hour stays within the range of 0-23
    const getNextHour = (currentHour + i) % 24;
    //Arguments to pass to functions
    const context = {
      forecastData,
      getNextHour,
      sunriseHour,
      sunsetHour,
    };
    //⏰ GET TIME
    const sliderTime = setHour(context, i);
    //🌥️ DISPLAY ICON
    const night = isNight(forecastData, getNextHour);
    const conditions = forecastData.hourlyForecast[getNextHour].condition.text;
    const weatherIcon = setWeatherIcon(context, conditions, night);
    //🌡️ DISPLAY TEMPERATURE
    const sliderTemperature = setTemperature(context);

    sliderTrio.append(sliderTime, weatherIcon, sliderTemperature);
    sliderContents.appendChild(sliderTrio);
  }
}

export { setSliderTrio, setWeatherIcon };
