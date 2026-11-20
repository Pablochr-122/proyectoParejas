// R1. CONFIGURACIÓN DE LA PARTIDA

const configuracionInicial = {
    parejas: 8
};

let configuracion = {
    parejas: configuracionInicial.parejas
};

// Cartas de la partida que se está jugando actualmente.
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


/**
 * Gestiona los observadores que reciben notificaciones
 * cuando una carta cambia su estado.
 */
class Observador {

    constructor() {
        this.observadores = [];
    }

    /**
     * Añade un observador a la lista.
     *
     * @param {Function} observador - Función que recibirá la notificación.
     * @returns {void}
     */
    suscribir(observador) {
        this.observadores.push(observador);
    }

    /**
     * Elimina un observador de la lista.
     *
     * @param {Function} observador - Observador que se desea eliminar.
     * @returns {void}
     */
    desuscribir(observador) {
        this.observadores = this.observadores.filter(
            elemento => elemento !== observador
        );
    }

    /**
     * Notifica a todos los observadores suscritos.
     *
     * @param {Carta} carta - Carta cuyo estado ha cambiado.
     * @returns {void}
     */
    notificar(carta) {
        this.observadores.forEach(observador => observador(carta));
    }
}

const observadorCartas = new Observador();


/**
 * Representa una carta del juego de parejas.
 *
 * Cada carta contiene un número identificador y un estado
 * que indica si está descubierta o boca abajo.
 *
 * Sus atributos son privados y se accede a ellos mediante
 * getters y setters.
 */
class Carta {

    #numero;
    #descubierta;


    /**
    * Crea una nueva carta.
    *
    * @param {number} numero - Número identificador de la carta.
    * @param {boolean} [descubierta=false] - Estado inicial de la carta.
    */
    constructor(numero, descubierta = false) {

        this.#validarNumero(numero);

        if (typeof descubierta !== "boolean") {
            throw new TypeError("El estado de la carta debe ser booleano.");
        }

        this.#numero = numero;
        this.#descubierta = descubierta;
    }


    /**
    * Comprueba que el número de la carta sea un entero positivo.
    *
    * @param {number} numero - Número que se desea validar.
    * @returns {void}
    * @throws {TypeError} Si el número no es un entero positivo.
    */
    #validarNumero(numero) {

        if (!Number.isInteger(numero) || numero < 1) {
            throw new TypeError("El número de carta no es válido.");
        }
    }

    // Getter y setter del número
    get numero() {
        return this.#numero;
    }

    set numero(numero) {
        this.#validarNumero(numero);
        this.#numero = numero;
    }

    // Getter y setter del estado
    get descubierta() {
        return this.#descubierta;
    }

    set descubierta(estado) {

        if (typeof estado !== "boolean") {
            throw new TypeError("El estado debe ser verdadero o falso.");
        }

        let estadoAnterior = this.#descubierta;

        this.#descubierta = estado;

        if (estadoAnterior === false && estado === true) {
            observadorCartas.notificar(this);
        }
    }

    /**
    * Cambia el estado de la carta.
    *
    * @returns {boolean} Nuevo estado de la carta.
    */
    voltear() {

        // IMPORTANTE: se utiliza el setter para notificar al observador.
        this.descubierta = !this.#descubierta;

        return this.#descubierta;
    }


    /**
    * Convierte la instancia de Carta en un objeto serializable
    * para poder guardarla en localStorage mediante JSON.stringify().
    *
    * @returns {{tipo: string, numero: number, descubierta: boolean}}
    * Objeto con los datos de la carta.
    */
    toJSON() {

        return {
            tipo: "Carta",
            numero: this.#numero,
            descubierta: this.#descubierta
        };
    }
}

const claveContador = "juegoParejasContador";


/**
 * Gestiona el contador de volteos mediante el patrón Singleton.
 *
 * Solo permite crear una instancia del contador y guarda
 * su valor en localStorage.
 */
class Contador {

    static #instancia = null;

    #volteos;

    constructor() {

        // Evitar crear más de una instancia.
        if (Contador.#instancia !== null) {
            return Contador.#instancia;
        }

        let valorGuardado = Number(localStorage.getItem(claveContador));

        this.#volteos = Number.isInteger(valorGuardado) &&
                        valorGuardado >= 0
                        ? valorGuardado
                        : 0;

        Contador.#instancia = this;
    }

    /**
     * Devuelve la única instancia del contador.
     *
     * @returns {Contador} Instancia única del contador.
     */
    static obtenerInstancia() {

        if (Contador.#instancia === null) {
            new Contador();
        }

        return Contador.#instancia;
    }

    /**
     * Obtiene el número actual de volteos.
     *
     * @returns {number} Número de volteos realizados.
     */
    get volteos() {
        return this.#volteos;
    }

    /**
     * Incrementa el contador en una unidad y guarda el resultado.
     *
     * @returns {void}
     */
    incrementar() {

        this.#volteos++;

        localStorage.setItem(
            claveContador,
            this.#volteos
        );

        actualizarContador();
    }

    /**
     * Restablece el contador a cero y guarda el resultado.
     *
     * @returns {void}
     */
    reiniciar() {

        this.#volteos = 0;

        localStorage.setItem(claveContador, 0);

        actualizarContador();
    }
}


// Obtener la única instancia del contador.
const contador = Contador.obtenerInstancia();

// Suscribir el contador al observador de las cartas.
observadorCartas.suscribir(() => {
    contador.incrementar();
});


/**
 * Actualiza el contador de volteos mostrado en el HTML.
 *
 * @returns {void}
 */
function actualizarContador() {

    let elemento = document.getElementById("contador");

    if (elemento !== null) {
        elemento.textContent = "Volteos: " + contador.volteos;
    }
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
 * Al guardar únicamente la configuración, también se elimina
 * la información de las cartas de la partida anterior.
 *
 * @returns {void}
 */
function restablecerConfiguracion() {

    configuracion = { ...configuracionInicial };

    guardarConfiguracion(configuracion);

    contador.reiniciar();

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

        contador.reiniciar();
    }

    cartasPartida = cartas;

    guardarConfiguracion(configuracion, cartas);

    let dimensiones = calcularTablero(numeroParejas);

    console.log("Filas del tablero:", dimensiones.filas);

    console.log("Columnas del tablero:", dimensiones.columnas);

    mostrarResumen(cartas, numeroParejas);

    mostrarCartas(cartas, dimensiones);

    actualizarContador();
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

    contador.reiniciar();

    localStorage.removeItem(claveContador);

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

    // Guardar el estado actualizado.
    guardarConfiguracion(configuracion, cartasPartida);
}

window.voltear = voltear;