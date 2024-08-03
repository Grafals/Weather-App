const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const card = document.querySelector(".card");
const apiKey = "79963bb05ecf648412485f3e51d63536";

weatherForm.addEventListener("submit", async event => {

    event.preventDefault();

    const city = cityInput.value;

    if(city){
        try{
            const weatherData = await getWeatherData(city);
            displayWeatherInfo(weatherData);
        }
        catch(error){
            console.error(error);
            displayError(error);
        }
    }
    else{
        displayError("Please enter a city");
    }
});

async function getWeatherData(city){

    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    const response = await fetch(apiUrl);

    if(!response.ok){
        throw new Error("Could not fetch weather data");
    }

    return await response.json();
}

function displayWeatherInfo(data){

    const {name: city, 
           main: {temp, humidity, pressure, feels_like},
           weather: [{description, id}],
           wind: {speed: windSpeed},
           clouds: {all: cloudiness}} = data;

    card.textContent = "";
    card.style.display = "flex";

    const cityDisplay = document.createElement("h1");
    const tempDisplay = document.createElement("p");
    const humidityDisplay = document.createElement("p");
    const pressureDisplay = document.createElement("p");
    const windDisplay = document.createElement("p");
    const cloudsDisplay = document.createElement("p");
    const feelsLikeDisplay = document.createElement("p");
    const descDisplay = document.createElement("p");
    const weatherEmoji = document.createElement("p");

    cityDisplay.textContent = city;
    tempDisplay.textContent = `Temperature: ${temp.toFixed(1)}°C`;
    humidityDisplay.textContent = `Humidity: ${humidity}%`;
    pressureDisplay.textContent = `Pressure: ${pressure} hPa`;
    windDisplay.textContent = `Wind Speed: ${windSpeed} m/s`;
    cloudsDisplay.textContent = `Cloudiness: ${cloudiness}%`;
    feelsLikeDisplay.textContent = `Feels Like: ${feels_like.toFixed(1)}°C`;
    descDisplay.textContent = description.charAt(0).toUpperCase() + description.slice(1);
    weatherEmoji.textContent = getWeatherEmoji(id);

    cityDisplay.classList.add("cityDisplay");
    tempDisplay.classList.add("tempDisplay");
    humidityDisplay.classList.add("humidityDisplay");
    pressureDisplay.classList.add("pressureDisplay");
    windDisplay.classList.add("windDisplay");
    cloudsDisplay.classList.add("cloudsDisplay");
    feelsLikeDisplay.classList.add("feelsLikeDisplay");
    descDisplay.classList.add("descDisplay");
    weatherEmoji.classList.add("weatherEmoji");

    card.appendChild(cityDisplay);
    card.appendChild(tempDisplay);
    card.appendChild(humidityDisplay);
    card.appendChild(pressureDisplay);
    card.appendChild(windDisplay);
    card.appendChild(cloudsDisplay);
    card.appendChild(feelsLikeDisplay);
    card.appendChild(descDisplay);
    card.appendChild(weatherEmoji);
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

function displayError(message){

    const errorDisplay = document.createElement("p");
    errorDisplay.textContent = message;
    errorDisplay.classList.add("errorDisplay");

    card.textContent = "";
    card.style.display = "flex";
    card.appendChild(errorDisplay);
}
