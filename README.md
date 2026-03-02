# Semana 1 - Deploy estatico (GitHub Pages)
## Links
- Repositorio: https://github.com/vitbomb/nuvem-semana1-Vitor-Bombardelli
- Site (GitHub Pages): https://vitbomb.github.io/nuvem-semana1-Vitor-Bombardelli/
## O que foi feito
- Criei index.html, style.css e script.js pelo navegador
- Ativei GitHub Pages (main / root)
## Dificuldades
- Não houveram dificuldades, pois a atividade estava muito bem explicada no PDF.
# Semana 2 - HTTP e Fetch (sem Node)
-Objetivo  de implementar no site um
consumo de API com fetch.
## Dificuldades
-Houve um erro no console após as modificações no código.
"Uncaught SyntaxError: Unexpected number"
- O erro foi causado devido a ter um texto e número perdido no código, após a identificação do texto e eliminação do mesmo, a API funcionou.
- Ao buscar clima, aparece:
- {
  "fonte": "open-meteo.com",
  "temperatura": 23,
  "vento": 14.5,
  "unidade_temp": "°C",
  "unidade_vento": "km/h",
  "bruto": {
    "latitude": -24.375,
    "longitude": -53.875,
    "generationtime_ms": 0.054717063903808594,
    "utc_offset_seconds": 0,
    "timezone": "GMT",
    "timezone_abbreviation": "GMT",
    "elevation": 329,
    "current_units": {
      "time": "iso8601",
      "interval": "seconds",
      "temperature_2m": "°C",
      "wind_speed_10m": "km/h"
    },
    "current": {
      "time": "2026-03-02T11:15",
      "interval": 900,
      "temperature_2m": 23,
      "wind_speed_10m": 14.5
    }
  }

}
-E ao simular um envio de dados:
{
  "fonte": "jsonplaceholder.typicode.com",
  "resposta": {
    "turma": "Serviços em Nuvem",
    "atividade": "Semana 2",
    "timestamp": "2026-03-02T11:23:04.749Z",
    "id": 101
  }
}
