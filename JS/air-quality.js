function getCachedAqi(aqi, city) {
  const cacheKey = `cachedAqi-${city.toLowerCase()}`;

  if (aqi >= 1 && aqi <= 6) {
    localStorage.setItem(cacheKey, aqi);
    return aqi;
  }

  const cached = localStorage.getItem(cacheKey);
  console.log(cached);

  if (cached !== null) {
    console.warn("Data missing or invalid. Using cached value as a fallback.");
    return parseInt(cached, 10);
  }

  console.warn("Data missing or invalid");
  return null;
}

function getAirQuality(forecastData) {
  const aqi = getCachedAqi(forecastData.airQuality, forecastData.city);
  if (!aqi) return;

  const titleText = document.querySelector("#air-text");
  let title;
  if (aqi === 1) return (title = "Good");
  if (aqi === 2) return (title = "Moderate");
  if (aqi === 3) {
    title = "Unhealthy for Sensitive Groups";
    titleText.style.fontSize = "1rem";
    return title;
  }
  if (aqi === 4) return (title = "Unhealthy");
  if (aqi === 5) return (title = "Very Unhealthy");
  if (aqi === 6) return (title = "Hazardous");
  console.warn("Invalid AQI value");
  return title;
}
function getAqiCaption(forecastData) {
  const aqi = getCachedAqi(forecastData.airQuality, forecastData.city);
  let resp;
  if (aqi === 1) return (resp = "Air quality is clean and poses little risk.");
  if (aqi === 2)
    return (resp = "Air quality is okay; sensitive groups stay alert.");
  if (aqi === 3)
    return (resp = "Sensitive people may feel effects; others okay.");
  if (aqi === 4)
    return (resp = "Everyone may feel effects; limit outdoor time.");
  if (aqi === 5)
    return (resp = "Health alert: avoid outdoor activity if possible.");
  if (aqi === 6)
    return (resp = "Serious risk: stay indoors and use protection.");
  console.warn("Invalid AQI value");
  return resp;
}

function makeBallMove(forecastData) {
  const aqi = getCachedAqi(forecastData.airQuality, forecastData.city);
  if (!aqi) return;
  const ball = document.querySelector(".air-anim-ball");
  //DIVIDED THE STRIPE IN 6 BLOCKS SINCE THERE ARE 6 VALUES, AND MADE THE BALL MOVE IN THE MIDDLE OF EACH OF THE 6 BLOCKS
  if (aqi === 1) return (ball.style.left = "8.3%");
  if (aqi === 2) return (ball.style.left = "25%");
  if (aqi === 3) return (ball.style.left = "41.6%");
  if (aqi === 4) return (ball.style.left = "58.3%");
  if (aqi === 5) return (ball.style.left = "75%");
  if (aqi === 6) return (ball.style.left = "91.6%");
  console.warn("Invalid AQI value");
}

function setAirQuality(forecastData) {
  const aqiTitle = getAirQuality(forecastData);
  const sentence = getAqiCaption(forecastData);

  const airQuality = document.querySelector("#air-text");
  airQuality.textContent = aqiTitle;

  makeBallMove(forecastData);

  const caption = document.querySelector("#air-caption");
  caption.textContent = sentence;
}

export { setAirQuality };
