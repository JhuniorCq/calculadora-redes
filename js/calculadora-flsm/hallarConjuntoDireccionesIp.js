import {datosHallarVariasIP} from './calculadora-flsm.js';

const formarObjetoDatosHallarVariasIP = (valorN, numeroSubRedesValor, nuevaMascaraSubredDecimal) => {
    datosHallarVariasIP.valorN = valorN;
    datosHallarVariasIP.numeroSubRedesValor = numeroSubRedesValor;
    datosHallarVariasIP.nuevaMascaraSubredDecimal = nuevaMascaraSubredDecimal;
}

export {formarObjetoDatosHallarVariasIP};