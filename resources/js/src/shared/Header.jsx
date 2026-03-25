import { useContext } from "react";
import { IndexHelperContext } from "../Index/helpers/IndexHelper";
import { Link } from 'react-router-dom';
import React from "react";
import { UsuarioHelperContext } from "../Usuario/Helpers/UsuarioHelper";

function Header() {
  const { usuarios, logout } = useContext(UsuarioHelperContext);
  // Caso 1. Usuario sin haber iniciado sesión
  if (!usuarios) {
    return (
      <div>
        <nav className="navbar navbar-expand-lg gradient-purple navbar-dark navbar-custom shadow">
          <div className="container">
            {/* Logo siempre visible */}
            <Link to="/" className="navbar-brand d-flex align-items-center">
              <span className="fs-4 fw-bold">
                <img className="logo_encabezado" src="logo_sin_fondo.png" alt="Logo Eventium" />
              </span>
            </Link>

            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto align-items-center">
                <li className="nav-item">
                  <Link to="/login" className="nav-link fw-bold">Iniciar Sesión</Link>
                </li>
                <li className="nav-item">
                  <Link to="/registro" className="btn btn-light ms-lg-3 px-4 rounded-pill">Crear cuenta</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    );
  }

  // Caso 2. Usuario administrador ha iniciado sesión
  if (usuarios.admin) {
    return (
      <div>
        <nav className="navbar navbar-expand-lg gradient-purple navbar-dark navbar-custom shadow">
          <div className="container">
            {/* Logo siempre visible */}
            <Link to="/" className="navbar-brand d-flex align-items-center">
              <span className="fs-4 fw-bold">
                <img className="logo_encabezado" src="logo_sin_fondo.png" alt="Logo Eventium" />
              </span>
            </Link>

            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto align-items-center">
                <li className="nav-item">
                  <Link to="/addEvento" className="nav-link fw-bold">Añadir evento</Link>
                </li>
                <li className="nav-item">
                  <Link to="#" className="nav-link fw-bold">Cambiar permisos</Link>
                </li>
                <li className="nav-item">
                  <Link to="#" className="nav-link fw-bold">Mi perfil</Link>
                </li>
                <li className="nav-item">
                  <button onClick={() => logout()} className="btn btn-danger">Cerrar sesión</button>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    );
  } else {
    // Caso 3. Usuario que NO es admin
    return (
      <div>
        <nav className="navbar navbar-expand-lg gradient-purple navbar-dark navbar-custom shadow">
          <div className="container">
            {/* Logo siempre visible */}
            <Link to="/" className="navbar-brand d-flex align-items-center">
              <span className="fs-4 fw-bold">
                <img className="logo_encabezado" src="logo_sin_fondo.png" alt="Logo Eventium" />
              </span>
            </Link>

            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto align-items-center">
                <li className="nav-item">
                  <Link to="#" className="nav-link fw-bold">Comprar entrada</Link>
                </li>
                <li className="nav-item">
                  <Link to="#" className="nav-link fw-bold">Ver los eventos</Link>
                </li>
                <li className="nav-item">
                  <Link to="#" className="nav-link fw-bold">Mi perfil</Link>
                </li>
                <li className="nav-item">
                  <Link to="/logout" className="btn btn-danger ms-lg-3 px-4 rounded-pill">Cerrar sesión</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    );
  }

}

export default Header;