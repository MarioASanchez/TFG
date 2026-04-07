import React, { useContext } from "react";
import { CarritoContext } from "./Helpers/CarritoHelper";
import { obtenerUrlImagen } from "./Helpers/ImagenHelper";

function SelectioAsiento({ show, handleClose, evento, alConfirmarCompra }) {
  const { addToCart } = useContext(CarritoContext);
  const [asientosSeleccionados, setAsientosSeleccionados] = React.useState([]);
  const [asientosOcupados, setAsientosOcupados] = React.useState([]);

  React.useEffect(() => {
    if (show && evento) {
      setAsientosSeleccionados([]);
      fetch(`${import.meta.env.VITE_API_USERS_URL}/api/compras/evento/${evento.id}`)
        .then((respuesta) => respuesta.json())
        .then((datos) => setAsientosOcupados(datos))
        .catch((error) => console.error("Error al cargar asientos ocupados:", error));
    }
  }, [show, evento]);

  if (!show || !evento) return null;

  const precioBase = Number(evento.precio) || 0;

  const alternarAsiento = (idAsiento, precio, tipoEntrada) => {
    if (asientosOcupados.includes(idAsiento)) return;

    setAsientosSeleccionados((asientosPrevios) => {
      const asientoSeleccionado = asientosPrevios.find((asiento) => asiento.id === idAsiento);

      if (asientoSeleccionado) {
        return asientosPrevios.filter((asiento) => asiento.id !== idAsiento);
      }

      return [
        ...asientosPrevios,
        { id: idAsiento, precio: Number(precio), tipoEntrada }
      ];
    });
  };

  const precioTotal = asientosSeleccionados.reduce(
    (acumulado, asiento) => acumulado + Number(asiento.precio),
    0
  );
  const puntosAGanar = Math.floor(precioTotal * 0.1);

  const handleComprar = () => {
    if (asientosSeleccionados.length === 0) {
      alert("Por favor, selecciona al menos un asiento.");
      return;
    }

    // Agrupamos los asientos por tipo para que el carrito muestre una linea por zona.
    const entradasPorTipo = asientosSeleccionados.reduce((acumulador, asiento) => {
      if (!acumulador[asiento.tipoEntrada]) {
        acumulador[asiento.tipoEntrada] = {
          id: `${evento.id}-${asiento.tipoEntrada.toLowerCase()}`,
          claveCarrito: `${evento.id}-${asiento.tipoEntrada.toLowerCase()}`,
          idEvento: evento.id,
          nombre: evento.nombre,
          imagen: evento.imagen,
          tipoEntrada: asiento.tipoEntrada,
          precio: Number(asiento.precio),
          cantidad: 0,
          asientos: []
        };
      }

      acumulador[asiento.tipoEntrada].cantidad += 1;
      acumulador[asiento.tipoEntrada].asientos.push(asiento.id);

      return acumulador;
    }, {});

    // Cada grupo se envia como una entrada independiente al carrito.
    Object.values(entradasPorTipo).forEach((entrada) => addToCart(entrada));
    setAsientosSeleccionados([]);
    handleClose();

    if (alConfirmarCompra) {
      alConfirmarCompra();
    }
  };

  const aforo = evento.aforo || 30;
  const cantidadVip = Math.floor(aforo * 0.1);
  const cantidadPreferente = Math.floor(aforo * 0.2);
  const cantidadGeneral = aforo - cantidadVip - cantidadPreferente;

  const asientosVip = Array.from({ length: cantidadVip }, (_, indice) => `A${indice + 1}`);
  const asientosPreferente = Array.from(
    { length: cantidadPreferente },
    (_, indice) => `B${indice + 1}`
  );
  const asientosGeneral = Array.from(
    { length: cantidadGeneral },
    (_, indice) => `D${indice + 1}`
  );

  return (
    <div
      className={`modal fade ${show ? "show d-block" : ""}`}
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-xl modal-dialog-scrollable modal-dialog-centered">
        <div className="modal-content modal-content-custom bg-white">
          <div className="modal-header border-0 pb-0">
            <div>
              <h2 className="modal-title h3 fw-bold text-dark">{evento.nombre}</h2>
              <p className="text-muted mb-0">
                {evento.localizacion || "Teatro Circular"} • {evento.fechaInicio}
              </p>
            </div>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body pt-3">
            <div className="mb-4 text-center">
              <img
                src={obtenerUrlImagen(evento.imagen)}
                alt={evento.nombre}
                className="rounded-3 shadow-sm"
                style={{ maxHeight: "250px", width: "auto", maxWidth: "100%" }}
              />
            </div>

            <h3 className="h5 fw-bold mb-4 text-center text-dark">
              Selector de Asientos (Aforo: {aforo})
            </h3>

            <div className="stage mb-5">ESCENARIO</div>

            <div className="seat-legend mb-4 d-flex justify-content-center gap-4">
              <div className="d-flex align-items-center gap-2">
                <div className="seat available m-0 pointer-none"></div>
                <span className="small">Disponible</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <div className="seat selected m-0 pointer-none"></div>
                <span className="small">Seleccionado</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <div className="seat occupied m-0 pointer-none"></div>
                <span className="small">Ocupado</span>
              </div>
            </div>

            {cantidadVip > 0 && (
              <div className="mb-4 text-center">
                <h4 className="h6 fw-bold mb-3 text-warning">
                  Zona VIP - {(precioBase * 1.5).toFixed(2)}€
                </h4>
                <div
                  className="d-flex justify-content-center flex-wrap gap-1 mx-auto"
                  style={{ maxWidth: "800px" }}
                >
                  {asientosVip.map((idAsiento) => {
                    const estaOcupado = asientosOcupados.includes(idAsiento);
                    const estaSeleccionado = asientosSeleccionados.find(
                      (asiento) => asiento.id === idAsiento
                    );

                    return (
                      <span
                        key={idAsiento}
                        className={`seat ${
                          estaOcupado ? "occupied" : estaSeleccionado ? "selected" : "available"
                        }`}
                        onClick={() =>
                          !estaOcupado && alternarAsiento(idAsiento, precioBase * 1.5, "VIP")
                        }
                      >
                        {idAsiento}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {cantidadPreferente > 0 && (
              <div className="mb-4 text-center">
                <h4 className="h6 fw-bold mb-3 text-info">
                  Zona Preferente - {(precioBase * 1.2).toFixed(2)}€
                </h4>
                <div
                  className="d-flex justify-content-center flex-wrap gap-1 mx-auto"
                  style={{ maxWidth: "800px" }}
                >
                  {asientosPreferente.map((idAsiento) => {
                    const estaOcupado = asientosOcupados.includes(idAsiento);
                    const estaSeleccionado = asientosSeleccionados.find(
                      (asiento) => asiento.id === idAsiento
                    );

                    return (
                      <span
                        key={idAsiento}
                        className={`seat ${
                          estaOcupado ? "occupied" : estaSeleccionado ? "selected" : "available"
                        }`}
                        onClick={() =>
                          !estaOcupado &&
                          alternarAsiento(idAsiento, precioBase * 1.2, "Preferente")
                        }
                      >
                        {idAsiento}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {cantidadGeneral > 0 && (
              <div className="mb-5 text-center">
                <h4 className="h6 fw-bold mb-3 text-success">
                  Zona General - {precioBase.toFixed(2)}€
                </h4>
                <div
                  className="d-flex justify-content-center flex-wrap gap-1 mx-auto"
                  style={{ maxWidth: "800px" }}
                >
                  {asientosGeneral.map((idAsiento) => {
                    const estaOcupado = asientosOcupados.includes(idAsiento);
                    const estaSeleccionado = asientosSeleccionados.find(
                      (asiento) => asiento.id === idAsiento
                    );

                    return (
                      <span
                        key={idAsiento}
                        className={`seat ${
                          estaOcupado ? "occupied" : estaSeleccionado ? "selected" : "available"
                        }`}
                        onClick={() =>
                          !estaOcupado && alternarAsiento(idAsiento, precioBase, "General")
                        }
                      >
                        {idAsiento}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="points-card p-4 border rounded shadow-sm bg-light">
              <h4 className="h5 fw-bold mb-4 text-dark">Resumen de Compra</h4>
              <div className="mb-4">
                <div className="d-flex justify-content-between mb-3">
                  <span className="text-secondary">Asientos seleccionados:</span>
                  <span className="fw-bold text-dark">{asientosSeleccionados.length}</span>
                </div>
                <div className="d-flex justify-content-between mb-3 text-dark">
                  <span className="text-secondary">Recinto:</span>
                  <span className="fw-bold">{evento.localizacion || "Teatro Circular"}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between mb-3">
                  <span className="h4 mb-0">Total:</span>
                  <span className="h4 mb-0 fw-bold text-purple">{precioTotal.toFixed(2)}€</span>
                </div>
                <div className="d-flex justify-content-between text-success smaill">
                  <span>Puntos a ganar:</span>
                  <span className="fw-bold">{puntosAGanar} puntos</span>
                </div>
              </div>
              <div className="row g-2">
                <div className="col-8">
                  <button
                    className="btn btn-primary-custom w-100 py-3 fw-bold rounded-pill"
                    onClick={handleComprar}
                  >
                    Añadir al Carrito
                  </button>
                </div>
                <div className="col-4">
                  <button
                    className="btn btn-outline-secondary w-100 h-100 rounded-pill"
                    onClick={handleClose}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SelectioAsiento;
