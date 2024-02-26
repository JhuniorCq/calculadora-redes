const btnVerIntegrantes = document.querySelector('.ver-integrantes');

const fondoModal = document.getElementById('fondo-modal');
const contenedorModal = document.getElementById('contenedor-modal');
const btnCerrarVentanaModal = document.getElementById('btn-cerrar');

const mostrarIntegrantes = () => {
    fondoModal.style.visibility = 'visible';
    contenedorModal.classList.toggle('cerrar-contenedor-modal');
}

const cerrarVentanaModal = () => {
    contenedorModal.classList.toggle('cerrar-contenedor-modal');
    //Este setTimeout es para que se aprecie la Transición y no se cierre la ventana de frente
    setTimeout(function() {
        fondoModal.style.visibility = 'hidden';
    }, 600);
}

window.addEventListener('click', function(evento) {
    if(evento.target === fondoModal) {
        contenedorModal.classList.toggle('cerrar-contenedor-modal');
        //Este setTimeout es para que se aprecie la Transición y no se cierre la ventana de frente
        setTimeout(function() {
            fondoModal.style.visibility = 'hidden';
        }, 600);
    }
});

btnVerIntegrantes.addEventListener('click', mostrarIntegrantes);
btnCerrarVentanaModal.addEventListener('click', cerrarVentanaModal)