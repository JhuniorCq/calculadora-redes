import {datosHallarVariasIP, direccionIpInput} from './calculadora-flsm.js';
import {hallarCantidadDiferente255, formarArraySubcadenasNdigitos, agregarCerosSubcadenasNdigitos, formarMatrizArrayBitsMultiploOcho, formarMatrizArrayDireccionesIpDecimal} from './operaciones-flsm.js';

const formarObjetoDatosHallarVariasIP = (valorN, numeroSubRedesValor, nuevaMascaraSubredDecimal) => {
    datosHallarVariasIP.valorN = valorN;
    datosHallarVariasIP.numeroSubRedesValor = numeroSubRedesValor;
    datosHallarVariasIP.nuevaMascaraSubredDecimal = nuevaMascaraSubredDecimal;
}

const hallarVariasDireccionesIP = () => {
    const valorN = datosHallarVariasIP.valorN;
    const numeroSubRedesValor = datosHallarVariasIP.numeroSubRedesValor;
    const nuevaMascaraSubredDecimal = datosHallarVariasIP.nuevaMascaraSubredDecimal;

    const cantidadDiferente255 = hallarCantidadDiferente255(nuevaMascaraSubredDecimal); 

    const arraySubcadenasNdigitos = formarArraySubcadenasNdigitos(numeroSubRedesValor, valorN); // HASTA ACÁ FINO

    const arrayCadenaMultiploOchoBits = agregarCerosSubcadenasNdigitos(cantidadDiferente255, valorN, arraySubcadenasNdigitos);

    const nuevaMascaraSubredBinario = nuevaMascaraSubredDecimal.map(elemento => elemento.toString(2));

    const matrizArrayBitsMultiploOcho = formarMatrizArrayBitsMultiploOcho(cantidadDiferente255, nuevaMascaraSubredBinario, arrayCadenaMultiploOchoBits);

    //Esto me da un resultado con 255, porque lo programé así en base a su CLASE, pero lo que me debe dar debe ser en base a su Dirección IP
    const matrizArrayPseudoDireccionesIpDecimal = formarMatrizArrayDireccionesIpDecimal(matrizArrayBitsMultiploOcho);

    console.log(matrizArrayPseudoDireccionesIpDecimal);
    console.log(direccionIpInput.value)

    // HASTA ACÁ TAMOS BIEN, YA ME BOTA UNA MATRIZ CON ARRAYS QUE CONTIENEN LOS OCTETOS DE CADA IP

    //LO QUE QUEDARÍA POR HACER ES ORDENAR TODO ESTO EN FUNCIONES Y MOSTRARLO EN EL FRONT
    //SI SE PUEDE SERÍA MEJOR CREAR ARCHIVOS SEPARADOS PARA LAS FUNCIONES Y LUEGO SOLO LLAMARLAS ACÁ

    const cantidadIgual255 = 4 - cantidadDiferente255;
    const direccionIpInputValor = direccionIpInput.value;
    let arrayNumerosDireccionIpValor = direccionIpInputValor.split('.');
    arrayNumerosDireccionIpValor = arrayNumerosDireccionIpValor.map(octeto => parseInt(octeto));

    const matrizArrayDireccionesIP = matrizArrayPseudoDireccionesIpDecimal.map(array => [...array]);
    // console.log(matrizArrayPseudoDireccionesIP)
    // for(let i=0; i<matrizArrayPseudoDireccionesIP.length; i++) {
    //     for(let j=0; j<4; j++) {
    //         if(j < cantidadIgual255) {
    //             matrizArrayPseudoDireccionesIP[i][j] = arrayNumerosDireccionIpValor[j];
    //         }
    //     }
    // }

    matrizArrayDireccionesIP.forEach((pseudoDireccion, i) => {
        pseudoDireccion.forEach((numero, j) => {
            if(j < cantidadIgual255) {
                matrizArrayDireccionesIP[i][j] = arrayNumerosDireccionIpValor[j];
            }
        });
    });

    console.log(matrizArrayDireccionesIP); // LISTA DE DIRECCIONES IP
}


export {formarObjetoDatosHallarVariasIP, hallarVariasDireccionesIP};