console.log("script.js carregado!");

// Obter referências aos elementos HTML
const out = document.getElementById("out");
const btnGet = document.getElementById("btnGet");
const btnPost = document.getElementById("btnPost");
const cityEl = document.getElementById("city");
const btnCity = document.getElementById("btnCity");
const cityOut = document.getElementById("cityOut");
const statusEl = document.getElementById("status"); // Referência para o status
const clockEl = document.getElementById("clock");   // Referência para o relógio
const studentNameEl = document.querySelector(".container > p > span.muted"); // Para o nome do aluno

// --- Funções Auxiliares para Exibir Saídas ---

// Função auxiliar para exibir a saída principal (GET/POST)
function show(obj) {
    out.textContent = typeof obj === "string" ? obj : JSON.stringify(obj, null, 2);
}

// Função auxiliar para exibir a saída de clima por cidade
function showCity(obj) {
    cityOut.textContent = typeof obj === "string" ? obj : JSON.stringify(obj, null, 2);
}

// --- Funções de API (em escopo global para reusabilidade) ---

// Função para geocodificar o nome de uma cidade em coordenadas geográficas
async function geocodeCity(name) {
    const url = "https://geocoding-api.open-meteo.com/v1/search?name=" +
        encodeURIComponent(name) + "&count=1&language=pt&format=json";
    const resp = await fetch(url);
    if (!resp.ok) throw new Error("HTTP " + resp.status + " - Erro ao buscar cidade.");
    const data = await resp.json();
    const first = data.results && data.results[0];
    if (!first) throw new Error("Cidade não encontrada.");
    return { name: first.name, lat: first.latitude, lon: first.longitude, country: first.country };
}

// Função para buscar dados de clima usando latitude e longitude
async function fetchWeather(lat, lon) {
    const url = "https://api.open-meteo.com/v1/forecast?latitude=" + lat + "&longitude=" + lon +
        "&current=temperature_2m,wind_speed_10m";
    const resp = await fetch(url);
    if (!resp.ok) throw new Error("HTTP " + resp.status + " - Erro ao buscar clima.");
    return await resp.json();
}

// --- Funções de Manipulação de Eventos ---

// Manipulador de evento para o botão GET (clima para coordenadas fixas)
btnGet.addEventListener("click", async function() {
    show("Buscando clima (GET) para Oeste do PR...");
    try {
        const url = "https://api.open-meteo.com/v1/forecast?latitude=-24.33&longitude=-53.85&current=temperature_2m,wind_speed_10m";
        const resp = await fetch(url);
        if (!resp.ok) throw new Error("HTTP " + resp.status + " - Erro ao buscar clima fixo.");
        const data = await resp.json();

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
});

// Manipulador de evento para o botão POST (simulado)
btnPost.addEventListener("click", async function() {
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
        if (!resp.ok) throw new Error("HTTP " + resp.status + " - Erro ao enviar POST.");
        const data = await resp.json();
        show({ fonte: "jsonplaceholder.typicode.com", resposta: data });
    } catch (err) {
        show("Erro no POST: " + err.message);
    }
});

// Manipulador de evento para o botão "Buscar clima" por cidade
btnCity.addEventListener("click", async function() {
    const city = (cityEl.value || "").trim();
    if (!city) {
        return showCity("Por favor, digite o nome de uma cidade.");
    }
    showCity("Buscando clima para '" + city + "'...");
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
        showCity("Erro ao buscar clima para a cidade: " + err.message);
        console.error("Erro detalhado na busca de clima:", err); // Log de erro mais detalhado
    }
});

// --- Funções de Inicialização e Atualização Periódica ---

// Função para atualizar o relógio na interface
function updateClock() {
    const now = new Date();
    clockEl.textContent = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

// Função para preencher o nome do aluno (exemplo)
function setStudentName() {
    // Substitua 'Seu Nome Aqui' pelo seu nome real
    if (studentNameEl) {
        studentNameEl.textContent = "Seu Nome Aqui";
    }
}


// --- Execução ao carregar a página ---

// Preenche automaticamente o campo da cidade ao carregar a página (se houver um valor salvo)
const last = localStorage.getItem("lastCity");
if (last) {
    cityEl.value = last;
}

// Define o status inicial da página
if (statusEl) {
    statusEl.textContent = "Pronto!";
}

// Atualiza o relógio imediatamente e depois a cada segundo
if (clockEl) {
    updateClock();
    setInterval(updateClock, 1000); // Atualiza o relógio a cada 1 segundo
}

// Define o nome do aluno
setStudentName();```
