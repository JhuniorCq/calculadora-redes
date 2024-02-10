
const validarDireccionIP = (direccionIPValor) => {

    const regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

    if (!direccionIPValor) {
        alert('Debe ingresar una Dirección IP.');
        return false;
    } else if(!regex.test(direccionIPValor)){
        alert('Formato de dirección IP inválido.');
        return false;
    }

    return true;
}

const validarNumeroSubRedes = (numeroSubRedesValor) => {
    if(!numeroSubRedesValor) {
        alert('Debe ingresar un número de subredes.')
        return false;
    } else if(numeroSubRedesValor < 0) {
        alert('El número de subredes es inválido.')
        return false;
    }

    return true;
}

export {validarDireccionIP, validarNumeroSubRedes};
