import React, { useContext } from "react";
import { CarritoContext } from "./Helpers/CarritoHelper";
import { obtenerUrlImagen } from "./Helpers/ImagenHelper";

const CarritoLateral = () => {
    const { cart, removeFromCart, updateQuantity, clearCart, checkout } = useContext(CarritoContext);

    const total = cart.reduce((acumulado, item) => acumulado + (item.precio * item.cantidad), 0);

    return (
        <div className="offcanvas offcanvas-end bg-dark text-white" tabIndex="-1" id="offcanvasCarrito" aria-labelledby="offcanvasCarritoLabel">
            <div className="offcanvas-header border-bottom border-secondary">
                <h5 className="offcanvas-title text-purple fw-bold" id="offcanvasCarritoLabel">Tu Carrito</h5>
                <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div className="offcanvas-body">
                {cart.length === 0 ? (
                    <div className="text-center mt-5">
                        <i className="bi bi-cart-x fs-1 text-secondary mb-3 d-block"></i>
                        <p>Tu carrito esta vacio</p>
                        <button className="btn btn-outline-light btn-sm" data-bs-dismiss="offcanvas">Seguir comprando</button>
                    </div>
                ) : (
                    <>
                        {cart.map((item) => (
                            <div key={item.claveCarrito ?? item.id} className="card-dark p-3 mb-3 shadow-sm">
                                <div className="d-flex align-items-center mb-3">
                                    <img
                                        src={obtenerUrlImagen(item.imagen)}
                                        alt={item.nombre}
                                        className="rounded shadow-sm me-3"
                                        style={{ width: "50px", height: "50px", objectFit: "cover" }}
                                    />
                                    <div className="grow min-width-0">
                                        <h6 className="mb-0 text-white text-truncate small fw-bold">{item.nombre}</h6>
                                        {item.tipoEntrada && (
                                            <div className="small text-info fw-semibold">{item.tipoEntrada}</div>
                                        )}
                                        {item.asientos?.length > 0 && (
                                            <div className="small text-secondary text-truncate">
                                                Asientos: {item.asientos.join(", ")}
                                            </div>
                                        )}
                                        <span className="text-purple fw-bold" style={{ fontSize: "0.85rem" }}>
                                            {item.precio}€
                                        </span>
                                    </div>
                                    <button
                                        className="btn btn-sm btn-outline-danger border-0 p-1 ms-2"
                                        onClick={() => removeFromCart(item.claveCarrito ?? item.id)}
                                    >
                                        <i className="bi bi-trash3 fs-6"></i>
                                    </button>
                                </div>
                                <div className="d-flex justify-content-between align-items-center bg-dark bg-opacity-50 p-2 rounded shadow-inner">
                                    <span className="small text-gray-custom" style={{ fontSize: "0.75rem" }}>Cantidad:</span>
                                    {/* Si la entrada tiene asientos concretos, la cantidad queda fijada por esos asientos. */}
                                    {item.asientos?.length > 0 ? (
                                        <span className="fw-bold px-3 small">{item.cantidad}</span>
                                    ) : (
                                        <div className="d-flex align-items-center ms-auto">
                                            <button
                                                className="btn btn-sm btn-link text-white p-0 text-decoration-none bg-white bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center"
                                                style={{ width: "24px", height: "24px" }}
                                                onClick={() => updateQuantity(item.claveCarrito ?? item.id, item.cantidad - 1)}
                                            >
                                                -
                                            </button>
                                            <span className="fw-bold px-3 small">{item.cantidad}</span>
                                            <button
                                                className="btn btn-sm btn-link text-white p-0 text-decoration-none bg-white bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center"
                                                style={{ width: "24px", height: "24px" }}
                                                onClick={() => updateQuantity(item.claveCarrito ?? item.id, item.cantidad + 1)}
                                            >
                                                +
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </div>
            {cart.length > 0 && (
                <div className="offcanvas-footer p-4 border-top border-secondary bg-dark shadow-lg">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <span className="text-gray-custom">Total a pagar:</span>
                        <span className="fs-3 fw-bold text-purple">{total.toFixed(2)}€</span>
                    </div>
                    <button className="btn btn-primary-custom w-100 py-3 fw-bold mb-3 shadow-sm rounded-pill" onClick={checkout}>
                        Finalizar Compra
                    </button>
                    <button className="btn btn-outline-secondary btn-sm w-100 border-0 text-gray-custom" onClick={clearCart}>
                        <i className="bi bi-x-lg me-2"></i>Vaciar Carrito
                    </button>
                </div>
            )}
        </div>
    );
};

export default CarritoLateral;
