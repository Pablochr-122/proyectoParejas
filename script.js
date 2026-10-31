// R1. CONFIGURACIÓN DE LA PARTIDA

const configuracionInicial = {
    parejas: 8
};

let configuracion = {
    parejas: configuracionInicial.parejas
};

function pedirConfiguracion() {

    let numeroParejas = prompt("Introduce el número de parejas (entre 4 y 12):");
    return Number(numeroParejas);
}

function calcularTablero(numeroParejas) {

    let numeroCartas = numeroParejas * 2;
    let columnas = Math.floor(Math.sqrt(numeroCartas));
    let filas = Math.ceil(numeroCartas / columnas);
    return {
        filas: filas,
        columnas: columnas
    };
}

// R2. GENERACIÓN DE CARTAS

function generarCartas(numeroParejas) {

    let cartas = [];

    for (let i = 1; i <= numeroParejas; i++) {
        let carta1 = {
            numero: i,
            descubierta: true
        };
        let carta2 = {
            numero: i,
            descubierta: true
        };
        cartas.push(carta1);
        cartas.push(carta2);
    }
    return cartas;
}

// R3. BARAJADO

function barajarCartas(cartas) {

    for (let i = cartas.length - 1; i > 0; i--) {

        let posicionAleatoria = Math.floor(Math.random() * (i + 1));
        let auxiliar = cartas[i];
        cartas[i] = cartas[posicionAleatoria];
        cartas[posicionAleatoria] = auxiliar;
    }
    return cartas;
}

// R4. PRESENTACIÓN DEL TABLERO

function mostrarCartas(cartas) {

    let tablero = document.getElementById("tablero");
    let contenido = "";
    cartas.forEach(function(carta) {
        contenido += `<div class="carta">${carta.numero}</div>`;
    });
    tablero.innerHTML = contenido;
}

// R5. VALIDACIÓN DE LA CONFIGURACIÓN

function validarConfiguracion(numero) {

    if (!Number.isInteger(numero)) {
        console.error("El número de parejas debe ser un entero.");
        return false;
    }

    if (numero < 4 || numero > 12) {
        console.error("El número de parejas debe estar entre 4 y 12.");
        return false;
    }

    return true;
}
