// Obter referências aos elementos HTML
const out = document.getElementById("out");
const btnGet = document.getElementById("btnGet");
const btnPost = document.getElementById("btnPost");
const cityEl = document.getElementById("city");
const btnCity = document.getElementById("btnCity");
const cityOut = document.getElementById("cityOut");
const statusEl = document.getElementById("status"); // Referência para o status
const clockEl = document.getElementById("clock");   // Referência para o relógio

// Função auxiliar para exibir a saída principal
function show(obj) {
    out.textContent = typeof obj === "string" ? obj : JSON.stringify(obj, null, 2);
} // Chave de fechamento adicionada

// Função auxiliar para exibir a saída de clima por cidade
function showCity(obj) {
    cityOut.textContent = typeof obj === "string" ? obj : JSON.stringify(obj, null, 2);
}

// --- Funções de API (agora em escopo global) ---

// Função para geocodificar o nome de uma cidade
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

// Função para buscar dados de clima usando latitude e longitude
async function fetchWeather(lat, lon) {
    const url = "https://api.open-meteo.com/v1/forecast?latitude=" + lat + "&longitude=" + lon +
        "&current=temperature_2m,wind_speed_10m";
    const resp = await fetch(url);
    if (!resp.ok) throw new Error("HTTP " + resp.status);
    return await resp.json();
}

// --- Funções de Manipulação de Eventos ---

// Manipulador de evento para o botão GET (clima para coordenadas fixas)
async function httpGetWeather() {
    show("Buscando clima (GET) para Oeste do PR...");
    try {
        const url = "https://api.open-meteo.com/v1/forecast?latitude=-24.33&longitude=-53.85&current=temperature_2m,wind_speed_10m";
        const resp = await fetch(url); // Agora faz a requisição fetch
        if (!resp.ok) throw new Error("HTTP " + resp.status);
        const data = await resp.json(); // Obtém os dados da resposta

        show({
            fonte: "open-meteo.com",
            temperatura: data.current?.temperature_2m,
            vento: data.current?.wind_speed_10m,
            unidade_temp: data.current_units?.temperature_2m,
            unidade_vento: data.current_units?.wind_speed_10m,
            bruto: data
        });
    } catch (err) {
        show("Erro no GET: " + err.message + "\nDica: veja F12 > Network/Console.");
    }
}

// Manipulador de evento para o botão POST (simulado)
async function httpPostSimulado() {
    show("Enviando dados (POST simulado)...");
    try {
        const resp = await fetch("https://jsonplaceholder.typicode.com/posts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                turma: "Serviços em Nuvem",
                atividade: "Semana 2",
                timestamp: new Date().toISOString()
            })
        });
        if (!resp.ok) throw new Error("HTTP " + resp.status);
        const data = await resp.json();
        show({ fonte: "jsonplaceholder.typicode.com", resposta: data });
    } catch (err) {
        show("Erro no POST: " + err.message);
    }
}

// --- Atribuição de Listeners (agora em escopo global) ---
btnGet.addEventListener("click", httpGetWeather);
btnPost.addEventListener("click", httpPostSimulado);

// Manipulador de evento para o botão "Buscar clima" por cidade
btnCity.addEventListener("click", async function() {
    const city = (cityEl.value || "").trim();
    if (!city) return showCity("Digite uma cidade.");
    showCity("Buscando...");
    try {
        localStorage.setItem("lastCity", city); // Armazena a última cidade pesquisada

        const geo = await geocodeCity(city);     // Geocodifica a cidade
        const meteo = await fetchWeather(geo.lat, geo.lon); // Busca o clima com as coordenadas

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

// --- Inicialização da Página ---

// Preencher automaticamente o campo da cidade ao carregar a página
const last = localStorage.getItem("lastCity");
if (last) cityEl.value = last;

// Função para atualizar o relógio
function updateClock() {
    const now = new Date();
    clockEl.textContent = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

// Define o status inicial e inicia a atualização do relógio
statusEl.textContent = "Pronto!";
updateClock(); // Atualiza o relógio imediatamente
setInterval(updateClock, 1000); // Atualiza o relógio a cada segundo
