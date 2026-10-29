// R1. Configuración de la partida
const claveConfig = "config";

const defaultConfig = {
    parejas: 8
};

let configuracion = {
    ...defaultConfig
};

function solicitarConfiguracion(defaultConfig) {
    const respuesta = prompt("Introduce el número de parejas (4-12 parejas): ", String(configuracion.parejas));

    if (respuesta === null) {
        return defaultConfig;
    }

    const parejas = Number(respuesta);

    if (!validarParejas(parejas)) {
        console.error("El número de parejas debe estar entre 4 y 12");
        return false;
    }

    configuracion.parejas = parejas;
    guardarConfiguracion();

    return true;  
}

const configElegida = solicitarConfiguracion(configuracion);
// R2. Generacion de cartas
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

// R3. Barajado
function barajarCartas(cartas) {
    for (let i = cartas.length - 1; i > 0; i--) {
        const posicion = Math.floor(Math.random() * (i + 1));
        const temporal = cartas[i];
        cartas[i] = cartas[posicion];
        cartas[posicion] = temporal;
    }
    return cartas;
}

// Punto de partida - R4. Presentación del tablero
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

// R5. Validación de la configuración
function validarParejas(parejas) {
    return Number.isInteger(parejas)
        && parejas >= 4
        && parejas <= 12;
}

function validarConfiguracion(config) {
    return config !== null
        && typeof config === "object"
        && !Array.isArray(config)
        && validarParejas(config.parejas);
}