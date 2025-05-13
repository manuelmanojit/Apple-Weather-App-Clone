import { getCurrentHour } from "./main.js";

//GET SUNRISE TIME
async function getSunriseTime(forecastData) {
  const time = forecastData.sunrise.slice(0, 2);
  //I CAN'T DO slice(6,8) BECAUSE STRING LENGTH MIGHT CHANGE
  const period = forecastData.sunrise.slice(-2);
  //HANDLE MIDNIGHT TIME
  if (period === "AM" && time === "12") {
    return "00";
  }
  //HANDLE 1PM TO 11PM
  if (period === "PM" && time !== "12") {
    let sunrise = (parseInt(time) + 12).toString().padStart(2, "0");
    return sunrise;
  }
  // FOR OTHER AM TIMES JUST RETURN THE HOUR
  return time;
}

//GET SUNSET TIME
async function getSunsetTime(forecastData) {
  const time = forecastData.sunset.slice(0, 2);
  //I CAN'T DO slice(6,8) BECAUSE STRING LENGTH MIGHT CHANGE
  const period = forecastData.sunset.slice(-2);
  //HANDLE MIDNIGHT TIME
  if (period === "AM" && time === "12") {
    return "00";
  }
  //HANDLE 1PM TO 11PM
  if (period === "PM" && time !== "12") {
    let sunset = (parseInt(time) + 12).toString().padStart(2, "0");
    return sunset;
  }
  // FOR OTHER AM TIMES JUST RETURN THE HOUR
  return time;
}

async function isNight(forecastData) {
  //if the current hour is
  const now = await getCurrentHour(forecastData);
  const sunrise = await getSunriseTime(forecastData);
  const sunset = await getSunsetTime(forecastData);

  let verdict;

  if (sunset !== 0 && sunrise !== 0) {
    if ((now >= 0 && now < sunrise) || (now > sunset && now <= 23)) {
      verdict = true;
    } else {
      verdict = false;
    }
  }
  if (sunset === 0) {
    if (now > sunset && now < sunrise) {
      verdict = true;
    } else {
      verdict = false;
    }
  }
  if (sunrise === 0) {
    if (now > sunset && now <= 23) {
      verdict = true;
    } else {
      verdict = false;
    }
  }
  return verdict;
}

export { isNight };
