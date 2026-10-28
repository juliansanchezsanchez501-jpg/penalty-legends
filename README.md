# Street Legends ⚽

Juego web de fútbol arcade con gráficos de pixel art (estilo consola portátil).
Se abre con `index.html`.

## Qué hay

- **Ciudad deportiva**: pueblo en 2D con tiles. Andas por él y entras en cada casa.
- **Canchas**: pachanga 3 contra 3 más portero, estilo Inazuma. Súper tiro con **bestia** (dragón, tornado de fuego, ola, rayo o meteoro), zoom y cámara lenta. El portero puede pararlo.
- **Estadio**: liga de 8 equipos y 7 jornadas, rollo OSM. Puedes **jugar** el partido o **simularlo**. Antes de jugar ves tu carta y la del rival. Al acabar la temporada, los equipos mejores pueden ficharte.
- **Penaltis**: la tanda de 5 tiros (`penaltis.html`), con 4 competiciones, también en pixel art.
- **Gimnasio**: subes tiro, velocidad, regate, pase y físico. Tu carta sube con ellos. Entrenar cuesta 60 monedas.
- **Tienda**: técnicas, auras, peinados y camisetas.
- **Tragaperras**: 40 monedas por tirada. Tres iguales dan un cosmético.

## Premios

| Dónde | Ganar | Empate |
|---|---|---|
| Pachanga | 45 🪙 | 18 🪙 |
| Partido de liga jugado | 120 🪙 | 45 🪙 |
| Partido de liga simulado | 70% de lo anterior | 70% |
| Ganar la liga | 800 🪙 | — |
| Fichaje de un club mejor | 160 a 700 🪙 | — |
| Ganar una copa de penaltis | 300 a 950 🪙 + 2 puntos | — |

Cada gol da 5 o 6 monedas más.

## Cómo se dibuja

Todo el mundo del juego se pinta en un lienzo pequeño (320x200 en la ciudad y el
partido, 320x240 en los penaltis) y luego se agranda sin suavizado. Los textos se
pintan después, a tamaño real, para que se lean bien.

## Guardado

Todo se guarda en el navegador (localStorage, clave `penaltyLegends.v2`).
El personaje, las monedas y los cosméticos son los mismos en la ciudad y en la tanda de penaltis.

## Pruebas

Atajos para ver una pantalla sin jugar: `index.html#demo=city`, `#demo=match`, `#demo=liga`,
`#demo=cards`, `#demo=gym`, `#demo=tienda`, `#demo=slot`, `#demo=fichaje`, `#demo=simliga`,
`#demo=beast&k=dragon` (también `tornado`, `tsunami`, `relampago`, `meteoro`) y `#demo=bench`
(simula 10 partidos y saca el marcador medio).
