/* ==========================================================================
   Weather or Not - script.js
   A small weather dashboard that reads FICTIONAL sample data through a
   simulated (mock) API. No network, server or API key is involved.
   ========================================================================== */

"use strict";

/* --------------------------------------------------------------------------
   1. Sample dataset (in memory)
   This is the application's data source. weather-data.json contains the same
   records as a reference copy; the app does not load that file.
   -------------------------------------------------------------------------- */
const WEATHER_DATA = [
  {
    city: "London", country: "United Kingdom", condition: "Cloudy",
    temperatureC: 14, feelsLikeC: 12, humidityPercent: 78, windSpeedKmh: 19, windGustKmh: 34,
    forecast: [
      { day: "Mon", condition: "Rain", highC: 15, lowC: 10, rainChancePercent: 70 },
      { day: "Tue", condition: "Cloudy", highC: 14, lowC: 9, rainChancePercent: 40 },
      { day: "Wed", condition: "Partly Cloudy", highC: 16, lowC: 10, rainChancePercent: 20 },
      { day: "Thu", condition: "Rain", highC: 13, lowC: 8, rainChancePercent: 65 },
      { day: "Fri", condition: "Sunny", highC: 17, lowC: 9, rainChancePercent: 10 }
    ]
  },
  {
    city: "Tokyo", country: "Japan", condition: "Partly Cloudy",
    temperatureC: 21, feelsLikeC: 21, humidityPercent: 62, windSpeedKmh: 11, windGustKmh: 22,
    forecast: [
      { day: "Mon", condition: "Sunny", highC: 23, lowC: 16, rainChancePercent: 10 },
      { day: "Tue", condition: "Partly Cloudy", highC: 22, lowC: 15, rainChancePercent: 20 },
      { day: "Wed", condition: "Cloudy", highC: 20, lowC: 15, rainChancePercent: 35 },
      { day: "Thu", condition: "Rain", highC: 18, lowC: 14, rainChancePercent: 75 },
      { day: "Fri", condition: "Partly Cloudy", highC: 21, lowC: 14, rainChancePercent: 25 }
    ]
  },
  {
    city: "New York", country: "United States", condition: "Sunny",
    temperatureC: 17, feelsLikeC: 15, humidityPercent: 48, windSpeedKmh: 16, windGustKmh: 29,
    forecast: [
      { day: "Mon", condition: "Sunny", highC: 18, lowC: 9, rainChancePercent: 5 },
      { day: "Tue", condition: "Partly Cloudy", highC: 17, lowC: 10, rainChancePercent: 15 },
      { day: "Wed", condition: "Cloudy", highC: 15, lowC: 9, rainChancePercent: 40 },
      { day: "Thu", condition: "Rain", highC: 14, lowC: 8, rainChancePercent: 70 },
      { day: "Fri", condition: "Sunny", highC: 16, lowC: 7, rainChancePercent: 10 }
    ]
  },
  {
    city: "Sydney", country: "Australia", condition: "Sunny",
    temperatureC: 24, feelsLikeC: 25, humidityPercent: 55, windSpeedKmh: 22, windGustKmh: 38,
    forecast: [
      { day: "Mon", condition: "Sunny", highC: 26, lowC: 17, rainChancePercent: 5 },
      { day: "Tue", condition: "Sunny", highC: 27, lowC: 18, rainChancePercent: 5 },
      { day: "Wed", condition: "Partly Cloudy", highC: 25, lowC: 18, rainChancePercent: 20 },
      { day: "Thu", condition: "Thunderstorm", highC: 22, lowC: 17, rainChancePercent: 80 },
      { day: "Fri", condition: "Cloudy", highC: 21, lowC: 16, rainChancePercent: 35 }
    ]
  },
  {
    city: "Bengaluru", country: "India", condition: "Partly Cloudy",
    temperatureC: 27, feelsLikeC: 29, humidityPercent: 66, windSpeedKmh: 9, windGustKmh: 18,
    forecast: [
      { day: "Mon", condition: "Rain", highC: 26, lowC: 20, rainChancePercent: 60 },
      { day: "Tue", condition: "Thunderstorm", highC: 25, lowC: 20, rainChancePercent: 80 },
      { day: "Wed", condition: "Cloudy", highC: 26, lowC: 20, rainChancePercent: 45 },
      { day: "Thu", condition: "Rain", highC: 25, lowC: 19, rainChancePercent: 65 },
      { day: "Fri", condition: "Partly Cloudy", highC: 27, lowC: 20, rainChancePercent: 25 }
    ]
  },
  {
    city: "Cairo", country: "Egypt", condition: "Sunny",
    temperatureC: 31, feelsLikeC: 30, humidityPercent: 28, windSpeedKmh: 14, windGustKmh: 26,
    forecast: [
      { day: "Mon", condition: "Sunny", highC: 32, lowC: 20, rainChancePercent: 0 },
      { day: "Tue", condition: "Sunny", highC: 33, lowC: 21, rainChancePercent: 0 },
      { day: "Wed", condition: "Sunny", highC: 33, lowC: 21, rainChancePercent: 0 },
      { day: "Thu", condition: "Partly Cloudy", highC: 31, lowC: 20, rainChancePercent: 5 },
      { day: "Fri", condition: "Sunny", highC: 30, lowC: 19, rainChancePercent: 0 }
    ]
  }
];

// How long the simulated request takes, in milliseconds.
const MOCK_DELAY_MS = 1200;

// Simple icons for each condition label used in the dataset.
const CONDITION_ICONS = {
  "Sunny": "☀️",
  "Partly Cloudy": "⛅",
  "Cloudy": "☁️",
  "Rain": "🌧️",
  "Thunderstorm": "⛈️"
};

/* --------------------------------------------------------------------------
   2. Mock API
   Pretends to be a weather service. It uses a Promise and setTimeout so the
   result arrives later, just like a real network request would.
   - Resolves with a weather record for a supported city.
   - Resolves with null when the city is not in the dataset.
   - Rejects with an Error when a failure is simulated.
   -------------------------------------------------------------------------- */
function fetchWeather(cityName, options) {
  const shouldFail = Boolean(options && options.simulateFailure);

  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      if (shouldFail) {
        reject(new Error("Simulated network error: the weather service did not respond."));
        return;
      }

      const wanted = String(cityName).trim().toLowerCase();
      const record = WEATHER_DATA.find(function (entry) {
        return entry.city.toLowerCase() === wanted;
      });

      // Hand back a copy so the dataset itself is never modified by the UI.
      resolve(record ? JSON.parse(JSON.stringify(record)) : null);
    }, MOCK_DELAY_MS);
  });
}

/* --------------------------------------------------------------------------
   3. Page elements
   -------------------------------------------------------------------------- */
const searchForm = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");
const cityOptions = document.getElementById("city-options");
const cityChips = document.getElementById("city-chips");
const failureToggle = document.getElementById("failure-toggle");

const statusMessage = document.getElementById("status-message");
const loadingIndicator = document.getElementById("loading-indicator");
const errorBanner = document.getElementById("error-banner");
const errorText = document.getElementById("error-text");
const retryButton = document.getElementById("retry-button");
const unsupportedMessage = document.getElementById("unsupported-message");
const unsupportedText = document.getElementById("unsupported-text");

const weatherPanel = document.getElementById("weather-panel");
const cityHeading = document.getElementById("city-heading");
const conditionIcon = document.getElementById("condition-icon");
const conditionLabel = document.getElementById("condition-label");
const temperatureValue = document.getElementById("temperature-value");
const feelsLikeValue = document.getElementById("feels-like-value");
const humidityValue = document.getElementById("humidity-value");
const windValue = document.getElementById("wind-value");
const forecastList = document.getElementById("forecast-list");

/* --------------------------------------------------------------------------
   4. Application state
   -------------------------------------------------------------------------- */
let latestRequestId = 0;     // Identifies the most recent request.
let lastRequestedCity = "";  // Used by the Retry button.
let displayedForecast = null; // The forecast array currently shown on the page.

/* --------------------------------------------------------------------------
   5. Small UI helpers
   -------------------------------------------------------------------------- */
function setStatus(text) {
  statusMessage.textContent = text;
}

function showLoading(isLoading) {
  loadingIndicator.hidden = !isLoading;
  weatherPanel.classList.toggle("is-loading", isLoading);
  document.body.setAttribute("aria-busy", isLoading ? "true" : "false");
}

function showError(message) {
  errorText.textContent = message;
  errorBanner.hidden = false;
}

function hideError() {
  errorBanner.hidden = true;
  errorText.textContent = "";
}

function showUnsupported(cityName) {
  const names = WEATHER_DATA.map(function (entry) { return entry.city; });
  unsupportedText.textContent =
    "Sorry, there is no sample weather for \"" + cityName + "\" yet. " +
    "Please try one of: " + names.join(", ") + ".";
  unsupportedMessage.hidden = false;
}

function hideUnsupported() {
  unsupportedMessage.hidden = true;
  unsupportedText.textContent = "";
}

// Marks the chip that matches the chosen city (if any) as pressed.
function highlightChip(cityName) {
  const wanted = cityName.trim().toLowerCase();
  cityChips.querySelectorAll("button").forEach(function (chip) {
    const isMatch = chip.dataset.city.toLowerCase() === wanted;
    chip.setAttribute("aria-pressed", isMatch ? "true" : "false");
  });
}

function iconFor(condition) {
  return CONDITION_ICONS[condition] || "🌡️";
}

/* --------------------------------------------------------------------------
   6. Rendering
   -------------------------------------------------------------------------- */
function renderCurrent(record) {
  cityHeading.textContent = record.city + ", " + record.country;
  conditionIcon.textContent = iconFor(record.condition);
  conditionLabel.textContent = record.condition;
  temperatureValue.textContent = record.temperatureC + "°";
  feelsLikeValue.textContent = record.feelsLikeC + "°C";
  humidityValue.textContent = record.humidityPercent + "%";
  windValue.textContent = record.windGustKmh + " km/h";
}

// Builds one empty forecast card.
function createForecastCard() {
  const card = document.createElement("li");
  card.className = "forecast-card";

  ["fc-day", "fc-icon", "fc-condition", "fc-temps", "fc-rain"].forEach(function (name) {
    const part = document.createElement("span");
    part.className = name;
    card.appendChild(part);
  });

  return card;
}

// Writes one day of forecast data into a card.
function fillForecastCard(card, day) {
  card.querySelector(".fc-day").textContent = day.day;
  card.querySelector(".fc-icon").textContent = iconFor(day.condition);
  card.querySelector(".fc-icon").setAttribute("aria-hidden", "true");
  card.querySelector(".fc-condition").textContent = day.condition;
  card.querySelector(".fc-temps").textContent = day.highC + "° / " + day.lowC + "°";
  card.querySelector(".fc-rain").textContent = day.rainChancePercent + "% rain";
  card.setAttribute(
    "aria-label",
    day.day + ": " + day.condition + ", high " + day.highC + ", low " + day.lowC +
    ", " + day.rainChancePercent + " percent chance of rain"
  );
}

function renderForecast(forecast) {
  // Start with an empty list, then build one card per forecast day.
  forecastList.textContent = "";

  forecast.forEach(function (day, index) {
    const isLastDay = index === forecast.length - 1;

    // Choose which day's data this card shows.
    const source = (isLastDay && displayedForecast) ? displayedForecast[index] : day;

    const card = createForecastCard();
    fillForecastCard(card, source);
    forecastList.appendChild(card);
  });

  displayedForecast = forecast;
}

/* --------------------------------------------------------------------------
   7. Loading a city
   -------------------------------------------------------------------------- */
async function loadCity(rawName) {
  const cityName = String(rawName).trim();

  // Nothing typed: ask for input and leave everything else alone.
  if (cityName === "") {
    setStatus("Please type a city name or pick one of the cities below.");
    return;
  }

  lastRequestedCity = cityName;
  const requestId = ++latestRequestId;

  hideUnsupported();
  highlightChip(cityName);
  setStatus("Loading weather for " + cityName + "…");
  showLoading(true);
  cityHeading.textContent = cityName;

  try {
    const record = await fetchWeather(cityName, { simulateFailure: failureToggle.checked });

    // A newer request has started; ignore this older answer.
    if (requestId !== latestRequestId) {
      return;
    }

    if (record === null) {
      // Valid request, but no data for this city.
      weatherPanel.hidden = true;
      showUnsupported(cityName);
      setStatus("No sample data for " + cityName + ".");
      return;
    }

    renderCurrent(record);
    renderForecast(record.forecast);
    weatherPanel.hidden = false;
    setStatus("Showing sample weather for " + record.city + ".");
  } catch (error) {
    if (requestId !== latestRequestId) {
      return;
    }

    weatherPanel.hidden = true;
    showError("Could not load weather for " + cityName + ". " + error.message);
    setStatus("The request for " + cityName + " failed.");
  } finally {
    // Only the newest request controls the loading indicator.
    if (requestId === latestRequestId) {
      showLoading(false);
    }
  }
}

/* --------------------------------------------------------------------------
   8. Setup and event listeners
   -------------------------------------------------------------------------- */
function buildCityControls() {
  WEATHER_DATA.forEach(function (entry) {
    const option = document.createElement("option");
    option.value = entry.city;
    cityOptions.appendChild(option);

    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "chip";
    chip.textContent = entry.city;
    chip.dataset.city = entry.city;
    chip.setAttribute("aria-pressed", "false");
    cityChips.appendChild(chip);
  });
}

buildCityControls();

searchForm.addEventListener("submit", function (event) {
  event.preventDefault();
  loadCity(cityInput.value);
});

cityChips.addEventListener("click", function (event) {
  const chip = event.target.closest("button[data-city]");
  if (!chip) {
    return;
  }
  cityInput.value = chip.dataset.city;
  loadCity(chip.dataset.city);
});

retryButton.addEventListener("click", function () {
  hideError();
  loadCity(lastRequestedCity);
});

// Show a city when the page opens.
cityInput.value = "London";
loadCity("London");
