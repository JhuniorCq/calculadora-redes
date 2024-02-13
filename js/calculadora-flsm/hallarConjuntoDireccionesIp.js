import {datosHallarVariasIP, direccionIpInput} from './calculadora-flsm.js';
import {hallarCantidadDiferente255, formarArraySubcadenasNdigitos, agregarCerosSubcadenasNdigitos, formarMatrizArrayBitsMultiploOcho, formarMatrizArrayDireccionesIpDecimal} from './operaciones-flsm.js';
import {datosRed} from './calculadora-flsm.js';

const formarObjetoDatosHallarVariasIP = (valorN, numeroSubRedesValor, nuevaMascaraSubredDecimal) => {
    datosHallarVariasIP.valorN = valorN;
    datosHallarVariasIP.numeroSubRedesValor = numeroSubRedesValor;
    datosHallarVariasIP.nuevaMascaraSubredDecimal = nuevaMascaraSubredDecimal;
}

const hallarVariasDireccionesIP = () => {
    const valorN = datosHallarVariasIP.valorN;
    const numeroSubRedesValor = datosHallarVariasIP.numeroSubRedesValor;
    let nuevaMascaraSubredDecimal = datosHallarVariasIP.nuevaMascaraSubredDecimal;

    //////////////
    if(datosRed.claseRed === 'A') { // LO DE LA CLASE A YA ESTÁ CORREGIDO, PERO HAY QUE VER SU ULTIMO HOST Y BROADCASTE QUE HAY ALGO MALO
        const mascaraRedOficial = datosRed.mascaraSubred;
        const arrayOctetos = mascaraRedOficial.split('.');
        nuevaMascaraSubredDecimal = arrayOctetos.map(octeto => parseInt(octeto));
    }

    //PROBNADOOOOOOOOOOOOOOOOOOOOOOOOO
    const cantidadDiferente255 = hallarCantidadDiferente255(nuevaMascaraSubredDecimal); 

    const arraySubcadenasNdigitos = formarArraySubcadenasNdigitos(numeroSubRedesValor, valorN); // HASTA ACÁ FINO

    const arrayCadenaMultiploOchoBits = agregarCerosSubcadenasNdigitos(cantidadDiferente255, valorN, arraySubcadenasNdigitos);

    const nuevaMascaraSubredBinario = nuevaMascaraSubredDecimal.map(elemento => elemento.toString(2));

    const matrizArrayBitsMultiploOcho = formarMatrizArrayBitsMultiploOcho(cantidadDiferente255, nuevaMascaraSubredBinario, arrayCadenaMultiploOchoBits);

    //Esto me da un resultado con 255, porque lo programé así en base a su CLASE, pero lo que me debe dar debe ser en base a su Dirección IP
    const matrizArrayPseudoDireccionesIpDecimal = formarMatrizArrayDireccionesIpDecimal(matrizArrayBitsMultiploOcho);

    console.log(matrizArrayPseudoDireccionesIpDecimal);
    console.log(direccionIpInput.value)

    const cantidadIgual255 = 4 - cantidadDiferente255;
    const direccionIpInputValor = direccionIpInput.value;
    let arrayNumerosDireccionIpValor = direccionIpInputValor.split('.');
    arrayNumerosDireccionIpValor = arrayNumerosDireccionIpValor.map(octeto => parseInt(octeto));

    const matrizArrayDireccionesIP = matrizArrayPseudoDireccionesIpDecimal.map(array => [...array]);

    matrizArrayDireccionesIP.forEach((pseudoDireccion, i) => {
        pseudoDireccion.forEach((numero, j) => {
            if(j < cantidadIgual255) {
                matrizArrayDireccionesIP[i][j] = arrayNumerosDireccionIpValor[j];
            }
        });
    });

    console.log(matrizArrayDireccionesIP); // LISTA DE DIRECCIONES IP

    const arrayDireccionesIP = matrizArrayDireccionesIP.map(array => array.join('.'));

    console.log(arrayDireccionesIP);

    return arrayDireccionesIP;
}


export {formarObjetoDatosHallarVariasIP, hallarVariasDireccionesIP};