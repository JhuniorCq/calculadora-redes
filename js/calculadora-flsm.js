import {validarDireccionIP, validarNumeroSubRedes} from './validaciones-flsm.js';
import {cambiarMarginLabel} from './detalles-flsm.js';
const formulario = document.querySelector('.formulario');
const direccionIpInput = document.getElementById('direccion-ip');
const prefijoRedInput= document.getElementById('prefijo-red'); // Acá mostraré un dato
const numeroSubRedesInput = document.getElementById('numero-subredes');
const hostsSubRedInput = document.getElementById('hosts-subred'); // Acá mostraré un dato
const datosRed = {};
// let cantidadBitsSubred, cantidadBitsHostSubred, cantidadSubredesCreadas;

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
    prefijoRedInput.value = datosRed.prefijoRed; //Mostramos al Usuario el Prefijo de Red obtenido

    //PROCESO PARA HALLAR LOS HOSTS POR SUBRED
    const cantidadHostsSubRed = hallarNumeroSubredes(numeroSubRedesValor);
    hostsSubRedInput.value = cantidadHostsSubRed; //Mostramos al Usuario la Cantidad de Subredes obtenida
    


}

const hallarPrefijoRed = (direccionIPValor) => {
    const arrayNumerosIP = direccionIPValor.split('.');     // ['192', '168', '200', '139']
    const primerNumero = arrayNumerosIP[0];     // '192'

    if(primerNumero >= 0 && primerNumero <= 127) {
        datosRed.claseRed = 'A';
        datosRed.prefijoRed = 8;
        datosRed.mascaraSubred = '255.0.0.0'; //Se asigna la Máscara de Subred Original
    } else if(primerNumero >= 128 && primerNumero <= 191) {
        datosRed.claseRed = 'B';
        datosRed.prefijoRed = 16;
        datosRed.mascaraSubred = '255.255.0.0'; //Se asigna la Máscara de Subred Original
    } else if(primerNumero >= 192 && primerNumero <= 223){
        datosRed.claseRed = 'C';
        datosRed.prefijoRed = 24;
        datosRed.mascaraSubred = '255.255.255.0'; //Se asigna la Máscara de Subred Original
    }
}

const hallarNumeroSubredes = (numeroSubRedesValor) => {
    console.log('Número de Subredes ingresado: ', numeroSubRedesValor);

    const mascaraSubred = datosRed.mascaraSubred;
    const arrayNumerosMascara = mascaraSubred.split('.');
    const mascaraSubredBinario = convertirBinario(mascaraSubred);
    
    console.log('Máscara red original decimal: ', arrayNumerosMascara)
    console.log('Máscara red original binario: ', mascaraSubredBinario)

    const valorN = hallarCantidadBits(numeroSubRedesValor); // valorN representa la cantidad UNOS
    console.log('Valor de N: ', valorN)

    // Esta función me devuelve la NUEVA MÁSCADA DE SUBRED (EN DECIMAL)
    const nuevaMascaraSubredDecimal = obtenerNuevaMascaraSubred(valorN, mascaraSubredBinario);
    console.log(nuevaMascaraSubredDecimal);

    // AHORA DEBEMOS SEGUIR PARA HALLAR EL NÚMERO DE SUBREDES
    const cantidadCeros = hallarNumeroCeros(valorN, datosRed.claseRed);
    console.log(cantidadCeros);

    const cantidadHostsSubRed = calcularCantidadHostsSubred(cantidadCeros);
    console.log('Cantidad hosts por subred: ', cantidadHostsSubRed)

    return cantidadHostsSubRed;
}

const hallarNumeroCeros = (valorN, claseRed) => {
    let cantidadBits; //Dependen de la Clase el Prefijo de Red tenrá 1, 2 o 3 CEROS

    if(claseRed === 'A') {
        cantidadBits = 24;
        return cantidadBits - valorN;
    } else if(claseRed === 'B') {
        cantidadBits = 16;
        return cantidadBits - valorN;
    } else {
        cantidadBits = 8;
        return cantidadBits - valorN;
    }
}

const calcularCantidadHostsSubred = (cantidadCeros) => {
    return Math.pow(2, cantidadCeros) - 2;
}

const convertirBinario = (mascaraRed) => {
    const arrayNumerosMascara = mascaraRed.split('.');
    const mascaraRedBinario = arrayNumerosMascara.map(numero => {
        const numeroINT = parseInt(numero);
        return numeroINT.toString(2);
    });

    return mascaraRedBinario;
}

const hallarCantidadBits = (numeroSubRedesValor) => {
    let base = 2, i=0;
    while(true) {
        i++;
        if(Math.pow(base, i) >= numeroSubRedesValor) {
            break;
        }
        base*2;
    }
    return i;
}

const obtenerNuevaMascaraSubred = (valorN, mascaraSubredBinario) => {
    const cantidadCeros = hallarCantidadOctetoCeros(mascaraSubredBinario); // [11111111, 11111111, 11111111, 0] -> habría un CERO
    const cadenaCeros = formarCadena(cantidadCeros*8, '0'); //Formamos una cadena con una cantidad de CEROS múltiplo de 8
    const nuevoValor = agregarUnosCadenaCeros(cadenaCeros, valorN); //11100000

    console.log(`Se eliminará los ${cantidadCeros} últimos ceros y se agregará esto: ${nuevoValor}`);

    const todosBitsMascaraSubred = agruparTodosBitsMacara(mascaraSubredBinario, cantidadCeros, nuevoValor);
    
    console.log('Macara de Red, todos sus numeros binarios juntos: ', todosBitsMascaraSubred)

    const nuevaMascaraSubredBinario = formarNuevaMascaraBinario(todosBitsMascaraSubred);
    const nuevaMascaraSubredDecimal = convertirDecimalNuevaMascara(nuevaMascaraSubredBinario);

    return nuevaMascaraSubredDecimal;
}

const formarCadena = (cantidad, numeroAgregar) => {
    let resultado = '';

    for(let i=0; i<cantidad; i++) {
        resultado += numeroAgregar;
    }

    return resultado;
}

const eliminarValorMascaraBinaria = (cantidad, mascaraRedBinario) => {
    for(let i=0; i<cantidad; i++) {
        mascaraRedBinario.pop();
    }

    return mascaraRedBinario;
}

const hallarCantidadOctetoCeros = (mascaraSubredBinario) => {
    let cantidadCeros = 0; 
    mascaraSubredBinario.forEach(valor => {
        if(valor === '0') {
            cantidadCeros++;
        }
    });

    console.log('Cantidad de CEROS en la mascara de subred original: ', cantidadCeros);
    return cantidadCeros;
}

const agregarUnosCadenaCeros = (cadenaCeros, valorN) => {
    let nuevoValor = '';
    for(let i=0; i<cadenaCeros.length; i++) {
        if(i <= valorN - 1) {
            nuevoValor = nuevoValor + '1';
        } else {
            nuevoValor = nuevoValor + '0';
        }
    }

    return nuevoValor;
}

const agruparTodosBitsMacara = (mascaraSubredBinario, cantidadCeros, nuevoValor) => {
    mascaraSubredBinario = eliminarValorMascaraBinaria(cantidadCeros, mascaraSubredBinario);
    mascaraSubredBinario.push(nuevoValor);
    //Acá se forma una cadena de 0 y 1 de una cantidad de dígitos múltiplo de 8
    const todosBitsMascaraSubred = mascaraSubredBinario.join('');

    return todosBitsMascaraSubred;
}

const formarNuevaMascaraBinario = (todosBitsMascaraSubred) => {
    const cantidadBitsMascaraSubred = todosBitsMascaraSubred.length;
    
    console.log('Cantidad Elementos Máscara Red Binaria: ', cantidadBitsMascaraSubred);

    const cantidadNumerosNuevaMascara = cantidadBitsMascaraSubred / 8;
    console.log('Voy a dividir: ', cantidadNumerosNuevaMascara)
    let nuevaMascaraSubredBinario = [], indiceMenor = 0, indiceMayor = indiceMenor + 8;

    for(let i=0; i<cantidadNumerosNuevaMascara; i++) {
        const numeroBinario = todosBitsMascaraSubred.slice(indiceMenor, indiceMayor);
        nuevaMascaraSubredBinario.push(numeroBinario);
        indiceMenor = indiceMayor;
        indiceMayor = indiceMayor + 8;
    }

    console.log(nuevaMascaraSubredBinario);
    return nuevaMascaraSubredBinario;
}

const convertirDecimalNuevaMascara = (nuevaMascaraSubredBinario) => {
    //Convertimos a Base 10 a cada Elemento del Array "nuevaMascaraSubredBinario"
    nuevaMascaraSubredBinario.forEach((valor, index) => {
        nuevaMascaraSubredBinario[index] = parseInt(nuevaMascaraSubredBinario[index], 2);
    });

    return nuevaMascaraSubredBinario;
}

//Con esto mostraremos el Prefijo de Red, pero de manera dinámica
const mostrarPrefijoRed = () => {
    //PROCESO PARA HALLAR EL PREFIJO DE RED
    const direccionIpValor = direccionIpInput.value;    // '192.168.200.139'

    hallarPrefijoRed(direccionIpValor);

    prefijoRedInput.value = datosRed.prefijoRed; //Mostramos al Usuario Prefijo de Red obtenido

    cambiarMarginLabel(direccionIpInput, prefijoRedInput);
}

const mostrarNumeroSubredes = () => {
    //PROCESO PARA HALLAR EL NÚMERO DE SUBREDES
    // const hostsSubRedInput = hostsSubRedInput.value;
    // console.log();
    //->
    //REPETIR EL PROCESO DE HALLAR LA CANTIDAD DE HOST POR SUB RED YA NO SERÁ NECESARIO
    //MOSTRAR AL USUARIO EL NÚMERO DE SUBREDES
    cambiarMarginLabel(numeroSubRedesInput, hostsSubRedInput);
}

formulario.addEventListener('submit', calcularDatos);
direccionIpInput.addEventListener('input', mostrarPrefijoRed);
numeroSubRedesInput.addEventListener('input', mostrarNumeroSubredes);