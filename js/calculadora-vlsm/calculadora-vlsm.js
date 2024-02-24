const formulario = document.querySelector('.formulario');
const direccionIpInput = document.getElementById('direccion-ip');
const prefijoRedInput = document.getElementById('prefijo-red');
const numeroSubRedesInput = document.getElementById('numero-subredes');
import {hallarPrefijoRed} from '../calculadora-vlsm/hallarPrefijoRed.js';
import {cambiarMarginLabel} from '../detalles-calculadoras.js';

const contenedorTablaSubredes = document.querySelector('.contenedor-subredes');
const cuerpoTabla = document.querySelector('.cuerpo-tabla');

//Acá almaceno -> Clase Subred, Prefijo Subred, Máscara Subred
const datosSubred = {};

const hallarResultado = (evento) => {
    try {
        evento.preventDefault();

        const direccionIpValor = direccionIpInput.value;
        
        
        //Cada INPUT FILA es un Número de Host nodeListInputFila
        const nodeListInputFila = document.querySelectorAll('.input-fila');
        const arrayInputFila = [...nodeListInputFila];
        
        if(nodeListInputFila.length <= 0) {
            alert('El número de subredes debe ser positivo.');
            return;
        }

        //Ordenamos los valores del array
        let arrayInputsValores = arrayInputFila.map(inputFila => inputFila.value);
        arrayInputsValores.sort((a, b) => b - a);

        console.log(arrayInputsValores);

        arrayInputsValores.forEach(valor => {
            //Calcular el número de bits de host necesarios
            const valorN = hallarValorNyHostsDisponibles(valor)[0];
            const hostsDisponibles = hallarValorNyHostsDisponibles(valor)[1];
            console.log(`Para ${valor} su N es: `, valorN);
            console.log(`Para ${valor} su cantidad de Hosts disponibles: `, hostsDisponibles);

            
        });

    } catch(err) {
        console.error('', err.message);
    }
}

const hallarValorNyHostsDisponibles = (valor) => {
    let i=0, valorN, hostsDisponibles;

    while(true) {
        i++;
        if(2**i - 2 >= valor) {
            hostsDisponibles = 2**i - 2;
            break;
        }
    }
    valorN = i;

    return [valorN, hostsDisponibles];
}

const mostrarPrefijoRedDinamico = () => {
    const direccionIpValor = direccionIpInput.value;
    // console.log(direccionIpValor);
    
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
    
    contenedorTablaSubredes.style.display = 'flex';
}


formulario.addEventListener('submit', hallarResultado);
direccionIpInput.addEventListener('input', mostrarPrefijoRedDinamico);
numeroSubRedesInput.addEventListener('input', mostrarNumeroSubredesDinamico)
export {datosSubred, prefijoRedInput};
