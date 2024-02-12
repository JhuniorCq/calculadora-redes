import {validarDireccionIP, validarNumeroSubRedes} from './validaciones-flsm.js';
import {cambiarMarginLabel} from './detalles-flsm.js';
import {hallarPrefijoRed} from './hallarPrefijoRed.js';
import {hallarNumeroCeros, calcularCantidadHostsSubred, convertirBinarioMascaraSubred, hallarCantidadBits, formarCadena, eliminarValorMascara, formarNuevaMascaraBinario, obtenerNuevaMascaraSubred} from './operaciones-flsm.js';
import {formarObjetoDatosHallarVariasIP} from './hallarConjuntoDireccionesIp.js';
const formulario = document.querySelector('.formulario');
const direccionIpInput = document.getElementById('direccion-ip');
const prefijoRedInput= document.getElementById('prefijo-red'); // Acá mostraré un dato
const numeroSubRedesInput = document.getElementById('numero-subredes');
const hostsSubRedInput = document.getElementById('hosts-subred'); // Acá mostraré un dato
const datosRed = {};
const datosHallarVariasIP = {} //DE AHÍ DEBO ASIGNARLE OTRO NOMBRE

//IP DE EJEMPLO: 192.168.200.139
const calcularDatos = (evento) => {
    evento.preventDefault();

    //PROCESO PARA HALLAR EL PREFIJO DE RED
    const direccionIPValor = direccionIpInput.value;    // '192.168.200.139'
    const numeroSubRedesValor = numeroSubRedesInput.value;  // 8

    //VALIDAR DATOS
    if(!validarDireccionIP(direccionIPValor) || !validarNumeroSubRedes(numeroSubRedesValor)) {
        return;
    }
    
    //Acá asignamos la Clase, el Prefijo de Red y la Máscara de Red al Objeto "datosRed"
    hallarPrefijoRed(direccionIPValor);

    //PROCESO PARA HALLAR LOS HOSTS POR SUBRED
    const cantidadHostsSubRed = hallarNumeroSubredes(numeroSubRedesValor);
    hostsSubRedInput.value = cantidadHostsSubRed; //Mostramos al Usuario la Cantidad de Subredes obtenida
    
    hallarVariasDireccionesIP();

}

//  HALLAR PREFIJO RED . JS
const hallarNumeroSubredes = (numeroSubRedesValor) => {
    console.log('Número de Subredes ingresado: ', numeroSubRedesValor);

    const mascaraSubred = datosRed.mascaraSubred;
    const arrayNumerosMascara = mascaraSubred.split('.');
    const mascaraSubredBinario = convertirBinarioMascaraSubred(mascaraSubred);
    
    console.log('Máscara red original decimal: ', arrayNumerosMascara)
    console.log('Máscara red original binario: ', mascaraSubredBinario)

    const valorN = hallarCantidadBits(numeroSubRedesValor); // valorN representa la cantidad UNOS
    console.log('Valor de N: ', valorN);

    // Esta función me devuelve la NUEVA MÁSCADA DE SUBRED (EN DECIMAL)
    const nuevaMascaraSubredDecimal = obtenerNuevaMascaraSubred(valorN, mascaraSubredBinario);
    console.log(nuevaMascaraSubredDecimal);

    // AHORA DEBEMOS SEGUIR PARA HALLAR EL NÚMERO DE SUBREDES
    const cantidadCeros = hallarNumeroCeros(valorN);
    console.log(cantidadCeros);

    const cantidadHostsSubRed = calcularCantidadHostsSubred(cantidadCeros);
    console.log('Cantidad hosts por subred: ', cantidadHostsSubRed)

    //ACÁ FORMARÉ AL OBJETO QUE CONTENDRÁ LOS DATOS QUE ME DARÁN UN CONJUNTO DE DIRECCIONES IP
    formarObjetoDatosHallarVariasIP(valorN, numeroSubRedesValor, nuevaMascaraSubredDecimal);
    
    return cantidadHostsSubRed;
}


// HALLAR VARIAS DIRECCIONES IP . JS
const hallarVariasDireccionesIP = () => {
    const valorN = datosHallarVariasIP.valorN;
    const numeroSubRedesValor = datosHallarVariasIP.numeroSubRedesValor;
    const nuevaMascaraSubredDecimal = datosHallarVariasIP.nuevaMascaraSubredDecimal;

    let cantidadDiferente255 = 0;

    nuevaMascaraSubredDecimal.forEach((elemento) => {
        if(elemento !== 255) {
            cantidadDiferente255++;
        }
    })

    let arraySubcadenasNdigitos = [];

    for(let i=0; i<numeroSubRedesValor; i++) {
        let numeroBinario = i.toString(2);
        
        while(numeroBinario.length < valorN) {
            numeroBinario = '0'.concat(numeroBinario);
        }

        console.log(numeroBinario);
        arraySubcadenasNdigitos.push(numeroBinario);
    }
    console.log(`Array subcadenas de ${valorN} digitos: `, arraySubcadenasNdigitos);

    const cadenaCeros = formarCadena(cantidadDiferente255*8 - valorN, '0');

    const nuevaMascaraSubredBinario = nuevaMascaraSubredDecimal.map(elemento => elemento.toString(2));
    
    const arrayCadenaMultiploOchoBits = arraySubcadenasNdigitos.map(elemento => {
        const cadenaOchoBits = elemento.concat(cadenaCeros);
        console.log('aaaa', cadenaOchoBits) 

        return cadenaOchoBits;
    });

    console.log(arrayCadenaMultiploOchoBits)

    const nuevaMascaraSinUltimosCeros = eliminarValorMascara(cantidadDiferente255, nuevaMascaraSubredBinario);
    console.log('nuevaMascaraSinUltimosCeros: ', nuevaMascaraSinUltimosCeros)

    const matrizArrayCadenasBits = arrayCadenaMultiploOchoBits.map((cadenaOchoBits) => {
        const nuevaMascaraSinUltimosCerosCopia = [...nuevaMascaraSinUltimosCeros];
        nuevaMascaraSinUltimosCerosCopia.push(cadenaOchoBits)
        return nuevaMascaraSinUltimosCerosCopia;
    });

    console.log('Lafe', matrizArrayCadenasBits)

    const matrizArrayBitsMultiploOcho = matrizArrayCadenasBits.map((array) => array.join(''))

    console.log('matrizArrayBitsMultiploOcho', matrizArrayBitsMultiploOcho)

    //La funcion se llama así, pero no será para formar la Nueva Mascara Binario, solo estoy reutilizando la funcion
    const matrizArrayDireccionsIpBinario = matrizArrayBitsMultiploOcho.map(arrayBitsMultiplo8 => formarNuevaMascaraBinario(arrayBitsMultiplo8));

    console.log(matrizArrayDireccionsIpBinario);

    const matrizArrayDireccionesIpDecimal = matrizArrayDireccionsIpBinario.map(arrayDireccionIpBinario => {
        console.log(arrayDireccionIpBinario)
        const arrayDireccionIpDecimal = arrayDireccionIpBinario.map(direccionIP => parseInt(direccionIP, 2));
        return arrayDireccionIpDecimal;
    });
    console.log(matrizArrayDireccionesIpDecimal) // HASTA ACÁ TAMOS BIEN, YA ME BOTA UNA MATRIZ CON ARRAYS QUE CONTIENEN LOS OCTETOS DE CADA IP

    //LO QUE QUEDARÍA POR HACER ES ORDENAR TODO ESTO EN FUNCIONES Y MOSTRARLO EN EL FRONT
    //SI SE PUEDE SERÍA MEJOR CREAR ARCHIVOS SEPARADOS PARA LAS FUNCIONES Y LUEGO SOLO LLAMARLAS ACÁ
}



//Con esto mostraremos el Prefijo de Red, pero de manera dinámica
const mostrarPrefijoRedDinamico = () => {
    //PROCESO PARA HALLAR EL PREFIJO DE RED
    const direccionIpValor = direccionIpInput.value;    // '192.168.200.139'

    hallarPrefijoRed(direccionIpValor);

    prefijoRedInput.value = datosRed.prefijoRed; //Mostramos al Usuario Prefijo de Red obtenido

    cambiarMarginLabel(direccionIpInput, prefijoRedInput);
}

const mostrarNumeroSubredesDinamico = () => {
    //PROCESO PARA HALLAR EL NÚMERO DE SUBREDES
    // const hostsSubRedInput = hostsSubRedInput.value;
    // console.log();
    //->
    //REPETIR EL PROCESO DE HALLAR LA CANTIDAD DE HOST POR SUB RED YA NO SERÁ NECESARIO
    //MOSTRAR AL USUARIO EL NÚMERO DE SUBREDES
    cambiarMarginLabel(numeroSubRedesInput, hostsSubRedInput);
}

formulario.addEventListener('submit', calcularDatos);
direccionIpInput.addEventListener('input', mostrarPrefijoRedDinamico);
numeroSubRedesInput.addEventListener('input', mostrarNumeroSubredesDinamico);

export {
    datosRed, prefijoRedInput, // hallarPrefijoRed.js
    hostsSubRedInput, // hallarNumeroSubredes.js
    datosHallarVariasIP // hallarConjuntoDireccionesIp.js
};