const weatherForm = document.querySelector('.input-form')
const  cityInput = document.querySelector('.cityInput')
const  card = document.querySelector('.weather-card')
const apiKey = "92e9ca1fb15dd49615992493c4ab59e2"


window.addEventListener('load' , () => {
    getWeatherData('Nagpur').then(displayWeather).catch(displayError)
})

weatherForm.addEventListener('submit',async event =>{
    event.preventDefault()
    const city = cityInput.value

    if(city){
        try{
            const weatherData = await getWeatherData(city)
            displayWeather(weatherData)
        }
        catch(error){
            console.error(error)
            displayError(error)
        }
    }
    else{
        displayError('Please fill in the city')
    }
})

async function getWeatherData(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`

    const response = await fetch(apiUrl)
    // console.log(response)

    if(!response.ok){
        throw new Error("Could not fetch weather data")
    }

    return await response.json()
}

function displayWeather(data){
    console.log(data)

    const {name:city, 
            main:{temp,humidity},
            weather:[{description,id}]} = data
    
    // card.innerHTML = ''
    // card.style.display = 'flex'

    card.innerHTML = `
        <h1 class="city-name">${city}</h1>
        <p class="city-temp">Temperature : ${(temp-273.15).toFixed(2)}°C</p>
        <p class="city-humid">Humidity : ${humidity}%</p>
        <p class="city-desc-display">${description}</p>
        <p class="weather-emoji">${getWeatherEmoji(id)}</p>
    `
}

function getWeatherEmoji(weatherId){
    if (weatherId >= 200 && weatherId < 300) return '⛈️';
    if (weatherId >= 300 && weatherId < 500) return '🌦️';
    if (weatherId >= 500 && weatherId < 600) return '🌧️';
    if (weatherId >= 600 && weatherId < 700) return '❄️';
    if (weatherId >= 700 && weatherId < 800) return '🌫️';
    if (weatherId === 800) return '☀️';
    if (weatherId > 800) return '☁️';
    return '❓';
}

function displayError(message){
    card.innerHTML = `
        <p class="errorDisplay">${message}</p>
    `;
    card.style.display = 'flex';
}