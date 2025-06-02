import { getCurrentHourAndMinutes } from "./utility-functions.js";
import { getWeather, setHomeUI, getFirstSavedCity } from "./main.js";

// 🌐 DOM ELEMENTS
const navBar = document.querySelector(".navbar");
const forecastContainer = document.querySelector("#main-container");
const addButton = document.querySelector(".add-btn");
const addIcon = document.querySelector(".add-btn span");
const addText = document.querySelector(".add-btn p");

addButton.style.display = "flex";
addButton.style.opacity = "1";
//---------------------------------------------------------------------
// 📦 SIDEBAR TOGGLE HANDLER
//---------------------------------------------------------------------
(function useSidebarIcon() {
  const sidebarIcon = document.querySelector(".side-bar-icon");

  sidebarIcon.addEventListener("click", () => {
    if (
      navBar.style.left === "-220px" &&
      forecastContainer.style.left === "-97px"
    ) {
      navBar.style.left = "0px";
      forecastContainer.style.left = "0px";
    } else if (
      navBar.style.left === "0px" &&
      forecastContainer.style.left === "0px"
    ) {
      navBar.style.left = "-220px";
      forecastContainer.style.left = "-97px";
    }
  });
})();

//---------------------------------------------------------------------
// 📝 CREATE NO SAVED CITIES YET MESSAGE
//---------------------------------------------------------------------
function createNoSavedCitiesMsg() {
  const navContainer = document.querySelector(".nav-container");
  const noCitiesMsg = document.createElement("p");
  noCitiesMsg.classList.add("no-saved-cities");
  noCitiesMsg.textContent = "No saved cities yet";
  navContainer.appendChild(noCitiesMsg);
}

function createElement(elementType, className, content) {
  const element = document.createElement(`${elementType}`);
  element.classList.add(`${className}`);
  element.textContent = `${content}`;
  return element;
}

//---------------------------------------------------------------------
// 🌆 CREATE CITY CARD
//---------------------------------------------------------------------
function setCity(data) {
  const forecast = data;
  const timezone = data.timezone;
  const navContainer = document.querySelector(".nav-container");

  // 🧱 CARD STRUCTURE
  const wrapper = document.createElement("div");
  wrapper.classList.add("nav-element-wrapper");

  const cardCont = document.createElement("div");
  cardCont.classList.add("nav-element-container");

  // 🔝 TOP PART OF CARD
  const topInner = document.createElement("div");
  topInner.classList.add("top-inner-nav");

  const topLeft = document.createElement("div");
  topLeft.classList.add("top-left-inner-nav");
  topInner.appendChild(topLeft);

  const cityName = createElement("p", "nav-city", `${forecast.city}`);

  const time = createElement(
    "p",
    "nav-time",
    getCurrentHourAndMinutes(timezone)
  );
  topLeft.append(cityName, time);

  const temperature = createElement(
    "p",
    "nav-temperature",
    `${forecast.temperature}°`
  );
  topInner.appendChild(temperature);

  // 🔽 BOTTOM PART OF CARD
  const bottomInner = document.createElement("div");
  bottomInner.classList.add("bottom-inner-nav");

  const condition = document.createElement("span");
  condition.classList.add("nav-condition");
  condition.textContent = forecast.conditions;

  const maxmin = document.createElement("div");
  maxmin.classList.add("nav-max-min");

  const maxText = document.createElement("span");
  maxText.textContent = "H:";

  const maxValue = document.createElement("span");
  maxValue.classList.add("nav-max-temp");
  maxValue.textContent = `${forecast.tempMax}°`;

  const minText = document.createElement("span");
  minText.textContent = "L:";

  const minValue = document.createElement("span");
  minValue.classList.add("nav-min-temp");
  minValue.textContent = `${forecast.tempMin}°`;

  maxmin.append(maxText, maxValue, minText, minValue);
  bottomInner.append(condition, maxmin);

  const hr = document.createElement("hr");
  hr.classList.add("nav-hr");

  cardCont.append(topInner, bottomInner);
  wrapper.append(cardCont, hr);
  navContainer.appendChild(wrapper);

  // 🖱️ SELECT ACTIVE CITY
  Array.from(navContainer.children).forEach((savedCity) => {
    savedCity.addEventListener("click", (e) => {
      if (e.currentTarget === savedCity) {
        Array.from(navContainer.children).forEach((city) =>
          city.firstChild.classList.remove("active")
        );
        savedCity.firstChild.classList.add("active");
      }
    });
  });

  // 🔁 LOAD CITY ON CLICK
  cardCont.addEventListener("click", async (e) => {
    //I don't want that the delete button triggers this logic
    if (e.target.classList.contains("delete-button")) return;
    //Forecast comes from the same first call that created the saved city card
    const thisCardForecast = await getWeather(forecast.city);

    let savedCities = JSON.parse(localStorage.getItem("savedCities")) || [];
    const cityExists = savedCities.some(
      (cityData) =>
        cityData.city === thisCardForecast.city &&
        cityData.region === thisCardForecast.region
    );
    // 💾 Save this city as the last selected one so it loads by default on page refresh or app startup
    localStorage.setItem(
      "lastSelectedCity",
      `${thisCardForecast.latitude},${thisCardForecast.longitude}`
    );
    if (cityExists) addButton.style.display = "none";
    // This sets the Home UI with this last clicked city
    setHomeUI(thisCardForecast);
  });

  // 🗑️ DELETE BUTTON HANDLER
  const deleteCont = document.createElement("div");
  cardCont.addEventListener("mouseover", () => {
    // Prevent multiple delete buttons per card
    if (!cardCont.querySelector(".delete-button")) {
      deleteCont.classList.add("delete-container");
      const deleteBtn = document.createElement("img");
      deleteBtn.classList.add("delete-button");
      deleteBtn.src = "../SVGs/delete.svg";
      deleteCont.appendChild(deleteBtn);
      cardCont.prepend(deleteCont);

      deleteBtn.addEventListener("click", async () => {
        wrapper.remove();
        //I need to get all the array items back but except the one i want to delete
        //I need to first get the stored object, then run filter on it and then overwrite it
        const savedCities =
          JSON.parse(localStorage.getItem("savedCities")) || [];
        //Now I leave out the one I don't want
        const updatedCities = savedCities.filter(
          (city) =>
            !(city.city === forecast.city && city.region === forecast.region)
        );
        //Here I overwrite it with the updated list of cities
        localStorage.setItem("savedCities", JSON.stringify(updatedCities));

        if (updatedCities.length > 0) {
          const firstCity = getFirstSavedCity();
          const forecast = await getWeather(firstCity);
          setHomeUI(forecast);
        } else {
          // Hide if there are no saved cities
          forecastContainer.style.left = "-97px";
          navBar.style.left = "-220px";
          addButton.style.display = "flex";
          setTimeout(() => {
            createNoSavedCitiesMsg();
          }, 1000);
        }
      });
    }
  });

  cardCont.addEventListener("mouseleave", () => {
    const deleteBtn = cardCont.querySelector(".delete-button");
    if (deleteBtn) deleteBtn.remove();
  });
}
//---------------------------------------------------------------------
// ➕ ADD CITY TO SIDEBAR
//---------------------------------------------------------------------
let handleClick = null;
// Declare HandleClick outside so the reference can persist across multiple calls.
// Can't initialize it inside addCity because
// every time the city is called, a new version of handleClick is declared
// with value "null", so there is never anything to remove to begin with.
// This way, the old event listener remains active. So, on every page load,
// addCity will run with the initial city, plus create an additional card
function addCity(forecastData) {
  // If the event listener has already been used, remove it
  if (handleClick) {
    addButton.removeEventListener("click", handleClick);
  }
  // Once the event listener is used, handleClick goes from "null" (false) to true
  handleClick = () => {
    const existingNoCitiesMsg = document.querySelector(".no-saved-cities");
    if (existingNoCitiesMsg) existingNoCitiesMsg.remove();

    const data = {
      city: forecastData.city,
      region: forecastData.region,
      temperature: forecastData.temperature,
      conditions: forecastData.conditions,
      tempMax: forecastData.tempMax,
      tempMin: forecastData.tempMin,
      timezone: forecastData.cityTimezone,
      lat: forecastData.latitude,
      lon: forecastData.longitude,
    };

    getFirstSavedCity();
    // Retrieve the saved cities array from localStorage, or use an empty array if nothing is saved yet
    // If we have one city object saved, we read it from the localStorage
    let savedCities = JSON.parse(localStorage.getItem("savedCities")) || [];
    // Check if the new city (from data) already exists in the savedCities
    const cityExists = savedCities.some(
      (cityData) =>
        cityData.city === data.city && cityData.region === data.region
    );
    // Since the city doesn’t exist yet, add the new city data to the savedCities array
    if (!cityExists) {
      savedCities.push(data);
      // Now savedCities contains the previously saved cities plus this new city
      //Overwrite savedCities in the localStorage with the new data
      localStorage.setItem("savedCities", JSON.stringify(savedCities));
      setCity(data);
      setTimeout(() => (addButton.style.opacity = "0"), 1000);
      addIcon.textContent = "check_circle";
      addText.textContent = "Added";
      navBar.style.left = "0px";
      forecastContainer.style.left = "0px";
    }
  };

  addButton.addEventListener("click", handleClick);
}
//---------------------------------------------------------------------
// 📤 LOAD SAVED CITIES ON STARTUP
//---------------------------------------------------------------------
function showSavedCities() {
  // Get all the cities currently saved in the localStorage (array of objects)
  const savedCities = JSON.parse(localStorage.getItem("savedCities")) || [];
  // For every object in the array (cityData) run setCity with "cityData" instead of the current forecastData,
  // therefore creating a new card for each city and its data stored in the localStorage
  // This way, each card can still use the data used at the moment of pressing "Add"
  if (savedCities.length > 0)
    savedCities.forEach((cityData) => setCity(cityData));
  else {
    createNoSavedCitiesMsg();
  }
}

export { addCity, showSavedCities };

// ALTERNATIVE (DO NOT USE THE BELOW CODE)
// let savedCities;
// const rawData = localStorage.getItem("savedCities");
// if(rawData === null) {
//     savedCities = [];
// } else {
//     savedCities = JSON.parse(rawData);
// }
