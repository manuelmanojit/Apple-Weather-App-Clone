import { getCurrentHourAndMinutes } from "./utility-functions.js";
import { getWeather, setHomeUI, getFirstSavedCity } from "./main.js";

// 🌐 DOM ELEMENTS
const addButton = document.querySelector(".add-btn");
const addIcon = document.querySelector(".add-btn span");
const addText = document.querySelector(".add-btn p");

addButton.style.display = "flex";
addButton.style.opacity = "1";

//--------------------------------------
// 📋 GET SAVED CITIES FROM LOCAL STORAGE
//--------------------------------------
function getSavedCities() {
  return JSON.parse(localStorage.getItem("savedCities")) || [];
}
//--------------------------------------
// 📝 CREATE NO SAVED CITIES YET MESSAGE
//--------------------------------------
function createNoSavedCitiesMsg() {
  const navContainer = document.querySelector(".nav-container");
  const noCitiesMsg = document.createElement("p");
  noCitiesMsg.classList.add("no-saved-cities");
  noCitiesMsg.textContent = "No saved cities yet";
  navContainer.appendChild(noCitiesMsg);
}
//------------------
// 📝 TOGGLE SIDEBAR
//------------------
function makeSidebarVisible(isVisible) {
  const navBarPosition = isVisible ? "0px" : "-220px";
  const forecastContainerPosition = isVisible ? "0px" : "-97px";

  document.documentElement.style.setProperty("--sidebarLeft", navBarPosition);
  document.documentElement.style.setProperty(
    "--forecastContainerLeft",
    forecastContainerPosition
  );

  localStorage.setItem(
    "sidebarStatus",
    JSON.stringify({
      navBarPosition: navBarPosition,
      forecastContainerPosition: forecastContainerPosition,
    })
  );
}
//---------------------------------------
// 📝 TEMPLATE FOR CREATING CARD ELEMENTS
//---------------------------------------
function createElement(elementType, className, content) {
  const element = document.createElement(elementType);
  element.textContent = content;
  if (className) element.classList.add(className);
  return element;
}
//---------------------------------
// 📝 CREATE EACH SAVED CITIES CARD
//---------------------------------
function createSavedCityCard(forecast) {
  const navContainer = document.querySelector(".nav-container");
  // 🧱 CARD STRUCTURE
  const wrapper = createElement("div", "nav-element-wrapper");
  const cardCont = createElement("div", "nav-element-container");
  // 🔝 TOP PART OF CARD
  const topInner = createElement("div", "top-inner-nav");
  const topLeft = createElement("div", "top-left-inner-nav");
  const cityName = createElement("p", "nav-city", forecast.city);
  const timezone = forecast.timezone;
  const time = createElement(
    "p",
    "nav-time",
    getCurrentHourAndMinutes(timezone)
  );
  const temperature = createElement(
    "p",
    "nav-temperature",
    `${forecast.temperature}°`
  );
  // 🔽 BOTTOM PART OF CARD
  const bottomInner = createElement("div", "bottom-inner-nav");
  const condition = createElement("span", "nav-condition", forecast.conditions);
  const maxmin = createElement("div", "nav-max-min");
  const maxText = createElement("span", null, "H:");
  const maxValue = createElement(
    "span",
    "nav-max-temp",
    `${forecast.tempMax}°`
  );
  const minText = createElement("span", null, "L:");
  const minValue = createElement(
    "span",
    "nav-min-temp",
    `${forecast.tempMin}°`
  );
  // LINE TO SEPARATE EACH CARD
  const horizontalLine = createElement("hr", "nav-hr");

  topLeft.append(cityName, time);
  topInner.append(topLeft, temperature);
  maxmin.append(maxText, maxValue, minText, minValue);
  bottomInner.append(condition, maxmin);
  cardCont.append(topInner, bottomInner);
  wrapper.append(cardCont, horizontalLine);
  navContainer.appendChild(wrapper);
  return [navContainer, cardCont, wrapper];
}
//---------------------------------------------------------------------
// 🌆 CREATE CITY CARD
//---------------------------------------------------------------------
function handleSavedCitiesEvents(data) {
  const forecast = data;
  const [navContainer, cardCont, wrapper] = createSavedCityCard(forecast);

  // 🖱️ SELECT ACTIVE CITY
  const displayedCities = Array.from(navContainer.children);
  displayedCities.forEach((city) => {
    city.addEventListener("click", () => {
      displayedCities.forEach((city) =>
        city.firstChild.classList.remove("active")
      );
      city.firstChild.classList.add("active");
    });
  });
  // 🔁 LOAD CITY ON CLICK
  cardCont.addEventListener("click", async (e) => {
    if (e.target.classList.contains("delete-button")) return;
    const thisCardForecast = await getWeather(
      `${forecast.latitude},${forecast.longitude}`
    );
    const savedCities = getSavedCities();
    const cityExists = savedCities.some(
      (cityData) =>
        cityData.city === thisCardForecast.city &&
        cityData.region === thisCardForecast.region
    );
    const lastSelectedCity = localStorage.getItem("lastSelectedCity");
    console.log(lastSelectedCity);
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
        console.log(wrapper);
        wrapper.remove();
        console.log(wrapper);
        //I need to get all the array items back but except the one i want to delete
        //I need to first get the stored object, then run filter on it and then overwrite it
        const savedCities = getSavedCities();
        //Now I leave out the one I don't want
        const updatedCities = savedCities.filter(
          (city) =>
            !(city.city === forecast.city && city.region === forecast.region)
        );
        //Here I overwrite it with the updated list of cities
        localStorage.setItem("savedCities", JSON.stringify(updatedCities));

        if (updatedCities.length === 0) {
          // Hide if there are no saved cities
          makeSidebarVisible(false);
          addButton.style.display = "flex";
          addButton.style.opacity = "1";
          setTimeout(() => {
            createNoSavedCitiesMsg();
          }, 1000);
        } else {
          const firstCity = getFirstSavedCity();
          const forecast = await getWeather(firstCity);
          setHomeUI(forecast);
        }
        console.log(updatedCities.length);
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
      latitude: forecastData.latitude,
      longitude: forecastData.longitude,
    };

    getFirstSavedCity();
    // Retrieve the saved cities array from localStorage, or use an empty array if nothing is saved yet
    // If we have one city object saved, we read it from the localStorage
    const savedCities = getSavedCities();
    // Check if the new city (from data) already exists in the savedCities
    const cityExists = savedCities.some(
      (cityData) =>
        cityData.city === data.city && cityData.region === data.region
    );
    // Since the city doesn’t exist yet, add the new city data to the savedCities array
    if (cityExists) return;

    savedCities.push(data);
    // Now savedCities contains the previously saved cities plus this new city
    //Overwrite savedCities in the localStorage with the new data
    localStorage.setItem("savedCities", JSON.stringify(savedCities));
    handleSavedCitiesEvents(data);
    setTimeout(() => {
      addButton.style.opacity = "0";
      addButton.style.display = "none";
      setTimeout(() => {
        addIcon.textContent = "add_circle";
        addText.textContent = "Add";
      }, 100);
    }, 1000);
    addIcon.textContent = "check_circle";
    addText.textContent = "Added";
    makeSidebarVisible(true);
  };

  addButton.addEventListener("click", handleClick);
}
//---------------------------------------------------------------------
// 📤 LOAD SAVED CITIES ON STARTUP
//---------------------------------------------------------------------
function showSavedCities() {
  // Get all the cities currently saved in the localStorage (array of objects)
  const savedCities = getSavedCities();
  // For every object in the array (cityData) run setCity with "cityData" instead of the current forecastData,
  // therefore creating a new card for each city and its data stored in the localStorage
  // This way, each card can still use the data used at the moment of pressing "Add"
  if (savedCities.length > 0)
    savedCities.forEach((cityData) => handleSavedCitiesEvents(cityData));
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
