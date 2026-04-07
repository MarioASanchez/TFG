import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

// Configuración para un mensaje de éxito
export const mostrarExito = (mensaje) => {
  return MySwal.fire({
    title: <strong style={{ color: '#2ecc71' }}>¡Conseguido!</strong>,
    html: <i>{mensaje}</i>,
    icon: 'success',
    confirmButtonColor: '#3085d6',
    timer: 3000, // Se cierra solo en 3 segundos
    timerProgressBar: true,
  });
};

// Configuración para un mensaje de error
export const mostrarError = (mensaje) => {
  return MySwal.fire({
    title: <strong style={{ color: '#e74c3c' }}>Vaya...</strong>,
    text: mensaje,
    icon: 'error',
    confirmButtonColor: '#d33',
  });
};