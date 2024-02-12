
//Este objeto es declarado en 'calculadora-flsm.js' y acá lo rellenaré con valores;
import {datosRed, prefijoRedInput} from './calculadora-flsm.js';

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
    prefijoRedInput.value = datosRed.prefijoRed; //Mostramos al Usuario el Prefijo de Red obtenido
}

export {hallarPrefijoRed};