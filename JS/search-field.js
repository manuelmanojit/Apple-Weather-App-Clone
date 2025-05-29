import { getWeather, setHomeUI } from "./main.js";
import { API, BASE_URL } from "./weatherAPI-config.js";

const container = document.querySelector(".search-container");
const search = document.querySelector(".search");

const list = document.createElement("ul");
list.classList.add("search-dropdown");
list.style.display = "none";

window.addEventListener("click", (e) => {
  if (e.target !== search) {
    search.blur();
    list.style.display = "none";
    list.innerHTML = "";
  }
});

async function getCity(typedValue) {
  if (!typedValue) return;

  const citySearch = await fetch(
    `${BASE_URL}search.json?key=${API}&q=${typedValue}`
  );
  return await citySearch.json();
}

async function selectCity(city) {
  list.style.display = "none";
  list.innerHTML = "";
  search.value = "";
  const forecast = await getWeather(city);
  await setHomeUI(forecast);
}

function createSuggestions(citiesArray) {
  // can also use: while (list.firstChild) list.removeChild(list.firstChild);
  list.innerHTML = "";

  if (!citiesArray) return;

  citiesArray.forEach((city) => {
    const listItem = document.createElement("li");

    listItem.tabIndex = 0; // Make it focusable
    listItem.textContent = `${city.name}, ${city.country}`;
    listItem.classList.add("search-dropdown-item");

    listItem.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        const nextCity = listItem.nextSibling;
        if (nextCity) nextCity.focus();
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        const previousCity = listItem.previousSibling;
        if (previousCity) previousCity.focus();
        else {
          search.focus();
          search.setSelectionRange(search.value[0], search.value.length);
        }
      }
    });

    listItem.addEventListener("click", async () => {
      await selectCity(`${city.lat},${city.lon}`);
    });

    listItem.addEventListener("keydown", async (e) => {
      if (document.activeElement === listItem && e.key === "Enter") {
        await selectCity(`${city.lat},${city.lon}`);
      }
    });

    list.appendChild(listItem);
    container.appendChild(list);
  });
}

search.addEventListener("keydown", async (e) => {
  if (e.key === "Enter") {
    list.style.display = "none";
    let newCity = search.value;
    await selectCity(newCity);
  }

  if (e.key === "ArrowDown") {
    e.preventDefault();
    const firstCity = list.firstElementChild;
    firstCity.focus();
  }
});

search.addEventListener("input", async (e) => {
  let typedValue = e.target.value.trim();

  list.style.display = "block";
  const citiesArray = await getCity(typedValue);

  if (!citiesArray || typedValue.length === 0) list.style.display = "none";

  createSuggestions(citiesArray);

  if (!citiesArray) return (list.style.display = "none");
});
