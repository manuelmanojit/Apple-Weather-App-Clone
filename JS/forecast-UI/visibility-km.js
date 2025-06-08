function getVisibilityCaption(v) {
  // v === visibility
  if (v >= 20) return "Perfectly clear view";
  if (v >= 10) return "Very clear view at the moment.";
  if (v >= 5) return "Good visibility  at the moment.";
  if (v >= 2) return "Moderate visibility at the moment.";
  if (v >= 1) return "Poor visibility at the moment.";
  if (v > 1) return "Very poor visibility at the moment.";
  return "Extremely poor visibility at the moment.";
}

function setVisibility(forecastData) {
  const visibility = Math.round(forecastData.visibility);
  const visibilityElement = document.querySelector("#visibility-number");
  visibilityElement.textContent = `${visibility}km`;

  const caption = document.querySelector("#visibility-caption");
  caption.textContent = getVisibilityCaption(visibility);
}

export { setVisibility };
