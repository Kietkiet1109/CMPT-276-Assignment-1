// The Geo API URL for searching
const GEO_API_URL = "https://geocoding-api.open-meteo.com/v1/search";

// The  Weather API URL
const WEATHER_API_URL = "https://api.open-meteo.com/v1/forecast";

// The input text box
const search_input = document.getElementById("city-input");

// The "View City" button
const search_button = document.getElementById("view-city-btn");

// The weather results card
const weather_result_card = document.getElementById("weather-result");

// The loading text element
const loading_text = document.getElementById("loading");

// The error message element
const error_message = document.getElementById("error-message");

// Event Listener for Search button
search_button.addEventListener("click", () => {

    // Get the value typed into the input box
    const city_name = search_input.value.trim();

    // Check if the city name not empty
    if (city_name) {
        // Search for coordinates based on the city name
        searchCityCoordinates(city_name);
    } else {
        // Show an error message
        showError("Please enter a city name.");
    }
});

// Function to search for City Coordinates using Geo URL
async function searchCityCoordinates(city_name) {

    // Show the loading text when waiting to fetch
    showLoading(true);

    try {
        // Requesting Coordinates using Geo API
        const response = await fetch(`${GEO_API_URL}?name=${city_name}&count=1&language=en&format=json`);
        const data = await response.json();

        // Check if the city was found
        if (!data.results || data.results.length === 0) {
            throw new Error("City not found. Please try again.");
        }

        // Extract latitude, longitude, name, and country
        const { latitude, longitude, name, country } = data.results[0];

        // Fetch weather using the found coordinates
        fetchWeather(latitude, longitude, `${name}, ${country}`);

    } catch (error) {
        // Display the error message to the user
        showError(error.message);
        showLoading(false);
    }
}

// Function to fetch the actual weather using coordinates
async function fetchWeather(lat, long, city_name) {

    // Show the loading text when waiting to fetch
    showLoading(true);

    // Requesting temp, humidity, and wind speed using the API URL
    const url = `${WEATHER_API_URL}?latitude=${lat}&longitude=${long}&current=temperature_2m,relative_humidity_2m,wind_speed_10m`;

    try {
        // Send the request to the weather API
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch weather data.");

        // Parse the data from the response
        const data = await response.json();
        renderWeather(data.current, city_name);

    } catch (error) {
        // Show any errors that occurred
        showError(error.message);
    } finally {
        // Turn off loading text when done fetching
        showLoading(false);
    }
}


// Function to update the HTML UI
function renderWeather(current_data, city_name) {
    // Hide error text
    error_message.classList.add("hidden");

    // Show result
    weather_result_card.classList.remove("hidden");

    // Update the HTML with new data
    document.getElementById("display-city").textContent = city_name;
    document.getElementById("display-temp").textContent = current_data.temperature_2m;
    document.getElementById("display-wind").textContent = current_data.wind_speed_10m;
    document.getElementById("display-humidity").textContent = current_data.relative_humidity_2m;
}

// Function to toggle the loading state
function showLoading(isLoading) {
    if (isLoading) {
        // Show the loading text
        loading_text.classList.remove("hidden");

        // Hide old result
        weather_result_card.classList.add("hidden");

        // Hide old error message
        error_message.classList.add("hidden");
    } else {
        // Hide the loading text
        loading_text.classList.add("hidden");
    }
}

// Function to display error messages
function showError(message) {
    // Set the text of the error element
    error_message.textContent = message;

    // Show the error message
    error_message.classList.remove("hidden");

    // Hide the result
    weather_result_card.classList.add("hidden");

    // Hide the loading text
    loading_text.classList.add("hidden");
}
