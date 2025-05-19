import { getCurrentHour, getWeather } from "./main.js";
import { isNight } from "./day-or-night.js";
import {
  getClearConditions,
  getPartlyCloudyConditions,
  getSunnyConditions,
  getCloudyConditions,
  getRainyConditions,
  getSnowyConditions,
} from "./get-weather-conditions.js";

function setHour(nextHour, i) {
  const time = document.createElement("p");
  time.classList.add("slider-time");
  //UPDATE TIME DYNAMICALLY
  let timeText = document.createTextNode("");
  //THE CURRENT (FIRST) HOUR IS ALWAYS "NOW"
  if (i === 0) {
    timeText.nodeValue = "Now";
  } else {
    timeText.nodeValue = nextHour;
  }
  time.appendChild(timeText);
  return time;
}

function setWeatherIcon(conditions, isNight) {
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
    if (!isNight) {
      weatherIcon.src = "../SVGs/partly-sunny.svg";
      weatherIcon.style.width = "22px";
    } else if (isNight) {
      weatherIcon.src = "../SVGs/partly-clear-night.svg";
    }
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

function setTemperature(forecastData, nextHour) {
  const sliderTemperature = document.createElement("p");
  sliderTemperature.classList.add("slider-temperature");
  const temperatureText = document.createTextNode(
    `${Math.round(forecastData.hourlyForecast[parseInt(nextHour)].temp_c)}°`
  );
  sliderTemperature.appendChild(temperatureText);
  return sliderTemperature;
}

async function setSliderTrio(forecastData) {
  const currentHour = await getCurrentHour(forecastData.cityTimezone);
  const sliderContents = document.querySelector(".slider-contents");

  // Clear the existing content by setting innerHTML to an empty string
  sliderContents.innerHTML = "";

  //LOOP 24 TIMES TO GENERATE ONE DISPLAY FOR EACH HOUR OF THE DAY
  for (let i = 0; i < 24; i++) {
    //CREATE SLIDER TRIO
    const sliderTrio = document.createElement("div");
    sliderTrio.classList.add("slider-trio");
    //MAKE TIME INCREASE BY "i" AT EACH LOOP (first is time + 0)
    const getNextHour = (currentHour + i) % 24;
    //ADD A "0" AT THE BEGINNING OF EACH SINGLE NUMBER
    const nextHour = getNextHour.toString().padStart(2, "0");

    //⏰ GET TIME
    const sliderTime = setHour(nextHour, i);
    //🌥️ DISPLAY ICON
    const night = await isNight(forecastData);
    const conditions =
      forecastData.hourlyForecast[parseInt(nextHour)].condition.text;
    const weatherIcon = setWeatherIcon(conditions, night);
    //🌡️ DISPLAY TEMPERATURE
    const sliderTemperature = setTemperature(forecastData, nextHour);
    //APPEND CONTENTS TO TRIO
    sliderTrio.append(sliderTime, weatherIcon, sliderTemperature);
    //APPEND TRIO CONTAINER TO SLIDER CONTAINER
    sliderContents.appendChild(sliderTrio);
  }
}

export { setSliderTrio, setWeatherIcon };
