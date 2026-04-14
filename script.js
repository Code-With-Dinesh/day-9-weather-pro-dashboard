const apiKey = "dadbee070fba8c55cd3159bfbc142877";

// Update UI
function updateUI(data) {
  document.getElementById("city").innerText = data.name;
  document.getElementById("temp").innerText = data.main.temp + "°C";
  document.getElementById("desc").innerText = data.weather[0].description;
  document.getElementById("wind").innerText = data.wind.speed + " km/h";
  document.getElementById("humidity").innerText = data.main.humidity + "%";

  const icon = data.weather[0].icon;
  document.getElementById("icon").src =
    `https://openweathermap.org/img/wn/${icon}@2x.png`;
}

// Search weather
async function getWeather() {
  const city = document.getElementById("search").value;

  if (city === "") {
    alert("Enter city 😅");
    return;
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  const res = await fetch(url);
  const data = await res.json();

  if (data.cod !== 200) {
    alert("City not found ❌");
    return;
  }

  updateUI(data);
  getForecast(city);
}

// Forecast
async function getForecast(city) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  const res = await fetch(url);
  const data = await res.json();

  const forecastDiv = document.getElementById("forecast");
  forecastDiv.innerHTML = "";

  for (let i = 0; i < 5; i++) {
    const item = data.list[i * 8];

    const div = document.createElement("div");
    div.className = "forecast-item";

    div.innerHTML = `
      <p>${item.dt_txt.split(" ")[0]} - ${item.main.temp}°C</p>
    `;

    forecastDiv.appendChild(div);
  }
}

// Auto location
navigator.geolocation.getCurrentPosition(async (position) => {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;

  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  const res = await fetch(url);
  const data = await res.json();

  updateUI(data);
  getForecast(data.name);
});

// Enter key support
document.getElementById("search").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    getWeather();
  }
});
