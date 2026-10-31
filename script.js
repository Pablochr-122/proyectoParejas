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

// R6. PREFERENCIAS PERSISTENTES

const claveConfig = "juegoParejasConfiguracion";

function guardarConfiguracion(datos) {

    localStorage.setItem(
        claveConfig,
        JSON.stringify(datos)
    );
}

function recuperarConfiguracion() {

    let datos = localStorage.getItem(claveConfig);

    if (datos !== null) {

        try {

            let configuracionGuardada = JSON.parse(datos);

            if (
                configuracionGuardada !== null &&
                typeof configuracionGuardada === "object" &&
                !Array.isArray(configuracionGuardada) &&
                validarConfiguracion(configuracionGuardada.parejas)
            ) {

                return {
                    parejas: configuracionGuardada.parejas
                };
            }

        } catch (error) {

            console.error("Error al recuperar la configuración.");

        }
    }

    return { ...configuracionInicial };
}

function restablecerConfiguracion() {
    
    configuracion = { ...configuracionInicial };
    guardarConfiguracion(configuracion);
    console.log("Configuración restablecida.");
}

// R7. RESUMEN EN CONSOLA

function mostrarResumen(cartas, numeroParejas) {

    console.log("===== RESUMEN DE LA PARTIDA =====");
    console.log("Número de parejas:", numeroParejas);
    console.log("Número de cartas:", cartas.length);
    console.log(
        "Secuencia de números:",
        cartas.map(carta => carta.numero)
    );
    console.log("=================================");
}

// R8. ORGANIZACIÓN Y DOCUMENTACIÓN

function prepararPartida(numeroParejas) {

    if (!validarConfiguracion(numeroParejas)) {
        console.error("No se puede preparar la partida.");
        return;
    }

    configuracion.parejas = numeroParejas;
    guardarConfiguracion(configuracion);
    let cartas = generarCartas(numeroParejas);
    cartas = barajarCartas(cartas);
    let dimensiones = calcularTablero(numeroParejas);
    console.log("Filas del tablero:", dimensiones.filas);
    console.log("Columnas del tablero:", dimensiones.columnas);
    mostrarResumen(cartas, numeroParejas);
    mostrarCartas(cartas);
}
