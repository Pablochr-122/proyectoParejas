
// R1. CONFIGURACIÓN DE LA PARTIDA

const configuracionInicial = {
    parejas: 8
};

let configuracion = {
    parejas: configuracionInicial.parejas
};

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
 * @returns {{filas: number, columnas: number}} Objeto con el número
 * de filas y columnas necesarias para mostrar todas las cartas.
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
 * Genera dos cartas por cada pareja. Cada carta contiene un número
 * identificador y una propiedad booleana que indica si está descubierta.
 *
 * @param {number} numeroParejas - Número de parejas que se generarán.
 * @returns {Array<{numero: number, descubierta: boolean}>}
 * Array con todas las cartas generadas.
 */
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

/**
 * Mezcla las cartas utilizando el algoritmo Fisher-Yates.
 * Intercambia aleatoriamente las posiciones de las cartas
 * sin modificar su contenido ni alterar el número de elementos.
 *
 * @param {Array<{numero: number, descubierta: boolean}>} cartas
 * Array de cartas que se desea barajar.
 * @returns {Array<{numero: number, descubierta: boolean}>}
 * Array de cartas con un orden aleatorio.
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
 * @param {Array<{numero: number, descubierta: boolean}>} cartas
 * Array de cartas generadas y barajadas.
 * @param {{filas: number, columnas: number}} dimensiones
 * Dimensiones del tablero: número de filas y columnas.
 * @returns {void}
 */


function mostrarCartas(cartas, dimensiones) {

    let contenido = "<table>";

    for (let i = 0; i < dimensiones.filas; i++) {

        contenido += "<tr>";

        for (let j = 0; j < dimensiones.columnas; j++) {

            let posicion = i * dimensiones.columnas + j;

            if (posicion < cartas.length) {

                contenido += `
                    <td
                        id="carta-${i}-${j}"
                        data-numero="${cartas[posicion].numero}"
                        onclick="voltear(${i}, ${j})"
                    >X</td>
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
 * @returns {boolean} Devuelve true si la configuración es válida
 * y false si no cumple los requisitos.
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
 * @param {{parejas: number}} datos - Objeto con la configuración
 * que se desea guardar.
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
 * Si no existe una configuración guardada o los datos son
 * incorrectos, devuelve la configuración predeterminada.
 *
 * @returns {{parejas: number, cartas: Array|null}} Objeto con la
 * configuración y las cartas recuperadas o con los valores iniciales.
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
                    ? configuracionGuardada.cartas
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
 * Al guardar únicamente la configuración, también se elimina
 * la información de las cartas de la partida anterior.
 *
 * @returns {void}
 */
function restablecerConfiguracion() {

    configuracion = { ...configuracionInicial };

    guardarConfiguracion(configuracion);

    console.log("Configuración restablecida.");
}


// R7. RESUMEN EN CONSOLA

/**
 * Muestra en la consola un resumen de la partida con el número
 * de parejas, el número total de cartas y la secuencia numérica
 * de las cartas después de realizar el barajado.
 *
 * @param {Array<{numero: number, descubierta: boolean}>} cartas
 * Array de cartas de la partida.
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
 * Guarda la configuración y las cartas, calcula las dimensiones,
 * muestra el resumen y presenta el tablero.
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

        cartas = cartasGuardadas;

        console.log("Partida anterior recuperada.");

    } else {

        cartas = generarCartas(numeroParejas);

        cartas = barajarCartas(cartas);
    }

    guardarConfiguracion(configuracion, cartas);

    let dimensiones = calcularTablero(numeroParejas);

    console.log("Filas del tablero:", dimensiones.filas);

    console.log("Columnas del tablero:", dimensiones.columnas);

    mostrarResumen(cartas, numeroParejas);

    mostrarCartas(cartas, dimensiones);
}


// R9. FINALIZACIÓN DE LA PARTIDA

/**
 * Finaliza la partida eliminando de localStorage la configuración
 * guardada de esta aplicación.
 *
 * @returns {void}
 */
function finDePartida() {

    localStorage.removeItem(claveConfig);

    console.log("Partida finalizada.");
}


// Inicio automático de la aplicación

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

            console.log("Se utilizará la configuración guardada.");

            prepararPartida(configuracion.parejas);
        }
    }
}

iniciarJuego();


// FUNCIÓN PARA DAR VUELTA A CARTAS

function voltear(x, y) {

    let carta = document.getElementById(`carta-${x}-${y}`);

    if (carta === null) {

        console.error("No existe una carta en esa posición.");
        return;
    }

    if (carta.textContent === "x") {

        carta.textContent = carta.dataset.numero;
        carta.style.backgroundColor = "white";
        carta.style.color = "black";

    } else {

        carta.textContent = "x";
        carta.style.backgroundColor = "rgb(36, 35, 35)";
        carta.style.color = "white";
    }
}

window.voltear = voltear;