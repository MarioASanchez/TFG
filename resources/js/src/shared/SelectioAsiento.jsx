import React, { useState, useContext } from "react";
import { CarritoContext } from "./Helpers/CarritoHelper";

function SelectioAsiento({ show, handleClose, evento }) {
  const { addToCart } = useContext(CarritoContext);
  // Estado para los asientos que el usuario está seleccionando actualmente
  const [selectedSeats, setSelectedSeats] = React.useState([]);
  // Estado para los asientos que ya están vendidos (vienen de la base de datos)
  const [occupiedSeats, setOccupiedSeats] = React.useState([]);

  // Cada vez que se abre el modal, reseteamos la selección y buscamos los asientos ocupados
  React.useEffect(() => {
    if (show && evento) {
      setSelectedSeats([]);
      // Llamada al backend de Spring Boot para obtener la lista de asientos vendidos para este evento
      fetch(`${import.meta.env.VITE_API_USERS_URL}/api/compras/evento/${evento.id}`)
        .then(res => res.json())
        .then(data => setOccupiedSeats(data))
        .catch(err => console.error("Error al cargar asientos ocupados:", err));
    }
  }, [show, evento]);

  if (!show || !evento) return null;

  // Forzamos que el precio sea un número para evitar errores de suma
  const basePrice = Number(evento.precio) || 0;

  // Función para marcar/desmarcar un asiento (si no está ya ocupado)
  const toggleSeat = (seatId, price) => {
    if (occupiedSeats.includes(seatId)) return; // No permitir tocar asientos ocupados
    setSelectedSeats(prev => {
      const isSelected = prev.find(s => s.id === seatId);
      if (isSelected) {
        return prev.filter(s => s.id !== seatId); // Deseleccionar
      } else {
        return [...prev, { id: seatId, precio: Number(price) }]; // Seleccionar
      }
    });
  };

  const totalPrice = selectedSeats.reduce((acc, seat) => acc + Number(seat.precio), 0);
  const pointsToEarn = Math.floor(totalPrice * 0.1);

  const handleComprar = () => {
    if (selectedSeats.length === 0) {
      alert("Por favor, selecciona al menos un asiento.");
      return;
    }
    
    // Creamos un objeto de "evento personalizado" que incluye los asientos elegidos
    const customEvento = {
        ...evento,
        // Generamos un ID único temporal para el carrito (evita duplicados si se compra el mismo evento dos veces)
        id: `${evento.id}-seats-${Date.now()}`,
        nombre: `${evento.nombre} (${selectedSeats.length} entradas)`,
        precio: totalPrice,
        asientos: selectedSeats.map(s => s.id) // Guardamos la lista de IDs de asientos (ej. A1, A2)
    };
    
    addToCart(customEvento); // Lo añadimos al carrito helper
    setSelectedSeats([]);
    handleClose();
  };

  const aforo = evento.aforo || 30;
  const vipCount = Math.floor(aforo * 0.1);
  const prefCount = Math.floor(aforo * 0.2);
  const genCount = aforo - vipCount - prefCount;

  const vipSeats = Array.from({ length: vipCount }, (_, i) => `A${i + 1}`);
  const prefSeats = Array.from({ length: prefCount }, (_, i) => `B${i + 1}`);
  const genSeats = Array.from({ length: genCount }, (_, i) => `D${i + 1}`);

  return (
    <div className={`modal fade ${show ? 'show d-block' : ''}`} tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-xl modal-dialog-scrollable modal-dialog-centered">
        <div className="modal-content modal-content-custom bg-white">
          <div className="modal-header border-0 pb-0">
            <div>
              <h2 className="modal-title h3 fw-bold text-dark">{evento.nombre}</h2>
              <p className="text-muted mb-0">
                {evento.localizacion || 'Teatro Circular'} • {evento.fechaInicio}
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
                src={evento.imagen.startsWith('http') ? evento.imagen : `/storage/${evento.imagen}`}
                alt={evento.nombre}
                className="rounded-3 shadow-sm"
                style={{ maxHeight: "250px", width: 'auto', maxWidth: '100%' }}
              />
            </div>

            <h3 className="h5 fw-bold mb-4 text-center text-dark">Selector de Asientos (Aforo: {aforo})</h3>
            
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

            {/* Zona VIP */}
            {vipCount > 0 && (
              <div className="mb-4 text-center">
                <h4 className="h6 fw-bold mb-3 text-warning">Zona VIP - {(basePrice * 1.5).toFixed(2)}€</h4>
                <div className="d-flex justify-content-center flex-wrap gap-1 mx-auto" style={{maxWidth: '800px'}}>
                  {vipSeats.map(id => {
                      const isOccupied = occupiedSeats.includes(id);
                      return (
                        <span 
                            key={id} 
                            className={`seat ${isOccupied ? 'occupied' : selectedSeats.find(s => s.id === id) ? 'selected' : 'available'}`}
                            onClick={() => !isOccupied && toggleSeat(id, basePrice * 1.5)}
                        >{id}</span>
                      );
                  })}
                </div>
              </div>
            )}

            {/* Zona Preferente */}
            {prefCount > 0 && (
              <div className="mb-4 text-center">
                <h4 className="h6 fw-bold mb-3 text-info">Zona Preferente - {(basePrice * 1.2).toFixed(2)}€</h4>
                <div className="d-flex justify-content-center flex-wrap gap-1 mx-auto" style={{maxWidth: '800px'}}>
                  {prefSeats.map(id => {
                      const isOccupied = occupiedSeats.includes(id);
                      return (
                        <span 
                            key={id} 
                            className={`seat ${isOccupied ? 'occupied' : selectedSeats.find(s => s.id === id) ? 'selected' : 'available'}`}
                            onClick={() => !isOccupied && toggleSeat(id, basePrice * 1.2)}
                        >{id}</span>
                      );
                  })}
                </div>
              </div>
            )}

            {/* Zona General */}
            {genCount > 0 && (
              <div className="mb-5 text-center">
                <h4 className="h6 fw-bold mb-3 text-success">Zona General - {basePrice.toFixed(2)}€</h4>
                <div className="d-flex justify-content-center flex-wrap gap-1 mx-auto" style={{maxWidth: '800px'}}>
                  {genSeats.map(id => {
                      const isOccupied = occupiedSeats.includes(id);
                      return (
                        <span 
                            key={id} 
                            className={`seat ${isOccupied ? 'occupied' : selectedSeats.find(s => s.id === id) ? 'selected' : 'available'}`}
                            onClick={() => !isOccupied && toggleSeat(id, basePrice)}
                        >{id}</span>
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
                  <span className="fw-bold text-dark">{selectedSeats.length}</span>
                </div>
                <div className="d-flex justify-content-between mb-3 text-dark">
                  <span className="text-secondary">Recinto:</span>
                  <span className="fw-bold">{evento.localizacion || 'Teatro Circular'}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between mb-3">
                  <span className="h4 mb-0">Total:</span>
                  <span className="h4 mb-0 fw-bold text-purple">{totalPrice.toFixed(2)}€</span>
                </div>
                <div className="d-flex justify-content-between text-success smaill">
                  <span>Puntos a ganar:</span>
                  <span className="fw-bold">{pointsToEarn} puntos</span>
                </div>
              </div>
              <div className="row g-2">
                <div className="col-8">
                    <button className="btn btn-primary-custom w-100 py-3 fw-bold rounded-pill" onClick={handleComprar}>
                        Añadir al Carrito
                    </button>
                </div>
                <div className="col-4">
                    <button className="btn btn-outline-secondary w-100 h-100 rounded-pill" onClick={handleClose}>
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
