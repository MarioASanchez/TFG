import React, { useContext } from "react";
import { CarritoContext } from "./Helpers/CarritoHelper";

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

function obtenerImagenEvento(evento) {
  if (!evento?.imagen) {
    return "https://placehold.co/1200x800?text=Evento";
  }

  return evento.imagen.startsWith("http") ? evento.imagen : `/storage/${evento.imagen}`;
}

function DetalleEventoModal({ mostrar, cerrarModal, evento }) {
  const { addToCart } = useContext(CarritoContext);

  if (!mostrar || !evento) {
    return null;
  }

  const stockDisponible = Number(evento.stock) || 0;
  const precio = Number(evento.precio) || 0;
  const eventoAgotado = stockDisponible <= 0;

  const anadirEntradaGeneral = () => {
    if (eventoAgotado) {
      return;
    }

    addToCart({
      ...evento,
      id: `${evento.id}-general`,
      claveCarrito: `${evento.id}-general`,
      idEvento: evento.id,
      tipoEntrada: "General"
    });

    cerrarModal();
  };

  return (
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
              src={obtenerImagenEvento(evento)}
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
              <span className="fw-bold text-purple fs-4">{precio.toFixed(2)} EUR</span>
            </div>

            <h2 className="fw-bold text-dark mb-3">{evento.nombre}</h2>

            <p className="text-secondary mb-4 detalle-evento-descripcion">
              {evento.descripcion || "Este evento todavia no tiene descripcion disponible."}
            </p>

            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <div className="detalle-evento-dato h-100">
                  <p className="detalle-evento-etiqueta mb-1">Ubicacion</p>
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
                onClick={anadirEntradaGeneral}
                disabled={eventoAgotado}
              >
                {eventoAgotado ? "Sin entradas disponibles" : "Anadir al carrito"}
              </button>
              <button
                className="btn btn-outline-secondary rounded-pill px-4 py-3 fw-semibold"
                onClick={cerrarModal}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetalleEventoModal;
