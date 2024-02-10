
// TODO ESTO ES PARA DETALLES DEL FRONT -> POR EJEMPLO QUE LOS LABEL SUBAN 10PX AL DAR CLICK EN EL INPUT

const inputs = document.querySelectorAll('.input');
const direccionIpInput = document.getElementById('direccion-ip');
const prefijoRedInput = document.getElementById('prefijo-red');

const cambiarMarginLabel = (evento) => {
    const inputSeleccionado = evento.target;
    const label = inputSeleccionado.previousElementSibling;

    label.style.marginBottom = '10px';
}

// const cambiarMarginPrefijoRed = () => {
//     const label = prefijoRedInput.previousElementSibling;
//     label.style.marginBottom = '10px';
// }


inputs.forEach(input => input.addEventListener('click', cambiarMarginLabel));
// prefijoRedInput.addEventListener('input', cambiarMarginPrefijoRed);