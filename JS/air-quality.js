async function getAirQuality(forecastData) {
  const aqi = forecastData.airQuality;
  const titleText = document.querySelector("#air-text");
  let title;
  if (aqi === 1) return (title = "Good");
  if (aqi === 2) return (title = "Moderate");
  if (aqi === 3) {
    title = "Unhealthy for Sensitive Groups";
    titleText.style.fontSize = "1rem";
  }
  if (aqi === 4) return (title = "Unhealthy");
  if (aqi === 5) return (title = "Very Unhealthy");
  if (aqi === 6) return (title = "Hazardous");
  console.warn("Invalid AQI value");
  return title;
}

async function getAqiCaption(forecastData) {
  const aqi = forecastData.airQuality;
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

async function makeBallMove(forecastData) {
  const aqi = forecastData.airQuality;
  const ball = document.querySelector(".air-anim-ball");
  if (aqi === 1) return (ball.style.left = "8.3%");
  if (aqi === 2) return (ball.style.left = "25%");
  if (aqi === 3) return (ball.style.left = "41.6%");
  if (aqi === 4) return (ball.style.left = "58.3%");
  if (aqi === 5) return (ball.style.left = "75%");
  if (aqi === 6) return (ball.style.left = "91.6%");
  console.warn("Invalid AQI value");
}

async function setAirQuality(forecastData) {
  const aqi = await getAirQuality(forecastData);
  const sentence = await getAqiCaption(forecastData);

  const airQuality = document.querySelector("#air-text");
  airQuality.textContent = aqi;

  makeBallMove(forecastData);

  const caption = document.querySelector("#air-caption");
  caption.textContent = sentence;
}

export { setAirQuality };
