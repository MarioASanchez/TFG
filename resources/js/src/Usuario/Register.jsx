import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";

import "../Index/styles.css";
import { useContext } from "react";

import Header from "../shared/Header";
import Footer from "../shared/Footer";
import { Link } from "react-router-dom";
import { UsuarioHelperContext } from "./Helpers/UsuarioHelper";

function Register() {
  let { register } = useContext(UsuarioHelperContext);

  function procesa(ev) {
    ev.preventDefault();
    const obj = {
      nombre: ev.target.nombre.value,
      nombreUsuario: ev.target.nombreUsuario.value,
      apellidos: ev.target.apellidos.value,
      email: ev.target.email.value,
      password: ev.target.password.value,
      admin: false,
      direccion: ev.target.direccion.value,
      puntosAcumulados: 0
    };
    register(obj);
  }

  return (
    <>
      <Header />
      <main className="main">
        <div className="formulario login">
          <h2 className="encabezados-formularios">Crea tu cuenta en Eventium</h2>
          <form id="registerForm" onSubmit={procesa}>
            <div className="mb-3">
              <label className="form-label">Nombre</label>
              <input
                type="text"
                name="nombre"
                className="form-control form-control-dark"
                placeholder="Juan Antonio"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Apellidos</label>
              <input
                type="text"
                name="apellidos"
                className="form-control form-control-dark"
                placeholder="Espín Fernández"
                required
              />
            </div>
             <div className="mb-3">
              <label className="form-label">Nombre Usuario</label>
              <input
                type="text"
                name="nombreUsuario"
                className="form-control form-control-dark"
                placeholder="xxxxx"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-control form-control-dark"
                placeholder="tu@email.com"
                required
              />
            </div>
             <div className="mb-3">
              <label className="form-label">Dirección</label>
              <input
                type="text"
                name="direccion"
                className="form-control form-control-dark"
                placeholder="C/Ave del paraiso"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Contraseña</label>
              <input
                type="password"
                name="password"
                className="form-control form-control-dark"
                placeholder="••••••••"
                required
                minLength="6"
              />
              <small className="texto_secundario">Mínimo 6 caracteres</small>
            </div>
            <div className="mb-4">
              <label className="form-label">Confirmar contraseña</label>
              <input
                type="password"
                className="form-control form-control-dark"
                placeholder="••••••••"
                required
              />
            </div>
            <div className="mb-4 form-check">
              <input
                type="checkbox"
                className="form-check-input"
                required
              />
              <label className="form-check-label small texto_secundario">
                Acepto los{" "}
                <a href="#" className="text-purple text-decoration-none">
                  términos y condiciones
                </a>{" "}
                y la{" "}
                <a href="#" className="text-purple text-decoration-none">
                  política de privacidad
                </a>
              </label>
            </div>
            <button
              type="submit"
              className="btn btn-primary-custom w-100 py-3 mb-3"
            >
              Crear Cuenta
            </button>
            <div className="text-center">
              <p className="texto_secundario">
                ¿Ya tienes cuenta?{" "}
                <a
                  href="#"
                  className="text-purple text-decoration-none"
                
                >
                  <Link to={"/login"} >Inicia sesión</Link>
                </a>
              </p>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Register;
