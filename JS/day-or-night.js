//GET SUNRISE TIME
function getSunriseTime(forecastData) {
  // starts like "04:51 AM"
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
function getSunsetTime(forecastData) {
  const time = forecastData.sunset.slice(0, 2);
  const period = forecastData.sunset.slice(-2);

  if (period === "AM" && time === "12") {
    return 0;
  }
  if (period === "PM" && time !== "12") {
    return parseInt(time, 10) + 12;
  }
  return parseInt(time, 10);
}

function isNight(forecastData, hour) {
  const now = hour;
  const sunrise = getSunriseTime(forecastData);
  const sunset = getSunsetTime(forecastData);
  const verdict = now < sunrise || now > sunset;
  return verdict;
}

export { isNight, getSunriseTime, getSunsetTime };
