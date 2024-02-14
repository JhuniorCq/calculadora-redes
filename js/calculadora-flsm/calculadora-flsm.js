import {validarDireccionIP, validarNumeroSubRedes} from './validaciones-flsm.js';
import {cambiarMarginLabel} from './detalles-flsm.js';
import {hallarPrefijoRed} from './hallarPrefijoRed.js';
import {hallarVariasDireccionesIP} from './hallarConjuntoDireccionesIp.js';
import {hallarNumeroSubredes, mascaraSubredNueva} from './hallarNumeroSubredes.js';
const formulario = document.querySelector('.formulario');
const direccionIpInput = document.getElementById('direccion-ip');
const prefijoRedInput= document.getElementById('prefijo-red'); // Acá mostraré un dato
const numeroSubRedesInput = document.getElementById('numero-subredes');
const hostsSubRedInput = document.getElementById('hosts-subred'); // Acá mostraré un dato
const datosRed = {};
const datosHallarVariasIP = {} //DE AHÍ DEBO ASIGNARLE OTRO NOMBRE

const contenedor = document.querySelector('.contenedor');
const contenedorRegresar = document.querySelector('.contenedor-regresar');
const contenedorResultado = document.querySelector('.resultado');
const tabla = document.querySelector('.tabla');
const cuerpoTabla = document.querySelector('.cuerpo-tabla');


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
    hallarNumeroSubredes(numeroSubRedesValor);
    
    const arrayDireccionesIP = hallarVariasDireccionesIP(); // LISTA DE DIRECCIONES IP

    mostrarTablaResultados(arrayDireccionesIP);
}


const mostrarTablaResultados = (arrayDireccionesIP) => {

    // contenedorResultado.style.display = 'none';

    const hostsSubRedValor = hostsSubRedInput.value;
    const mascaraSubredNuevaBinario = mascaraSubredNueva.split('.').map(elemento => {
        // parseInt(elemento);
        return parseInt(elemento).toString(2);
    });

    console.log('mascaraSubredNuevaBinario: ', mascaraSubredNuevaBinario)

    const cantidadUnosNuevaMascara = mascaraSubredNuevaBinario.join('').split('').filter(digito => digito === '1').length;

    console.log('cantidadUnosNuevaMascara', cantidadUnosNuevaMascara)

    console.log('arrayDireccionesIP', arrayDireccionesIP)
    contenedorRegresar.style.marginTop = '50px';
    contenedor.style.height = 'auto';
    contenedorResultado.style.display = 'flex';

    //FORMAREMOS EL PRIMER HOST
    const arrayPrimerHost = formarArrayPrimerHost(arrayDireccionesIP, '1');

    //FORMAREMOS EL ÚLTIMO HOST -> arrayDireccionesIP = ['172.23.44.0', '172.34.32.45', ....]
    let arrayUltimoHost;
    if(datosRed.claseRed === 'A') {

        const dividendo = parseInt(hostsSubRedValor) + 2;
        const maximo = dividendo/256 - 1;
        let segundoOcteto = 0;
        let iterador = 0;
        arrayUltimoHost = arrayDireccionesIP.map(direccionIP => {
            
            const dividendo = parseInt(hostsSubRedValor) + 2;
            const maximo = dividendo/256 - 1;
            let arrayOctetosDireccionIP = direccionIP.split('.'); // [['172','23','44','0'], [], ...]
            arrayOctetosDireccionIP = arrayOctetosDireccionIP.map(direccionIP => parseInt(direccionIP));

            const digitoSumado = arrayOctetosDireccionIP[2] + 127;
            arrayOctetosDireccionIP[2] = digitoSumado;
            arrayOctetosDireccionIP[3] = 254; //ESTE SIEMPRE SERÁ 254

            return arrayOctetosDireccionIP.join('.')
        }); 
        console.log('arrayUltimoHost: ', arrayUltimoHost)

    } else if(datosRed.claseRed === 'B') {
        const dividendo = parseInt(hostsSubRedValor) + 2;
        const maximo = dividendo/256 - 1;
        console.log('MAXIMOOO', maximo); //AHORA ESTE NÚMERO LO TENGO QUE COLOCAR EN EL PENULTIMO DIGITO DE CADA DIRECCION IP

        arrayUltimoHost = arrayDireccionesIP.map(direccionIP => {
            const arrayOctetosDireccionIP = direccionIP.split('.');
            const arraySinUltimosOctetos = [...arrayOctetosDireccionIP];
            arraySinUltimosOctetos.pop();
            arraySinUltimosOctetos.pop();
            const valorAgregar = `${parseInt(arrayOctetosDireccionIP[arrayOctetosDireccionIP.length-2])+maximo}.254`;
            console.log('valorAgregar', valorAgregar);
            arraySinUltimosOctetos.push(valorAgregar);
            console.log(arraySinUltimosOctetos)
            const ultimoHost = arraySinUltimosOctetos.join('.');
            return ultimoHost;
        });

        console.log(arrayUltimoHost);

    } else {
        arrayUltimoHost = arrayDireccionesIP.map(direccionIP => {
            const arrayDigitosDireccionIP = direccionIP.split('.');
            arrayDigitosDireccionIP[arrayDigitosDireccionIP.length - 1] = parseInt(arrayDigitosDireccionIP[arrayDigitosDireccionIP.length - 1]) + parseInt(hostsSubRedValor);
            console.log(arrayDigitosDireccionIP)
            return arrayDigitosDireccionIP.join('.');
        });
        console.log('arrayUltimoHost CLASE C', arrayUltimoHost)
    }

    const arrayBroadcast = arrayUltimoHost.map(direccionIP => {
        let arrayOctetosDireccionIP = direccionIP.split('.');
        arrayOctetosDireccionIP[arrayOctetosDireccionIP.length - 1] = parseInt(arrayOctetosDireccionIP[arrayOctetosDireccionIP.length - 1]) + 1;
        return arrayOctetosDireccionIP.join('.')
    });

    console.log('arrayBroadcast', arrayBroadcast)

    //ANTES DE INSERTAR FILAS AL <tbody> TENGO QUE LIMPIARLO
    cuerpoTabla.innerText = '';

    //LE QUITARÉ EL arrayUltimoHost[index] POR AHORA
    arrayDireccionesIP.forEach((direccionIP, index) => {
        const nuevaFila = document.createElement('tr'); // Falta: Primer Host - Último Host - Broadcast
        nuevaFila.innerHTML = `
            <td>Subred ${index+1}</td>
            <td>${hostsSubRedValor}</td>
            <td>${direccionIP} /${cantidadUnosNuevaMascara}</td>
            <td>${mascaraSubredNueva}</td>
            <td>${arrayPrimerHost[index]}</td>
            <td>${arrayUltimoHost[index]}</td>
            <td>${arrayBroadcast[index]}</td>
        `;
        cuerpoTabla.append(nuevaFila);
    });

}

const formarArrayPrimerHost = (arrayDireccionesIP, valorColocar) => {
    const arrayPrimerHost = arrayDireccionesIP.map(direccionIP => {
        const arrayDigitosDireccionIP = direccionIP.split('.');
        arrayDigitosDireccionIP[arrayDigitosDireccionIP.length - 1] = parseInt(arrayDigitosDireccionIP[arrayDigitosDireccionIP.length - 1]) + 1;
        console.log('lefefege: ', arrayDigitosDireccionIP)
        return arrayDigitosDireccionIP.join('.');
    })

    console.log('arrayPrimerHost', arrayPrimerHost)
    return arrayPrimerHost;
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
    datosHallarVariasIP, // hallarConjuntoDireccionesIp.js
    direccionIpInput // operaciones-flsm.js
};