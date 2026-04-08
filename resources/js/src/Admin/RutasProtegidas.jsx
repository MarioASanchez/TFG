import { Navigate } from 'react-router-dom';

const RutasProtegidas = ({ children, adminOnly = false }) => {
  // Obtenemos el usuario del localStorage
  const userString = localStorage.getItem('usuario'); 
  const user = userString ? JSON.parse(userString) : null;

  // Si no hay usuario, directo al login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si la ruta es solo para admin y el usuario NO es admin
  if (adminOnly && !user.admin) {
    return <Navigate to="/" replace />;
  }

  // Si todo está ok, renderizamos la ruta
  return children;
};

export default RutasProtegidas;