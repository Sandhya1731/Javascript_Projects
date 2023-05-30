const apiKey = "f9caacfa08d8d71371ab958e0a0c54dc";
const apiUrl =
  "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchbox = document.querySelector(".search input");
const searchbtn = document.querySelector(".search button");
const error = document.querySelector(".error");
async function checkWeather(city) {
  const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
  var data = await response.json();
  if (response.status == 404) {
    error.style.display = "block";
    document.querySelector(".weather").style.display = "none";
  } else {
    error.style.display = "none";
    document.querySelector(".temp").innerHTML =
      Math.round(data.main.temp) + "°c";
    document.querySelector(".city").innerHTML = data.name;
    document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
    document.querySelector(".wind").innerHTML = data.wind.speed + " km/hr";

    let weatherIcon = document.querySelector(".weather-icon");
    const weather = data.weather[0].main;

    switch (weather) {
      case "Clouds":
        weatherIcon.src = "./images/clouds.png";
        break;
      case "Rain":
        weatherIcon.src = "./images/rain.png";
        break;
      case "Clear":
        weatherIcon.src = "./images/clear.png";
        break;
      case "Drizzle":
        weatherIcon.src = "./images/drizzle.png";
        break;
      case "Mist":
        weatherIcon.src = "./images/mist.png";
        break;
    }

    document.querySelector(".weather").style.display = "block";
  }
  // console.log(data);
}

searchbtn.addEventListener("click", findCity);

function findCity(event) {
  event.preventDefault();
  const city = searchbox.value;
  searchbox.value = "";
  checkWeather(city);
}
