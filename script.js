// Punto de partida
function mostrarCartas(cartas) {
    const tablero = document.getElementById("tablero");

    if (tablero === null) {
        console.error("No se encuentra el tablero.");
        return;
    }

    tablero.textContent = cartas
    .map(carta => carta.numero)
    .join(" ");
}

// R1. Configuración de la partida
const claveConfig = "config";

const defaultConfig = {
    parejas: 8
};

let configuracion = {
    ...defaultConfig
};

//R2. Generacion de cartas
function generarCartas(parejas) {
    const cartas = [];

    for (let numero = 1; numero <= parejas; numero++) {
        cartas.push({
            numero: numero,
            descubierta: true
        });
        cartas.push({
            numero: numero,
            descubierta: true
        });
    }
    return cartas;
}

//R3. Barajado
function barajarCartas(cartas) {
    for (let i = cartas.length - 1; i > 0; i--) {
        const posicion = Math.floor(Math.random() * (i + 1));
        const temporal = cartas[i];
        cartas[i] = cartas[posicion];
        cartas[posicion] = temporal;
    }
    return cartas;
}