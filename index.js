const API_KEY = "b18bdaf5b1abb97ac271d680a7461b59";

// search button funtionality

const clearBtn = document.querySelector("#clearBtn"),
  input = document.querySelector("[data-input-text]"),
  searchBtn = document.querySelector("[data-search-btn]"),
  currentWeatherCardDiv = document.querySelector(".weather_details"),
  weatherCardDiv = document.querySelector(".more_weather");

function handleClearBtn(e) {
  let inputValue = e.target.value;
  //   console.log(inputValue);
  if (inputValue.length >= 1) {
    clearBtn.classList.add("show");
  } else {
    clearBtn.classList.remove("show");
  }
}

function clearText() {
  input.value = "";
  clearBtn.classList.remove("show");
}

const creatingCard = (cityName, weatherItem, index) => {
  if (index === 0) {
    return `
        <div class="city">
                    <h2 class="city_name">${cityName},</h2>
                    <p class="current_day">[${
                      weatherItem.dt_txt.split(" ")[0]
                    }]</p>
                </div>
                <p class="temprature">${(
                  weatherItem.main.temp - 273.15
                ).toFixed(2)}° C</p>
                <div class="weather_info">
                    <div class="weather_img">
                    <img src="https://openweathermap.org/img/wn/${
                      weatherItem.weather[0].icon
                    }@4x.png" alt="">
                    </div>
                    <p class="weather_title">${
                      weatherItem.weather[0].description
                    }</p>
                </div>
                <div class="weather_conditon">
                    <p class="wind">Wind: ${weatherItem.wind.speed}m/s</p>
                    <p class="pressure">Humidity: ${
                      weatherItem.main.humidity
                    }%</p>
                </div>
                <div class="weather_temp">
                    <p class="min_temp">Min: ${(
                      weatherItem.main.temp_min - 273.15
                    ).toFixed(2)}° C</p>
                    <p class="max_temp">Max: ${(
                      weatherItem.main.temp_max - 273.15
                    ).toFixed(2)}° C</p>
                </div>`;
  } else {
    return `<div class="weather_box">
                <div class="small_img">
                <img src="https://openweathermap.org/img/wn/${
                  weatherItem.weather[0].icon
                }@2x.png" alt="">
                </div>
                <div class="small_weather_info">
                <p class="date">(${weatherItem.dt_txt.split(" ")[0]})</p>
                <p class="temp">Temp:${(weatherItem.main.temp - 273.15).toFixed(
                  2
                )}° C</p>
                <p class="humid">Humidity: ${weatherItem.main.humidity}%</p>
                </div>
                </div>`;
  }
};

const getWeatherInfo = (cityName, lat, lon) => {
  const weather_url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
  fetch(weather_url)
    .then((response) => response.json())
    .then((result) => {
      // filtering for getting different days
      const uniqueDates = [];
      const fourDaysData = result.list.filter((info) => {
        const forecastdate = new Date(info.dt_txt).getDate();
        if (!uniqueDates.includes(forecastdate)) {
          return uniqueDates.push(forecastdate);
        }
      });

      //   clearing previous data
      input.value = "";
      currentWeatherCardDiv.innerHTML = "";
      weatherCardDiv.innerHTML = "";
      clearBtn.classList.remove("show");
      //   console.log(fourDaysData);
      fourDaysData.forEach((weatherItem, index) => {
        if (index === 0) {
          currentWeatherCardDiv.insertAdjacentHTML(
            "beforeend",
            creatingCard(cityName, weatherItem, index)
          );
        } else {
          weatherCardDiv.insertAdjacentHTML(
            "beforeend",
            creatingCard(cityName, weatherItem, index)
          );
        }
      });
    })
    .catch(() => {
        showAlert("Error occurred while fetching data");
      });
};

function getCityDetails() {
  let cityName = input.value.trim();
  if (!cityName) return showAlert("Enter city name");

  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (!data.length) return showAlert(`Data not found for ${cityName}`);
      const { name, lat, lon } = data[0];
      getWeatherInfo(name, lat, lon);
    })
    .catch(() => {
      showAlert("Error occurred while fetching data");
    });
}
const customToast = document.getElementById('customToast');
function showAlert(message) {
    customToast.textContent = message;
    customToast.classList.add('show');
    setTimeout(() => {
        customToast.classList.remove('show');
        
    }, 3000);
    input.value = "";
    clearBtn.classList.remove("show");
}

clearBtn.addEventListener("click", clearText);
searchBtn.addEventListener("click", getCityDetails);
input.addEventListener("input", handleClearBtn);
