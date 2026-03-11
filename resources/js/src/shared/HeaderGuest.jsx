import { Link, useNavigate } from 'react-router-dom'

function Header() {

  function irIniciarSession(){
    // Aqui hay que ir al formulario iniciar session pero ahora mismo no recuerdo como era el navegate
    const navigate = useNavigate();
    navigate("/login")
  }

  return (
    <div>
    {/* header */}
      <nav className="navbar navbar-expand-lg gradient-purple navbar-dark navbar-custom shadow">
        <div className="container">
        {/* Logo de la aplicación */}
          <Link to="/" className="navbar-brand d-flex align-items-center">
            <span className="fs-4 fw-bold">
              <img className="logo_encabezado" src="../../src/assets/logo_sin_fondo.png" alt="Logo de la aplicación Eventium"/>
            </span>
          </Link>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto me-3">
              <li className="nav-item">
                <Link to="/eventos" className="nav-link">Eventos</Link>
              </li>
            </ul>
            <button className="btn btn-light fw-semibold"  onClick={irIniciarSession}
             id="loginBtn">Iniciar Sesión</button>
             {/* Menú si la sesión está iniciada */}
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Header
