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