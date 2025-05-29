import { getCurrentHour, formatTime } from "./utility-functions.js";
import { isNight, getSunriseTime, getSunsetTime } from "./day-or-night.js";

const ball = document.querySelector(".sun-anim-ball");

function hideBall(forecastData, time) {
  const sunset = getSunsetTime(forecastData);
  ball.style.opacity = "0.75";
  if (time > sunset) return (ball.style.right = "calc(0% - 27.5px");
  ball.style.left = "calc(0% - 27.5px";
}

function getDayTime(forecastData) {
  const sunrise = getSunriseTime(forecastData);
  const sunset = getSunsetTime(forecastData);

  return sunset - sunrise;
}

function getTimeSinceSunrise(forecastData) {
  const currentTime = getCurrentHour(forecastData);
  const night = isNight(forecastData, currentTime);
  const sunrise = getSunriseTime(forecastData);

  if (night) return;

  return currentTime - sunrise;
}

function getPositionPercentage(forecastData) {
  //get percentage of time passed within the dayTime range so I can use it to determine ball position
  const dayTime = getDayTime(forecastData);
  const passedTime = getTimeSinceSunrise(forecastData);

  return (passedTime / dayTime) * 100;
}

function setSunriseAndSunset(forecastData) {
  const sunset = document.querySelector("#sunset-time");
  const sunrise = document.querySelector("#sunset-caption");

  const sunsetTime = forecastData.sunset;
  const sunriseTime = forecastData.sunrise;

  sunset.textContent = formatTime(sunsetTime);
  sunrise.textContent = `Sunrise: ${formatTime(sunriseTime)}`;
}

function moveSunBall(forecastData) {
  ball.style.left = "auto";
  ball.style.right = "auto";
  ball.style.opacity = "1";

  const currentTime = getCurrentHour(forecastData);
  const night = isNight(forecastData, currentTime);
  const percentage = getPositionPercentage(forecastData);

  const sunrise = getSunriseTime(forecastData);
  const sunset = getSunsetTime(forecastData);

  setSunriseAndSunset(forecastData);

  if (currentTime === sunrise) return (ball.style.left = "calc(0% - 5px");
  if (currentTime === sunset) return (ball.style.right = "calc(0% - 5px");

  if (night) return hideBall(forecastData, currentTime);
  else ball.style.left = `calc(${percentage}% - 5px)`;
}

export { moveSunBall };
