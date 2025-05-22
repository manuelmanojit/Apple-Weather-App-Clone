function setWarmerDifferenceUI(diff) {
  const container = document.querySelector(".feelslike-difference");
  container.style.backgroundColor = "rgb(243, 163, 59)";
  container.style.display = "flex";

  const arrow = document.querySelector(
    ".feelslike-difference .material-symbols-outlined"
  );
  arrow.textContent = "north";

  const number = document.querySelector(".feelslike-difference p");
  number.textContent = `${diff}°`;

  const caption = document.querySelector(".feelslike-caption");
  caption.textContent = "It feels warmer than it is.";

  const actual = document.querySelector(".feelslike-actual-number");
  actual.style.display = "inline";
}

function setColderDifferenceUI(diff) {
  const container = document.querySelector(".feelslike-difference");
  container.style.backgroundColor = "rgba(62, 200, 177, 0.67)";
  container.style.display = "flex";

  const arrow = document.querySelector(
    ".feelslike-difference .material-symbols-outlined"
  );
  arrow.textContent = "south";

  const number = document.querySelector(".feelslike-difference p");
  number.textContent = `${diff}°`;

  const caption = document.querySelector(".feelslike-caption");
  caption.textContent = "It feels colder than it is.";

  const actual = document.querySelector(".feelslike-actual-number");
  actual.style.display = "inline";
}

function setSameTemperatureUI() {
  const container = document.querySelector(".feelslike-difference");
  container.style.display = "none";

  const actual = document.querySelector(".feelslike-actual-number");
  actual.style.display = "none";

  const caption = document.querySelector(".feelslike-caption");
  caption.textContent = "It feels the same as the actual temperature.";
}

async function getFeelsLike(forecastData) {
  const temperature = forecastData.temperature;
  const feelsLike = forecastData.feelsLike;

  const diff = Math.abs(temperature - feelsLike);
  const cardTemperature = document.querySelector(".feelslike-new-number");
  cardTemperature.textContent = `${feelsLike}°`;

  if (temperature === feelsLike) return setSameTemperatureUI();

  const actual = document.querySelector(".feelslike-actual-number");
  actual.textContent = `Actual ${temperature}°`;

  if (temperature > feelsLike) return setColderDifferenceUI(diff);
  if (temperature < feelsLike) return setWarmerDifferenceUI(diff);
}

export { getFeelsLike };
