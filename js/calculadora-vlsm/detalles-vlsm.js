const cambiarMarginLabel = (inputIngreso, inputSalida) => {
    const labelInputIngreso = inputIngreso.previousElementSibling;
    const labelInputSalida = inputSalida.previousElementSibling;
    labelInputIngreso.style.marginBottom = '10px';
    labelInputSalida.style.marginBottom = '10px';
}

export {cambiarMarginLabel};