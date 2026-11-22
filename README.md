
# Juego de Parejas – Hito 1

## Desarrollo Web en Entorno Cliente (DEW)

**Proyecto:** Juego de parejas  
**Hito:** 1 – Configuración, generación, presentación e interacción con las cartas.

## 1. Descripción del proyecto

Este proyecto consiste en desarrollar un juego de parejas utilizando JavaScript.

En esta versión se implementa la configuración de la partida, la generación de cartas numéricas, el barajado aleatorio y la presentación del tablero en la página web.

Además, se incorpora la interacción con las cartas, permitiendo descubrirlas y registrar los volteos realizados. También se incluye un contador de volteos y un temporizador que comienza cuando se descubre la primera carta.

La aplicación permite guardar y recuperar el estado de la partida mediante `localStorage`, de forma que se pueda continuar una partida anterior.

## 2. Cómo ejecutar el proyecto

1. Descargar o clonar el repositorio.
2. Abrir la carpeta del proyecto.
3. Abrir el proyecto mediante un servidor local, por ejemplo, utilizando Live Server desde Visual Studio Code.
4. Abrir `index.html` en el navegador web.
5. Al iniciar la aplicación, aparecerá la opción de continuar una partida anterior o comenzar una nueva.
6. Si se comienza una partida nueva, aparecerá un `prompt` para introducir el número de parejas.
7. Introducir un número entero entre 4 y 12.
8. El tablero se generará con las cartas mezcladas.

Si se introduce un valor incorrecto, se utilizará la última configuración válida guardada o, en su defecto, la configuración predeterminada de 8 parejas.

Es necesario utilizar un servidor local porque el proyecto utiliza módulos JavaScript mediante `import` y `export`.

## 3. Funcionalidades implementadas

- **Configuración:** permite elegir entre 4 y 12 parejas mediante `prompt`.
- **Validación:** comprueba que el número introducido sea un entero dentro del intervalo permitido.
- **Generación de cartas:** crea dos cartas por cada pareja, identificadas mediante números.
- **Barajado:** utiliza el algoritmo Fisher-Yates y `Math.random()` para mezclar las cartas.
- **Cálculo del tablero:** calcula automáticamente las filas y columnas necesarias.
- **Presentación:** muestra las cartas en la página web respetando el orden del barajado.
- **Interacción:** permite voltear las cartas para descubrir su contenido.
- **Contador de volteos:** registra el número de cartas descubiertas y actualiza su valor en la página web.
- **Temporizador:** comienza a contar cuando se descubre la primera carta y muestra el tiempo transcurrido.
- **Persistencia:** guarda la configuración, el estado de las cartas, el contador y el tiempo mediante `localStorage`.
- **Recuperación:** permite recuperar una partida anterior, incluyendo las cartas, los volteos y el tiempo acumulado. El temporizador permanece detenido hasta que se descubre una carta.
- **Restablecimiento:** permite recuperar la configuración predeterminada e iniciar una partida nueva.
- **Resumen:** muestra en la consola el número de parejas, el total de cartas y la secuencia numérica.
- **Finalización:** incluye la función `finDePartida()` para eliminar la configuración guardada y reiniciar el contador y el temporizador.

## 4. Funciones principales

El código está organizado en cuatro archivos JavaScript independientes para facilitar su comprensión, mantenimiento y reutilización.

- **`Carta.js`:** contiene la clase `Carta` y el patrón Observador, que permite notificar cuándo se descubre una carta.
- **`Contador.js`:** contiene la clase `Contador`, implementada mediante el patrón Singleton, que gestiona el número de volteos.
- **`temporizador.js`:** contiene la clase `Temporizador`, implementada mediante el patrón Singleton, que gestiona el tiempo de la partida.
- **`juego.js`:** actúa como coordinador principal. Importa los módulos anteriores y gestiona la configuración, la generación, la presentación y la interacción con las cartas.

Las principales funciones del archivo `juego.js` son:

- `pedirConfiguracion()`
- `calcularTablero()`
- `generarCartas()`
- `barajarCartas()`
- `mostrarCartas()`
- `validarConfiguracion()`
- `guardarConfiguracion()`
- `recuperarConfiguracion()`
- `restablecerConfiguracion()`
- `mostrarResumen()`
- `prepararPartida()`
- `finDePartida()`
- `iniciarJuego()`
- `voltear()`

## 5. Ampliaciones realizadas

En esta entrega se han incorporado nuevas funcionalidades respecto a la versión inicial:

- Interacción con las cartas mediante la función `voltear()`.
- Contador de volteos utilizando el patrón Observador.
- Temporizador utilizando el patrón Singleton.
- Recuperación del estado de la partida mediante `localStorage`.
- Conservación del contador y del tiempo al recuperar una partida.
- Separación del código en cuatro módulos JavaScript: `Carta.js`, `Contador.js`, `temporizador.js` y `juego.js`.

## 6. Tecnologías utilizadas

- JavaScript.
- HTML.
- Módulos JavaScript (`import` y `export`).
- Programación orientada a objetos.
- Patrón Singleton.
- Patrón Observador.
- `Math.random()`.
- `localStorage`.
- `JSON`.
- `setInterval()` y `clearInterval()`.
- `console.log()` y `console.error()`.

No se han utilizado frameworks ni bibliotecas externas.

## 7. Estado del proyecto

El proyecto cuenta con la configuración de la partida, la generación y presentación del tablero, la interacción con las cartas, el contador de volteos y el temporizador.

También se ha incorporado la persistencia de los datos para poder recuperar una partida anterior y se ha organizado el código en cuatro archivos independientes mediante módulos JavaScript.

El proyecto continúa desarrollándose y podrá ampliarse con nuevas funcionalidades en los siguientes hitos.