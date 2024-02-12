import {validarDireccionIP, validarNumeroSubRedes} from './validaciones-flsm.js';
import {cambiarMarginLabel} from './detalles-flsm.js';
import {hallarPrefijoRed} from './hallarPrefijoRed.js';
import {hallarNumeroCeros, calcularCantidadHostsSubred, convertirBinarioMascaraSubred, hallarCantidadBits, formarCadena, eliminarValorMascara, formarNuevaMascaraBinario, obtenerNuevaMascaraSubred, hallarCantidadDiferente255, formarArraySubcadenasNdigitos, agregarCerosSubcadenasNdigitos, formarMatrizArrayBitsMultiploOcho, formarMatrizArrayDireccionesIpDecimal} from './operaciones-flsm.js';
import {formarObjetoDatosHallarVariasIP, hallarVariasDireccionesIP} from './hallarConjuntoDireccionesIp.js';
import {hallarNumeroSubredes} from './hallarNumeroSubredes.js';
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
    hallarNumeroSubredes(numeroSubRedesValor);
    
    const matrizArrayDireccionesIP = hallarVariasDireccionesIP();

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