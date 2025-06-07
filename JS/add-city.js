import { getCurrentHourAndMinutes } from "./utility-functions.js";
import { getWeather, setHomeUI, getFirstSavedCity } from "./main.js";

// 🌐 DOM ELEMENTS
const addButton = document.querySelector(".add-btn");
const addIcon = document.querySelector(".add-btn span");
const addText = document.querySelector(".add-btn p");

addButton.style.display = "flex";
addButton.style.opacity = "1";

//--------------------------------------
// 📋 SET AND GET SAVED CITIES FROM LOCAL STORAGE
//--------------------------------------
function setSavedCities(cities) {
  localStorage.setItem("savedCities", JSON.stringify(cities));
}
function getSavedCities() {
  try {
    return JSON.parse(localStorage.getItem("savedCities")) || [];
  } catch (error) {
    console.warn("Error retrieving saved cities:", error);
    return []; // Return an empty array anyways if there's an error
  }
}

//--------------------------------------
// 📝 CREATE NO SAVED CITIES YET MESSAGE
//--------------------------------------
function createNoSavedCitiesMsg() {
  const allCitiesContainer = document.querySelector(".nav-container");
  const noCitiesMsg = document.createElement("p");
  noCitiesMsg.classList.add("no-saved-cities");
  noCitiesMsg.textContent = "No saved cities yet";
  allCitiesContainer.appendChild(noCitiesMsg);
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
  const allCitiesContainer = document.querySelector(".nav-container");
  // 🧱 CARD STRUCTURE
  const cityWrapper = createElement("div", "nav-element-wrapper");
  const cityContainer = createElement("div", "nav-element-container");
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
  cityContainer.append(topInner, bottomInner);
  cityWrapper.append(cityContainer, horizontalLine);
  allCitiesContainer.appendChild(cityWrapper);
  return [allCitiesContainer, cityContainer, cityWrapper];
}
//---------------------------
// 🌆 HANDLE CITY CARD EVENTS
//---------------------------
function handleSavedCitiesEvents(data) {
  const forecast = data;
  const [allCitiesContainer, cityContainer, cityWrapper] =
    createSavedCityCard(forecast);
  // ----------------------------
  // OLD VERSION:
  // I was adding a separate click listener to *each* city card one by one.
  // So every time the list of cities changed (like after a search or update),
  // I'd re-run this code — and stack more and more listeners onto the same cards.
  // That bloats memory and makes the app slower and harder to debug over time.
  // It’s like gluing a new wire on top of the old ones every time I update the panel — messy.
  // NEW VERSION:
  // I add ONE listener to the container that *holds* all the city cards.
  // Now clicks are handled through event delegation — one smart listener at the top.
  // No matter how many cards I add or remove, the click just works — clean and efficient.
  // It’s like placing one big listening mat under the group instead of rewiring each button.
  // Much simpler, and I never have to worry about duplicate listeners or performance issues.
  // ----------------------------
  // 🖱️ SELECT ACTIVE CITY AND CHANGE STYLING
  allCitiesContainer.addEventListener("click", (e) => {
    // The .closest() method travels up the DOM tree from the element it is called on
    // It searches for the closest ancestor (which can be the element itself)
    // that matches the CSS selector passed to it. If it finds a matching ancestor,
    // it returns that element. If it doesn't find one, it returns null.
    const clickedCity = e.target.closest(".nav-element-wrapper");
    if (!clickedCity) return;

    Array.from(allCitiesContainer.children).forEach((city) =>
      //firstChild because I only want cityContainer, not cityWrapper
      city.firstChild.classList.remove("active")
    );

    clickedCity.firstChild.classList.add("active");
  });

  // 🔁 LOAD CITY ON CLICK
  cityContainer.addEventListener("click", async (e) => {
    if (e.target.classList.contains("delete-button")) return;
    const thisCardForecast = await getWeather(
      `${forecast.latitude},${forecast.longitude}`
    );
    const cityExists = getSavedCities().some(
      (cityData) =>
        cityData.city === thisCardForecast.city &&
        cityData.region === thisCardForecast.region
    );
    if (cityExists) addButton.style.display = "none";
    setHomeUI(thisCardForecast);
    // 💾 Save this city as the last selected one so it loads by default on page refresh or app startup
    localStorage.setItem(
      "lastSelectedCity",
      `${thisCardForecast.latitude},${thisCardForecast.longitude}`
    );
  });

  function createDeleteButton(thisCityContainer) {
    const deleteCont = document.createElement("div");
    const deleteBtn = document.createElement("img");

    deleteCont.classList.add("delete-container");
    deleteBtn.classList.add("delete-button");
    deleteBtn.src = "../SVGs/delete.svg";

    deleteCont.appendChild(deleteBtn);
    thisCityContainer.prepend(deleteCont);

    return deleteBtn;
  }

  // 🗑️ DELETE BUTTON HANDLER
  cityContainer.addEventListener("mouseover", () => {
    // Prevent multiple delete buttons per card
    if (cityContainer.querySelector(".delete-button")) return;

    const deleteBtn = createDeleteButton(cityContainer);

    deleteBtn.addEventListener("click", async () => {
      cityWrapper.remove();
      //I need to get all the array items back but except the one i want to delete
      //I need to first get the stored object, then run filter on it and then overwrite it
      const updatedCities = getSavedCities().filter(
        (city) =>
          !(city.city === forecast.city && city.region === forecast.region)
      );
      setSavedCities(updatedCities);

      if (!updatedCities.length) {
        makeSidebarVisible(false);
        addButton.style.display = "flex";
        addButton.style.opacity = "1";
        setTimeout(createNoSavedCitiesMsg, 1000);
        return;
      } else {
        const firstCity = getFirstSavedCity();
        const forecast = await getWeather(firstCity);
        setHomeUI(forecast);
      }
    });
  });

  cityContainer.addEventListener("mouseleave", () => {
    const deleteBtn = cityContainer.querySelector(".delete-button");
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
    // If we have one city object saved, we read it from the localStorage
    const savedCities = getSavedCities();
    const cityExists = getSavedCities().some(
      (cityData) =>
        cityData.city === data.city && cityData.region === data.region
    );
    if (cityExists) return;
    // Since the city doesn’t exist yet, add the new city data to the savedCities array
    savedCities.push(data);
    // Now savedCities contains the previously saved cities plus this new city
    // Overwrite savedCities in the localStorage with the new data
    setSavedCities(savedCities);
    // Create a new card for the newly added city
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
  // For every city in the array run setCity with the data from the localStorage
  // so that it matches the correct city
  if (savedCities.length > 0)
    savedCities.forEach((cityData) => handleSavedCitiesEvents(cityData));
  else {
    createNoSavedCitiesMsg();
  }
}

export { addCity, showSavedCities };
