import { getCurrentHour } from "./main.js";
import { isNight } from "./day-or-night.js";

function getSunProtectionRequirement(forecastData) {
  const hourlyForecast = forecastData.hourlyForecast;
  const currentHour = getCurrentHour(forecastData);
  const night = isNight(forecastData);

  //loop through each of them and find uvindex
  const uvList = [];
  for (let hour of hourlyForecast) {
    uvList.push(Math.round(hour.uv));
  }
  const first = uvList.findIndex((uv) => uv >= 3);
  const last = uvList.findLastIndex((uv) => uv >= 3);

  const caption = document.querySelector("#uvindex-caption");

  if (!night) {
    if (currentHour < last) {
      caption.textContent = `Use sun protection ${first}:00 and ${last}:00.`;
    } else {
      caption.textContent = "Low UV for the rest of the day.";
    }
  } else if (night) {
    caption.textContent = "The sun is down right now.";
  }
}

function getUvIndexLevel(forecastData) {
  const uv = forecastData.uvIndex;

  if (uv >= 0 && uv <= 2) return "Low";
  if (uv >= 3 && uv <= 5) return "Moderate";
  if (uv >= 6 && uv <= 7) return "High";
  if (uv >= 8 && uv <= 10) return "Very High";
  if (uv >= 11) return "Extreme";

  console.warn("Invalid UV Index value");
  return "Unknown";
}

function makeBallMove(forecastData) {
  const uv = forecastData.uvIndex;
  const ball = document.querySelector(".uvindex-anim-ball");

  if (uv === 0) return (ball.style.left = "0%");
  if (uv >= 1 && uv <= 2) return (ball.style.left = "10%");
  if (uv >= 3 && uv <= 5) return (ball.style.left = "30%");
  if (uv >= 6 && uv <= 7) return (ball.style.left = "50%");
  if (uv >= 8 && uv <= 10) return (ball.style.left = "70%");
  if (uv >= 11) return (ball.style.left = "90%");

  console.warn("Invalid UV Index value");
}

function setUvIndex(forecastData) {
  const uvIndexNumber = forecastData.uvIndex;
  const uvText = getUvIndexLevel(forecastData);

  //Update numeric value
  const numberElement = document.querySelector("#uvindex-value-number");
  numberElement.textContent = uvIndexNumber;

  //Update descriptive text
  const textElement = document.querySelector("#uvindex-value-text");
  textElement.textContent = uvText;

  //Move animation ball
  makeBallMove(forecastData);
  //Tell the user when to use sun protection
  getSunProtectionRequirement(forecastData);
}

export { setUvIndex };
