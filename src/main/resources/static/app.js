// The  Weather API URL
const WEATHER_API_URL = "https://api.open-meteo.com/v1/forecast";

// Array containing Top 10 Cities objects
const top_cities = [
    { name: "Vancouver", country: "Canada", lat: 49.25, long: -123.12 },
    { name: "Hanoi", country: "Vietnam", lat: 21.02, long: 105.83 },
    { name: "Ho Chi Minh City", country: "Vietnam", lat: 10.82, long: 106.63 },
    { name: "Tokyo", country: "Japan", lat: 35.68, long: 139.65 },
    { name: "New York", country: "USA", lat: 40.71, long: -74.01 },
    { name: "London", country: "UK", lat: 51.51, long: -0.13 },
    { name: "Paris", country: "France", lat: 48.85, long: 2.35 },
    { name: "Sydney", country: "Australia", lat: -33.87, long: 151.21 },
    { name: "Dubai", country: "UAE", lat: 25.20, long: 55.27 },
    { name: "Rio de Janeiro", country: "Brazil", lat: -22.91, long: -43.17 }
];

// Top 10 buttons container element
const city_list_container = document.getElementById("city-list");

// The weather results card
const weather_result_card = document.getElementById("weather-result");

// The loading text element
const loading_text = document.getElementById("loading");

// The error message element
const error_message = document.getElementById("error-message");

// Create the button for each city in Top 10 Cities List
top_cities.forEach(city => {
    const btn = document.createElement("button");
    btn.textContent = city.name;
    btn.className = "city-btn";

    // Add a fetch weather event when clicking to the button
    btn.onclick = () => fetchWeather(city.lat, city.long, `${city.name}, ${city.country}`);

    // Add button to the container
    city_list_container.appendChild(btn);
});

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
