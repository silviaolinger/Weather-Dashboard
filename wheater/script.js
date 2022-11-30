const api = {
    key: "3a72c1c5a9c73d81b0beeb9afbe9910d",
    base: "https://api.openweathermap.org/data/2.5/",
    lang: "en_us",
    units: "imperial"

}

const city = document.querySelector('.city')
const date = document.querySelector('.date');
const container_img = document.querySelector('.container-img');
const container_temp = document.querySelector('.container-temp');
const temp_number = document.querySelector('.container-temp div');
const temp_unit = document.querySelector('.container-temp span');
const weather_t = document.querySelector('.weather');
const search_input = document.querySelector('.form-control');
const search_button = document.querySelector('.btn');
const low_high = document.querySelector('.low-high');
let humidity=document.querySelector('.humidity');
const divlist = document.querySelector(".listholder");
//const humidity_F=document.getElementById('humidity_F');
const wind_speed=document.querySelector('.windSpeed');






window.addEventListener('load', () => {
    //if ("geolocation" in navigator)
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(setPosition, showError);
    }
    else {
        alert('broweser doest not support geolocation');
    }
    function setPosition(position) {
        console.log(position)
        let lat = position.coords.latitude;
        let long = position.coords.longitude;
        coordResults(lat, long);
    }
    function showError(error) {
        alert(`erro: ${error.message}`);
    }
    const searchList = document.getElementById ("searchList");
//const search = JSON.parse(localStorage.getItem("savedsearch"))||[];
// to display the list in the screen
})







function coordResults(lat, long) {
  

    fetch(`${api.base}weather?lat=${lat}&lon=${long}&lang=${api.lang}&units=${api.units}&&APPID=${api.key}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`http error: status ${response.status}`)
            }
            return response.json();
        })
        .catch(error => {
            alert(error.message)
        })
        .then(response => {
            displayResults(response)
        });
}

var citySearchArray = localStorage.citySearchArray
  ? JSON.parse(localStorage.citySearchArray)
  : [];

function showCityButtons() {
  document.querySelector("#cityArray").innerHTML = "";
  for (i = 0; i < citySearchArray.length; i++)
    document.querySelector("#cityArray").innerHTML += `
	<li onclick="searchResults('${citySearchArray[i]}')"class="btn btn-secondary mb-1">${citySearchArray[i]}</li>`;
}

showCityButtons();


search_button.addEventListener('click', function() {
    searchResults(search_input.value)


    const city =search_input.value;
        citySearchArray.push(city);

        console.log(citySearchArray);
        
        localStorage.setItem('savedsearch',JSON.stringify(citySearchArray));
    showCityButtons();
        searchResults(city);
})

search_input.addEventListener('keypress', enter)
function enter(event) {
    key = event.keyCode
    if (key === 13) {
        searchResults(search_input.value)
    }
       
}

     
function searchResults(city) {
    
    fetch(`https://api.openweathermap.org/data/2.5/forecast/daily?q=${city}&units=${api.units}&cnt=7&appid=166a433c57516f51dfab1f7edaed8413`)
   
    .then(response => {
            if (!response.ok) {
                throw new Error(`http error: status ${response.status}`)
            }
            return response.json();
        })
        .catch(error => {
            alert(error.message)
        })
        .then(response => {
            displaySearchResults(response)
        })
            
        }


function displayResults(weather) {
    console.log(weather)
    
    city.innerText = `${weather.name}, ${weather.sys.country}`;
    let hum= weather.main.humidity
    humidity.innerHTML="Humidity: "+hum;
    let wind_s=weather.wind.speed;
    wind_speed.innerHTML="Wind Speed: " + wind_s

    let now = new Date();
    date.innerText = dateBuilder(now);

    let iconName = weather.weather[0].icon;
    container_img.innerHTML = `<img src="./icons/${iconName}.png">`;

    let temperature = `${Math.round(weather.main.temp)}`
    temp_number.innerHTML = temperature;
    temp_unit.innerHTML = `F`;

    weather_time = weather.weather[0].description;
    weather_t.innerText = capitalizeFirstLetter(weather_time)

    low_high.innerText = `${Math.round(weather.main.temp_min)}F / ${Math.round(weather.main.temp_max)}F`;
}
function displaySearchResults(weather) {
    console.log(weather)
    
    city.innerText = `${weather.city.name}, ${weather.city.country}`;
    let hum= weather.list[0].humidity
    humidity.innerHTML="Humidity: "+hum;
    let wind_s=weather.list[0].speed;
    wind_speed.innerHTML="Wind Speed: " + wind_s

    let now = new Date();
    date.innerText = dateBuilder(now);

    let iconName = weather.list[0].weather[0].icon;
    container_img.innerHTML = `<img src="./icons/${iconName}.png">`;

    let temperature = `${Math.round(weather.list[0].temp.day)}`
    temp_number.innerHTML = temperature;
    temp_unit.innerHTML = `F`;

    for(i = 0; i<5; i++){
        document.getElementById( "humidity_F" + (i+1)).innerHTML = "humidity: " + (weather.list[i].humidity)
        
        document.getElementById( "windSpeed" + (i+1)).innerHTML = "Wind: " + (weather.list[i].speed)
        
        document.getElementById( "temp" + (i+1)).innerHTML = (Math.round(weather.list[i].temp.day)) + " F"
        document.getElementById( "city" + (i+1)).innerText = `${weather.city.name}, ${weather.city.country}`;
        document.getElementById( "city" + (i+1)).innerText = `${weather.city.name}, ${weather.city.country}`;
        document.getElementById("day" + (i+1)).innerHTML = days[Check5Days(i)]
        document.getElementById("img" + (i+1)).src = "http://openweathermap.org/img/wn/"+
            weather.list[i].weather[0].icon
            +".png";
    
}
}
let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
let months = ["January", "February", "March", "Aprin", "May", "June", "July", "August", "September", "October", "November", "December"];
function dateBuilder(d) {
   
    
    let day = days[d.getDay()]; //getDay: 0-6
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();
    
    return `${day}, ${date} ${month} ${year}`;
    
}


function Check5Days(day){
    const d = new Date();
    if(day + d.getDay() > 6){
        return day + d.getDay() - 7;
    }
    else{
        return day + d.getDay();
    }
}

    

//5day forecast
function displayFiveDays(){
fetch(`${api.base}forecast?q=${city}&lang=${api.lang}&units=${api.units}&APPID=${api.key}`)
.then(response => {
    if (!response.ok) {
        throw new Error(`http error: status ${response.status}`)
    }
    return response.json();
})
.catch(error => {
    alert(error.message)
})
.then(response => {
    displayResults(response)
});
}




function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
function d(){
    let a=document.getElementById('x');
    searchResults(a.value);

}
