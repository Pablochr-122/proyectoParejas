
import { Carta } from "./Carta.js";
import { contador, actualizarContador } from "./Contador.js";
import {
    temporizador,
    actualizarTemporizador
} from "./temporizador.js";


// R1. CONFIGURACIÓN DE LA PARTIDA

const configuracionInicial = {
    parejas: 8
};

let configuracion = {
    parejas: configuracionInicial.parejas
};

let cartasPartida = [];


/**
 * Solicita al usuario mediante un prompt el número de parejas
 * que tendrá la partida.
 *
 * @returns {number} Número de parejas introducido por el usuario.
 */
function pedirConfiguracion() {

    let numeroParejas = prompt("Introduce el número de parejas (entre 4 y 12):");
    return Number(numeroParejas);
}


/**
 * Calcula las dimensiones del tablero en función del número
 * de parejas. El número de cartas será el doble de las parejas.
 *
 * @param {number} numeroParejas - Número de parejas de la partida.
 * @returns {{filas: number, columnas: number}} Dimensiones del tablero.
 */
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

/**
 * Genera dos cartas por cada pareja utilizando la clase Carta.
 * Todas las cartas se crean inicialmente boca abajo.
 *
 * @param {number} numeroParejas - Número de parejas que se generarán.
 * @returns {Carta[]} Array con todas las instancias de Carta generadas.
 */
function generarCartas(numeroParejas) {

    let cartas = [];

    for (let i = 1; i <= numeroParejas; i++) {

        let carta1 = new Carta(i, false);
        let carta2 = new Carta(i, false);

        cartas.push(carta1);
        cartas.push(carta2);
    }

    return cartas;
}


// R3. BARAJADO

/**
 * Mezcla las cartas utilizando el algoritmo Fisher-Yates.
 *
 * @param {Carta[]} cartas - Array de cartas que se desea barajar.
 * @returns {Carta[]} Array de cartas con un orden aleatorio.
 */
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

/**
 * Muestra las cartas en el HTML siguiendo el orden del barajado
 * y las dimensiones calculadas para el tablero.
 *
 * @param {Carta[]} cartas - Array de cartas generadas y barajadas.
 * @param {{filas: number, columnas: number}} dimensiones - Dimensiones.
 * @returns {void}
 */
function mostrarCartas(cartas, dimensiones) {

    let contenido = "<table>";

    for (let i = 0; i < dimensiones.filas; i++) {

        contenido += "<tr>";

        for (let j = 0; j < dimensiones.columnas; j++) {

            let posicion = i * dimensiones.columnas + j;

            if (posicion < cartas.length) {

                let carta = cartas[posicion];

                contenido += `
                    <td
                        id="carta-${i}-${j}"
                        onclick="voltear(${i}, ${j})"
                        data-numero="${carta.numero}"
                        style="
                            ${carta.descubierta
                                ? "background-color: white; color: black;"
                                : ""}
                        "
                    >${carta.descubierta ? carta.numero : "X"}</td>
                `;
            }
        }

        contenido += "</tr>";
    }

    contenido += "</table>";

    document.getElementById("tablero").innerHTML = contenido;
}


// R5. VALIDACIÓN DE LA CONFIGURACIÓN

/**
 * Comprueba que el número de parejas sea un número entero
 * comprendido entre 4 y 12, ambos inclusive.
 *
 * @param {number} numero - Número de parejas que se desea validar.
 * @returns {boolean} True si la configuración es válida.
 */
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


/**
 * Comprueba que las cartas guardadas sean válidas y que existan
 * exactamente dos cartas de cada número.
 *
 * @param {Array} cartas - Cartas que se desean comprobar.
 * @param {number} parejas - Número de parejas de la partida.
 * @returns {boolean} True si las cartas son válidas.
 */
function validarCartasGuardadas(cartas, parejas) {

    if (!Array.isArray(cartas) || cartas.length !== parejas * 2) {
        return false;
    }

    let cantidades = Array(parejas + 1).fill(0);

    for (let carta of cartas) {

        if (
            carta === null ||
            typeof carta !== "object" ||
            Array.isArray(carta) ||
            (!(carta instanceof Carta) && carta.tipo !== "Carta") ||
            !Number.isInteger(carta.numero) ||
            carta.numero < 1 ||
            carta.numero > parejas ||
            typeof carta.descubierta !== "boolean"
        ) {
            return false;
        }

        cantidades[carta.numero]++;
    }

    return cantidades.slice(1).every(cantidad => cantidad === 2);
}


// R6. PREFERENCIAS PERSISTENTES

const claveConfig = "juegoParejasConfiguracion";

/**
 * Guarda la configuración de la partida en localStorage,
 * convirtiendo el objeto JavaScript a formato JSON.
 *
 * También guarda las cartas para poder recuperar la misma
 * partida y mantener el orden del barajado.
 *
 * @param {{parejas: number}} datos - Objeto con la configuración.
 * @param {Array} [cartas] - Cartas de la partida.
 * @returns {void}
 */
function guardarConfiguracion(datos, cartas = null) {

    let partida = {
        parejas: datos.parejas
    };

    if (cartas !== null) {
        partida.cartas = cartas;
    }

    localStorage.setItem(
        claveConfig,
        JSON.stringify(partida)
    );
}


/**
 * Recupera la configuración guardada en localStorage y comprueba
 * que los datos almacenados sean válidos.
 *
 * @returns {{parejas: number, cartas: Array|null}} Configuración recuperada.
 */
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

                let cartas = validarCartasGuardadas(
                    configuracionGuardada.cartas,
                    configuracionGuardada.parejas
                )
                    ? configuracionGuardada.cartas.map(
                        carta => new Carta(
                            carta.numero,
                            carta.descubierta
                        )
                    )
                    : null;

                return {
                    parejas: configuracionGuardada.parejas,
                    cartas: cartas
                };
            }

        } catch (error) {

            console.error("Error al recuperar la configuración.");
        }
    }

    return {
        parejas: configuracionInicial.parejas,
        cartas: null
    };
}


/**
 * Restablece la configuración de la partida a sus valores
 * predeterminados y guarda los cambios en localStorage.
 *
 * @returns {void}
 */
function restablecerConfiguracion() {

    configuracion = { ...configuracionInicial };

    guardarConfiguracion(configuracion);

    contador.reiniciar();
    temporizador.reiniciar();

    console.log("Configuración restablecida.");
}


// R7. RESUMEN EN CONSOLA

/**
 * Muestra en la consola un resumen de la partida.
 *
 * @param {Carta[]} cartas - Cartas de la partida.
 * @param {number} numeroParejas - Número de parejas configuradas.
 * @returns {void}
 */
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

/**
 * Prepara una partida nueva o recupera una partida anterior.
 *
 * @param {number} numeroParejas - Número de parejas.
 * @param {Array|null} cartasGuardadas - Cartas de una partida anterior.
 * @returns {void}
 */
function prepararPartida(numeroParejas, cartasGuardadas = null) {

    if (!validarConfiguracion(numeroParejas)) {

        console.error("No se puede preparar la partida.");
        return;
    }

    configuracion.parejas = numeroParejas;

    let cartas;

    if (validarCartasGuardadas(cartasGuardadas, numeroParejas)) {

        // Recuperar las cartas de la partida anterior.
        cartas = cartasGuardadas;

        console.log("Partida anterior recuperada.");

    } else {

        // Crear una partida nueva.
        cartas = generarCartas(numeroParejas);

        cartas = barajarCartas(cartas);

        // Reiniciar el contador y el temporizador.
        contador.reiniciar();
        temporizador.reiniciar();
    }

    cartasPartida = cartas;

    guardarConfiguracion(configuracion, cartas);

    let dimensiones = calcularTablero(numeroParejas);

    console.log("Filas del tablero:", dimensiones.filas);

    console.log("Columnas del tablero:", dimensiones.columnas);

    mostrarResumen(cartas, numeroParejas);

    mostrarCartas(cartas, dimensiones);

    actualizarContador();
    actualizarTemporizador();
}


// R9. FINALIZACIÓN DE LA PARTIDA

/**
 * Finaliza la partida eliminando de localStorage la configuración
 * guardada y reiniciando el contador y el temporizador.
 *
 * @returns {void}
 */
function finDePartida() {

    localStorage.removeItem(claveConfig);

    contador.reiniciar();
    temporizador.reiniciar();

    console.log("Partida finalizada.");
}


// INICIO DE LA APLICACIÓN

/**
 * Inicia la aplicación comprobando si existe una partida anterior.
 * Si existe, permite continuarla o comenzar una nueva partida.
 *
 * Si no existe, solicita la configuración al usuario.
 *
 * @returns {void}
 */
function iniciarJuego() {

    configuracion = recuperarConfiguracion();

    console.log("Configuración inicial:", configuracion);

    // Comprobar si existe una partida anterior.
    if (configuracion.cartas !== null) {

        console.log("Se ha encontrado una partida guardada.");

        // Preguntar si quiere continuar o empezar una partida nueva.
        let continuarPartida = confirm(
            "Se ha encontrado una partida anterior. " +
            "¿Quieres continuarla? Pulsa Aceptar para continuar " +
            "o Cancelar para empezar una nueva."
        );

        if (continuarPartida) {

            // Recuperar la partida anterior.
            prepararPartida(
                configuracion.parejas,
                configuracion.cartas
            );

        } else {

            // Solicitar el número de parejas para la nueva partida.
            let numeroParejas = pedirConfiguracion();

            if (validarConfiguracion(numeroParejas)) {

                prepararPartida(numeroParejas);

            } else {

                console.log("Se mantiene la partida anterior.");

                prepararPartida(
                    configuracion.parejas,
                    configuracion.cartas
                );
            }
        }

    } else {

        // Si no existe una partida guardada, solicitar configuración.
        let numeroParejas = pedirConfiguracion();

        if (validarConfiguracion(numeroParejas)) {

            prepararPartida(numeroParejas);

        } else {

            console.log("Se utilizará la configuración predeterminada.");

            prepararPartida(configuracionInicial.parejas);
        }
    }
}


// FUNCIÓN PARA DAR VUELTA A CARTAS

/**
 * Voltea la carta situada en las coordenadas indicadas del tablero.
 *
 * Cambia el estado de la instancia de Carta mediante su método
 * público voltear(), actualiza su representación visual en el HTML
 * y guarda el nuevo estado de las cartas en localStorage.
 *
 * @param {number} x - Índice de la fila de la carta (empieza en 0).
 * @param {number} y - Índice de la columna de la carta (empieza en 0).
 * @returns {void}
 */
function voltear(x, y) {

    let dimensiones = calcularTablero(configuracion.parejas);

    if (
        !Number.isInteger(x) ||
        !Number.isInteger(y) ||
        x < 0 ||
        y < 0 ||
        x >= dimensiones.filas ||
        y >= dimensiones.columnas
    ) {
        console.error("Posición de carta no válida.");
        return;
    }

    let posicion = x * dimensiones.columnas + y;

    if (posicion >= cartasPartida.length) {
        console.error("No existe una carta en esa posición.");
        return;
    }

    let carta = cartasPartida[posicion];

    // Iniciar el temporizador al descubrir la primera carta.
    // Si ya está funcionando, no se crea otro intervalo.
    if (!carta.descubierta) {
        temporizador.iniciar();
    }

    // Cambiar el estado de la carta.
    carta.voltear();

    // Obtener el elemento HTML.
    let cartaHTML = document.getElementById(`carta-${x}-${y}`);

    if (cartaHTML === null) {
        console.error("No se encuentra la carta en el tablero.");
        return;
    }

    // Actualizar su apariencia.
    if (carta.descubierta) {

        cartaHTML.textContent = carta.numero;
        cartaHTML.style.backgroundColor = "white";
        cartaHTML.style.color = "black";

    } else {

        cartaHTML.textContent = "X";
        cartaHTML.style.backgroundColor = "rgb(36, 35, 35)";
        cartaHTML.style.color = "white";
    }

    // Guardar el estado actualizado de las cartas.
    guardarConfiguracion(configuracion, cartasPartida);
}


// Hacer accesible la función desde el onclick del HTML.
window.voltear = voltear;


// Iniciar el juego.
iniciarJuego();