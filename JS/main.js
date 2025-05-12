import { setSliderTrio } from "./Slider-card.js";

const search = document.querySelector(".search");
//THIS IS UPDATING ON GETWEATHER, NOT REQUESTWEATHER
search.addEventListener("keydown", async (e) => {
  if (e.key === "Enter") {
    let newCity = search.value;
    const forecast = await getWeather(newCity);
    await setSliderTrio(forecast);
    console.log(newCity);
  }
});

async function getWeather(city = "copenhagen") {
  const API = "138593b09da6432e891161652250905";
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

  const forecast = {
    conditions: weather.current.condition.text,
    temperature: weather.current.temp_c,
    feelsLike: weather.current["feelslike_c"],
    airQuality: weather.current.air_quality["us-epa-index"],
    uvIndex: weather.current.uv,
    wind: weather.current.wind_kph,
    windDirection: weather.current.humidity,
    sunrise: astronomy.astronomy.astro.sunrise,
    sunset: astronomy.astronomy.astro.sunset,
    dailyForecast: weather.forecast.forecastday[0],
    hourlyForecast: weather.forecast.forecastday[0].hour,
    timezone: weather.location.tz_id,
  };
  // console.log(weather);
  // console.log(forecast);
  return forecast;
}

// GET CURRENT HOUR
async function getCurrentHour(forecastData) {
  const currentDay = new Date();
  const timezone = await forecastData.timezone;
  const options = { hour: "numeric", timeZone: timezone, hour12: false };
  const currentHour = parseInt(
    new Intl.DateTimeFormat("default", options).format(currentDay)
  );
  return currentHour;
}

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

export { getCurrentHour, getSunriseTime, getSunsetTime, getWeather, isNight };
