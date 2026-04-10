import React, { useEffect, useState } from "react";
import "../Index/styles.css";
import Footer from "./Footer";
import Header from "./Header";
import DetalleEventoModal from "./DetalleEventoModal";
import { obtenerUrlImagen } from "./Helpers/ImagenHelper";
import { useLocation } from "react-router-dom";

function formatearFecha(fecha) {
  if (!fecha) {
    return "Fecha pendiente";
  }

  return new Date(fecha).toLocaleDateString("es-ES");
}

function Eventos() {
  const location = useLocation();
  const [listaEventos, setListaEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");

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

  useEffect(() => {
    setTextoBusqueda(location.state?.textoBusqueda ?? "");
    setCategoriaSeleccionada(location.state?.categoriaSeleccionada ?? "");
  }, [location.state]);

  const abrirModalEvento = (evento) => {
    setEventoSeleccionado(evento);
  };

  const cerrarModalEvento = () => {
    setEventoSeleccionado(null);
  };

  const eliminarEventoDeLaLista = (idEvento) => {
    setListaEventos((eventosPrevios) =>
      eventosPrevios.filter((evento) => evento.id !== idEvento)
    );
  };

  const categoriasDisponibles = Array.from(
    new Set(
      listaEventos.flatMap((evento) =>
        Array.isArray(evento.etiquetas) ? evento.etiquetas : []
      )
    )
  ).sort((categoriaA, categoriaB) => categoriaA.localeCompare(categoriaB));

  const eventosFiltrados = listaEventos.filter((evento) => {
    const textoNormalizado = textoBusqueda.trim().toLowerCase();
    const categoriaNormalizada = categoriaSeleccionada.trim().toLowerCase();
    const etiquetasEvento = Array.isArray(evento.etiquetas) ? evento.etiquetas : [];

    const coincideTexto =
      textoNormalizado === "" ||
      evento.nombre?.toLowerCase().includes(textoNormalizado) ||
      evento.descripcion?.toLowerCase().includes(textoNormalizado) ||
      evento.localizacion?.toLowerCase().includes(textoNormalizado);

    const coincideCategoria =
      categoriaNormalizada === "" ||
      etiquetasEvento.some((etiqueta) => etiqueta.toLowerCase() === categoriaNormalizada);

    return coincideTexto && coincideCategoria;
  });

  return (
    <>
      <Header />
      <section className="py-5">
        <div className="container">
          <h2 className="display-5 fw-bold mb-5" id="todos_eventos">
            Todos los eventos
          </h2>

          <div className="row g-3 mb-4">
            <div className="col-md-8">
              <input
                type="text"
                className="form-control"
                placeholder="Buscar por nombre, descripción o ubicación"
                value={textoBusqueda}
                onChange={(ev) => setTextoBusqueda(ev.target.value)}
              />
            </div>
            <div className="col-md-4">
              <select
                className="form-control"
                value={categoriaSeleccionada}
                onChange={(ev) => setCategoriaSeleccionada(ev.target.value)}
              >
                <option value="">Todas las categorías</option>
                {categoriasDisponibles.map((categoria) => (
                  <option key={categoria} value={categoria}>
                    {categoria.charAt(0).toUpperCase() + categoria.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="row g-4">
            {loading ? (
              <div className="text-center">Cargando eventos...</div>
            ) : eventosFiltrados.length === 0 ? (
              <div className="text-center">No hay eventos que coincidan con la búsqueda.</div>
            ) : (
              eventosFiltrados.map((evento) => (
                <div key={evento.id} className="col-lg-3 col-md-4 col-sm-6">
                  <div className="card-custom h-100 d-flex flex-column p-0 overflow-hidden shadow-sm">
                    <img
                      src={evento.imagen.startsWith('http') ? evento.imagen : `/storage/${evento.imagen}`}
                      className="w-100 card-img-small"
                      alt={evento.nombre}
                    />
                    <div className="p-3 grow d-flex flex-column">
                      <h3 className="h6 fw-bold mb-2">{evento.nombre}</h3>
                      <p className="small text-muted mb-3">
                        {evento.localizacion} • {new Date(evento.fechaInicio).toLocaleDateString()}
                      </p>
                      <div className="mt-auto">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <span className="fw-bold text-purple">
                            {Number(evento.precio || 0).toFixed(2)} €
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
                          className="btn btn-primary-custom btn-sm w-100 rounded-pill"
                          onClick={() => addToCart(evento)}
                        >
                          Añadir al Carrito
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
        alEliminarEvento={eliminarEventoDeLaLista}
      />

      <Footer />
    </>
  );
}

export default Eventos;
