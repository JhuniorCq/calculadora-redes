import {datosRed, hostsSubRedInput, direccionIpInput} from './calculadora-flsm.js';
import {convertirBinarioMascaraSubred, hallarCantidadBits, obtenerNuevaMascaraSubred, hallarNumeroCeros, calcularCantidadHostsSubred} from './operaciones-flsm.js';
import {formarObjetoDatosHallarVariasIP} from './hallarConjuntoDireccionesIp.js';

const hallarNumeroSubredes = (numeroSubRedesValor) => {
    console.log('Número de Subredes ingresado: ', numeroSubRedesValor);

    const mascaraSubred = datosRed.mascaraSubred;
    const arrayNumerosMascara = mascaraSubred.split('.');
    const mascaraSubredBinario = convertirBinarioMascaraSubred(mascaraSubred);
    
    console.log('Máscara red original decimal: ', arrayNumerosMascara)
    console.log('Máscara red original binario: ', mascaraSubredBinario)

    const valorN = hallarCantidadBits(numeroSubRedesValor); // valorN representa la cantidad UNOS
    console.log('Valor de N: ', valorN);

    // Esta función me devuelve la NUEVA MÁSCADA DE SUBRED (EN DECIMAL) -> ESTO ES UN CAMPO QUE MOSTRARÉ EN LA TABLA (será igual en cada fila)
    const nuevaMascaraSubredDecimal = obtenerNuevaMascaraSubred(valorN, mascaraSubredBinario);
    console.log(nuevaMascaraSubredDecimal);

    // AHORA DEBEMOS SEGUIR PARA HALLAR EL NÚMERO DE SUBREDES
    const cantidadCeros = hallarNumeroCeros(valorN);
    console.log(cantidadCeros);

    const cantidadHostsSubRed = calcularCantidadHostsSubred(cantidadCeros);
    console.log('Cantidad hosts por subred: ', cantidadHostsSubRed)

    hostsSubRedInput.value = cantidadHostsSubRed; //Mostramos al Usuario la Cantidad de Subredes obtenida

    //ACÁ FORMARÉ AL OBJETO QUE CONTENDRÁ LOS DATOS QUE ME DARÁN UN CONJUNTO DE DIRECCIONES IP
    formarObjetoDatosHallarVariasIP(valorN, numeroSubRedesValor, nuevaMascaraSubredDecimal);
}

export {hallarNumeroSubredes};