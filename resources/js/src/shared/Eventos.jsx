import React, { useContext, useEffect, useState } from "react";
import Footer from "./Footer";
import Header from "./Header";
import { CarritoContext } from "./Helpers/CarritoHelper";

function Eventos() {
  const { addToCart } = useContext(CarritoContext);
  const [listaEventos, setListaEventos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/eventos")
      .then(res => res.json())
      .then(data => {
        setListaEventos(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching eventos:", err);
        setLoading(false);
      });
  }, []);

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
                    <img
                      src={evento.imagen.startsWith('http') ? evento.imagen : `/storage/${evento.imagen}`}
                      className="w-100 card-img-small"
                      alt={evento.nombre}
                    />
                    <div className="p-3 flex-grow-1 d-flex flex-column">
                      <h3 className="h6 fw-bold mb-2">{evento.nombre}</h3>
                      <p className="small text-muted mb-3">
                        {evento.localizacion} • {new Date(evento.fechaInicio).toLocaleDateString()}
                      </p>
                      <div className="mt-auto">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <span className="fw-bold text-purple">{evento.precio}€</span>
                          <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-2 py-1" style={{fontSize: '0.7rem'}}>
                            Disponible
                          </span>
                        </div>
                        <button 
                          className="btn btn-primary-custom btn-sm w-100 rounded-pill"
                          onClick={() =>
                            addToCart({
                              ...evento,
                              // Las entradas directas desde la card se tratan como entrada general.
                              id: `${evento.id}-general`,
                              claveCarrito: `${evento.id}-general`,
                              idEvento: evento.id,
                              tipoEntrada: "General"
                            })
                          }
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
      <Footer />
    </>
  );
}

export default Eventos;
