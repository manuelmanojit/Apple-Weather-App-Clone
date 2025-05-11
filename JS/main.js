function getCurrentHour() {
  const currentDay = new Date();
  const currentHour = currentDay.getHours();
  return currentHour;
}

async function getWeather() {
  const API = "138593b09da6432e891161652250905";
  const city = "Copenhagen";
  const weatherURL = `https://api.weatherapi.com/v1/forecast.json?key=${API}&q=${city}&days=10&aqi=yes&alerts=no`;
  const astronomyURL = `https://api.weatherapi.com/v1/astronomy.json?key=${API}&q=${city}`;

  //WITH .then() I HANDLE THE PROMISE DIRECTLY INSIDE OF IT, SO I DON'T STORE IT IN A VARIABLE
  const weatherResp = await fetch(weatherURL);
  if (!weatherResp.ok) {
    throw new Error("Network response not OK");
  }
  const weather = await weatherResp.json();

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
    windDirection: weather.current.wind_dir,
    windDegree: weather.current.wind_degree,
    precipitation: weather.current.precip_mm,
    visibility: weather.current.vis_km,
    humidity: weather.current.humidity,
    sunrise: astronomy.astronomy.astro.sunrise,
    sunset: astronomy.astronomy.astro.sunset,
    dailyForecast: weather.forecast.forecastday[0],
    hourlyForecast: weather.forecast.forecastday[0].hour,
  };
  console.log(forecast);
  // console.log(astronomy);
  return forecast;
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

getSunsetTime(getWeather());

async function generateSliderTrio() {
  // const conditions = await getWeatherByCity();
  const forecast = await getWeather();
  const sunset = await getSunsetTime();
  const sunrise = await getSunriseTime();

  //GET SLIDER CONTAINER
  const sliderContents = document.querySelector(".slider-contents");

  //LOOP 24 TIMES TO GENERATE ONE DISPLAY FOR EACH HOUR OF THE DAY
  for (let i = 0; i < 24; i++) {
    //CREATE SLIDER TRIO
    const sliderTrio = document.createElement("div");
    //SET ATTRIBUTE TO SLIDER TRIO
    sliderTrio.classList.add("slider-trio");
    //DISPLAY TIME
    const sliderTime = document.createElement("p");
    sliderTime.classList.add("slider-time");
    //MAKE TIME INCREASE BY ONE HOUR AT EACH LOOP
    const getNextHour = (getCurrentHour() + i) % 24;
    //ADD A "0" AT THE BEGINNING OF EACH SINGLE NUMBER
    const nextHour = getNextHour.toString().padStart(2, "0");
    //UPDATE TIME DYNAMICALLY
    let timeText = document.createTextNode("");
    //THE CURRENT (FIRST) HOUR IS ALWAYS "NOW"
    if (i === 0) {
      timeText.nodeValue = "Now";
    } else {
      timeText.nodeValue = nextHour;
    }
    sliderTime.appendChild(timeText);

    //DISPLAY ICON
    const conditions =
      forecast.hourlyForecast[parseInt(nextHour)].condition.text;
    console.log(conditions);
    const sliderIcon = document.createElement("img");
    sliderIcon.classList.add("slider-icon");
    if (
      nextHour > parseInt(sunset) &&
      nextHour < parseInt(sunrise) &&
      conditions === "Clear"
    ) {
      sliderIcon.src = "../SVGs/clear-night.svg";
      sliderIcon.style.width = "12px";
    }

    if (
      nextHour > parseInt(sunset) &&
      nextHour < parseInt(sunrise) &&
      conditions === "Partly cloudy"
    ) {
      sliderIcon.src = "../SVGs/partly-clear-night.svg";
    }

    if (
      conditions === "Clear" ||
      (conditions === "Sunny" &&
        nextHour < parseInt(sunset) &&
        nextHour > parseInt(sunrise))
    ) {
      sliderIcon.src = "../SVGs/sunny.svg";
      sliderIcon.style.width = "16px";
    }

    if (conditions === "Partly cloudy") {
      sliderIcon.src = "../SVGs/partly-sunny.svg";
      sliderIcon.style.width = "22px";
    }

    if (
      conditions === "Cloudy" ||
      conditions === "Overcast" ||
      conditions === "Mist" ||
      conditions === "Fog" ||
      conditions === "Freezing fog" ||
      conditions === "Thundery outbreaks possible"
    ) {
      sliderIcon.src = "../SVGs/cloudy.svg";
    }

    if (
      conditions === "Patchy rain possible" ||
      conditions === "Patchy light drizzle" ||
      conditions === "Light drizzle" ||
      conditions === "Freezing drizzle" ||
      conditions === "Heavy freezing drizzle" ||
      conditions === "Patchy light rain" ||
      conditions === "Light rain" ||
      conditions === "Moderate rain at times" ||
      conditions === "Moderate rain" ||
      conditions === "Heavy rain at times" ||
      conditions === "Heavy rain" ||
      conditions === "Light freezing rain" ||
      conditions === "Moderate or heavy freezing rain" ||
      conditions === "Light sleet" ||
      conditions === "Moderate or heavy sleet" ||
      conditions === "Light rain shower" ||
      conditions === "Moderate or heavy rain shower" ||
      conditions === "Torrential rain shower" ||
      conditions === "Light sleet showers" ||
      conditions === "Moderate or heavy sleet showers" ||
      conditions === "Patchy sleet possible" ||
      conditions === "Patchy freezing drizzle possible" ||
      conditions === "Patchy light rain with thunder" ||
      conditions === "Moderate or heavy rain with thunder" ||
      conditions === "Patchy light snow with thunder" ||
      conditions === "Moderate or heavy snow with thunder"
    ) {
      sliderIcon.src = "../SVGs/rainy.svg";
    }

    if (
      conditions === "Patchy snow possible" ||
      conditions === "Patchy light snow" ||
      conditions === "Light snow" ||
      conditions === "Patchy moderate snow" ||
      conditions === "Moderate snow" ||
      conditions === "Patchy heavy snow" ||
      conditions === "Heavy snow" ||
      conditions === "Light snow showers" ||
      conditions === "Moderate or heavy snow showers" ||
      conditions === "Blowing snow" ||
      conditions === "Blizzard" ||
      conditions === "Ice pellets" ||
      conditions === "Light showers of ice pellets" ||
      conditions === "Moderate or heavy showers of ice pellets"
    ) {
      sliderIcon.src = "../SVGs/snowy.svg";
    }

    //DISPLAY TEMPERATURE
    const sliderTemperature = document.createElement("p");
    sliderTemperature.classList.add("slider-temperature");
    const temperatureText = document.createTextNode(
      `${Math.round(forecast.hourlyForecast[parseInt(nextHour)].temp_c)}°`
    );
    sliderTemperature.appendChild(temperatureText);

    //APPEND CONTENTS TO TRIO
    sliderTrio.append(sliderTime, sliderIcon, sliderTemperature);
    //APPEND TRIO CONTAINER TO SLIDER CONTAINER
    sliderContents.appendChild(sliderTrio);
    console.log(nextHour);
  }
}

function setSliderIcon() {}

generateSliderTrio(getWeather());
