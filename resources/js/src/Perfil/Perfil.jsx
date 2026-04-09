import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "./perfil.css";

import Footer from "../shared/Footer";
import Header from "../shared/Header";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import { Link } from "react-router-dom";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { UsuarioHelperContext } from "../Usuario/Helpers/UsuarioHelper";
import { mostrarExito, mostrarError } from "../shared/Helpers/Notificaciones";
import { IndexHelperContext } from "../Index/helpers/IndexHelper";
import DetalleEventoModal from "../shared/DetalleEventoModal";
import { obtenerUrlImagen } from "../shared/Helpers/ImagenHelper";

function Perfil() {
  const { usuarios, eliminarCuenta, cambiarDatos, guardarPreferencias, obtenerEtiquetas, obtenerRecomendados, obtenerHistorialCompleto } = useContext(UsuarioHelperContext)
  const { eventos } = useContext(IndexHelperContext);
  const [etiquetas, setEtiquetas] = useState([]);
  const [seleccionadas, setSeleccionadas] = useState([]);
  const [recomendados, setRecomendados] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [eventoActivo, setEventoActivo] = useState(null);


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

  const cargarTodo = useCallback(async () => {
    if (!usuarios?.id) return;

    try {
      // Solo mostramos el cargando la primera vez 
      if (historial.length === 0) {
        setCargando(true)
      }
      // 1. Cargamos etiquetas y preferencias en paralelo
      const [tagsTotales, resPrefs] = await Promise.all([
        obtenerEtiquetas(),
        fetch(`${URL_SPRING}/preferencias/${usuarios.id}`)
      ]);

      setEtiquetas(tagsTotales);

      let idsPrefs = [];
      if (resPrefs.ok) {
        const dataPrefs = await resPrefs.json();
        idsPrefs = dataPrefs.idsEtiquetas || [];
        setSeleccionadas(idsPrefs);
      }

      // 2. Cargamos Recomendaciones e Historial
      const [dataRecom, dataHistorial] = await Promise.all([
        obtenerRecomendados(idsPrefs),
        obtenerHistorialCompleto(usuarios.id)
      ]);

      setRecomendados(dataRecom);
      setHistorial(dataHistorial);

    } catch (error) {
      console.error("Error cargando perfil:", error);
    } finally {
      setCargando(false);
    }
  }, [usuarios?.id, obtenerEtiquetas, obtenerRecomendados, obtenerHistorialCompleto, URL_SPRING]);

  const historialAgrupado = useMemo(() => {
    if (!historial || historial.length === 0) return [];

    const agrupado = historial.reduce((acc, item) => {
      const id = item.idEvento;
      const infoEvento = item.evento;

      // Limpiamos los asientos: de '["D1"]' a ['D1']
      let asientosLimpios = [];
      try {
        asientosLimpios = typeof item.asientos === 'string'
          ? JSON.parse(item.asientos)
          : item.asientos;
      } catch (e) {
        asientosLimpios = [item.asientos];
      }

      if (!acc[id]) {
        acc[id] = {
          ...item,
          nombreEvento: infoEvento?.nombre || "Evento sin nombre",
          localizacion: infoEvento?.localizacion || "N/A",
          fechaEvento: infoEvento?.fechaInicio || item.fechaCompra,
          fechaFin: infoEvento?.fechaFin || item.fechaCompra,
          asientos: Array.isArray(asientosLimpios) ? asientosLimpios : [asientosLimpios],
          precioTotal: parseFloat(item.precio || 0),
        };
      } else {
        // Evitar duplicados y combinar asientos
        const nuevosAsientos = Array.isArray(asientosLimpios) ? asientosLimpios : [asientosLimpios];
        acc[id].asientos = [...new Set([...acc[id].asientos, ...nuevosAsientos])];
        acc[id].precioTotal += parseFloat(item.precio || 0);
      }
      return acc;
    }, {});

    return Object.values(agrupado);
  }, [historial]);

  const eventosFuturos = useMemo(() => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    return historialAgrupado.filter(item => {
      if (!item.fechaEvento) return false;

      const fechaEventoObj = new Date(item.fechaEvento);
      return fechaEventoObj >= hoy;
    });
  }, [historialAgrupado]);

  // Calcular el total gastado de cada usuario
  const totalGastado = useMemo(() => {
    return historialAgrupado.reduce((total, compra) => total + compra.precioTotal, 0);
  }, [historialAgrupado]);


  useEffect(() => {
    // Carga inicial al montar el componente
    cargarTodo();

  }, [cargarTodo]);

  // Función para añadir o quitar IDs del array
  const manejarCheck = (id) => {
    setSeleccionadas(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // 2. Función para el guardado de las etiquetas
  const enviarPreferencias = async () => {
    try {
      await guardarPreferencias(usuarios.id, seleccionadas);
      // Recargar recomendados tras guardar nuevas etiquetas
      const nuevosRecom = await obtenerRecomendados(seleccionadas);
      setRecomendados(nuevosRecom);
      mostrarExito("Preferencias guardadas");
    } catch (error) {
      mostrarError("Error al guardar");
    }
  };

  const getFechaLocal = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };


  if (!usuarios) {
    return <p>Cargando datos del perfil...</p>;
  }

  const abrirModalEvento = (evento) => {
    setEventoActivo(evento);
  };

  const cerrarModalEvento = () => {
    setEventoActivo(null);
  };

  const eliminarEventoDeRecomendados = (idEvento) => {
    setRecomendados((eventosPrevios) =>
      eventosPrevios.filter((evento) => evento.id !== idEvento)
    );
  };

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
                {eventosFuturos.length}
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
                <h4 className="mb-4 text-dark">
                  <i className="bi bi-calendar3 me-2"></i>Calendario de Eventos
                </h4>
                <div className="card-custom p-4 h-100">
                  <Calendar
                    tileClassName={({ date, view }) => {
                      if (view === 'month') {
                        const fechaCelda = getFechaLocal(date);
                        const tieneEvento = eventosFuturos.some(evento => {
                          const inicio = getFechaLocal(new Date(evento.fechaEvento));
                          const fin = getFechaLocal(new Date(evento.fechaFin));
                          return fechaCelda >= inicio && fechaCelda <= fin;
                        });
                        return tieneEvento ? 'dia-con-evento' : null;
                      }
                    }}
                    tileContent={({ date, view }) => {
                      if (view === 'month') {
                        const fechaCelda = getFechaLocal(date);

                        // Filtramos todos los eventos que caen en este día
                        const eventosDeHoy = eventosFuturos.filter(evento => {
                          const inicio = getFechaLocal(new Date(evento.fechaEvento));
                          const fin = getFechaLocal(new Date(evento.fechaFin));
                          return fechaCelda >= inicio && fechaCelda <= fin;
                        });

                        if (eventosDeHoy.length > 0) {
                          // Extraemos los nombres y los unimos con una coma
                          const nombres = eventosDeHoy.map(e => e.nombreEvento).join(', ');

                          return (
                            <div className="hover-event-container" data-evento={nombres}>
                              <div className="dot-indicador"></div>
                            </div>
                          );
                        }
                      }
                      return null;
                    }}
                    formatShortWeekday={(locale, date) =>
                      ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'][date.getDay()]
                    }
                  />
                </div>
              </div>
              <div className="col-lg-6">
                <h4 className="mb-4 text-dark">
                  <i className="bi bi-ticket-perforated me-2"></i>Mis próximos eventos
                </h4>

                {cargando ? (
                  /* Carga los datos de la BBDD */
                  <div className="card-custom p-4 text-center">
                    <div className="spinner-border text-primary mb-2" role="status"></div>
                    <p className="text-muted mb-0">Buscando tus entradas...</p>
                  </div>
                ) : eventosFuturos.length === 0 ? (
                  /* Ha cargado pero no ha encontrado nada */
                  <div className="card-custom p-4 text-center">
                    <p className="text-muted mb-0">No tienes eventos próximos programados.</p>
                  </div>
                ) : (
                  /* Los muestra */
                  eventosFuturos.map((entrada) => (
                    <div key={entrada.idEvento} className="card-custom p-4 mb-3 shadow-sm border-0">
                      <h6 className="fw-bold mb-2">{entrada.nombreEvento}</h6>
                      <p className="small text-muted mb-2">
                        <i className="bi bi-geo-alt me-1"></i>{entrada.localizacion || "Localización por confirmar"}
                        <br />
                        <i className="bi bi-calendar me-1"> Fecha de inicio:</i>
                        {new Date(entrada.fechaEvento).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                        <br />
                        <i className="bi bi-calendar me-1"> Fecha de fin:</i>
                        {new Date(entrada.fechaFin).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>

                      <div className="d-flex flex-wrap gap-2 mb-3">
                        {entrada.asientos.map((asiento, index) => (
                          <span key={index} className="badge bg-primary">Asiento {asiento}</span>
                        ))}
                      </div>
                    </div>
                  ))
                )}
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
                          onClick={() => abrirModalEvento(elemento)}
                        >
                          <img
                            src={obtenerUrlImagen(elemento.imagen)}
                            className="w-100 card-img-small"
                            alt={elemento.nombre}
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
                                {elemento.fechaInicio || 'Próximamente'}
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
                  <h3 className="mb-0">{totalGastado.toFixed(2)}€</h3>
                  <p className="text-muted mb-0">Total gastado</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card-custom p-4 text-center">
                  <i className="bi bi-star-fill fs-1 text-warning mb-2"></i>
                  <h3 className="mb-0">{usuarios.puntosAcumulados}</h3>
                  <p className="text-muted mb-0">Puntos ganados</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card-custom p-4 text-center">
                  <i className="bi bi-ticket-perforated fs-1 text-info mb-2"></i>
                  <h3 className="mb-0">{historialAgrupado.length}</h3>
                  <p className="text-muted mb-0">Eventos comprados</p>
                </div>
              </div>
            </div>

            <div className="card-custom p-4">
              <h4 className="mb-4 text-dark">
                <i className="bi bi-clock-history me-2"></i>Historial de Compras
              </h4>

              {historialAgrupado.map((compra) => (
                <div key={compra.idEvento} className="border rounded p-3 mb-3 d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="fw-bold mb-1">{compra.nombreEvento}</h6>
                    <p className="small text-muted mb-1">
                      <i className="bi bi-calendar3 me-2"></i>{compra.fechaCompra || '2026-04-07'}
                    </p>
                    <span className="badge bg-success bg-opacity-10 text-success border border-success px-2 py-1" style={{ fontSize: '0.75rem' }}>
                      Completada
                    </span>
                  </div>
                  <div className="text-end">
                    <p className="mb-0 fw-bold fs-5">{compra.precioTotal.toFixed(2)}€</p>
                    <p className="text-muted mb-0" style={{ fontSize: '0.7rem' }}>
                      Asientos comprados: {compra.asientos.join(', ')}
                    </p>
                  </div>
                </div>
              ))}

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

      <DetalleEventoModal
        mostrar={Boolean(eventoActivo)}
        cerrarModal={cerrarModalEvento}
        evento={eventoActivo}
        alEliminarEvento={eliminarEventoDeRecomendados}
      />
    </>
  );
}

export default Perfil;
