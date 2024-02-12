




const saludar = (nombre) => {
    console.log(`Hola ${nombre}`);
}

const hallarPrefijoRed = (direccionIPValor, datosRed) => {
    const arrayNumerosIP = direccionIPValor.split('.');     // ['192', '168', '200', '139']
    const primerNumero = arrayNumerosIP[0];     // '192'
    // const datosRed = {}

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

    return datosRed;
}

export {saludar, hallarPrefijoRed};