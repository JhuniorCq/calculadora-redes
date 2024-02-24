const formulario = document.querySelector('.formulario');
const direccionIpInput = document.getElementById('direccion-ip');
const prefijoRedInput = document.getElementById('prefijo-red');
const numeroSubRedesInput = document.getElementById('numero-subredes');
import {hallarPrefijoRed} from '../calculadora-vlsm/hallarPrefijoRed.js';
import {cambiarMarginLabel} from '../detalles-calculadoras.js';

const resultado = document.querySelector('.resultado');
const cuerpoTabla = document.querySelector('.cuerpo-tabla');

const datosSubred = {};

const hallarResultado = (evento) => {
    try {
        evento.preventDefault();

        const direccionIpValor = direccionIpInput.value;
        // const 

        // hallarPrefijoRed(direccionIpValor);

    } catch(err) {
        console.error('', err.message);
    }
}

const mostrarPrefijoRedDinamico = () => {
    const direccionIpValor = direccionIpInput.value;
    console.log(direccionIpValor);
    
    hallarPrefijoRed(direccionIpValor);
    cambiarMarginLabel(direccionIpInput, prefijoRedInput);
}

const mostrarNumeroSubredesDinamico = () => {
    cuerpoTabla.innerText = '';
    const labelNumeroSubRedes = numeroSubRedesInput.previousElementSibling;
    labelNumeroSubRedes.style.marginBottom = '10px';

    const numeroSubRedesValor = parseInt(numeroSubRedesInput.value);
    
    for(let i=0; i<numeroSubRedesValor; i++) {
        const nuevaFila = document.createElement('tr');
        nuevaFila.innerHTML = `
            <td>Subred ${i+1}</td>
            <td>
                <input type="number" id="numero-hosts-${i}" placeholder="Introduce el N° de hosts de la subred ${i+1}" class="input-fila" required>
            </td>
        `;
        cuerpoTabla.append(nuevaFila);
    }
    
    resultado.style.display = 'flex';
}


formulario.addEventListener('submit', hallarResultado);
direccionIpInput.addEventListener('input', mostrarPrefijoRedDinamico);
numeroSubRedesInput.addEventListener('input', mostrarNumeroSubredesDinamico)
export {datosSubred, prefijoRedInput};
