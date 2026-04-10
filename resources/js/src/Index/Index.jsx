import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "./styles.css";
import Header from "../shared/Header";
import Footer from "../shared/Footer";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IndexHelperContext } from "./helpers/IndexHelper";
import DetalleEventoModal from "../shared/DetalleEventoModal";
import { obtenerUrlImagen } from "../shared/Helpers/ImagenHelper";

function Index() {
    const navigate = useNavigate();
    const { eventos, eventosDestacados, etiquetas, eliminarEventoDelIndex } = useContext(IndexHelperContext);
    const [eventoActivo, setEventoActivo] = useState(null);
    const [textoBusqueda, setTextoBusqueda] = useState("");
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");

    function verDetallesEvento(evento) {
        setEventoActivo(evento);
    }

    function cerrarDetallesEvento() {
        setEventoActivo(null);
    }

    function verEventos() {
        navigate("/eventos", {
            state: {
                textoBusqueda: textoBusqueda.trim(),
                categoriaSeleccionada
            }
        });
    }

    function formatearFecha(fecha) {
        if (!fecha) {
            return "Fecha pendiente";
        }

        return new Date(fecha).toLocaleDateString("es-ES");
    }

    return (
        <>
            {/* header */}
            <Header />
            {/* Hero section */}
            <section className="hero-section d-flex align-items-center">
                <div className="gradient-overlay position-absolute w-100 h-100"></div>
                <div className="container position-relative">
                    <div className="row justify-content-center">
                        <div className="col-lg-10 text-center">
                            <h1 className="display-3 fw-bold mb-4">Vive la Cultura de Murcia</h1>
                            <p className="fs-5 mb-5 text-light">
                                Descubre los mejores eventos culturales y consigue tus entradas con descuentos exclusivos
                            </p>

                            <div className="search-box">
                                <div className="row g-2">
                                    <div className="col-md-5">
                                        <input
                                            type="text"
                                            className="form-control form-control-dark"
                                            placeholder="¿Qué evento buscas?"
                                            value={textoBusqueda}
                                            onChange={(ev) => setTextoBusqueda(ev.target.value)}
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <select
                                            className="form-select"
                                            value={categoriaSeleccionada}
                                            onChange={(ev) => setCategoriaSeleccionada(ev.target.value)}
                                        >
                                            <option value="">Todas las categorías</option>
                                            {etiquetas.map((etiqueta) => (
                                                <option key={etiqueta.id} value={etiqueta.nombreEtiqueta}>
                                                    {etiqueta.nombreEtiqueta.charAt(0).toUpperCase() + etiqueta.nombreEtiqueta.slice(1)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-3">
                                        <button className="btn btn-primary-custom w-100" onClick={verEventos}>
                                            Buscar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-5 bg-darker">
                <div className="container">
                    <h2 className="display-5 fw-bold text-center mb-5">
                        <span className="text-purple-light">Eventos Destacados</span>
                    </h2>

                    <div className="row g-4">
                        {eventosDestacados.length === 0 ? (
                            <div className="col-12 text-center text-light">
                                No hay eventos destacados disponibles todavia.
                            </div>
                        ) : (
                            eventosDestacados.map((eventoDestacado) => (
                                <div className="col-lg-4 col-md-6" key={eventoDestacado.id}>
                                    <div className="card-custom">
                                        <div className="position-relative">
                                            <img
                                                src={obtenerUrlImagen(eventoDestacado.imagen)}
                                                className="w-100 card-img-custom"
                                                alt={eventoDestacado.nombre}
                                            />
                                            <span className="badge badge-purple position-absolute top-0 end-0 m-3 text-white">
                                                Destacado
                                            </span>
                                        </div>
                                        <div className="p-4">
                                            <h3 className="h5 fw-bold mb-2">{eventoDestacado.nombre}</h3>
                                            <p className="text-gray-custom mb-3">
                                                {eventoDestacado.localizacion || "Murcia"} - {formatearFecha(eventoDestacado.fechaInicio)}
                                            </p>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <span className="fs-4 fw-bold text-purple">
                                                    Desde {Number(eventoDestacado.precio || 0).toFixed(2)} €
                                                </span>
                                                <button
                                                    className="btn btn-primary-custom btn-sm"
                                                    onClick={() => verDetallesEvento(eventoDestacado)}
                                                >
                                                    Ver más
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

            {/* Todos los eventos */}
            <section className="py-5">
                <div className="container">
                    <h2 className="display-5 fw-bold mb-5" id="todos_eventos">
                        Todos los Eventos
                    </h2>
                    <div className="row g-4">
                        {/* Eventos */}
                        {eventos.map((elemento, indice) => {
                            return (
                                <div className="col-lg-3 col-md-4 col-sm-6" key={indice}>
                                    <div
                                        className="card-custom h-100 d-flex flex-column p-0 overflow-hidden shadow-sm"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => verDetallesEvento(elemento)}
                                    >
                                        <img
                                            src={obtenerUrlImagen(elemento.imagen)}
                                            className="w-100 card-img-small"
                                            alt={elemento.nombre}
                                        />
                                        <div className="p-3 flex-grow-1 d-flex flex-column">
                                            <h3 className="h6 fw-bold mb-2">{elemento.nombre}</h3>
                                            <p className="small text-muted mb-3 mt-auto">
                                                Aforo: {elemento.aforo} - {elemento.localizacion || "Murcia"}
                                            </p>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <span className="fw-bold text-purple">{elemento.fechaInicio}</span>
                                                <span
                                                    className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-2 py-1"
                                                    style={{ fontSize: "0.7rem" }}
                                                >
                                                    Disponible
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="py-5 bg-darker">
                <div className="container">
                    <div className="card-custom p-5">
                        <div className="text-center mb-5">
                            <h2 className="display-5 fw-bold mb-3">Sistema de Puntos</h2>
                            <p className="text-gray-custom">
                                Gana puntos con cada compra y obtén descuentos exclusivos
                            </p>
                        </div>

                        <div className="row g-4 mb-4">
                            <div className="col-md-4">
                                <div className="points-card p-4 text-center">
                                    <div className="display-4 fw-bold text-purple mb-2">850</div>
                                    <div className="text-gray-custom">Puntos disponibles</div>
                                </div>
                            </div>

                            <div className="col-md-4">
                                <div className="points-card p-4 text-center">
                                    <div className="display-4 fw-bold text-success mb-2">42.50 €</div>
                                    <div className="text-gray-custom">En descuentos</div>
                                </div>
                            </div>

                            <div className="col-md-4">
                                <div className="points-card p-4 text-center">
                                    <div className="display-4 fw-bold text-info mb-2">10%</div>
                                    <div className="text-gray-custom">Cashback en compras</div>
                                </div>
                            </div>
                        </div>

                        <div className="points-card p-4 text-center">
                            <p className="fs-5 mb-2">
                                <span className="fw-bold text-purple">Cada 100 puntos = 5€ de descuento</span>
                            </p>
                            <p className="text-gray-custom mb-0">
                                Ganas 10% en puntos por cada compra realizada
                            </p>
                        </div>
                    </div>
                </div>
            </section>


            <Footer />

            <DetalleEventoModal
                mostrar={Boolean(eventoActivo)}
                cerrarModal={cerrarDetallesEvento}
                evento={eventoActivo}
                alEliminarEvento={eliminarEventoDelIndex}
            />
        </>
    );
}

export default Index;
