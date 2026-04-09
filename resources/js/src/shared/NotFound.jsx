import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "../Index/styles.css";
import React from "react";
import { Link } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

function NotFound() {
    return (
        <>
            <Header />

            <section className="py-5 min-vh-100 d-flex align-items-center">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <div className="card-custom p-5 text-center shadow-sm">
                                <span className="badge badge-purple mb-3 fs-6">Error 404</span>
                                <h1 className="display-1 fw-bold text-purple mb-3">404</h1>
                                <h2 className="display-5 fw-bold mb-3">Pagina no encontrada</h2>
                                <p className="text-gray-custom fs-5 mb-4">
                                    La ruta que intentas visitar no existe o ya no está disponible.
                                </p>

                                <div className="d-flex flex-column flex-md-row justify-content-center gap-3">
                                    <Link to="/" className="btn btn-primary-custom rounded-pill px-4 py-3 fw-bold">
                                        Volver al inicio
                                    </Link>
                                    <Link to="/eventos" className="btn btn-outline-secondary rounded-pill px-4 py-3 fw-semibold">
                                        Ir a eventos
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}

export default NotFound;
