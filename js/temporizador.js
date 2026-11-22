
const claveTemporizador = "juegoParejasTiempo";

/**
 * Gestiona el temporizador mediante el patrón Singleton.
 *
 * Guarda el tiempo transcurrido en localStorage y comienza
 * a contar cuando se descubre la primera carta.
 */
class Temporizador {

    static #instancia = null;

    #segundos;
    #intervalo;

    constructor() {

        // Evitar crear más de una instancia.
        if (Temporizador.#instancia !== null) {
            return Temporizador.#instancia;
        }

        let tiempoGuardado = Number(
            localStorage.getItem(claveTemporizador)
        );

        this.#segundos =
            Number.isInteger(tiempoGuardado) && tiempoGuardado >= 0
                ? tiempoGuardado
                : 0;

        this.#intervalo = null;

        Temporizador.#instancia = this;
    }

    /**
     * Devuelve la única instancia del temporizador.
     *
     * @returns {Temporizador} Instancia única del temporizador.
     */
    static obtenerInstancia() {

        if (Temporizador.#instancia === null) {
            new Temporizador();
        }

        return Temporizador.#instancia;
    }

    /**
     * Obtiene los segundos transcurridos.
     *
     * @returns {number} Tiempo transcurrido en segundos.
     */
    get segundos() {
        return this.#segundos;
    }

    /**
     * Inicia el temporizador si todavía no está funcionando.
     *
     * @returns {void}
     */
    iniciar() {

        if (this.#intervalo !== null) {
            return;
        }

        this.#intervalo = setInterval(() => {

            this.#segundos++;

            this.guardar();
            actualizarTemporizador();

        }, 1000);
    }

    /**
     * Guarda el tiempo transcurrido en localStorage.
     *
     * @returns {void}
     */
    guardar() {

        localStorage.setItem(
            claveTemporizador,
            this.#segundos
        );
    }

    /**
     * Detiene el temporizador sin borrar el tiempo acumulado.
     *
     * @returns {void}
     */
    detener() {

        if (this.#intervalo !== null) {
            clearInterval(this.#intervalo);
            this.#intervalo = null;
        }

        this.guardar();
    }

    /**
     * Reinicia el temporizador a cero.
     * Se utiliza al comenzar una partida nueva.
     *
     * @returns {void}
     */
    reiniciar() {

        this.detener();

        this.#segundos = 0;

        this.guardar();
        actualizarTemporizador();
    }
}


// Obtener la única instancia del temporizador.
const temporizador = Temporizador.obtenerInstancia();


/**
 * Actualiza el tiempo mostrado en el HTML con formato mm:ss.
 *
 * @returns {void}
 */
function actualizarTemporizador() {

    let elemento = document.getElementById("temporizador");

    if (elemento !== null) {

        let minutos = Math.floor(temporizador.segundos / 60);
        let segundos = temporizador.segundos % 60;

        elemento.textContent =
            "Tiempo: " +
            String(minutos).padStart(2, "0") +
            ":" +
            String(segundos).padStart(2, "0");
    }
}


// Exportar únicamente lo que necesita el juego.
export { temporizador, actualizarTemporizador };