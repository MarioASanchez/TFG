import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "./styles.css";
import Header from "../shared/Header";
import Footer from "../shared/Footer";
import React, { useContext } from "react";

import { useNavigate } from "react-router-dom";
import { IndexHelperContext } from "./helpers/IndexHelper";
import SelectioAsiento from "../shared/SelectioAsiento";
import { useState } from "react";

function Index() {
    const navigate = useNavigate();
    let { eventos } = useContext(IndexHelperContext);
    const URL_LARAVEL = "http://localhost:8000/"

    const [showSelector, setShowSelector] = useState(false);
    const [eventoActivo, setEventoActivo] = useState(null);

    function irAlEventos(evento) {
        setEventoActivo(evento);
        setShowSelector(true);
    }

    function verEventos() {
        navigate("/eventos");
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
                            <h1 className="display-3 fw-bold mb-4">
                                Vive la Cultura de Murcia
                            </h1>
                            <p className="fs-5 mb-5 text-light">
                                Descubre los mejores eventos culturales y
                                consigue tus entradas con descuentos exclusivos
                            </p>
                            {/* Buscador */}
                            <div className="search-box">
                                <div className="row g-2">
                                    <div className="col-md-5">
                                        <input
                                            type="text"
                                            className="form-control form-control-dark"
                                            placeholder="¿Qué evento buscas?"
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        {/* Aquí, cuando tengamos el back definido, se generaría de forma dinámica */}
                                        <select className="form-select">
                                            <option>
                                                Todas las categorías
                                            </option>
                                            <option>Teatro</option>
                                            <option>Música</option>
                                            <option>Danza</option>
                                            <option>Comedia</option>
                                        </select>
                                    </div>
                                    <div className="col-md-3">
                                        <button
                                            className="btn btn-primary-custom w-100"
                                            onClick={verEventos}
                                        >
                                            Buscar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* Eventos destacados */}
            <section className="py-5 bg-darker">
                <div className="container">
                    <h2 className="display-5 fw-bold text-center mb-5">
                        <span className="text-purple-light">
                            Eventos Destacados
                        </span>
                    </h2>

                    <div className="row g-4">
                        {/* Evento destacado 1 */}
                        <div className="col-lg-4 col-md-6">
                            <div className="card-custom">
                                <div className="position-relative">
                                    <img
                                        src="https://images.unsplash.com/photo-1503095396549-807759245b35?w=500"
                                        className="w-100 card-img-custom"
                                        alt="El Lago de los Cisnes"
                                    />
                                    <span className="badge badge-purple position-absolute top-0 end-0 m-3 text-white">
                                        Destacado
                                    </span>
                                </div>
                                <div className="p-4">
                                    <h3 className="h5 fw-bold mb-2">
                                        El Lago de los Cisnes
                                    </h3>
                                    <p className="text-gray-custom mb-3">
                                        Teatro Romea • 15 Dic 2024
                                    </p>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span className="fs-4 fw-bold text-purple">
                                            Desde 25€
                                        </span>
                                        <button
                                            className="btn btn-primary-custom btn-sm"
                                            onClick={() => irAlEventos(eventos[0] || {nombre: 'El Lago de los Cisnes', imagen: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=500', fechaInicio: '15 Dic 2024'})}
                                        >
                                            Ver más
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Evento destacado 2 */}

                        <div className="col-lg-4 col-md-6">
                            <div className="card-custom">
                                <div className="position-relative">
                                    <img
                                        src="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=500"
                                        className="w-100 card-img-custom"
                                        alt="Concierto Sinfónico"
                                    />
                                    <span className="badge badge-purple position-absolute top-0 end-0 m-3 text-white">
                                        Destacado
                                    </span>
                                </div>
                                <div className="p-4">
                                    <h3 className="h5 fw-bold mb-2">
                                        Concierto Sinfónico de Año Nuevo
                                    </h3>
                                    <p className="text-gray-custom mb-3">
                                        Auditorio • 31 Dic 2024
                                    </p>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span className="fs-4 fw-bold text-purple">
                                            Desde 30€
                                        </span>
                                        <button
                                            className="btn btn-primary-custom btn-sm"
                                            onClick={() => irAlEventos(eventos[1] || {nombre: 'Concierto Sinfónico', imagen: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=500', fechaInicio: '31 Dic 2024'})}
                                        >
                                            Ver más
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Evento destacado 3 */}
                        <div className="col-lg-4 col-md-6">
                            <div className="card-custom">
                                <div className="position-relative">
                                    <img
                                        src="https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=500"
                                        className="w-100 card-img-custom"
                                        alt="Don Quijote"
                                    />
                                    <span className="badge badge-purple position-absolute top-0 end-0 m-3 text-white">
                                        Destacado
                                    </span>
                                </div>
                                <div className="p-4">
                                    <h3 className="h5 fw-bold mb-2">
                                        Don Quijote - Ballet Nacional
                                    </h3>
                                    <p className="text-gray-custom mb-3">
                                        Teatro Circo • 20 Dic 2024
                                    </p>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span className="fs-4 fw-bold text-purple">
                                            Desde 35€
                                        </span>
                                        <button
                                            className="btn btn-primary-custom btn-sm"
                                            onClick={() => irAlEventos(eventos[2] || {nombre: 'Don Quijote', imagen: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=500', fechaInicio: '20 Dic 2024'})}
                                        >
                                            Ver más
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
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
                                <div
                                    className="col-lg-3 col-md-4 col-sm-6"
                                    key={indice}
                                >
                                    <div 
                                        className="card-custom h-100 d-flex flex-column p-0 overflow-hidden shadow-sm" 
                                        style={{ cursor: "pointer" }}
                                        onClick={() => irAlEventos(elemento)}
                                    >
                                        <img
                                            src={elemento.imagen.startsWith('http') ? elemento.imagen : `/storage/${elemento.imagen}`}
                                            className="w-100 card-img-small"
                                            alt={elemento.nombre}
                                        />
                                        <div className="p-3 flex-grow-1 d-flex flex-column">
                                            <h3 className="h6 fw-bold mb-2">
                                                {elemento.nombre}
                                            </h3>
                                            <p className="small text-muted mb-3 mt-auto">
                                                Aforo: {elemento.aforo} • {elemento.localizacion || 'Murcia'}
                                            </p>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <span className="fw-bold text-purple">
                                                    {elemento.fechaInicio}
                                                </span>
                                                <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-2 py-1" style={{fontSize: '0.7rem'}}>
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
                            <h2 className="display-5 fw-bold mb-3">
                                Sistema de Puntos
                            </h2>
                            <p className="text-gray-custom">
                                Gana puntos con cada compra y obtén descuentos
                                exclusivos
                            </p>
                        </div>

                        <div className="row g-4 mb-4">
                            <div className="col-md-4">
                                <div className="points-card p-4 text-center">
                                    <div className="display-4 fw-bold text-purple mb-2">
                                        850
                                    </div>
                                    <div className="text-gray-custom">
                                        Puntos disponibles
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-4">
                                <div className="points-card p-4 text-center">
                                    <div className="display-4 fw-bold text-success mb-2">
                                        42.50€
                                    </div>
                                    <div className="text-gray-custom">
                                        En descuentos
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-4">
                                <div className="points-card p-4 text-center">
                                    <div className="display-4 fw-bold text-info mb-2">
                                        10%
                                    </div>
                                    <div className="text-gray-custom">
                                        Cashback en compras
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="points-card p-4 text-center">
                            <p className="fs-5 mb-2">
                                <span className="fw-bold text-purple">
                                    Cada 100 puntos = 5€ de descuento
                                </span>
                            </p>
                            <p className="text-gray-custom mb-0">
                                Ganas 10% en puntos por cada compra realizada
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            {/* Footer */}
            <Footer />

            <SelectioAsiento 
                show={showSelector} 
                handleClose={() => setShowSelector(false)} 
                evento={eventoActivo} 
            />

            {/* <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
      <script src="index.js"></script> */}
        </>
    );
}

export default Index;
