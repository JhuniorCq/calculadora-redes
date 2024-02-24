import {datosSubred, prefijoRedInput} from './calculadora-vlsm.js';

const hallarPrefijoRed = (direccionIPValor) => {
    const arrayNumerosIP = direccionIPValor.split('.');     // ['192', '168', '200', '139']
    const primerNumero = arrayNumerosIP[0];     // '192'

    if(primerNumero >= 0 && primerNumero <= 127) {
        datosSubred.claseRed = 'A';
        datosSubred.prefijoRed = 8;
        datosSubred.mascaraSubred = '255.0.0.0'; //Se asigna la Máscara de Subred Original
    } else if(primerNumero >= 128 && primerNumero <= 191) {
        datosSubred.claseRed = 'B';
        datosSubred.prefijoRed = 16;
        datosSubred.mascaraSubred = '255.255.0.0'; //Se asigna la Máscara de Subred Original
    } else if(primerNumero >= 192 && primerNumero <= 223){
        datosSubred.claseRed = 'C';
        datosSubred.prefijoRed = 24;
        datosSubred.mascaraSubred = '255.255.255.0'; //Se asigna la Máscara de Subred Original
    }
    prefijoRedInput.value = datosSubred.prefijoRed; //Mostramos al Usuario el Prefijo de Red obtenido
}

export {hallarPrefijoRed};