import { getCurrentHourAndMinutes } from "./utility-functions.js";
import { getWeather, setHomeUI } from "./main.js";

const navBar = document.querySelector(".navbar");
const btn = document.querySelector(".add-btn");
const sidebarIcon = document.querySelector(".side-bar-icon");
sidebarIcon.addEventListener("click", () => {
  const currentDisplay = getComputedStyle(navBar).display;
  navBar.style.display = currentDisplay === "block" ? "none" : "block";
});

function setCity(forecastData) {
  //f = forecast
  const f = forecastData;
  console.log(getCurrentHourAndMinutes(forecastData));

  const navCont = document.querySelector(".nav-container");
  // Wraps both card and hr
  const wrapper = document.createElement("div");
  wrapper.classList.add("nav-element-wrapper");
  // Cont = container
  const cardCont = document.createElement("div");
  cardCont.classList.add("nav-element-container");

  const topInner = document.createElement("div");
  topInner.classList.add("top-inner-nav");

  const topLeft = document.createElement("div");
  topLeft.classList.add("top-left-inner-nav");
  topInner.appendChild(topLeft);

  const navCity = document.createElement("p");
  navCity.classList.add("nav-city");
  navCity.textContent = f.city;
  const time = document.createElement("p");
  time.classList.add("nav-time");
  time.textContent = getCurrentHourAndMinutes(forecastData);
  topLeft.append(navCity, time);

  const temperature = document.createElement("p");
  temperature.classList.add("nav-temperature");
  topInner.appendChild(temperature);
  temperature.textContent = `${f.temperature}°`;

  const bottomInner = document.createElement("div");
  bottomInner.classList.add("bottom-inner-nav");

  const condition = document.createElement("span");
  condition.classList.add("nav-condition");
  condition.textContent = f.conditions;

  const maxmin = document.createElement("div");
  maxmin.classList.add("nav-max-min");

  const maxText = document.createElement("span");
  maxText.textContent = "H:";

  const maxValue = document.createElement("span");
  maxValue.classList.add("nav-max-temp");
  maxValue.textContent = `${f.tempMax}°`;

  const minText = document.createElement("span");
  minText.textContent = "L:";

  const minValue = document.createElement("span");
  minValue.classList.add("nav-min-temp");
  minValue.textContent = `${f.tempMin}°`;

  const hr = document.createElement("hr");
  hr.classList.add("nav-hr");

  maxmin.append(maxText, maxValue, minText, minValue);
  bottomInner.append(condition, maxmin);
  cardCont.append(topInner, bottomInner);
  wrapper.append(cardCont, hr);
  navCont.appendChild(wrapper);

  cardCont.addEventListener("click", async () => {
    const forecast = await getWeather(f.city);
    setHomeUI(forecast);
  });
  const deleteCont = document.createElement("div");
  cardCont.addEventListener("mouseover", () => {
    if (!document.querySelector(".delete-button")) {
      deleteCont.classList.add("delete-container");
      const deleteBtn = document.createElement("img");
      deleteBtn.classList.add("delete-button");
      deleteBtn.src = "../SVGs/delete.svg";
      deleteCont.appendChild(deleteBtn);
      cardCont.prepend(deleteCont);

      deleteBtn.addEventListener("click", (e) => {
        wrapper.remove();
      });
    }
  });
  cardCont.addEventListener("mouseleave", () => {
    const deleteBtn = document.querySelector(".delete-button");
    if (deleteBtn) deleteBtn.remove();
  });
}

let handleClick = null;
// Declare it outside so the reference can persist across multiple calls.
// Can't initialize it inside addCity because
// every time the city is called, a new version of handleClick is declared
// with value "null", so there is never anything to remove to begin with.
// This way, the old event listener remains active. So, on every page load,
// addCity will run with the initial city, plus create an additional card
function addCity(forecastData) {
  // If the event listener has already been used, remove it
  if (handleClick) {
    btn.removeEventListener("click", handleClick);
  }
  // Once the event listener is used, handleClick goes from "null" (false) to true
  handleClick = () => {
    const data = {
      city: forecastData.city,
      region: forecastData.region,
      temperature: forecastData.temperature,
      conditions: forecastData.conditions,
      tempMax: forecastData.tempMax,
      tempMin: forecastData.tempMin,
    };
    // Retrieve the saved cities array from localStorage, or use an empty array if nothing is saved yet
    // If we have one city object saved, we read it from the localStorage
    let savedCities = JSON.parse(localStorage.getItem("savedCities")) || [];
    // Check if the new city (from data) already exists in the savedCities
    const cityExists = savedCities.some(
      (cityData) =>
        cityData.city === data.city && cityData.region === data.region
    );
    // Since the city doesn’t exist yet, add the new city data to the savedCities array
    // Now savedCities contains the previously saved cities plus this new city
    if (!cityExists) {
      savedCities.push(data);
      // Save the updated savedCities array back to localStorage under the same key,
      // thefore overwriting the old data with the new array that includes all cities
      localStorage.setItem("savedCities", JSON.stringify(savedCities));
      setCity(forecastData);
    }
  };

  btn.addEventListener("click", handleClick);
}

function getSavedCities() {
  // Get all the cities currently saved in the localStorage (array of objects)
  const savedCities = JSON.parse(localStorage.getItem("savedCities"));
  // For every object in the array (cityData) run setCity with "cityData" instead of the current forecastData,
  // therefore creating a new card for each city and its data stored in the localStorage
  // This way, each card can still use the data used at the moment of pressing "Add"
  savedCities.forEach((cityData) => setCity(cityData));
}

export { addCity, getSavedCities };

// ALTERNATIVE
// let savedCities;
// const rawData = localStorage.getItem("savedCities");
// if(rawData === null) {
//     savedCities = [];
// } else {
//     savedCities = JSON.parse(rawData);
// }
