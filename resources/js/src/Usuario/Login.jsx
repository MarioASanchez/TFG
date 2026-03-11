import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";

import "../Index/styles.css";

import { UsuarioHelperContext } from "../Usuario/Helpers/UsuarioHelper";
import { useContext } from "react";
import Header from "../shared/Header";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Footer from "../shared/Footer";


function Login() {

    const { login } = useContext(UsuarioHelperContext)
    const navigate = useNavigate();

    const procesa = async (ev) => {
        ev.preventDefault();  

        const obj = {
          email: ev.target.email.value,
          password: ev.target.password.value
        }

        const resultado = await login(obj);

        if(resultado.success) {
            navigate("/")
        }else{
          alert("Usuario o contraseña incorrectos")
        }
    }      

  return ( 
    <>
      <Header />
      <main className="main">
      <div className="formulario login" id="loginModal" tabIndex="">
        <div>
          <div className="modal-content modal-content-custom text-white">
            <div className="modal-header border-0">
              <h2 className="encabezados-formularios">Iniciar Sesión</h2>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
              ></button>
            </div>
            <div className="modal-body p-4">
              <form id="loginForm" onSubmit={procesa}
              >
                <div className="mb-3">
                  <label for="loginEmail" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="form-control form-control-dark"
                    placeholder="tu@email.com"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label for="loginPassword" className="form-label">
                    Contraseña
                  </label>
                  <input
                  name="password"
                    type="password"
                    className="form-control form-control-dark"
                    placeholder="••••••••"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary-custom w-100 py-3 mb-3"

                >
                  Iniciar Sesión
                </button>

                <hr className="my-4 border-secondary" />
                <div className="text-center">
                  <p className="mb-2 text-gray-custom text-dark">¿No tienes cuenta?</p>
                  <button 
                    type="button"
                    className="btn btn-outline-dark w-100 text"
                    
                  >
                    <Link to="/registro">Crear cuenta</Link>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      </main>
      <Footer/>

    </>
  )
}

export default Login
