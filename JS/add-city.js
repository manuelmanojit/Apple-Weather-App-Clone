import { getCurrentHourAndMinutes } from "./utility-functions.js";
import { getWeather, setHomeUI, getFirstSavedCity } from "./main.js";

const navBar = document.querySelector(".navbar");
const forecastContainer = document.querySelector("#main-container");

const addButton = document.querySelector(".add-btn");
addButton.style.display = "flex";
addButton.style.opacity = "1";
const addIcon = document.querySelector(".add-btn span");
const addText = document.querySelector(".add-btn p");

(function hideSidebar() {
  // Hide/Show thorugh icon click
  const sidebarIcon = document.querySelector(".side-bar-icon");

  sidebarIcon.addEventListener("click", () => {
    navBar.style.left = navBar.style.left === "-220px" ? "0" : "-220px";
    forecastContainer.style.transform =
      navBar.style.left === "-220px" ? "translate(-4.6vw)" : "translate(0%)";
  });
})();

function setCity(data) {
  //f = forecast
  const f = data;
  const timezone = data.timezone;

  // Cont = container
  const navCont = document.querySelector(".nav-container");
  // Wraps both card and hr
  const wrapper = document.createElement("div");
  wrapper.classList.add("nav-element-wrapper");

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
  time.textContent = getCurrentHourAndMinutes(timezone);
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

  // I get all the saved cities cards
  Array.from(navCont.children).forEach((savedCity) => {
    // Every saved city gets an event listener
    savedCity.addEventListener("click", (e) => {
      if (e.currentTarget === savedCity) {
        // Whenever I click on one saved city, all the other ones leave the "active" styling
        Array.from(navCont.children).forEach((city) =>
          city.firstChild.classList.remove("active")
        );
        // Right after that, I add the "active" styling to the saved city I just pressed
        savedCity.firstChild.classList.add("active");
      }
    });
  });

  cardCont.addEventListener("click", async (e) => {
    if (!e.target.classList.contains("delete-button")) {
      const forecast = await getWeather(f.city);

      let savedCities = JSON.parse(localStorage.getItem("savedCities")) || [];

      const cityExists = savedCities.some(
        (cityData) =>
          cityData.city === forecast.city && cityData.region === forecast.region
      );
      localStorage.setItem(
        "lastSelectedCity",
        `${forecast.latitude},${forecast.longitude}`
      );
      if (cityExists) {
        addButton.style.display = "none";
      }
      // This saves it as the last selected city to keep when refreshing the page
      setHomeUI(forecast);
    }
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

      deleteBtn.addEventListener("click", async () => {
        wrapper.remove();
        //I need to get all the array items back but except the one i want to delete
        //I need to first get the stored object, then run filter on it and then overwrite it
        const savedCities =
          JSON.parse(localStorage.getItem("savedCities")) || [];
        const updatedCities = savedCities.filter(
          (city) => city.city !== f.city && city.region !== f.region
        );
        localStorage.setItem("savedCities", JSON.stringify(updatedCities));
        const city = getFirstSavedCity();
        const forecast = await getWeather(city);
        setHomeUI(forecast);
        // Hide/Show depending on whether there are saved cities
        if (savedCities.length === 1) {
          forecastContainer.style.transform = "translate(-4.6vw)";
          navBar.style.left = "-220px";
          addButton.style.display = "flex";
          setTimeout(() => {
            const noCitiesMsg = document.createElement("p");
            noCitiesMsg.classList.add("no-saved-cities");
            noCitiesMsg.textContent = "No saved cities yet";
            navCont.appendChild(noCitiesMsg);
          }, 1000);
        }
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
    // Now savedCities contains the previously saved cities plus this new city
    if (!cityExists) {
      savedCities.push(data);
      // Save the updated savedCities array back to localStorage under the same key,
      // thefore overwriting the old data with the new array that includes all cities
      localStorage.setItem("savedCities", JSON.stringify(savedCities));
      setCity(data);
      setTimeout(() => (addButton.style.opacity = "0"), 1000);
      addIcon.textContent = "check_circle";
      addText.textContent = "Added";
      navBar.style.left = "0";
    }
  };

  addButton.addEventListener("click", handleClick);
}

function showSavedCities() {
  // Get all the cities currently saved in the localStorage (array of objects)
  const savedCities = JSON.parse(localStorage.getItem("savedCities"));

  const navCont = document.querySelector(".nav-container");
  // Remove existing "no cities" message if it's already there

  if (savedCities.length === 0) {
    const noCitiesMsg = document.createElement("p");
    noCitiesMsg.classList.add("no-saved-cities");
    noCitiesMsg.textContent = "No saved cities yet.";
    navCont.appendChild(noCitiesMsg);
    return; // No cities to render, exit early
  }

  // For every object in the array (cityData) run setCity with "cityData" instead of the current forecastData,
  // therefore creating a new card for each city and its data stored in the localStorage
  // This way, each card can still use the data used at the moment of pressing "Add"
  savedCities.forEach((cityData) => setCity(cityData));
}

export { addCity, showSavedCities };

// ALTERNATIVE
// let savedCities;
// const rawData = localStorage.getItem("savedCities");
// if(rawData === null) {
//     savedCities = [];
// } else {
//     savedCities = JSON.parse(rawData);
// }
