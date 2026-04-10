import "bootstrap/dist/css/bootstrap.min.css";
import { useContext } from "react";
import { Link } from 'react-router-dom';
import { UsuarioHelperContext } from "../Usuario/Helpers/UsuarioHelper";

function Footer() {
    const { usuarios } = useContext(UsuarioHelperContext);

    return (
        <footer className="gradient-purple py-5 mt-5 text-white">
            <div className="container">
                <div className="row g-4 justify-content-between">
                    
                    {/* COLUMNA 1: LOGO Y TEXTO */}
                    <div className="col-lg-4">
                        <Link to="/" className="d-inline-block mb-3">
                            <img 
                                src="/logo_sin_fondo.png" 
                                alt="Logo Eventium" 
                                style={{ height: '75px', width: 'auto' }} 
                                className="img-fluid"
                            />
                        </Link>
                        <p className="text-white-50 pe-lg-5">
                            Descubre los mejores eventos culturales y consigue tus entradas con descuentos exclusivos
                        </p>
                    </div>

                    {/* COLUMNA 2: ENLACES RÁPIDOS CONDICIONALES */}
                    <div className="col-6 col-md-4 col-lg-2">
                        <h6 className="fw-bold text-uppercase mb-4 text-white">Explora</h6>
                        <ul className="list-unstyled">
                            
                            {/* DA IGUAL EL ROL */}
                            <li className="mb-2">
                                <Link to="/eventos" className="text-white-50 text-decoration-none link-light">Eventos</Link>
                            </li>

                            {/* USUARIO NO LOGUEADO */}
                            {!usuarios && (
                                <>
                                    <li className="mb-2">
                                        <Link to="/login" className="text-white-50 text-decoration-none link-light">Iniciar Sesión</Link>
                                    </li>
                                    <li className="mb-2">
                                        <Link to="/registro" className="text-white-50 text-decoration-none link-light">Crear cuenta</Link>
                                    </li>
                                </>
                            )}

                            {/* USUARIO LOGUEADO (Cualquier rol) */}
                            {usuarios && (
                                <li className="mb-2">
                                    <Link to={`/perfil/${usuarios.id}`} className="text-white-50 text-decoration-none link-light">Mi Perfil</Link>
                                </li>
                            )}


                            {/* ADMINISTRADORES */}
                            {usuarios && usuarios.admin && (
                                <>
                                    <li className="mb-2">
                                        <Link to="/addEvento" className="text-white-50 text-decoration-none link-light">Añadir evento</Link>
                                    </li>
                                    <li className="mb-2">
                                        <Link to="/permisos" className="text-white-50 text-decoration-none link-light">Modificar permisos</Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>

                    {/* COLUMNA 3: SOPORTE */}
                    <div className="col-6 col-md-4 col-lg-2">
                        <h6 className="fw-bold text-uppercase mb-4 text-white">Ayuda</h6>
                        <ul className="list-unstyled">
                            <li className="mb-2"><Link to="#" className="text-white-50 text-decoration-none link-light">Preguntas frecuentes</Link></li>
                            <li className="mb-2"><Link to="#" className="text-white-50 text-decoration-none link-light">Contacto</Link></li>
                            <li className="mb-2"><Link to="#" className="text-white-50 text-decoration-none link-light">Legal</Link></li>
                        </ul>
                    </div>

                </div>

                <hr className="my-5 border-secondary" />

                <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
                    <p className="small text-white-50 mb-0">
                        &copy; 2026 Eventium. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;