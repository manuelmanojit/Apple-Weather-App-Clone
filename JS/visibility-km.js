function getVisibilityCaption(forecastData) {
  const v = forecastData.visibility;
  console.log(v);

  if (v >= 20) return "Perfectly clear view";
  if (v >= 10) return "Very clear view at the moment.";
  if (v >= 5) return "Good visibility  at the moment.";
  if (v >= 2) return "Moderate visibility at the moment.";
  if (v >= 1) return "Poor visibility at the moment.";
  if (v > 1) return "Very poor visibility at the moment.";
  return "Extremely poor visibility at the moment.";
}

function setVisibility(forecastData) {
  const visibility = document.querySelector("#visibility-number");
  visibility.textContent = `${forecastData.visibility}km`;

  const caption = document.querySelector("#visibility-caption");
  caption.textContent = getVisibilityCaption(forecastData);
}

export { setVisibility };
