function setWind(forecastData) {
  const windSpeed = document.querySelector(".wind-speed .wind-value");
  windSpeed.textContent = forecastData.windSpeed;

  const windGusts = document.querySelector(".wind-gusts .wind-value");
  windGusts.textContent = forecastData.windGusts;

  const windDirection = document.querySelector(".wind-direction .wind-value");
  windDirection.textContent = forecastData.windDirection;
}

export { setWind };
