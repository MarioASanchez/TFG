import React from "react";
import SelectioAsiento from "./SelectioAsiento";
import { obtenerUrlImagen } from "./Helpers/ImagenHelper";
import { UsuarioHelperContext } from "../Usuario/Helpers/UsuarioHelper";
import { AdminHelperContext } from "../Admin/Helpers/AdminHelper";
import { mostrarError, mostrarExito } from "./Helpers/Notificaciones";

function formatearFecha(fecha) {
  if (!fecha) {
    return "Fecha pendiente";
  }

  return new Date(fecha).toLocaleString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function DetalleEventoModal({ mostrar, cerrarModal, evento, alEliminarEvento }) {
  const { usuarios } = React.useContext(UsuarioHelperContext);
  const { eliminarEvento } = React.useContext(AdminHelperContext);
  const [mostrarSelectorAsiento, setMostrarSelectorAsiento] = React.useState(false);
  const [eliminandoEvento, setEliminandoEvento] = React.useState(false);

  React.useEffect(() => {
    if (!mostrar) {
      setMostrarSelectorAsiento(false);
    }
  }, [mostrar]);

  if (!mostrar || !evento) {
    return null;
  }

  const stockDisponible = Number(evento.stock) || 0;
  const precio = Number(evento.precio) || 0;
  const eventoAgotado = stockDisponible <= 0;

  const abrirSelectorAsiento = () => {
    if (eventoAgotado) {
      return;
    }

    setMostrarSelectorAsiento(true);
  };

  const cerrarSelectorAsiento = () => {
    setMostrarSelectorAsiento(false);
  };

  const cerrarFlujoCompra = () => {
    setMostrarSelectorAsiento(false);
    cerrarModal();
  };

  const borrarEvento = async () => {
    const confirmacion = window.confirm(`¿Seguro que quieres eliminar el evento "${evento.nombre}"?`);

    if (!confirmacion) {
      return;
    }

    try {
      setEliminandoEvento(true);
      await eliminarEvento(evento.id);

      if (alEliminarEvento) {
        alEliminarEvento(evento.id);
      }

      mostrarExito("Evento eliminado con éxito");
      cerrarModal();
    } catch (error) {
      console.error(error);
      mostrarError("No se ha podido eliminar el evento");
    } finally {
      setEliminandoEvento(false);
    }
  };

  return (
    <>
      {!mostrarSelectorAsiento && (
        <div
          className={`modal fade ${mostrar ? "show d-block" : ""}`}
          tabIndex="-1"
          style={{ backgroundColor: "rgba(15, 15, 26, 0.78)" }}
          onClick={cerrarModal}
        >
          <div
            className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable"
            onClick={(ev) => ev.stopPropagation()}
          >
            <div className="modal-content modal-content-custom border-0 overflow-hidden shadow-lg">
              <div className="position-relative">
                <img
                  src={obtenerUrlImagen(evento.imagen)}
                  alt={evento.nombre}
                  className="w-100 detalle-evento-imagen"
                />
                <button
                  type="button"
                  className="btn-close btn-close-white detalle-evento-cerrar"
                  onClick={cerrarModal}
                  aria-label="Cerrar"
                ></button>
              </div>

              <div className="modal-body p-4 p-md-5">
                <div className="d-flex flex-wrap gap-2 align-items-center justify-content-between mb-3">
                  <span className="badge badge-purple fs-6 px-3 py-2">
                    {eventoAgotado ? "Agotado" : "Disponible"}
                  </span>
                  <span className="fw-bold text-purple fs-4">{precio.toFixed(2)} €</span>
                </div>

                <h2 className="fw-bold text-dark mb-3">{evento.nombre}</h2>

                <p className="text-secondary mb-4 detalle-evento-descripcion">
                  {evento.descripcion || "Este evento todavia no tiene descripción disponible."}
                </p>

                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <div className="detalle-evento-dato h-100">
                      <p className="detalle-evento-etiqueta mb-1">Ubicación</p>
                      <p className="mb-0 fw-semibold">{evento.localizacion || "Por confirmar"}</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="detalle-evento-dato h-100">
                      <p className="detalle-evento-etiqueta mb-1">Entradas disponibles</p>
                      <p className="mb-0 fw-semibold">{stockDisponible}</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="detalle-evento-dato h-100">
                      <p className="detalle-evento-etiqueta mb-1">Fecha de inicio</p>
                      <p className="mb-0 fw-semibold">{formatearFecha(evento.fechaInicio)}</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="detalle-evento-dato h-100">
                      <p className="detalle-evento-etiqueta mb-1">Fecha de fin</p>
                      <p className="mb-0 fw-semibold">{formatearFecha(evento.fechaFin)}</p>
                    </div>
                  </div>
                </div>

                <div className="d-flex flex-column flex-md-row gap-3">
                  <button
                    className="btn btn-primary-custom rounded-pill px-4 py-3 fw-bold"
                    onClick={abrirSelectorAsiento}
                    disabled={eventoAgotado}
                  >
                    {eventoAgotado ? "Sin entradas disponibles" : "Añadir al carrito"}
                  </button>
                  <button
                    className="btn btn-outline-secondary rounded-pill px-4 py-3 fw-semibold"
                    onClick={cerrarModal}
                  >
                    Cerrar
                  </button>
                  {usuarios?.admin && (
                    <button
                      className="btn btn-danger rounded-pill px-4 py-3 fw-semibold"
                      onClick={borrarEvento}
                      disabled={eliminandoEvento}
                    >
                      {eliminandoEvento ? "Eliminando..." : "Eliminar el evento"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <SelectioAsiento
        show={mostrarSelectorAsiento}
        handleClose={cerrarSelectorAsiento}
        evento={evento}
        alConfirmarCompra={cerrarFlujoCompra}
      />
    </>
  );
}

export default DetalleEventoModal;
