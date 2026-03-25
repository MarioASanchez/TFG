import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import { Link } from 'react-router-dom'
import React from "react";


function Footer() {
    return (
        <footer className="gradient-purple py-5">
            <div className="container">
                <div className="row g-3">
                    <div className="col-lg-3 col-md-6">
                        <Link to="/" className="navbar-brand d-flex align-items-center">
                             <img className="logo_encabezado" src="logo_sin_fondo.png" alt="Logo Eventium" />
                        </Link>
                    </div>

                    <div className="col-lg-3 col-md-6">
                        <h4 className="h6 fw-bold mb-3">Enlaces</h4>
                        <ul className="list-unstyled">
                            <li className="mb-2">
                                <Link to={"/eventos"} className="text-light text-decoration-none"> Eventos</Link>
                                
                            </li>
                            <li className="mb-2">
                                <Link to="#" className="text-light text-decoration-none">Mis Entradas</Link>
                            </li>
                            <li className="mb-2">
                                <Link to="#" className="text-light text-decoration-none">Sistema de Puntos</Link>
                            </li>
                        </ul>
                    </div>

                    <div className="col-lg-3 col-md-6">
                        <h4 className="h6 fw-bold mb-3">Ayuda</h4>
                        <ul className="list-unstyled">
                            <li className="mb-2">
                                <Link to="#" className="text-light text-decoration-none">Preguntas Frecuentes</Link>
                            </li>
                            <li className="mb-2">
                                <Link to="#" className="text-light text-decoration-none">Contacto</Link>
                            </li>
                            <li className="mb-2">
                                <Link to="#" className="text-light text-decoration-none">Política de Privacidad</Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <hr className="my-4 border-light opacity-25" />
                <div className="text-center text-light">
                    <p className="mb-0">
                        &copy; 2026 Eventos Murcia. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        </footer>

    )
}

export default Footer