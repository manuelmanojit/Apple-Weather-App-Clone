import {
  getClearConditions,
  getPartlyCloudyConditions,
  getSunnyConditions,
  getCloudyConditions,
  getRainyConditions,
  getSnowyConditions,
} from "./get-weather-conditions.js";
import { isNight } from "./day-or-night.js";
import { getCurrentHour } from "./utility-functions.js";

const navBar = document.querySelector(".navbar");
const container = document.querySelector("#main-container");
const cards = document.querySelectorAll(".cards");
const headerConditions = document.querySelector(".condition");

function setBackground(forecastData) {
  const cond = forecastData.conditions.toLowerCase();
  const time = getCurrentHour(forecastData);
  const night = isNight(forecastData, time);
  console.log(night === true);

  // Reset styles before setting new ones
  navBar.style.backgroundColor = "";
  headerConditions.style.color = "";
  headerConditions.style.textShadow = "";
  cards.forEach((card) => (card.style.backgroundColor = ""));

  if (getClearConditions().includes(cond)) {
    container.style.backgroundImage = 'url("../IMGs/night-sky-clear.png")';
    navBar.style.backgroundColor = "#132034";
    return;
  }
  if (getPartlyCloudyConditions().includes(cond)) {
    if (!night) {
      container.style.backgroundImage = 'url("../IMGs/partly-cloudy-sky.png")';
      headerConditions.style.color = "rgba(86, 131, 166, 0.85)";
      headerConditions.style.textShadow =
        "1px 1px 5px rgba(255, 255, 255, 0.3)";
      navBar.style.backgroundColor = "#4574a5";
    } else if (night) {
      container.style.backgroundImage = 'url("../IMGs/night-sky-cloudy.png")';
      headerConditions.style.color = "rgba(255, 255, 255, 0.65)";
      headerConditions.style.textShadow = "none";
      navBar.style.backgroundColor = "#10213f";
    }
    return;
  }

  if (getSunnyConditions().includes(cond)) {
    container.style.backgroundImage = 'url("../IMGs/sunny-sky.png")';
    navBar.style.backgroundColor = "#2b5e99";
    return;
  }
  if (getCloudyConditions().includes(cond)) {
    if (!night) {
      container.style.backgroundImage = 'url("../IMGs/cloudy-sky.png")';
      headerConditions.style.color = "rgba(255, 255, 255, 0.85)";
      navBar.style.backgroundColor = "#596470";
      cards.forEach(
        (card) => (card.style.backgroundColor = "rgba(30, 30, 30, 0.25)")
      );
    } else if (night) {
      container.style.backgroundImage = 'url("../IMGs/night-sky-cloudy.png")';
      headerConditions.style.color = "rgba(255, 255, 255, 0.65)";
      headerConditions.style.textShadow = "none";
      navBar.style.backgroundColor = "#10213f";
    }
    return;
  }
  if (getRainyConditions().includes(cond)) {
    if (!night) {
      container.style.backgroundImage = 'url("../IMGs/rainy-sky.png")';
      headerConditions.style.color = "rgba(255, 255, 255, 0.85)";
      navBar.style.backgroundColor = "#616770";
      cards.forEach(
        (card) => (card.style.backgroundColor = "rgba(30, 30, 30, 0.25)")
      );
    } else if (night) {
      container.style.backgroundImage = 'url("../IMGs/night-sky-rainy.png")';
      navBar.style.backgroundColor = "#192347";
      cards.forEach(
        (card) => (card.style.backgroundColor = "rgba(30, 30, 30, 0.25)")
      );
    }
    return;
  }
  if (getSnowyConditions().includes(cond)) {
    container.style.backgroundImage = 'url("../IMGs/rainy-sky.png")';
    navBar.style.backgroundColor = "#616770";
    return;
  }

  //fallback
  container.style.backgroundImage = 'url("../IMGs/partly-cloudy-sky.png")';
  navBar.style.backgroundColor = "#4574a5";

  console.warn("⚠️ No image matched for condition:", cond);
}

export { setBackground };
