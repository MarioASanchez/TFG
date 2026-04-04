import { useContext } from "react";
import { Link } from 'react-router-dom';
import React from "react";
import { UsuarioHelperContext } from "../Usuario/Helpers/UsuarioHelper";
import { CarritoContext } from "./Helpers/CarritoHelper";
import CarritoLateral from "./CarritoLateral";

function Header() {
  const { usuarios, logout } = useContext(UsuarioHelperContext);
  const { cart } = useContext(CarritoContext);

  const cartCount = cart.reduce((acc, item) => acc + item.cantidad, 0);

  const CartButton = () => (
    <li className="nav-item">
      <button
        className="btn nav-link fw-bold position-relative border-0"
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasCarrito"
      >
        <i className="bi bi-cart3 fs-5"></i> Carrito
        {cartCount > 0 && (
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.7rem' }}>
            {cartCount}
          </span>
        )}
      </button>
    </li>
  );

  return (
    <>
      <nav className="navbar navbar-expand-lg gradient-purple navbar-dark navbar-custom shadow">
        <div className="container">
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

              {/* 1. CARRITO: Solo si el usuario NO es admin (opcional, tú decides) */}
              {(!usuarios || !usuarios.admin) && <CartButton />}

              {/* 2. USUARIO NO LOGUEADO */}
              {!usuarios && (
                <>
                  <li className="nav-item">
                    <Link to="/login" className="nav-link fw-bold">Iniciar Sesión</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/registro" className="btn btn-light ms-lg-3 px-4 rounded-pill">Crear cuenta</Link>
                  </li>
                </>
              )}

              {/* 3. USUARIO LOGUEADO (Cualquier rol) */}
              {usuarios && (
                <>
                  <li className="nav-item">
                    <Link to="/" className="nav-link fw-bold">Inicio</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/eventos" className="nav-link fw-bold">Eventos</Link>
                  </li>

                  {/* --- SOLO USUARIOS NORMALES (NO ADMIN) --- */}
                  {!usuarios.admin && (
                    <>
                      <li className="nav-item">
                        <Link to="#" className="nav-link fw-bold">Mis Entradas</Link>
                      </li>
                      <li className="nav-item">
                        <Link to="#" className="nav-link fw-bold">Puntos</Link>
                      </li>
                    </>
                  )}

                  {/* --- SOLO ADMINISTRADORES --- */}
                  {usuarios.admin && (
                    <>
                      <li className="nav-item">
                        <Link to="/addEvento" className="nav-link fw-bold text-warning">Añadir evento</Link>
                      </li>
                      <li className="nav-item">
                        <Link to="/permisos" className="nav-link fw-bold text-warning">Modificar permisos</Link>
                      </li>
                    </>
                  )}

                  {/* --- PERFIL Y LOGOUT (Para todos los logueados) --- */}
                  <li className="nav-item">
                    <Link to={`/perfil/${usuarios.id}`} className="nav-link fw-bold">Mi perfil</Link>
                  </li>
                  <li className="nav-item">
                    <button onClick={() => logout()} className="btn btn-danger ms-lg-3 px-4 rounded-pill">Cerrar sesión</button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
      <CarritoLateral />
    </>
  );
}

export default Header;