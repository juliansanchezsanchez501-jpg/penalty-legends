# Street Legends ⚽

Juego web de fútbol arcade con gráficos de pixel art (estilo consola portátil).
Se abre con `index.html`.

## Qué hay

- **Ciudad deportiva**: pueblo en 2D con tiles. Andas por él y entras en cada casa.
- **Canchas**: pachanga 3 contra 3 más portero, estilo Inazuma. Súper tiro con **bestia** (dragón, tornado de fuego, ola, rayo o meteoro), zoom y cámara lenta. El portero puede pararlo.
- **Estadio**: liga de 8 equipos y 7 jornadas, rollo OSM. Cada partido empieza con una pantalla de **reto** tipo combate (tu rival de frente, tú de espaldas). Desde ahí puedes **jugar**, **simular** o ver las cartas. Al acabar la temporada, los equipos mejores pueden ficharte.
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

`sprites.js` es el motor de sprites que usan los dos juegos. Dibuja cada muñeco con
formas de colores planos, ajusta cada pixel al color más cercano (sin difuminado) y le
pone un contorno de color, como los sprites de combate. Hay dos tamaños:

- **Grande** (84x116, tipo combate): retrato, cartas, tienda, pantalla de reto y la tanda
  de penaltis. Se puede hornear a cualquier tamaño y girado, sin perder nitidez.
- **Pequeño** (28x48): ciudad y partidos. El pelo son mapas hechos pixel a pixel.

La ciudad y el partido se pintan en un lienzo pequeño y se agrandan x2 sin suavizado.
La tanda de penaltis igual (400x300 a 800x600). Los textos van aparte, a tamaño real.

## Guardado

Todo se guarda en el navegador (localStorage, clave `penaltyLegends.v2`).
El personaje, las monedas y los cosméticos son los mismos en la ciudad y en la tanda de penaltis.

## Pruebas

Atajos para ver una pantalla sin jugar: `index.html#demo=city`, `#demo=match`, `#demo=liga`,
`#demo=cards`, `#demo=gym`, `#demo=tienda`, `#demo=slot`, `#demo=fichaje`, `#demo=simliga`,
`#demo=beast&k=dragon` (también `tornado`, `tsunami`, `relampago`, `meteoro`) y `#demo=bench`
(simula 10 partidos y saca el marcador medio).
