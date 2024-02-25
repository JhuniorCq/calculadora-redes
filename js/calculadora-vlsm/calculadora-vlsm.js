const formulario = document.querySelector('.formulario');
const direccionIpInput = document.getElementById('direccion-ip');
const prefijoRedInput = document.getElementById('prefijo-red');
const numeroSubRedesInput = document.getElementById('numero-subredes');
import {hallarPrefijoRed} from '../calculadora-vlsm/hallarPrefijoRed.js';
import {cambiarMarginLabel} from '../detalles-calculadoras.js';

const contenedorTablaSubredes = document.querySelector('.contenedor-subredes');
const cuerpoTabla = document.querySelector('.cuerpo-tabla');

const contenedorResultado = document.querySelector('.contenedor-resultado');
const tbodyResultados = document.querySelector('.tbody-resultados');

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

        let booleano = true, ultimoOctetoSiguienteSubred;
        hallarPrefijoRed(direccionIpValor);
        const prefijoRed = datosSubred.prefijoRed;
        const arrayDatosNecesarios = [];

        let index = 0;
        for(const valor of arrayInputsValores) {

            //Calcular el número de bits de host necesarios
            const valorN = hallarValorNyHostsDisponibles(valor)[0];
            const hostsDisponibles = hallarValorNyHostsDisponibles(valor)[1];
            console.log(`Para ${valor} su N es: `, valorN);
            console.log(`Para ${valor} su cantidad de Hosts disponibles: `, hostsDisponibles);

            //Calcular el número de bits de subred
            
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
            console.log('saltoRed', saltoRed)

            console.log('La Dirección IP inicial es: ', direccionIpValor);

            //Calcular los parámetros de la red -> Almacenaré algunos de los datos halladas paracada Fila, en este Objeto
            const objetoDatosSubred = {
                // numero_subred: index + 1,
                hosts_disponibles: hostsDisponibles,
                nuevo_prefijo_red: nuevoPrefijoRed,
                nueva_mascara_subred: nuevaMascaraSubred,
                salto_red: saltoRed
            };
            
            arrayDatosNecesarios.push(objetoDatosSubred);

            // index++;
        }

        console.log(arrayDatosNecesarios);
        
        tbodyResultados.innerText = '';

        const claseSubred = datosSubred.claseRed;
        if(claseSubred === 'A') {
            const arrayDireccionesRed = hallarDireccionesRedA(direccionIpValor, arrayDatosNecesarios);
            console.log('Tamos haciendo de la Clase A')

        } else if(claseSubred === 'B') {
            const arrayDireccionesRed = hallarDireccionesRedB(direccionIpValor, arrayDatosNecesarios);
            console.log('Tamos haciendo de la Clase B')

            arrayDireccionesRed.forEach((direccionRed, index) => {
                const hostsDisponibles = arrayDatosNecesarios[index]['hosts_disponibles'];
                const nuevoPrefijoRed = arrayDatosNecesarios[index]['nuevo_prefijo_red'];
                const nuevaMascara = arrayDatosNecesarios[index]['nueva_mascara_subred'];

                const direccionRedIP = [...direccionRed].join('.');
                console.log('La direccion RED en el forEach es ', direccionRedIP);

                //TAL VEZ SE TENGA QUE CONSISTENSIAR EN CASO LA SUMA DE ultimoOcteto1 + X de algo Mayor a 255, pero POR AHORA LO DEJARÉ ASÍ
                const ultimoOcteto1 = direccionRed.pop();
                const primerHost = direccionRed.concat([ultimoOcteto1 + 1]);
                const primerHostOK = [...primerHost].join('.');
                console.log('primerHost', primerHostOK);

                const ultimoHost = direccionRed.concat([ultimoOcteto1 + hostsDisponibles]);
                const ultimiHostOK = [...ultimoHost].join('.');
                console.log('ultimoHost', ultimiHostOK);

                const broadcast = direccionRed.concat([ultimoOcteto1 + hostsDisponibles + 1]);
                const broadcastOK = [...broadcast].join('.');
                console.log('broadcast', broadcastOK);

                //Ahora tocará crear las filas
                const nuevaFila = document.createElement('tr');
                nuevaFila.innerHTML = `
                    <td>Subred ${index+1}</td>
                    <td>${hostsDisponibles}</td>
                    <td>${direccionRedIP}/${nuevoPrefijoRed}</td>
                    <td>${nuevaMascara}</td>
                    <td>${primerHostOK}</td>
                    <td>${ultimiHostOK}</td>
                    <td>${broadcastOK}</td>
                `;
                tbodyResultados.append(nuevaFila);
            });

            contenedorResultado.style.display = 'flex';

        } else {
            const arrayDireccionesRed = hallarDireccionesRedC(direccionIpValor, arrayDatosNecesarios);

            arrayDireccionesRed.forEach((direccionRed, index) => {

                const hostsDisponibles = arrayDatosNecesarios[index]['hosts_disponibles'];
                const nuevoPrefijoRed = arrayDatosNecesarios[index]['nuevo_prefijo_red'];
                const nuevaMascara = arrayDatosNecesarios[index]['nueva_mascara_subred'];

                const direccionRedIP = [...direccionRed].join('.');
                console.log('La direccion RED en el forEach es ', direccionRedIP)

                const ultimoOcteto1 = direccionRed.pop();
                const primerHost = direccionRed.concat([ultimoOcteto1 + 1]);
                const primerHostOK = [...primerHost].join('.');
                console.log('primerHost', primerHostOK);

                const ultimoHost = direccionRed.concat([ultimoOcteto1 + hostsDisponibles]);
                const ultimiHostOK = [...ultimoHost].join('.');
                console.log('ultimoHost', ultimiHostOK);

                const broadcast = direccionRed.concat([ultimoOcteto1 + hostsDisponibles + 1]);
                const broadcastOK = [...broadcast].join('.');
                console.log('broadcast', broadcastOK);

                //Ahora tocará crear las filas
                const nuevaFila = document.createElement('tr');
                nuevaFila.innerHTML = `
                    <td>Subred ${index+1}</td>
                    <td>${hostsDisponibles}</td>
                    <td>${direccionRedIP}/${nuevoPrefijoRed}</td>
                    <td>${nuevaMascara}</td>
                    <td>${primerHostOK}</td>
                    <td>${ultimiHostOK}</td>
                    <td>${broadcastOK}</td>
                `;
                tbodyResultados.append(nuevaFila);

            });
            contenedorResultado.style.display = 'flex';
        }
    } catch(err) {
        console.error('', err.message);
    }
}

const hallarDireccionesRedC = (direccionIpValor, arrayDatosNecesarios) => {
    //Formando la PRIMERA DIRECCIÓN DE RED -> CLASE C
    const direccionIpTresOctetos = direccionIpValor.split('.');
    direccionIpTresOctetos.pop();
    direccionIpTresOctetos.push(0);
    const primeraDireccionRed = direccionIpTresOctetos;

    console.log('PRIMERA DIRECCION RED', primeraDireccionRed)

    let direccionRed1 = [...primeraDireccionRed];
    const arrayDireccionesRed = arrayDatosNecesarios.map(objetoDatos => {
        const saltoRed = objetoDatos['salto_red'];

        const sumita = direccionRed1[3] + saltoRed;
        direccionRed1[3] = sumita;
        const direccionRed = [...direccionRed1];

        return direccionRed;
    });

    arrayDireccionesRed.unshift(primeraDireccionRed);
    arrayDireccionesRed.pop();

    console.log('arrayDireccionesRed', arrayDireccionesRed.map(direccionRed => direccionRed.join('.')));
    return arrayDireccionesRed;
}

const hallarDireccionesRedB = (direccionIpValor, arrayDatosNecesarios) => {
    const direccionIpTresOctetos = direccionIpValor.split('.');
    direccionIpTresOctetos.pop();
    direccionIpTresOctetos.pop();
    direccionIpTresOctetos.push(0);
    direccionIpTresOctetos.push(0);
    const primeraDireccionRed = direccionIpTresOctetos;
    console.log('PRIMERA DIRECCION RED', primeraDireccionRed)

    let direccionRed1 = [...primeraDireccionRed];
    let iterador = 0;
    const arrayDireccionesRed = arrayDatosNecesarios.map(objetoDatos => {
        const saltoRed = objetoDatos['salto_red'];

        const sumita = direccionRed1[3] + saltoRed;
        
        if(sumita > 255) {
            iterador++;
            const resto = sumita % 256;

            direccionRed1[2] = iterador;
            direccionRed1[3] = resto;
        } else {
            direccionRed1[3] = sumita;
        }

        const direccionRed = [...direccionRed1];
        return direccionRed;
    });

    arrayDireccionesRed.unshift(primeraDireccionRed);
    arrayDireccionesRed.pop();

    console.log('arrayDireccionesRed', arrayDireccionesRed.map(direccionRed => direccionRed.join('.')));
    return arrayDireccionesRed;
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
