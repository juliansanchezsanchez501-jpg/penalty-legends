# Street Legends ⚽

Juego web de fútbol arcade con gráficos de pixel art (estilo consola portátil).
Se abre con `index.html`.

## Qué hay

- **Ciudad deportiva**: pueblo en 2D con tiles. Andas por él y entras en cada casa.
- **Canchas**: pachanga 3 contra 3 más portero, estilo Inazuma, con súper tiro y zoom.
- **Estadio**: liga de 8 equipos y 7 jornadas, rollo OSM. Antes de cada partido ves tu carta y la del rival. Al acabar la temporada, **los equipos mejores pueden ficharte**: cobras una prima y tus compañeros suben de nivel.
- **Penaltis**: la tanda de 5 tiros (`penaltis.html`), con 4 competiciones.
- **Gimnasio**: subes tiro, velocidad, regate, pase y físico. Tu carta sube con ellos.
- **Tienda**: técnicas, auras, peinados y camisetas.
- **Tragaperras**: 40 monedas por tirada. Tres iguales dan un cosmético.

## Premios

| Dónde | Ganar | Empate |
|---|---|---|
| Pachanga | 45 🪙 | 18 🪙 |
| Partido de liga | 120 🪙 | 45 🪙 |
| Ganar la liga | 800 🪙 | — |
| Ganar una copa de penaltis | 300 a 950 🪙 + 2 puntos | — |

Cada gol da 5 o 6 monedas más.

## Guardado

Todo se guarda en el navegador (localStorage, clave `penaltyLegends.v2`).
El personaje, las monedas y los cosméticos son los mismos en la ciudad y en la tanda de penaltis.

## Pruebas

Atajos para ver una pantalla sin jugar: `index.html#demo=city`, `#demo=match`, `#demo=liga`,
`#demo=cards`, `#demo=gym`, `#demo=tienda`, `#demo=slot`, `#demo=bench`.
