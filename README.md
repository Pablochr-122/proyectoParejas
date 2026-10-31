# Juego de Parejas – Hito 1

## Desarrollo Web en Entorno Cliente (DEW)

**Proyecto:** Juego de parejas  
**Hito:** 1 – Configuración, generación y presentación de cartas.

## 1. Descripción del proyecto

Este proyecto consiste en desarrollar la primera versión de un juego de parejas utilizando JavaScript.

En este primer hito se implementa la configuración de la partida, la generación de cartas numéricas, el barajado aleatorio y la presentación del tablero en la página web.

Las cartas aparecen descubiertas y todavía no se puede interactuar con ellas.

## 2. Cómo ejecutar el proyecto

1. Descargar o clonar el repositorio.
2. Abrir la carpeta del proyecto.
3. Abrir el archivo `index.html` en un navegador web.
4. Al iniciar la aplicación, aparecerá un `prompt` para introducir el número de parejas.
5. Introducir un número entero entre 4 y 12.
6. El tablero se generará con las cartas mezcladas.

Si se introduce un valor incorrecto, se utilizará la última configuración válida guardada o, en su defecto, la configuración predeterminada de 8 parejas.

## 3. Funcionalidades implementadas

- **Configuración:** permite elegir entre 4 y 12 parejas mediante `prompt`.
- **Validación:** comprueba que el número introducido sea un entero dentro del intervalo permitido.
- **Generación de cartas:** crea dos cartas por cada pareja, identificadas mediante números.
- **Barajado:** utiliza el algoritmo Fisher-Yates y `Math.random()` para mezclar las cartas.
- **Cálculo del tablero:** calcula automáticamente las filas y columnas necesarias.
- **Presentación:** muestra las cartas en la página web respetando el orden del barajado.
- **Persistencia:** guarda la configuración en `localStorage` utilizando JSON.
- **Recuperación:** recupera la configuración guardada al iniciar la aplicación.
- **Restablecimiento:** permite recuperar la configuración predeterminada.
- **Resumen:** muestra en la consola el número de parejas, el total de cartas y la secuencia numérica.
- **Finalización:** incluye la función `finDePartida()` para eliminar la configuración guardada.

## 4. Funciones principales

El código está organizado en funciones independientes para facilitar su comprensión y mantenimiento:

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

## 5. Ampliaciones realizadas

En esta entrega no se han realizado ampliaciones voluntarias (A1 y A2).

Se han implementado los requisitos obligatorios correspondientes al primer hito.

## 6. Tecnologías utilizadas

- JavaScript.
- HTML.
- `Math.random()`.
- `localStorage`.
- `JSON`.
- `console.log()` y `console.error()`.

No se han utilizado frameworks ni bibliotecas externas.

## 7. Estado del proyecto

El proyecto cumple las funcionalidades correspondientes al primer hito.

En futuras unidades se incorporará la interacción con las cartas, la comprobación de parejas, el ocultamiento de cartas y el registro de resultados.