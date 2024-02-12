import {datosRed} from './calculadora-flsm.js'

const hallarNumeroCeros = (valorN) => {
    let cantidadBits; //Dependen de la Clase el Prefijo de Red tenrá 1, 2 o 3 CEROS
    const claseRed = datosRed.claseRed;

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

const convertirBinarioMascaraSubred = (mascaraSubred) => {
    const arrayNumerosMascara = mascaraSubred.split('.');
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

const formarCadena = (cantidad, numeroAgregar) => {
    let resultado = '';

    for(let i=0; i<cantidad; i++) {
        resultado += numeroAgregar;
    }

    return resultado;
}

const eliminarValorMascara = (cantidad, mascaraRed) => {
    for(let i=0; i<cantidad; i++) {
        mascaraRed.pop();
    }

    return mascaraRed;
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
    mascaraSubredBinario = eliminarValorMascara(cantidadCeros, mascaraSubredBinario);
    mascaraSubredBinario.push(nuevoValor);
    //Acá se forma una cadena de 0 y 1 de una cantidad de dígitos múltiplo de 8
    const todosBitsMascaraSubred = mascaraSubredBinario.join('');

    return todosBitsMascaraSubred;
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

const convertirDecimalNuevaMascara = (nuevaMascaraSubredBinario) => {
    //Convertimos a Base 10 a cada Elemento del Array "nuevaMascaraSubredBinario"
    nuevaMascaraSubredBinario.forEach((valor, index) => {
        nuevaMascaraSubredBinario[index] = parseInt(nuevaMascaraSubredBinario[index], 2);
    });

    return nuevaMascaraSubredBinario;
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



export {hallarNumeroCeros, calcularCantidadHostsSubred, convertirBinarioMascaraSubred, hallarCantidadBits, formarCadena, eliminarValorMascara, /*hallarCantidadOctetoCeros,*/ agregarUnosCadenaCeros, agruparTodosBitsMacara, obtenerNuevaMascaraSubred, convertirDecimalNuevaMascara, formarNuevaMascaraBinario};