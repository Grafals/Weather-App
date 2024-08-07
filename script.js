const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const weatherContainer = document.querySelector(".weatherContainer");
const card = document.querySelector(".card");
const forecast = document.querySelector(".forecast");
const apiKey = "79963bb05ecf648412485f3e51d63536";

weatherForm.addEventListener("submit", async event => {
    event.preventDefault();

    const city = cityInput.value;

    if (city) {
        try {
            const weatherData = await getWeatherData(city);
            const forecastData = await getForecastData(city);
            displayWeatherInfo(weatherData);
            displayForecastInfo(forecastData);
        } catch (error) {
            console.error(error);
            displayError(error.message);
        }
    } else {
        displayError("Please enter a city");
    }
});

async function getWeatherData(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
        throw new Error("Could not fetch weather data");
    }

    return await response.json();
}

async function getForecastData(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
        throw new Error("Could not fetch forecast data");
    }

    return await response.json();
}

function displayWeatherInfo(data) {
    const { name: city, main: { temp }, weather: [{ description, id }] } = data;

    card.textContent = "";
    card.style.display = "block";

    const cityDisplay = document.createElement("h1");
    const tempDisplay = document.createElement("p");
    const descDisplay = document.createElement("p");
    const weatherEmoji = document.createElement("p");

    cityDisplay.textContent = city;
    tempDisplay.textContent = `${(temp - 273.15).toFixed(1)}°C`;
    descDisplay.textContent = description;
    weatherEmoji.textContent = getWeatherEmoji(id);

    cityDisplay.classList.add("cityDisplay");
    tempDisplay.classList.add("tempDisplay");
    descDisplay.classList.add("descDisplay");
    weatherEmoji.classList.add("weatherEmoji");

    card.appendChild(cityDisplay);
    card.appendChild(tempDisplay);
    card.appendChild(descDisplay);
    card.appendChild(weatherEmoji);
}

function displayForecastInfo(data) {
    forecast.textContent = "";

    const hourlyTitle = document.createElement("h2");
    hourlyTitle.textContent = "Hours Forcast";
    hourlyTitle.classList.add("forecastTitle");
    const hourlyContainer = document.createElement("div");
    hourlyContainer.classList.add("forecastHourly");

    const dailyTitle = document.createElement("h2");
    dailyTitle.textContent = "Days Forcast";
    dailyTitle.classList.add("forecastTitle");
    const dailyContainer = document.createElement("div");
    dailyContainer.classList.add("forecastDaily");

    // Hourly forecast
    for (let i = 0; i < 8; i++) {
        const hourlyData = data.list[i];
        const date = new Date(hourlyData.dt * 1000);
        const temp = (hourlyData.main.temp - 273.15).toFixed(1);
        const description = hourlyData.weather[0].description;
        const weatherId = hourlyData.weather[0].id;

        const forecastItem = document.createElement("div");
        forecastItem.classList.add("forecastItem");

        const timeDisplay = document.createElement("p");
        timeDisplay.textContent = `${date.getHours()}:00`;
        const tempDisplay = document.createElement("p");
        tempDisplay.textContent = `${temp}°C`;
        const descDisplay = document.createElement("p");
        descDisplay.textContent = description;
        const weatherEmoji = document.createElement("p");
        weatherEmoji.textContent = getWeatherEmoji(weatherId);

        forecastItem.appendChild(timeDisplay);
        forecastItem.appendChild(tempDisplay);
        forecastItem.appendChild(descDisplay);
        forecastItem.appendChild(weatherEmoji);

        hourlyContainer.appendChild(forecastItem);
    }

    // Daily forecast
    for (let i = 0; i < data.list.length; i += 8) {
        const dailyData = data.list[i];
        const date = new Date(dailyData.dt * 1000);
        const temp = (dailyData.main.temp - 273.15).toFixed(1);
        const description = dailyData.weather[0].description;
        const weatherId = dailyData.weather[0].id;

        const forecastItem = document.createElement("div");
        forecastItem.classList.add("forecastItem");

        const dateDisplay = document.createElement("p");
        dateDisplay.textContent = date.toLocaleDateString(undefined, { weekday: 'short' });
        const tempDisplay = document.createElement("p");
        tempDisplay.textContent = `${temp}°C`;
        const descDisplay = document.createElement("p");
        descDisplay.textContent = description;
        const weatherEmoji = document.createElement("p");
        weatherEmoji.textContent = getWeatherEmoji(weatherId);

        forecastItem.appendChild(dateDisplay);
        forecastItem.appendChild(tempDisplay);
        forecastItem.appendChild(descDisplay);
        forecastItem.appendChild(weatherEmoji);

        dailyContainer.appendChild(forecastItem);
    }

    forecast.appendChild(hourlyTitle);
    forecast.appendChild(hourlyContainer);
    forecast.appendChild(dailyTitle);
    forecast.appendChild(dailyContainer);
}

function getWeatherEmoji(weatherId) {
    switch (true) {
        case (weatherId >= 200 && weatherId < 300):
            return "🌩️"; // Thunderstorm
        case (weatherId >= 300 && weatherId < 400):
            return "🌦️"; // Drizzle
        case (weatherId >= 500 && weatherId < 600):
            return "🌧️"; // Rain
        case (weatherId >= 600 && weatherId < 700):
            return "❄️"; // Snow
        case (weatherId >= 700 && weatherId < 800):
            return "🌫️"; // Atmosphere
        case (weatherId === 800):
            return "☀️"; // Clear
        case (weatherId >= 801 && weatherId < 810):
            return "⛅"; // Clouds
        default:
            return "🌥️"; // Default emoji
    }
}

function displayError(message) {
    card.textContent = "";
    card.style.display = "block";

    const errorDisplay = document.createElement("p");
    errorDisplay.textContent = message;
    errorDisplay.classList.add("errorDisplay");

    card.appendChild(errorDisplay);
}
