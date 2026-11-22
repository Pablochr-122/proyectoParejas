
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

        // Notificar únicamente cuando se descubre una carta.
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

        // Se utiliza el setter para notificar al observador.
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


// Exportar los elementos que necesitan los demás módulos.
export { Carta, observadorCartas };