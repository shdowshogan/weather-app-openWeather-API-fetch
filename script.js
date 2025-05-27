const weatherForm = document.querySelector('.input-form')
const cityInput = document.querySelector('.cityInput')
const card = document.querySelector('.weather-card')
const forecastCard = document.querySelector('.forecast-cards')
const hourlyCard = document.querySelector('.hourly-cards')
const apiKey = "92e9ca1fb15dd49615992493c4ab59e2"
const sunriseElement = document.querySelector('.sunrise')
const sunsetElement = document.querySelector('.sunset')
const visibilityElement = document.querySelector('.visibility')
const pressureElement = document.querySelector('.pressure')
const feels_likeElement = document.querySelector('.feels-like-temp')
const cloudCoverElement = document.querySelector('.cloud-cover')
const windSpeedElement = document.querySelector('.wind-speed-dir')
const countryElement = document.querySelector('.country-name')


window.addEventListener('load', () => {
    getWeatherData('Nagpur').then(displayWeather).catch(displayError)
    getForecastData('Nagpur').then(displayForecast).catch(displayError)
    cityInput.value = ''
})

weatherForm.addEventListener('submit', async event => {
    event.preventDefault()
    const city = cityInput.value

    if (city) {
        try {
            const weatherData = await getWeatherData(city)
            const forecastData = await getForecastData(city)

            displayWeather(weatherData)
            displayForecast(forecastData)
        } catch (error) {
            console.error(error)
            displayError(error.message)
        }
    } else {
        displayError('Please fill in the city')
    }
})

async function getWeatherData(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
    const response = await fetch(apiUrl)
    if (!response.ok) throw new Error("Could not fetch weather data")
    return await response.json()
}

function displayWeather(data) {
    const {
        name: city,
        main: { temp, humidity,pressure,grnd_level , sea_level,feels_like },
        weather: [{ description, id }],
        sys: { sunrise, sunset ,country},
        visibility,
        wind,clouds
    } = data

    const sunriseTime = new Date(sunrise * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    const sunsetTime = new Date(sunset * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    const visibilityKm = (visibility / 1000).toFixed(2)
    const pressureHpa = pressure.toFixed(2)
    const pressureGrnd = grnd_level ? grnd_level.toFixed(2) : 'N/A'
    const feelsLikeCelsius = (feels_like - 273.15).toFixed(2)
    const windSpeed = wind.speed ? wind.speed.toFixed(2) : 'N/A'
    const windDirection = getWindDirection(wind.deg)
    const cloudCover = clouds.all ? `${clouds.all}%` : 'N/A'
    const countryName = getCountryName(country)

    card.innerHTML = `
        <h1 class="city-name">${city}</h1>
        <p class="city-temp">Temperature : ${(temp - 273.15).toFixed(2)}°C</p>
        <p class="city-humid">Humidity : ${humidity}%</p>
        <p class="city-desc-display">${description}</p>
        <p class="weather-emoji">${getWeatherEmoji(id)}</p>
    `

    sunriseElement.innerHTML = `
        <h1>Sunrise <img src="icons/sunrise.png"></h1>
        <p class="sunrise-html">${sunriseTime}</p>
    `
    sunsetElement.innerHTML = `
        <h1>Sunset <img src="icons/sunset.png"></h1>
        <p class="sunset-html">${sunsetTime}</p>
    `
    visibilityElement.innerHTML = `
        <h1>Visibility(KM) <img src="icons/visibility.png"></h1>
        <p class="visibility-html">${visibilityKm}</p>
    `

    pressureElement.innerHTML = `
        <h1>Pressure(hPa) <img src="icons/gauge.png"></h1>
        <p class="pressure-html">${pressureHpa}</p>
    `
    feels_likeElement.innerHTML = `
        <h1>Feels Like</h1>
        <p class="feels-like-html">${feelsLikeCelsius}°C</p>
    `
    cloudCoverElement.innerHTML = `
        <h1>Cloud Cover</h1>
        <p class="cloud-cover-html">${cloudCover}</p>
    `
    windSpeedElement.innerHTML = `
        <h1>Wind Speed & <br> Direction</h1>
        <p class="wind-speed-html">${windSpeed} m/s</p>
        <div style="display: flex; align-items: center; justify-content: start; ">
            <p class="wind-direction-html">${windDirection}</p> 
            <img src="icons/compass.png">
        </div>
        `
        
    countryElement.innerHTML = `
        <h1>Country</h1>
        <p class="country-name-html">${countryName}</p>
    `
}
function getCountryName(countryCode) {
    const countryNames = new Intl.DisplayNames(['en'], { type: 'region' });
    if (!countryCode) return 'Unknown Country';
    return countryNames.of(countryCode.toUpperCase());
}


function getWindDirection(deg) {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(deg / 45) % 8; 
    return directions[index]
}

function getWeatherEmoji(weatherId) {
    if (weatherId >= 200 && weatherId < 300) return '⛈️';
    if (weatherId >= 300 && weatherId < 500) return '🌦️';
    if (weatherId >= 500 && weatherId < 600) return '🌧️';
    if (weatherId >= 600 && weatherId < 700) return '❄️';
    if (weatherId >= 700 && weatherId < 800) return '🌫️';
    if (weatherId === 800) return '☀️';
    if (weatherId > 800) return '☁️';
    return '❓';
}

function displayError(message) {
    card.innerHTML = `<p class="errorDisplay">${message}</p>`;
    card.style.display = 'flex';
}

async function getForecastData(city) {
    const geoUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
    const geoResponse = await fetch(geoUrl)
    if (!geoResponse.ok) throw new Error("Could not fetch location data")
    const geoData = await geoResponse.json()
    console.log(geoData)
    const { lat, lon } = geoData.coord

    // Free plan 5-day/3-hour forecast API
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    const forecastResponse = await fetch(forecastUrl)
    if (!forecastResponse.ok) {
        const errorText = await forecastResponse.text()
        console.error("Forecast API error:", errorText)
        throw new Error("Could not fetch forecast data")
    }

    const fullForecast = await forecastResponse.json()

    return {
        hourly: fullForecast.list.slice(0, 8), // Next 24 hours (3-hour steps)
        daily: fullForecast.list.filter((_, i) => i % 8 === 0).slice(0, 10) // Approx daily for 10 days
    }
}


function displayForecast(data) {
    const { hourly, daily } = data

    forecastCard.innerHTML = ''
    hourlyCard.innerHTML = ''

    hourly.forEach((hour) => {
        const date = new Date(hour.dt * 1000)
        const hourElement = document.createElement('div')
        hourElement.classList.add('hourly-daily-forecast')
        hourElement.innerHTML = `
            <p>${date.getHours()}:00</p>
            <p>${hour.main.temp.toFixed(2)}°C</p>
            <p class="weather-emoji">${getWeatherEmoji(hour.weather[0].id)}</p>
        `
        hourlyCard.appendChild(hourElement)
    })

    daily.forEach((day) => {
        const date = new Date(day.dt * 1000)
        const dayElement = document.createElement('div')
        dayElement.classList.add('hourly-daily-forecast')
        dayElement.innerHTML = `
            <p>${date.toLocaleDateString('en-US',{weekday: 'short'})}</p>
            <p>${day.main.temp.toFixed(2)}°C</p>
            <p class="weather-emoji">${getWeatherEmoji(day.weather[0].id)}</p>
        `
        forecastCard.appendChild(dayElement)
    })
}


const getLocationBtn = document.getElementById('getLocationBtn');

if (getLocationBtn) {
    getLocationBtn.addEventListener('click', () => {
        if (navigator.geolocation) {
            getLocationBtn.disabled = true;
            getLocationBtn.textContent = "Locating...";
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    // Reverse geocode to get city name
                    const geoRes = await fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${apiKey}`);
                    const geoData = await geoRes.json();
                    if (geoData && geoData.length > 0) {
                        let city = geoData[0].name.split(" ")[0];
                        cityInput.value = city;
                        // Fetch and display weather
                        const weatherData = await getWeatherData(city);
                        const forecastData = await getForecastData(city);
                        displayWeather(weatherData);
                        displayForecast(forecastData);
                    } else {
                        displayError("Could not determine your city.");
                    }
                } catch (err) {
                    displayError("Location error: " + err.message);
                }
                getLocationBtn.disabled = false;
                getLocationBtn.textContent = "Use My Location";
            }, (error) => {
                displayError("Location access denied.");
                getLocationBtn.disabled = false;
                getLocationBtn.textContent = "Use My Location";
            });
        } else {
            displayError("Geolocation is not supported by your browser.");
        }
    });
}

function scaleContainer(scaleFactor = 1) {
    const container = document.querySelector('.container');
    if (!container) return;

    container.style.transform = `scale(${scaleFactor})`;
    
}

// Automatically determine scale based on width
function autoScaleContainer() {
    const width = window.innerWidth;

    // Example: scale down on smaller screens
    let scaleFactor = 1;
    if (width < 1840 && width >= 1700) {
        scaleFactor = 0.9;
    } else if (width < 1700 && width >= 1600) {
        scaleFactor = 0.85;
    } else if (width < 1600 && width >= 1500) {
        scaleFactor = 0.8;
    } else if (width < 1500) {
        scaleFactor = 0.75;
    }

    scaleContainer(scaleFactor);
}

// Listen to resize and initial load
window.addEventListener('resize', autoScaleContainer);
window.addEventListener('load', autoScaleContainer);

