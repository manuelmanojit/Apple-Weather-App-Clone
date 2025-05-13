import { getCurrentHour, getWeather } from "./main.js";
import { isNight } from "./day-or-night.js";

function generateHour(nextHour, i) {
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

function generateIcon(nextHour, conditions, isNight) {
  const sliderIcon = document.createElement("img");
  sliderIcon.classList.add("slider-icon");

  let iconSet = false; // track if an icon was matched

  const cond = conditions.trim().toLowerCase();

  sliderIcon.src = "";
  if (cond === "clear") {
    sliderIcon.src = "../SVGs/clear-night.svg";
    sliderIcon.style.width = "12px";
    iconSet = true;
  }

  if (cond === "partly cloudy") {
    if (!isNight) {
      sliderIcon.src = "../SVGs/partly-sunny.svg";
      sliderIcon.style.width = "22px";
    } else if (isNight) {
      sliderIcon.src = "../SVGs/partly-clear-night.svg";
    }
    iconSet = true;
  }

  if (cond === "sunny") {
    sliderIcon.src = "../SVGs/sunny.svg";
    sliderIcon.style.width = "16px";
    iconSet = true;
  }

  if (
    cond === "cloudy" ||
    cond === "overcast" ||
    cond === "mist" ||
    cond === "fog" ||
    cond === "freezing fog" ||
    cond === "thundery outbreaks possible"
  ) {
    sliderIcon.src = "../SVGs/cloudy.svg";
    iconSet = true;
  }

  if (
    cond === "patchy rain possible" ||
    cond === "patchy rain nearby" ||
    cond === "patchy light drizzle" ||
    cond === "light drizzle" ||
    cond === "freezing drizzle" ||
    cond === "heavy freezing drizzle" ||
    cond === "patchy light rain" ||
    cond === "light rain" ||
    cond === "moderate rain at times" ||
    cond === "moderate rain" ||
    cond === "heavy rain at times" ||
    cond === "heavy rain" ||
    cond === "light freezing rain" ||
    cond === "moderate or heavy freezing rain" ||
    cond === "light sleet" ||
    cond === "moderate or heavy sleet" ||
    cond === "light rain shower" ||
    cond === "moderate or heavy rain shower" ||
    cond === "torrential rain shower" ||
    cond === "light sleet showers" ||
    cond === "moderate or heavy sleet showers" ||
    cond === "patchy sleet possible" ||
    cond === "patchy freezing drizzle possible" ||
    cond === "thundery outbreaks in nearby" ||
    cond === "patchy light rain with thunder" ||
    cond === "moderate or heavy rain with thunder" ||
    cond === "patchy light snow with thunder" ||
    cond === "moderate or heavy snow with thunder"
  ) {
    sliderIcon.src = "../SVGs/rainy.svg";
    iconSet = true;
  }

  if (
    cond === "patchy snow possible" ||
    cond === "patchy light snow" ||
    cond === "light snow" ||
    cond === "patchy moderate snow" ||
    cond === "moderate snow" ||
    cond === "patchy heavy snow" ||
    cond === "heavy snow" ||
    cond === "light snow showers" ||
    cond === "moderate or heavy snow showers" ||
    cond === "blowing snow" ||
    cond === "blizzard" ||
    cond === "ice pellets" ||
    cond === "light showers of ice pellets" ||
    cond === "moderate or heavy showers of ice pellets"
  ) {
    sliderIcon.src = "../SVGs/snowy.svg";
    iconSet = true;
  }
  if (!iconSet) {
    console.warn("⚠️ No icon matched for condition:", cond);
  }

  return sliderIcon;
}

function generateTemperature(forecastData, nextHour) {
  const sliderTemperature = document.createElement("p");
  sliderTemperature.classList.add("slider-temperature");
  const temperatureText = document.createTextNode(
    `${Math.round(forecastData.hourlyForecast[parseInt(nextHour)].temp_c)}°`
  );
  sliderTemperature.appendChild(temperatureText);
  return sliderTemperature;
}

async function setSliderTrio(forecastData) {
  const currentHour = await getCurrentHour(forecastData);
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
    const sliderTime = generateHour(nextHour, i);
    //🌥️ DISPLAY ICON
    const night = await isNight(forecastData);
    const conditions =
      forecastData.hourlyForecast[parseInt(nextHour)].condition.text;

    const sliderIcon = generateIcon(nextHour, conditions, night);
    //🌡️ DISPLAY TEMPERATURE
    const sliderTemperature = generateTemperature(forecastData, nextHour);

    //APPEND CONTENTS TO TRIO
    sliderTrio.append(sliderTime, sliderIcon, sliderTemperature);
    //APPEND TRIO CONTAINER TO SLIDER CONTAINER
    sliderContents.appendChild(sliderTrio);
  }
}

export { setSliderTrio };
