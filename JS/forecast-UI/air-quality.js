function getAirQuality(aqi) {
  const titleText = document.querySelector("#air-text");
  if (aqi === 1) return "Good";
  if (aqi === 2) return "Moderate";
  if (aqi === 3) {
    titleText.style.fontSize = "1rem";
    return "Unhealthy for Sensitive Groups";
  }
  if (aqi === 4) return "Unhealthy";
  if (aqi === 5) return "Very Unhealthy";
  if (aqi === 6) return "Hazardous";
  if (!aqi) console.warn("Invalid AQI value");
}

function getAqiCaption(aqi) {
  if (aqi === 1) return "Air quality is clean and poses little risk.";
  if (aqi === 2) return "Air quality is okay; sensitive groups stay alert.";
  if (aqi === 3) return "Sensitive people may feel effects; others okay.";
  if (aqi === 4) return "Everyone may feel effects; limit outdoor time.";
  if (aqi === 5) return "Health alert: avoid outdoor activity if possible.";
  if (aqi === 6) return "Serious risk: stay indoors and use protection.";
  if (!aqi) console.warn("Invalid AQI value");
}

function makeBallMove(aqi) {
  const ball = document.querySelector(".air-anim-ball");
  //DIVIDED THE STRIPE IN 6 BLOCKS SINCE THERE ARE 6 VALUES, AND MADE THE BALL MOVE IN THE MIDDLE OF EACH OF THE 6 BLOCKS
  if (aqi === 1) return (ball.style.left = "8.3%");
  if (aqi === 2) return (ball.style.left = "25%");
  if (aqi === 3) return (ball.style.left = "41.6%");
  if (aqi === 4) return (ball.style.left = "58.3%");
  if (aqi === 5) return (ball.style.left = "75%");
  if (aqi === 6) return (ball.style.left = "91.6%");
  if (!aqi) console.warn("Invalid AQI value");
}

function setAirQuality(forecastData) {
  const aqi = forecastData.airQuality;
  const aqiTitle = getAirQuality(aqi);
  const sentence = getAqiCaption(aqi);

  const airQuality = document.querySelector("#air-text");
  airQuality.textContent = aqiTitle;

  makeBallMove(aqi);

  const caption = document.querySelector("#air-caption");
  caption.textContent = sentence;
}

export { setAirQuality };
