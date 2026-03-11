import Header from "./Header";
import Footer from "./Footer";
import React from "react";
function SelectioAsiento() {
  return (
    <>
      <Header/>
      {/*  Modal de Evento con Selector de Asientos */}
      <div className="entradas" id="eventModal" tabIndex="">
      <div className="modal-dialog modal-xl modal-dialog-scrollable">
        <div className="modal-content modal-content-custom text-white">
          <div className="modal-header border-0">
            <div>
              <h2 className="modal-title h3 fw-bold text-dark">Stand Up Comedy Night</h2>
              <p className="text-gray-custom mb-0 text-dark">
                Teatro Circular • 10 Enero 2025 • 20:30h
              </p>
            </div>
            <button
              type="button"
              className="btn-close btn-close-white"
              data-bs-dismiss="modal"
            ></button>
          </div>
          <div className="modal-body">
            <div className="mb-4">
              <img
                src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800"
                alt="Stand Up Comedy"
                className="w-100 rounded-3"
                // style={{height: "300px" , object-fit: "cover"}}
              />
            </div>

            <h3 className="h4 fw-bold mb-4 text-dark">Selector de Asientos</h3>
            {/* Escenario */}
            <div className="stage mb-4">ESCENARIO</div>
            {/* Leyenda */}

            <div className="seat-legend">
              <div className="seat-legend-item">
                <div
                  className="seat-legend-box"
                  style={{ backgroundColor: " #22c55e" }}
                ></div>
                <span>Disponible</span>
              </div>
              <div className="seat-legend-item">
                <div
                  className="seat-legend-box"
                  style={{ backgroundColor: "#a855f7" }}
                ></div>
                <span>Seleccionado</span>
              </div>
              <div className="seat-legend-item">
                <div
                  className="seat-legend-box"
                  style={{ backgroundColor: "#64748b" }}
                ></div>
                <span>Ocupado</span>
              </div>
            </div>
            {/* Zona VIP */}
            <div className="mb-4">
              <h4 className="h6 fw-bold mb-3 text-warning">Zona VIP - 35€</h4>
              <div className="text-center">
                <div className="d-inline-block"></div>
              </div>
            </div>
            {/* Zona  Preferentes */}
            <div className="mb-4">
              <h4 className="h6 fw-bold mb-3 text-info">
                Zona Preferente - 25€
              </h4>
              <div className="text-center">
                <div className="mb-1">
                  <span className="seat available" onclick="toggleSeat(this)">
                    B1
                  </span>
                  <span className="seat available" onclick="toggleSeat(this)">
                    B2
                  </span>
                  <span className="seat available" onclick="toggleSeat(this)">
                    B3
                  </span>
                  <span className="seat occupied">B4</span>
                  <span className="seat occupied">B5</span>
                  <span className="seat available" onclick="toggleSeat(this)">
                    B6
                  </span>
                  <span className="seat available" onclick="toggleSeat(this)">
                    B7
                  </span>
                  <span className="seat available" onclick="toggleSeat(this)">
                    B8
                  </span>
                  <span className="seat available" onclick="toggleSeat(this)">
                    B9
                  </span>
                  <span className="seat available" onclick="toggleSeat(this)">
                    B10
                  </span>
                </div>
                <div>
                  <span className="seat available" onclick="toggleSeat(this)">
                    C1
                  </span>
                  <span className="seat available" onclick="toggleSeat(this)">
                    C2
                  </span>
                  <span className="seat occupied">C3</span>
                  <span className="seat available" onclick="toggleSeat(this)">
                    C4
                  </span>
                  <span className="seat available" onclick="toggleSeat(this)">
                    C5
                  </span>
                  <span className="seat available" onclick="toggleSeat(this)">
                    C6
                  </span>
                  <span className="seat occupied">C7</span>
                  <span className="seat available" onclick="toggleSeat(this)">
                    C8
                  </span>
                  <span className="seat available" onclick="toggleSeat(this)">
                    C9
                  </span>
                  <span className="seat available" onclick="toggleSeat(this)">
                    C10
                  </span>
                </div>
              </div>
            </div>
            {/* Zona general */}
            <div className="mb-4">
              <h4 className="h6 fw-bold mb-3 text-success">
                Zona General - 20€
              </h4>
              <div className="text-center">
                <div className="mb-1">
                  <span className="seat available" onclick="toggleSeat(this)">
                    D1
                  </span>
                  <span className="seat available" onclick="toggleSeat(this)">
                    D2
                  </span>
                  <span className="seat available" onclick="toggleSeat(this)">
                    D3
                  </span>
                  <span className="seat available" onclick="toggleSeat(this)">
                    D4
                  </span>
                  <span className="seat occupied">D5</span>
                  <span className="seat available" onclick="toggleSeat(this)">
                    D6
                  </span>
                  <span className="seat available" onclick="toggleSeat(this)">
                    D7
                  </span>
                  <span className="seat available" onclick="toggleSeat(this)">
                    D8
                  </span>
                  <span className="seat available" onclick="toggleSeat(this)">
                    D9
                  </span>
                  <span className="seat available" onclick="toggleSeat(this)">
                    D10
                  </span>
                  <span className="seat available" onclick="toggleSeat(this)">
                    D11
                  </span>
                  <span className="seat available" onclick="toggleSeat(this)">
                    D12
                  </span>
                </div>
                <div>
                  <span className="seat available" onclick="toggleSeat(this)">
                    E1
                  </span>
                  <span className="seat available" onclick="toggleSeat(this)">
                    E2
                  </span>
                  <span className="seat available" onclick="toggleSeat(this)">
                    E3
                  </span>
                  <span className="seat available" onclick="toggleSeat(this)">
                    E4
                  </span>
                  <span className="seat available" onclick="toggleSeat(this)">
                    E5
                  </span>
                  <span className="seat available" onclick="toggleSeat(this)">
                    E6
                  </span>
                  <span className="seat available" onclick="toggleSeat(this)">
                    E7
                  </span>
                  <span className="seat available" onclick="toggleSeat(this)">
                    E8
                  </span>
                  <span className="seat occupied">E9</span>
                  <span className="seat available" onclick="toggleSeat(this)">
                    E10
                  </span>
                  <span className="seat available" onclick="toggleSeat(this)">
                    E11
                  </span>
                  <span className="seat available" onclick="toggleSeat(this)">
                    E12
                  </span>
                </div>
              </div>
            </div>

            <div className="points-card p-4">
              <h4 className="h5 fw-bold mb-4">Resumen de Compra</h4>
              <div className="mb-4">
                <div className="d-flex justify-content-between mb-3">
                  <span className="text-gray-custom">
                    Asientos seleccionados:
                  </span>
                  <span id="selectedSeatsCount" className="fw-bold">
                    0
                  </span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span className="text-gray-custom">Total:</span>
                  <span id="totalPrice" className="fs-3 fw-bold text-purple">
                    0€
                  </span>
                </div>
                <div className="d-flex justify-content-between text-success">
                  <span>Puntos a ganar:</span>
                  <span id="pointsToEarn" className="fw-bold">
                    0 puntos
                  </span>
                </div>
              </div>
              <button className="btn btn-primary-custom w-100 py-3 fs-5 fw-bold">
                Comprar Entradas
              </button>
            </div>
          </div>
        </div>
      </div>
     
      </div>
       <Footer/>
    </>
  );
}

export default SelectioAsiento;
