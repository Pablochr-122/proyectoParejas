
import { observadorCartas } from "./Carta.js";

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

        this.#volteos =
            Number.isInteger(valorGuardado) && valorGuardado >= 0
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


// Exportar únicamente lo que necesita el juego.
export { contador, actualizarContador };
