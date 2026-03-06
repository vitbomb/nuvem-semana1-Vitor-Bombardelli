const cityEl = document.getElementById("city");
const btnCity = document.getElementById("btnCity");
const cityOut = document.getElementById("cityOut");

function showCity(obj) {
cityOut.textContent = typeof obj === "string" ? obj : JSON.stringify(obj, null, 2);
}

async function geocodeCity(name) {
const url = "https://geocoding-api.open-meteo.com/v1/search?name=" +
encodeURIComponent(name) + "&count=1&language=pt&format=json";
const resp = await fetch(url);
if (!resp.ok) throw new Error("HTTP " + resp.status);
const data = await resp.json();
const first = data.results && data.results[0];
if (!first) throw new Error("Cidade não encontrada");
return { name: first.name, lat: first.latitude, lon: first.longitude, country: first.country };
}

async function fetchWeather(lat, lon) {
const url = "https://api.open-meteo.com/v1/forecast?latitude=" + lat + "&longitude=" + lon +
"&current=temperature_2m,wind_speed_10m";
const resp = await fetch(url);
if (!resp.ok) throw new Error("HTTP " + resp.status);

return await resp.json();
}

btnCity.addEventListener("click", async function(){
const city = (cityEl.value || "").trim();
if (!city) return showCity("Digite uma cidade.");
showCity("Buscando...");
try {
localStorage.setItem("lastCity", city);

const geo = await geocodeCity(city);
const meteo = await fetchWeather(geo.lat, geo.lon);

showCity({
cidade: geo.name,
pais: geo.country,
temperatura: meteo.current?.temperature_2m,
vento: meteo.current?.wind_speed_10m,
unidades: meteo.current_units
});
} catch (err) {
showCity("Erro: " + err.message);
}
});

// Preencher automaticamente ao abrir
const last = localStorage.getItem("lastCity");
if (last) cityEl.value = last;
