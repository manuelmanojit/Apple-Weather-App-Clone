import { getCurrentHour } from "./main.js";

//GET SUNRISE TIME
async function getSunriseTime(forecastData) {
  const time = forecastData.sunrise.slice(0, 2);
  //I CAN'T DO slice(6,8) BECAUSE STRING LENGTH MIGHT CHANGE
  const period = forecastData.sunrise.slice(-2);
  //HANDLE MIDNIGHT TIME
  if (period === "AM" && time === "12") {
    return 0;
  }
  //HANDLE 1PM TO 11PM
  if (period === "PM" && time !== "12") {
    let sunrise = parseInt(time, 10) + 12;
    return sunrise;
  }
  // FOR OTHER AM TIMES JUST RETURN THE HOUR
  return parseInt(time, 10);
}

//GET SUNSET TIME
async function getSunsetTime(forecastData) {
  const time = forecastData.sunset.slice(0, 2);
  //I CAN'T DO slice(6,8) BECAUSE STRING LENGTH MIGHT CHANGE
  const period = forecastData.sunset.slice(-2);
  //HANDLE MIDNIGHT TIME
  if (period === "AM" && time === "12") {
    return 0;
  }
  //HANDLE 1PM TO 11PM
  if (period === "PM" && time !== "12") {
    let sunset = parseInt(time, 10) + 12;
    return sunset;
  }
  console.log(time);
  // FOR OTHER AM TIMES JUST RETURN THE HOUR
  return parseInt(time, 10);
}

async function isNight(forecastData, hour) {
  //if the current hour is
  const now = hour;
  const sunrise = await getSunriseTime(forecastData);
  const sunset = await getSunsetTime(forecastData);
  const verdict = now < sunrise || now > sunset;
  console.log(verdict, now, sunrise, sunset);
  return verdict;
}

export { isNight };
