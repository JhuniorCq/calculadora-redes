const formulario = document.querySelector('.formulario');
const direccionIpInput = document.getElementById('direccion-ip');
const prefijoRedCampo= document.getElementById('prefijo-red')
const numeroSubRedesInput = document.getElementById('numero-subredes');
const hostsSubRedCampo = document.getElementById('hosts-subred');
const datosRed = {};

//IP DE EJEMPLO: 192.168.200.139
const hallar = (evento) => {
    evento.preventDefault();

    //PROCESO PARA HALLAR EL PREFIJO DE RED
    const direccionIPValor = direccionIpInput.value;
    
    const arrayNumerosIP = direccionIPValor.split('.');
    const primerNumero = arrayNumerosIP[0];
    
    //Acá asignamos la Clase, el Prefijo de Red y la Máscara de Red al Objeto "datosRed"
    hallarPrefijoRed(primerNumero);                 //VALIDAR QUE LOS CAMPOS SEAN OBLIGATORIOS

    prefijoRedCampo.innerText = datosRed.prefijoRed; //Mostramos Prefijo de Red

    //PROCESO PARA HALLAR LOS HOSTS POR SUBRED
    const numeroSubRedesValor = numeroSubRedesInput.value;
    console.log(numeroSubRedesValor);

    const mascaraRed = datosRed.mascaraRed;
    const arrayNumerosMascara = mascaraRed.split('.');
    const mascaraRedBinario = convertirBinario(mascaraRed);
    
    console.log(arrayNumerosMascara)
    console.log('Máscara red binario: ', mascaraRedBinario)

    const valorN = hallarCantidadBits(numeroSubRedesValor);
    console.log('Valor de N: ', valorN)

    // const claseRed = datosRed.claseRed;
    const x = agregarUnosCeros(valorN, mascaraRedBinario);
    console.log(x);
}

const hallarPrefijoRed = (primerNumero) => {
    if(primerNumero >= 0 && primerNumero <= 127) {
        datosRed.claseRed = 'A';
        datosRed.prefijoRed = 8;
        datosRed.mascaraRed = '255.0.0.0';
    } else if(primerNumero >= 128 && primerNumero <= 191) {
        datosRed.claseRed = 'B';
        datosRed.prefijoRed = 16;
        datosRed.mascaraRed = '255.255.0.0';
    } else if(primerNumero >= 192 && primerNumero <= 223){
        datosRed.claseRed = 'C';
        datosRed.prefijoRed = 24;
        datosRed.mascaraRed = '255.255.255.0';
    }
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

const agregarUnosCeros = (valorN, mascaraRedBinario) => {
    // const cantidadUnos = valorN;
    //Si la resta sale negativo hago un IF -> y me paso al siguiente 0 y ahi completo con UNOS
    let cantidadCeros = 0; 
    
    mascaraRedBinario.forEach(valor => {
        if(valor === '0') {
            cantidadCeros++;
        }
    });

    console.log('jwd: ', cantidadCeros);

    const cadenaCeros = formarCadena(cantidadCeros*8, '0'); //Formamos una cadena con una cantidad de CEROS múltiplo de 8
    console.log(cadenaCeros);

    let nuevoValor = '';
    for(let i=0; i<cadenaCeros.length; i++) {
        if(i <= valorN - 1) {
            nuevoValor = nuevoValor + '1';
        } else {
            nuevoValor = nuevoValor + '0';
        }

        // cadenaCeros[i] = '1';//ESTO NO SE PUEDE PORQUE LAS CADENAS TIENEN DIGITOS INMUTABLES
    }
    // console.log(cadenaCeros);

    // const cadenaCerosUnos = cadenaCeros;

    mascaraRedBinario = eliminarValorMascaraBinaria(cantidadCeros, mascaraRedBinario);
    mascaraRedBinario.push(nuevoValor);
    const mascaraRedBinarioString = mascaraRedBinario.join('');//Acá se forma una cadena de 0 y 1 de una cantidad de dígitos múltiplo de 8

    console.log('Macara de Red, todos sus numeros binarios juntos: ', mascaraRedBinarioString)
    const tamanioMascaraRedBinarioString = mascaraRedBinarioString.length;

    console.log('Cantidad Elementos Mascara Red Binaria: ', tamanioMascaraRedBinarioString);

    const cantidadNumerosNuevaMascara = tamanioMascaraRedBinarioString / 8;
    console.log('Voy a dividir: ', cantidadNumerosNuevaMascara)
    let nuevaMascaraRedBinario = [];
    let indiceMenor = 0, indiceMayor = indiceMenor + 8, aux;

    for(let i=0; i<cantidadNumerosNuevaMascara; i++) {

        const numeroBinario = mascaraRedBinarioString.slice(indiceMenor, indiceMayor);
        nuevaMascaraRedBinario.push(numeroBinario);
        indiceMenor = indiceMayor;
        indiceMayor = indiceMayor + 8;
    }

        console.log(nuevaMascaraRedBinario);

    nuevaMascaraRedBinario.forEach((valor, index) => {
        nuevaMascaraRedBinario[index] = parseInt(nuevaMascaraRedBinario[index], 2);

    });

    //AGREGAR ....

    // if(cantidadCeros < 0) {
    //     const cantidadUnos2 = Math.abs(cantidadCeros);
    //     const cantidadCeros2 = 8 - cantidadUnos2;

    // } 
    
    // const cadenaUnos = formarCadena(cantidadUnos, '1');
    // const cadenaCeros = formarCadena(cantidadCeros, '0');
    // console.log(cadenaUnos);
    // console.log(cadenaCeros);
    // mascaraRedBinario.forEach((valor, index) => {
    //     if(valor === '0') {
    //         mascaraRedBinario[index] = `${cadenaUnos}${cadenaCeros}`;
    //     }
    // });
    return nuevaMascaraRedBinario;


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

formulario.addEventListener('submit', hallar);