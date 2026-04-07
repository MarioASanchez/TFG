import React, { useEffect, useState } from "react";
import "../Index/styles.css";
import Footer from "./Footer";
import Header from "./Header";
import DetalleEventoModal from "./DetalleEventoModal";

function obtenerImagenEvento(evento) {
  if (!evento?.imagen) {
    return "https://placehold.co/1200x800?text=Evento";
  }

  return evento.imagen.startsWith("http") ? evento.imagen : `/storage/${evento.imagen}`;
}

function formatearFecha(fecha) {
  if (!fecha) {
    return "Fecha pendiente";
  }

  return new Date(fecha).toLocaleDateString("es-ES");
}

function Eventos() {
  const [listaEventos, setListaEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);

  useEffect(() => {
    fetch("/api/eventos")
      .then((res) => res.json())
      .then((data) => {
        setListaEventos(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching eventos:", err);
        setLoading(false);
      });
  }, []);

  const abrirModalEvento = (evento) => {
    setEventoSeleccionado(evento);
  };

  const cerrarModalEvento = () => {
    setEventoSeleccionado(null);
  };

  return (
    <>
      <Header />
      <section className="py-5">
        <div className="container">
          <h2 className="display-5 fw-bold mb-5" id="todos_eventos">
            Todos los Eventos
          </h2>

          <div className="row g-4">
            {loading ? (
              <div className="text-center">Cargando eventos...</div>
            ) : listaEventos.length === 0 ? (
              <div className="text-center">No hay eventos disponibles en este momento.</div>
            ) : (
              listaEventos.map((evento) => (
                <div key={evento.id} className="col-lg-3 col-md-4 col-sm-6">
                  <div className="card-custom h-100 d-flex flex-column p-0 overflow-hidden shadow-sm">
                    <button
                      type="button"
                      className="evento-boton-detalle p-0 border-0 bg-transparent text-start"
                      onClick={() => abrirModalEvento(evento)}
                    >
                      <img
                        src={obtenerImagenEvento(evento)}
                        className="w-100 card-img-small"
                        alt={evento.nombre}
                      />
                    </button>

                    <div className="p-3 flex-grow-1 d-flex flex-column">
                      <button
                        type="button"
                        className="evento-boton-detalle border-0 bg-transparent text-start p-0"
                        onClick={() => abrirModalEvento(evento)}
                      >
                        <h3 className="h6 fw-bold mb-2">{evento.nombre}</h3>
                      </button>

                      <p className="small text-muted mb-2">
                        {evento.localizacion || "Ubicacion por confirmar"} - {formatearFecha(evento.fechaInicio)}
                      </p>

                      <p className="small text-secondary mb-3 evento-resumen-descripcion">
                        {evento.descripcion || "Pulsa en ver detalles para consultar la informacion completa del evento."}
                      </p>

                      <div className="mt-auto">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <span className="fw-bold text-purple">
                            {Number(evento.precio || 0).toFixed(2)} EUR
                          </span>
                          <span
                            className={`badge px-2 py-1 ${
                              Number(evento.stock) > 0
                                ? "bg-success bg-opacity-10 text-success border border-success border-opacity-25"
                                : "bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25"
                            }`}
                            style={{ fontSize: "0.7rem" }}
                          >
                            {Number(evento.stock) > 0 ? "Disponible" : "Agotado"}
                          </span>
                        </div>

                        <button
                          type="button"
                          className="btn btn-outline-secondary btn-sm w-100 rounded-pill"
                          onClick={() => abrirModalEvento(evento)}
                        >
                          Ver detalles
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <DetalleEventoModal
        mostrar={Boolean(eventoSeleccionado)}
        cerrarModal={cerrarModalEvento}
        evento={eventoSeleccionado}
      />

      <Footer />
    </>
  );
}

export default Eventos;
