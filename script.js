// const weatherForm = document.querySelector('.input-form')
// const  cityInput = document.querySelector('.cityInput')
// const  card = document.querySelector('.weather-card')
// const forecastCard = document.querySelector('.forecast-cards')
// const hourlyCard = document.querySelector('.hourly-cards')
// const apiKey = "92e9ca1fb15dd49615992493c4ab59e2"


// window.addEventListener('load' , () => {
//     getWeatherData('Nagpur').then(displayWeather).catch(displayError)
// })

// weatherForm.addEventListener('submit',async event =>{
//     event.preventDefault()
//     const city = cityInput.value

//     if(city){
//         try{
//             const weatherData = await getWeatherData(city)
//             const forecastData = await getForecastData(city)
//             displayWeather(weatherData)
//             displayForecast(forecastData)
            

//         }
//         catch(error){
//             console.error(error)
//             displayError(error)
//         }
//     }
//     else{
//         displayError('Please fill in the city')
//     }
// })

// async function getWeatherData(city) {
//     const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`

//     const response = await fetch(apiUrl)
//     // console.log(response)

//     if(!response.ok){
//         throw new Error("Could not fetch weather data")
//     }

//     return await response.json()
// }

// function displayWeather(data){
//     console.log(data)

//     const {name:city, 
//             main:{temp,humidity},
//             weather:[{description,id}],
//             coord:{lon,lat}} = data
    
//     // card.innerHTML = ''
//     // card.style.display = 'flex'

//     card.innerHTML = `
//         <h1 class="city-name">${city}</h1>
//         <p class="city-temp">Temperature : ${(temp-273.15).toFixed(2)}°C</p>
//         <p class="city-humid">Humidity : ${humidity}%</p>
//         <p class="city-desc-display">${description}</p>
//         <p class="weather-emoji">${getWeatherEmoji(id)}</p>
//     `
// }

// function getWeatherEmoji(weatherId){
//     if (weatherId >= 200 && weatherId < 300) return '⛈️';
//     if (weatherId >= 300 && weatherId < 500) return '🌦️';
//     if (weatherId >= 500 && weatherId < 600) return '🌧️';
//     if (weatherId >= 600 && weatherId < 700) return '❄️';
//     if (weatherId >= 700 && weatherId < 800) return '🌫️';
//     if (weatherId === 800) return '☀️';
//     if (weatherId > 800) return '☁️';
//     return '❓';
// }

// function displayError(message){
//     card.innerHTML = `
//         <p class="errorDisplay">${message}</p>
//     `;
//     card.style.display = 'flex';
// }


// async function getForecastData(city) {
//     const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`

//     const geoResponse = await fetch(apiUrl)
//     if(!geoResponse.ok){
//         throw new Error("Could not fetch forecast data")
//     }
//     const geoData = await geoResponse.json()
//     const {lat, lon} = geoData.coord
//     console.log(lat, lon)

//     const hourlyUrl = `https://pro.openweathermap.org/data/2.5/forecast/hourly?lat=${lat}&lon=${lon}&appid=${apiKey}`
//     const hourlyResponse = await fetch(hourlyUrl)
//     if(!hourlyResponse.ok){
//         throw new Error("Could not fetch hourly data")
//     }
//     const hourlyData = await hourlyResponse.json()

//     const dailyUrl = `https://api.openweathermap.org/data/2.5/forecast/daily?lat=${lat}&lon=${lon}&cnt=${10}&appid=${apiKey}`
//     const dailyResponse = await fetch(dailyUrl)
//     if(!dailyResponse.ok){
//         throw new Error("Could not fetch daily data")
//     }
//     const dailyData = await dailyResponse.json()
//     return {
//         hourly: hourlyData,
//         daily: dailyData
//     }
// }


// function displayForecast(data) {
//     const {hourly, daily} = data

//     forecastCard.innerHTML = ''
//     hourlyCard.innerHTML = ''

//     // Display hourly forecast
//     hourly.list.forEach((hour) => {
//         const date = new Date(hour.dt * 1000)
//         const hourElement = document.createElement('div')
//         hourElement.classList.add('hourly-card')
//         hourElement.innerHTML = `
//             <p>${date.getHours()}:00</p>
//             <p>${(hour.main.temp - 273.15).toFixed(2)}°C</p>
//             <p>${getWeatherEmoji(hour.weather[0].id)}</p>
//         `
//         hourlyCard.appendChild(hourElement)
//     })

//     // Display daily forecast
//     daily.list.forEach((day) => {
//         const date = new Date(day.dt * 1000)
//         const dayElement = document.createElement('div')
//         dayElement.classList.add('forecast-card')
//         dayElement.innerHTML = `
//             <p>${date.toDateString()}</p>
//             <p>${(day.temp.day - 273.15).toFixed(2)}°C</p>
//             <p>${getWeatherEmoji(day.weather[0].id)}</p>
//         `
//         forecastCard.appendChild(dayElement)
//     })
// }



const weatherForm = document.querySelector('.input-form')
const cityInput = document.querySelector('.cityInput')
const card = document.querySelector('.weather-card')
const forecastCard = document.querySelector('.forecast-cards')
const hourlyCard = document.querySelector('.hourly-cards')
const apiKey = "92e9ca1fb15dd49615992493c4ab59e2"

window.addEventListener('load', () => {
    getWeatherData('Nagpur').then(displayWeather).catch(displayError)
    getForecastData('Nagpur').then(displayForecast).catch(displayError)
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
        main: { temp, humidity },
        weather: [{ description, id }]
    } = data

    card.innerHTML = `
        <h1 class="city-name">${city}</h1>
        <p class="city-temp">Temperature : ${(temp - 273.15).toFixed(2)}°C</p>
        <p class="city-humid">Humidity : ${humidity}%</p>
        <p class="city-desc-display">${description}</p>
        <p class="weather-emoji">${getWeatherEmoji(id)}</p>
    `
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

    // ✅ No .list here — just loop through hourly array
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

// ...existing code...

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

