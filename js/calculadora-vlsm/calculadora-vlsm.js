const formulario = document.querySelector('.formulario');
const direccionIpInput = document.getElementById('direccion-ip');
const prefijoRedInput = document.getElementById('prefijo-red');
const numeroSubRedesInput = document.getElementById('numero-subredes');
import {hallarPrefijoRed} from '../calculadora-vlsm/hallarPrefijoRed.js';
import {cambiarMarginLabel} from '../detalles-calculadoras.js';

const contenedorTablaSubredes = document.querySelector('.contenedor-subredes');
const cuerpoTabla = document.querySelector('.cuerpo-tabla');

//Acá almaceno -> Clase Subred, Prefijo Subred, Máscara Subred
const datosSubred = {};

const hallarResultado = (evento) => {
    try {
        evento.preventDefault();

        const direccionIpValor = direccionIpInput.value;
        
        
        //Cada INPUT FILA es un Número de Host nodeListInputFila
        const nodeListInputFila = document.querySelectorAll('.input-fila');
        const arrayInputFila = [...nodeListInputFila];
        
        if(nodeListInputFila.length <= 0) {
            alert('El número de subredes debe ser positivo.');
            return;
        }

        //Ordenamos los valores del array
        let arrayInputsValores = arrayInputFila.map(inputFila => inputFila.value);
        arrayInputsValores.sort((a, b) => b - a);

        console.log(arrayInputsValores);
        let booleano = true;
        let ultimoOctetoSiguienteSubred;
        arrayInputsValores.forEach(valor => {
            //Calcular el número de bits de host necesarios
            const valorN = hallarValorNyHostsDisponibles(valor)[0];
            const hostsDisponibles = hallarValorNyHostsDisponibles(valor)[1];
            console.log(`Para ${valor} su N es: `, valorN);
            console.log(`Para ${valor} su cantidad de Hosts disponibles: `, hostsDisponibles);

            //Calcular el número de bits de subred
            const prefijoRed = datosSubred.prefijoRed;
            const numeroBitsSubred = (32 - prefijoRed) - valorN;

            //Calcular la nueva máscara de subred
            const nuevoPrefijoRed = prefijoRed + numeroBitsSubred;

            console.log(numeroBitsSubred)
            console.log(nuevoPrefijoRed)

            //Hallar la nueva Máscara de subred
            const cantidadUnos = nuevoPrefijoRed;
            const cadena32Bits = formarCadena32Bits(cantidadUnos);
            console.log(cadena32Bits);
            const arrayOctetosNuevaMascara = hallarNuevaMascaraSubred(cadena32Bits);
            const nuevaMascaraSubred = arrayOctetosNuevaMascara.join('.');
            console.log(nuevaMascaraSubred);

            //Calcular el salto de red
            const saltoRed = 256 - arrayOctetosNuevaMascara[3];

            console.log('La Dirección IP inicial es: ', direccionIpValor);
            //Calcular los parámetros de la red
            
            if(booleano) {
                ultimoOctetoSiguienteSubred = calcularParametrosRed(direccionIpValor, hostsDisponibles)[4][3];
                booleano = false;
            }

            console.log('ultimoOcteto', ultimoOctetoSiguienteSubred)
            // const arrayParametros = calcularParametrosRed(direccionIpInput, hostsDisponibles, saltoRed, ultimoOctetoSiguienteSubred);
            // const direccionSubred = arrayParametros[0];
            // const primerHost = arrayParametros[1];
            // const ultimoHost = arrayParametros[2];
            // const broadcast = arrayParametros[3];
            // ultimoOctetoSiguienteSubred = arrayParametros[4][3];
        });

    } catch(err) {
        console.error('', err.message);
    }
}

const hallarValorNyHostsDisponibles = (valor) => {
    let i=0, valorN, hostsDisponibles;

    while(true) {
        i++;
        if(2**i - 2 >= valor) {
            hostsDisponibles = 2**i - 2;
            break;
        }
    }
    valorN = i;

    return [valorN, hostsDisponibles];
}

const formarCadena32Bits = (cantidadUnos) => {
    let cadena32Bits = '';
    for(let i=0; i<32; i++) {
        if(i < cantidadUnos) {
            cadena32Bits += '1';
        } else {
            cadena32Bits += '0';
        }
    }
    return cadena32Bits;
}

const hallarNuevaMascaraSubred = (cadena32Bits) => {
    let rangoInicio = 0, rangoFin = 8;
    let array = [];

    for(let i=0; i<4; i++) {
        const segmentoCadena = cadena32Bits.slice(rangoInicio, rangoFin);
        rangoInicio = rangoFin;
        rangoFin = rangoFin + 8;
        array.push(parseInt(segmentoCadena, 2));
    }
    
    return array;
}

const calcularParametrosRed = (direccionIpValor, hostsDisponibles, saltoRed=0, octeto=0) => {
    const claseRed = datosSubred.claseRed;
    const octetosDireccionIP = direccionIpValor.split('.'); // ['192', '168', '200', '139']
    console.log(octetosDireccionIP);

    if(claseRed === 'A') {
        
    } else if(claseRed === 'B') {

    } else {
        octetosDireccionIP.pop();
        const direccionSubred = octetosDireccionIP.concat([saltoRed+octeto]); // ['192', '168', '200', 0]
        const direccionSubredOK = [...direccionSubred];
        console.log('direccionSubred', direccionSubredOK);

        const ultimoOcteto = direccionSubred.pop();
        const primerHost = octetosDireccionIP.concat([ultimoOcteto + 1]);
        const primerHostOK = [...primerHost];
        console.log('primerHost', primerHostOK);

        // const ultimoOcteto2 = primerHost.pop();
        const ultimoHost = octetosDireccionIP.concat([ultimoOcteto + hostsDisponibles]);
        const ultimoHostOK = [...ultimoHost];
        console.log('ultimoHost', ultimoHostOK);

        const ultimoOcteto2 = ultimoHost.pop();
        const broadcast = ultimoHost.concat([ultimoOcteto2 + 1]);
        const broadcastOK = [...broadcast];
        console.log('broadcast', broadcastOK);

        const ultimoOcteto3 = broadcast.pop();
        const siguienteSubred = broadcast.concat([ultimoOcteto3 + 1]);
        console.log('siguienteSubred', siguienteSubred);

        return [
            direccionSubredOK,
            primerHostOK,
            ultimoHostOK,
            broadcastOK,
            siguienteSubred
        ];
    }
}

/***************************************/
const mostrarPrefijoRedDinamico = () => {
    const direccionIpValor = direccionIpInput.value;
    // console.log(direccionIpValor);
    
    hallarPrefijoRed(direccionIpValor);
    cambiarMarginLabel(direccionIpInput, prefijoRedInput);
}

const mostrarNumeroSubredesDinamico = () => {
    cuerpoTabla.innerText = '';
    const labelNumeroSubRedes = numeroSubRedesInput.previousElementSibling;
    labelNumeroSubRedes.style.marginBottom = '10px';

    const numeroSubRedesValor = parseInt(numeroSubRedesInput.value);
    
    for(let i=0; i<numeroSubRedesValor; i++) {
        const nuevaFila = document.createElement('tr');
        nuevaFila.innerHTML = `
            <td>Subred ${i+1}</td>
            <td>
                <input type="number" id="numero-hosts-${i}" placeholder="Introduce el N° de hosts de la subred ${i+1}" class="input-fila" required>
            </td>
        `;
        cuerpoTabla.append(nuevaFila);
    }
    
    contenedorTablaSubredes.style.display = 'flex';
}


formulario.addEventListener('submit', hallarResultado);
direccionIpInput.addEventListener('input', mostrarPrefijoRedDinamico);
numeroSubRedesInput.addEventListener('input', mostrarNumeroSubredesDinamico)
export {datosSubred, prefijoRedInput};
