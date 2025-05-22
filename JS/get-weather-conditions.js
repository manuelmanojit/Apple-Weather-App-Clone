const clearConditions = ["clear"];
const partlyCloudyConditions = ["partly cloudy"];
const sunnyConditions = ["sunny"];
const cloudyConditions = [
  "cloudy",
  "overcast",
  "mist",
  "fog",
  "freezing fog",
  "thundery outbreaks possible",
];
const rainyConditions = [
  "patchy rain possible",
  "patchy rain nearby",
  "patchy light drizzle",
  "light drizzle",
  "freezing drizzle",
  "heavy freezing drizzle",
  "patchy light rain",
  "patchy light rain in area with thunder",
  "light rain",
  "moderate rain at times",
  "moderate rain",
  "heavy rain at times",
  "heavy rain",
  "light freezing rain",
  "moderate or heavy freezing rain",
  "light sleet",
  "moderate or heavy sleet",
  "light rain shower",
  "moderate or heavy rain shower",
  "torrential rain shower",
  "light sleet showers",
  "moderate or heavy sleet showers",
  "patchy sleet possible",
  "patchy freezing drizzle possible",
  "thundery outbreaks in nearby",
  "patchy light rain with thunder",
  "moderate or heavy rain with thunder",
  "patchy light snow with thunder",
  "moderate or heavy snow with thunder",
];
const snowyConditions = [
  "patchy snow possible",
  "patchy light snow",
  "light snow",
  "patchy moderate snow",
  "moderate snow",
  "patchy heavy snow",
  "heavy snow",
  "light snow showers",
  "moderate or heavy snow showers",
  "blowing snow",
  "blizzard",
  "ice pellets",
  "light showers of ice pellets",
  "moderate or heavy showers of ice pellets",
];

function getClearConditions() {
  return clearConditions;
}

function getPartlyCloudyConditions() {
  return partlyCloudyConditions;
}

function getSunnyConditions() {
  return sunnyConditions;
}

function getCloudyConditions() {
  return cloudyConditions;
}

function getRainyConditions() {
  return rainyConditions;
}

function getSnowyConditions() {
  return snowyConditions;
}

export {
  getClearConditions,
  getPartlyCloudyConditions,
  getSunnyConditions,
  getCloudyConditions,
  getRainyConditions,
  getSnowyConditions,
};
