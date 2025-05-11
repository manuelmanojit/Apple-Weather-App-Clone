//GENERATE WEATHER OBJECT
async function getWeather() {
  const API = "138593b09da6432e891161652250905";
  let city = "Copenhagen";

  const search = document.querySelector(".search");
  search.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      city = search.value;
    }
  });

  const weatherURL = `https://api.weatherapi.com/v1/forecast.json?key=${API}&q=${city}&days=10&aqi=yes&alerts=no`;
  const astronomyURL = `https://api.weatherapi.com/v1/astronomy.json?key=${API}&q=${city}`;
  //WEATHER REQUEST
  const weatherResp = await fetch(weatherURL);
  if (!weatherResp.ok) {
    throw new Error("Network response not OK");
  }
  const weather = await weatherResp.json();
  //ASTRONOMY REQUEST
  const moonResp = await fetch(astronomyURL);
  if (!moonResp.ok) {
    throw new Error("Network response not OK");
  }
  const astronomy = await moonResp.json();
  //POPULATING FORECAST OBJECT TO USE FOR THE APP
  const forecast = {
    conditions: weather.current.condition.text,
    temperature: weather.current.temp_c,
    feelsLike: weather.current["feelslike_c"],
    airQuality: weather.current.air_quality["us-epa-index"],
    uvIndex: weather.current.uv,
    wind: weather.current.wind_kph,
    windDirection: weather.current.wind_dir,
    windDegree: weather.current.wind_degree,
    precipitation: weather.current.precip_mm,
    visibility: weather.current.vis_km,
    humidity: weather.current.humidity,
    sunrise: astronomy.astronomy.astro.sunrise,
    sunset: astronomy.astronomy.astro.sunset,
    dailyForecast: weather.forecast.forecastday[0],
    hourlyForecast: weather.forecast.forecastday[0].hour,
    timezone: weather.location.tz_id,
  };
  console.log(weather);
  return forecast;
}

// GET CURRENT HOUR
async function getCurrentHour() {
  const currentDay = new Date();
  const weather = await getWeather();
  const timezone = weather.timezone;
  const options = { hour: "numeric", timeZone: timezone, hour12: false };
  const currentHour = parseInt(
    new Intl.DateTimeFormat("default", options).format(currentDay)
  );
  console.log(currentHour, timezone);
  return currentHour;
}

getCurrentHour();

//GET SUNRISE TIME
async function getSunriseTime() {
  const forecast = await getWeather();
  const time = forecast.sunrise.slice(0, 2);
  //I CAN'T DO slice(6,8) BECAUSE STRING LENGTH MIGHT CHANGE
  const period = forecast.sunrise.slice(-2);
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
async function getSunsetTime() {
  const forecast = await getWeather();
  const time = forecast.sunset.slice(0, 2);
  //I CAN'T DO slice(6,8) BECAUSE STRING LENGTH MIGHT CHANGE
  const period = forecast.sunset.slice(-2);
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

function airQuality(air) {
  const aqi = air;
  let resp;
  if (aqi >= 0 && aqi <= 50) return (resp = "Good");
  if (aqi >= 51 && aqi <= 100) return (resp = "Moderate");
  if (aqi >= 101 && aqi <= 150)
    return (resp = "Unhealthy for Sensitive Groups");
  if (aqi >= 151 && aqi <= 200) return (resp = "Unhealthy");
  if (aqi >= 201 && aqi <= 300) return (resp = "Very Unhealthy");
  if (aqi >= 301 && aqi <= 500) return (resp = "Hazardous");
  resp = "Invalid AQI value";
  return resp;
}

async function isNight() {
  //if the current hour is
  const now = await getCurrentHour();
  const sunrise = await getSunriseTime();
  const sunset = await getSunsetTime();

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
  console.log(now, sunrise, sunset, verdict);
  return verdict;
}

export { getCurrentHour, getSunriseTime, getSunsetTime, getWeather, isNight };
