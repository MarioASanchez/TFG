import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "./perfil.css";

import Footer from "../shared/Footer";
import Header from "../shared/Header";

import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";

import { UsuarioHelperContext } from "../Usuario/Helpers/UsuarioHelper";
import { mostrarExito, mostrarError } from "../shared/Helpers/Notificaciones";

function Perfil() {
  let { usuarios, eliminarCuenta, cambiarDatos, guardarPreferencias } = useContext(UsuarioHelperContext)
  const [etiquetas, setEtiquetas] = useState([]);
  const [seleccionadas, setSeleccionadas] = useState([]);
  const [recomendados, setRecomendados] = useState([]);
  const URL_LARAVEL = import.meta.env.VITE_API_EVENTS_URL;
  const URL_SPRING = import.meta.env.VITE_API_USERS_URL;

  function procesa(ev) {
    ev.preventDefault();
    const datosNuevos = {
      id: usuarios.id,
      nuevoNombre: ev.target.nuevoNombre.value,
      nuevoApellido: ev.target.nuevoApellido.value,
      nuevoUsername: ev.target.nuevoUsername.value
    }

    cambiarDatos(datosNuevos)

  }

  // MANEJO DE LAS ETIQUETAS
  useEffect(() => {
    const cargarDatosIniciales = async () => {
      if (!usuarios?.id) return;

      try {
        // 1. Cargamos etiquetas globales (Laravel)
        const resLaravel = await fetch(`${URL_LARAVEL}/etiquetas`);
        const tagsTotales = await resLaravel.json();
        setEtiquetas(tagsTotales);

        // 2. Cargamos preferencias (Spring Boot)
        const resSpring = await fetch(`${URL_SPRING}/preferencias/${usuarios.id}`);

        // CREAMOS UNA VARIABLE LOCAL para guardar los IDs y poder usarlos ahora mismo
        let idsParaRecomendaciones = [];

        if (resSpring.ok) {
          const dataUsuario = await resSpring.json();
          // Extraemos los IDs de la respuesta de Spring
          idsParaRecomendaciones = dataUsuario.idsEtiquetas || [];
          // Actualizamos el estado para los checkboxes
          setSeleccionadas(idsParaRecomendaciones);
        }

        console.log("Enviando estas etiquetas a Laravel:", idsParaRecomendaciones);
        // 3. Recomendaciones (Laravel)
        const resEventos = await fetch(`${URL_LARAVEL}/recomendados`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          // Enviamos la variable que acabamos de definir arriba
          body: JSON.stringify({ etiquetas: idsParaRecomendaciones })
        });

        if (resEventos.ok) {
          const eventosData = await resEventos.json();
          setRecomendados(eventosData);
        }

      } catch (error) {
        console.error("Error al cargar la configuración del perfil:", error);
      }
    };

    cargarDatosIniciales();
  }, [usuarios?.id]);


  // 1. Función para añadir o quitar IDs del array
  const manejarCheck = (id) => {
    setSeleccionadas((prev) =>
      prev.includes(id)
        ? prev.filter(item => item !== id) // Si ya está, lo quita
        : [...prev, id]                   // Si no está, lo añade
    );
  };

  // 2. Función para el guardado de las etiquetas
  const enviarPreferencias = async () => {
    try {
      // Llamamos a la función del Helper 
      await guardarPreferencias(usuarios.id, seleccionadas);
      mostrarExito("Preferencias guardadas con éxito")
    } catch (error) {
      mostrarError("Woopsie")
    }
  };


  if (!usuarios) {
    return <p>Cargando datos del perfil...</p>;
  }

  return (
    <>
      {/* <!-- Toast Container --> */}
      <div className="toast-container" id="toastContainer"></div>

      {/* <!-- Navbar --> */}
      <Header />

      {/* <!-- Profile Page --> */}
      <div className="container py-5">
        <Link to="/" className="btn btn-outline-secondary mb-4">
          <i className="bi bi-arrow-left me-2"></i>Volver al inicio
        </Link>

        {/* <!-- Profile Header --> */}
        <div className="profile-header">
          <h1 className="text-center mb-2" id="profileUserName">
            {usuarios.nombre + " " + usuarios.apellidos}
          </h1>
          <p className="text-center mb-0 opacity-75" id="profileUserEmail">
            {usuarios.email}
          </p>
        </div>

        {/* <!-- Profile Stats --> */}
        <div className="row g-4 mb-4">
          <div className="col-md-6">
            <div className="card-custom p-4 text-center">
              <i
                className="bi bi-ticket-perforated fs-1 mb-2"
                style={{ color: "var(--primary-color)" }}
              ></i>
              <h3 className="mb-0" id="profileEventCount">
                3
              </h3>
              <p className="text-muted mb-0">Eventos próximos</p>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card-custom p-4 text-center">
              <i className="bi bi-star-fill fs-1 text-warning mb-2"></i>
              <h3>{usuarios.puntosAcumulados}</h3>
              <p className="text-muted mb-0">Puntos acumulados</p>
            </div>
          </div>
        </div>

        {/* <!-- Profile Tabs --> */}
        <ul className="nav nav-pills mb-4 " id="profileTabs" role="tablist">
          <li className="nav-item " role="presentation">
            <button
              className="nav-link active bg-success"
              data-bs-toggle="pill"
              data-bs-target="#tabCalendar"
              type="button"
            >
              <i className="bi bi-calendar3 me-2"></i>Calendario
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className="nav-link bg-success "
              data-bs-toggle="pill"
              data-bs-target="#tabRecommended"
              type="button"

            >
              <i className="bi bi-graph-up-arrow me-2 "></i>Recomendados
            </button>
          </li>
          <li className="nav-item " role="presentation">
            <button
              className="nav-link bg-success"
              data-bs-toggle="pill"
              data-bs-target="#tabFavorites"
              type="button"
            >
              <i className="bi bi-heart-fill me-2"></i>Favoritos
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className="nav-link bg-success"
              data-bs-toggle="pill"
              data-bs-target="#tabCoupons"
              type="button"
            >
              <i className="bi bi-tag-fill me-2"></i>Cupones
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className="nav-link bg-success"
              data-bs-toggle="pill"
              data-bs-target="#tabHistory"
              type="button"
            >
              <i className="bi bi-clock-history me-2"></i>Historial
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className="nav-link bg-success"
              data-bs-toggle="pill"
              data-bs-target="#tabSettings"
              type="button"
            >
              <i className="bi bi-gear-fill me-2"></i>Configuración
            </button>
          </li>
        </ul>

        <div className="tab-content" id="profileTabContent">
          {/* <!-- Calendar Tab --> */}
          <div className="tab-pane fade show active" id="tabCalendar">
            <div className="row g-4">
              <div className="col-lg-6">
                <div className="card-custom p-4">
                  <h4 className="mb-4">
                    <i className="bi bi-calendar3 me-2"></i>Calendario de Eventos
                  </h4>
                  <div className="calendar">
                    <div className="calendar-header">
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick="previousMonth()"
                      >
                        <i className="bi bi-chevron-left"></i>
                      </button>
                      <h5 className="mb-0" id="calendarMonth">
                        Diciembre 2024
                      </h5>
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick="nextMonth()"
                      >
                        <i className="bi bi-chevron-right"></i>
                      </button>
                    </div>
                    <div className="calendar-grid">
                      <div className="calendar-day-header">L</div>
                      <div className="calendar-day-header">M</div>
                      <div className="calendar-day-header">X</div>
                      <div className="calendar-day-header">J</div>
                      <div className="calendar-day-header">V</div>
                      <div className="calendar-day-header">S</div>
                      <div className="calendar-day-header">D</div>
                      <div className="calendar-day other-month">25</div>
                      <div className="calendar-day other-month">26</div>
                      <div className="calendar-day other-month">27</div>
                      <div className="calendar-day other-month">28</div>
                      <div className="calendar-day other-month">29</div>
                      <div className="calendar-day other-month">30</div>
                      <div className="calendar-day">1</div>
                      <div className="calendar-day">2</div>
                      <div className="calendar-day">3</div>
                      <div className="calendar-day">4</div>
                      <div className="calendar-day">5</div>
                      <div className="calendar-day">6</div>
                      <div className="calendar-day">7</div>
                      <div className="calendar-day">8</div>
                      <div className="calendar-day">9</div>
                      <div className="calendar-day">10</div>
                      <div className="calendar-day">11</div>
                      <div className="calendar-day">12</div>
                      <div className="calendar-day">13</div>
                      <div className="calendar-day">14</div>
                      <div className="calendar-day has-event">15</div>
                      <div className="calendar-day">16</div>
                      <div className="calendar-day">17</div>
                      <div className="calendar-day">18</div>
                      <div className="calendar-day">19</div>
                      <div className="calendar-day has-event">20</div>
                      <div className="calendar-day">21</div>
                      <div className="calendar-day">22</div>
                      <div className="calendar-day">23</div>
                      <div className="calendar-day">24</div>
                      <div className="calendar-day">25</div>
                      <div className="calendar-day">26</div>
                      <div className="calendar-day">27</div>
                      <div className="calendar-day has-event">28</div>
                      <div className="calendar-day">29</div>
                      <div className="calendar-day">30</div>
                      <div className="calendar-day has-event">31</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <h4 className="mb-4 text-dark">
                  <i className="bi bi-ticket-perforated me-2"></i>Mis Entradas
                </h4>

                <div className="card-custom p-4 mb-3">
                  <h6 className="fw-bold mb-2">Festival de Rock Murcia 2024</h6>
                  <p className="small text-muted mb-2">
                    <i className="bi bi-geo-alt me-1"></i>Auditorio El Batel
                    <br />
                    <i className="bi bi-calendar me-1"></i>15 Dic 2024, 21:00h
                  </p>
                  <span className="badge bg-primary">Asiento A5</span>
                  <span className="badge bg-warning text-dark ms-2">VIP</span>
                  <hr />
                  <div className="row g-2">
                    <div className="col-6">
                      <button className="btn btn-sm btn-outline-primary w-100">
                        <i className="bi bi-download me-1"></i>Descargar PDF
                      </button>
                    </div>
                    <div className="col-6">
                      <button className="btn btn-sm btn-outline-primary w-100">
                        <i className="bi bi-share me-1"></i>Compartir
                      </button>
                    </div>
                  </div>
                </div>

                <div className="card-custom p-4 mb-3">
                  <h6 className="fw-bold mb-2">Espectáculo de Flamenco</h6>
                  <p className="small text-muted mb-2">
                    <i className="bi bi-geo-alt me-1"></i>Teatro Romea
                    <br />
                    <i className="bi bi-calendar me-1"></i>20 Dic 2024, 20:00h
                  </p>
                  <span className="badge bg-primary">Asiento B12</span>
                  <span className="badge bg-info text-dark ms-2">Preferente</span>
                  <hr />
                  <div className="row g-2">
                    <div className="col-6">
                      <button className="btn btn-sm btn-outline-primary w-100">
                        <i className="bi bi-download me-1"></i>Descargar PDF
                      </button>
                    </div>
                    <div className="col-6">
                      <button className="btn btn-sm btn-outline-primary w-100">
                        <i className="bi bi-share me-1"></i>Compartir
                      </button>
                    </div>
                  </div>
                </div>

                <div className="card-custom p-4 mb-3">
                  <h6 className="fw-bold mb-2">Concierto de Año Nuevo</h6>
                  <p className="small text-muted mb-2">
                    <i className="bi bi-geo-alt me-1"></i>Teatro Circo
                    <br />
                    <i className="bi bi-calendar me-1"></i>31 Dic 2024, 23:00h
                  </p>
                  <span className="badge bg-primary">Asiento C8</span>
                  <span className="badge bg-success text-dark ms-2">General</span>
                  <hr />
                  <div className="row g-2">
                    <div className="col-6">
                      <button className="btn btn-sm btn-outline-primary w-100">
                        <i className="bi bi-download me-1"></i>Descargar PDF
                      </button>
                    </div>
                    <div className="col-6">
                      <button className="btn btn-sm btn-outline-primary w-100">
                        <i className="bi bi-share me-1"></i>Compartir
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/*Sección de recomendados*/}
          <div className="tab-pane fade" id="tabRecommended">
            <section className="py-4">
              <div className="container p-0">
                <h2 className="display-6 fw-bold mb-4">
                 Recomendados para ti
                </h2>
                <p className="text-muted mb-4">Planes personalizados según tus intereses.</p>

                {recomendados.length === 0 ? (
                  <div className="card-custom p-5 text-center">
                    <div className="spinner-border text-success mb-3" role="status"></div>
                    <p className="text-muted mb-0">Buscando los mejores eventos para ti...</p>
                  </div>
                ) : (
                  <div className="row g-4">
                    {recomendados.map((elemento, indice) => (
                      <div className="col-lg-3 col-md-4 col-sm-6" key={elemento.id || indice}>
                        <div
                          className="card-custom h-100 d-flex flex-column p-0 overflow-hidden shadow-sm"
                          style={{ cursor: "pointer" }}
                          onClick={() => window.location.href = `/evento/${elemento.id}`}
                        >
                          <img
                            src={elemento.imagen?.startsWith('http') ? elemento.imagen : `${URL_LARAVEL}/../storage/${elemento.imagen}`}
                            className="w-100 card-img-small"
                            alt={elemento.titulo}
                            style={{ height: '160px', objectFit: 'cover' }}
                          />
                          <div className="p-3 flex-grow-1 d-flex flex-column">
                            <h3 className="h6 fw-bold mb-2">
                              {elemento.nombre}
                            </h3>
                            <p className="small text-muted mb-3 mt-auto">
                              Aforo: {elemento.aforo || 'Consultar'} • {elemento.localizacion || 'Murcia'}
                            </p>
                            <div className="d-flex justify-content-between align-items-center">
                              <span className="fw-bold text-purple" style={{ color: "var(--primary-color)" }}>
                                {elemento.fecha_inicio || elemento.fecha || 'Próximamente'}
                              </span>
                              <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-2 py-1" style={{ fontSize: '0.7rem' }}>
                                Disponible
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* <!-- Coupons Tab --> */}
          <div className="tab-pane fade" id="tabCoupons">
            <div className="row g-4 mb-4">
              <div className="col-md-4">
                <div
                  className="card-custom p-4 text-center"
                  style={{ background: "linear-gradient(135deg, #dcfce7 0%, #86efac 100%)" }}
                >
                  <i className="bi bi-percent fs-1 text-success mb-2"></i>
                  <h3 className="mb-0">3</h3>
                  <p className="text-dark mb-0">Cupones activos</p>
                </div>
              </div>
              <div className="col-md-4">
                <div
                  className="card-custom p-4 text-center"
                  style={{ background: "linear-gradient(135deg, #dbeafe 0%, #93c5fd 100%)" }}
                >
                  <i className="bi bi-gift fs-1 text-primary mb-2"></i>
                  <h3 className="mb-0">7€</h3>
                  <p className="text-dark mb-0">En descuentos por puntos</p>
                </div>
              </div>
              <div className="col-md-4">
                <div
                  className="card-custom p-4 text-center"
                  style={{ background: "linear-gradient(135deg, #fae8ff 0%, #e9d5ff 100%)" }}
                >
                  <i
                    className="bi bi-people fs-1 mb-2"
                    style={{ color: "var(--primary-color)" }}
                  ></i>
                  <h3 className="mb-0">MURCIA2024</h3>
                  <p className="text-dark mb-0">Tu código de referido</p>
                </div>
              </div>
            </div>

            <div className="card-custom p-4">
              <h4 className="mb-4">
                <i className="bi bi-tag-fill me-2"></i>Mis Cupones
              </h4>

              <div className="coupon-card mb-3">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <span className="badge bg-primary mb-2">20% OFF</span>
                    <h5 className="mb-1 font-monospace">BIENVENIDA20</h5>
                    <p className="small text-muted mb-0">
                      Válido hasta: 31/01/2025
                    </p>
                  </div>
                  <button
                    className="btn btn-primary-custom btn-sm"
                    onClick="copyCoupon('BIENVENIDA20')"
                  >
                    <i className="bi bi-clipboard me-1"></i>Copiar
                  </button>
                </div>
              </div>

              <div className="coupon-card mb-3">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <span className="badge bg-success mb-2">10€ OFF</span>
                    <h5 className="mb-1 font-monospace">PRIMERA10</h5>
                    <p className="small text-muted mb-0">
                      Válido hasta: 15/02/2025
                    </p>
                  </div>
                  <button
                    className="btn btn-primary-custom btn-sm"
                    onClick="copyCoupon('PRIMERA10')"
                  >
                    <i className="bi bi-clipboard me-1"></i>Copiar
                  </button>
                </div>
              </div>

              <div className="coupon-card mb-3">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <span className="badge bg-warning text-dark mb-2">2x1</span>
                    <h5 className="mb-1 font-monospace">DOSPORUN0</h5>
                    <p className="small text-muted mb-0">
                      Válido hasta: 28/02/2025
                    </p>
                  </div>
                  <button
                    className="btn btn-primary-custom btn-sm"
                    onClick="copyCoupon('DOSPORUN0')"
                  >
                    <i className="bi bi-clipboard me-1"></i>Copiar
                  </button>
                </div>
              </div>

              <div className="alert alert-info mt-4">
                <i className="bi bi-info-circle me-2"></i>
                <strong>Sistema de Referidos:</strong> Comparte tu código
                MURCIA2024 con amigos. Por cada amigo que se registre usando tu
                código, ambos recibirán 50 puntos extra.
              </div>
            </div>
          </div>

          {/* <!-- History Tab --> */}
          <div className="tab-pane fade" id="tabHistory">
            <div className="row g-4 mb-4">
              <div className="col-md-4">
                <div className="card-custom p-4 text-center">
                  <i
                    className="bi bi-credit-card fs-1 mb-2"
                    style={{ color: "var(--primary-color)" }}
                  ></i>
                  <h3 className="mb-0">125€</h3>
                  <p className="text-muted mb-0">Total gastado</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card-custom p-4 text-center">
                  <i className="bi bi-star-fill fs-1 text-warning mb-2"></i>
                  <h3 className="mb-0">150</h3>
                  <p className="text-muted mb-0">Puntos ganados</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card-custom p-4 text-center">
                  <i className="bi bi-ticket-perforated fs-1 text-info mb-2"></i>
                  <h3 className="mb-0">3</h3>
                  <p className="text-muted mb-0">Eventos comprados</p>
                </div>
              </div>
            </div>

            <div className="card-custom p-4">
              <h4 className="mb-4">
                <i className="bi bi-clock-history me-2"></i>Historial de Compras
              </h4>

              <div className="border rounded p-3 mb-3">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h6 className="mb-1">Festival de Rock Murcia 2024</h6>
                    <p className="small text-muted mb-2">
                      <i className="bi bi-calendar me-1"></i>1 de noviembre de 2024
                      <br />
                      <i className="bi bi-credit-card me-1"></i>Visa **** 1234
                    </p>
                    <span className="badge bg-success">Completada</span>
                  </div>
                  <div className="text-end">
                    <p className="mb-0 fw-bold fs-5">45€</p>
                    <p className="small text-success mb-0">+45 puntos</p>
                  </div>
                </div>
              </div>

              <div className="border rounded p-3 mb-3">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h6 className="mb-1">Espectáculo de Flamenco</h6>
                    <p className="small text-muted mb-2">
                      <i className="bi bi-calendar me-1"></i>15 de noviembre de 2024
                      <br />
                      <i className="bi bi-credit-card me-1"></i>Mastercard **** 5678
                    </p>
                    <span className="badge bg-success">Completada</span>
                  </div>
                  <div className="text-end">
                    <p className="mb-0 fw-bold fs-5">35€</p>
                    <p className="small text-success mb-0">+35 puntos</p>
                  </div>
                </div>
              </div>

              <div className="border rounded p-3 mb-3">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h6 className="mb-1">Concierto de Año Nuevo</h6>
                    <p className="small text-muted mb-2">
                      <i className="bi bi-calendar me-1"></i>22 de noviembre de 2024
                      <br />
                      <i className="bi bi-credit-card me-1"></i>Visa **** 1234
                    </p>
                    <span className="badge bg-success">Completada</span>
                  </div>
                  <div className="text-end">
                    <p className="mb-0 fw-bold fs-5">45€</p>
                    <p className="small text-success mb-0">+45 puntos</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* <!-- Settings Tab --> */}
          <div className="tab-pane fade" id="tabSettings">
            {/* */}
            <div className="card-custom p-4 mb-4">
              <h4 className="mb-4 text-dark">
                <i className="bi bi-tags me-2"></i>Tus Preferencias
              </h4>
              <p className="text-muted mb-4">
                Selecciona los tipos de eventos que más te gustan. Utilizaremos esto para recomendarte eventos personalizados.
              </p>

              <div className="row mb-4">
                {etiquetas.map((tag) => (
                  <div key={tag.id} className="col-6 col-md-4 col-lg-3 mb-3">
                    <div className="form-check custom-checkbox-card p-2 border rounded text-center">
                      <input
                        className="form-check-input d-none"
                        type="checkbox"
                        id={`tag-${tag.id}`}
                        checked={seleccionadas.includes(tag.id)}
                        onChange={() => manejarCheck(tag.id)}
                      />
                      <label
                        className={`form-check-label w-100 cursor-pointer ${seleccionadas.includes(tag.id) ? 'fw-bold text-primary' : 'text-dark'}`}
                        htmlFor={`tag-${tag.id}`}
                        style={{ cursor: 'pointer' }}
                      >
                        {seleccionadas.includes(tag.id) && <i className="bi bi-check2 me-1"></i>}
                        {tag.nombreEtiqueta.charAt(0).toUpperCase() + tag.nombreEtiqueta.slice(1)}
                      </label>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                className="btn btn-primary-custom"
                onClick={enviarPreferencias}
              >
                <i className="bi bi-save me-2"></i>Guardar mis gustos
              </button>
            </div>
            <div className="card-custom p-4 mb-4">
              <h4 className="mb-4 text-dark">
                <i className="bi bi-person me-2"></i>Modifica tus datos
              </h4>

              <form onSubmit={procesa}>
                <div className="mb-3">
                  <label className="form-label">Nombre</label>
                  <input
                    type="text"
                    className="form-control"
                    name="nuevoNombre"
                    defaultValue={usuarios.nombre}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Apellidos</label>
                  <input
                    type="text"
                    className="form-control"
                    name="nuevoApellido"
                    defaultValue={usuarios.apellidos}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Nombre de usuario</label>
                  <input
                    type="text"
                    className="form-control"
                    name="nuevoUsername"
                    defaultValue={usuarios.nombreUsuario}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={usuarios.email}
                    disabled
                  />
                  <small className="text-muted">
                    El email no se puede modificar
                  </small>
                </div>
                <button type="submit" className="btn btn-primary-custom">
                  <i className="bi bi-check-circle me-2"></i>Guardar cambios
                </button>
              </form>
            </div>

            <div className="card-custom p-4 border-danger">
              <h4 className="mb-4 text-danger">
                <i className="bi bi-exclamation-triangle me-2"></i>Zona Peligrosa
              </h4>
              <p className="text-muted mb-3">
                Una vez eliminada tu cuenta, no hay vuelta atrás. Por favor ten
                cuidado.
              </p>
              <button
                className="btn btn-danger w-100"
                onClick={() => eliminarCuenta(usuarios.id)}
              >
                <i className="bi bi-trash me-2"></i>Eliminar cuenta permanentemente
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* <!-- Footer --> */}
      <Footer />


    </>
  );
}

export default Perfil;
