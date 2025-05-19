function setHumidity(forecastData) {
  const humidity = document.querySelector("#humidity-percentage");
  humidity.textContent = forecastData.humidity;

  const caption = document.querySelector("#humidity-caption");
  caption.textContent = `The dew point is ${forecastData.dewPoint}° right now.`;
}

export { setHumidity };
