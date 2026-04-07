import { createContext, useState, useEffect, useContext } from "react";
import { UsuarioHelperContext } from "../../Usuario/Helpers/UsuarioHelper";

export const CarritoContext = createContext();

export const CarritoProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        try {
            const carritoGuardado = localStorage.getItem("carrito");
            return carritoGuardado ? JSON.parse(carritoGuardado) : [];
        } catch (error) {
            console.error("Error al cargar el carrito:", error);
            return [];
        }
    });

    const { usuarios, token } = useContext(UsuarioHelperContext);
    const URL_SPRING = import.meta.env.VITE_API_USERS_URL;

    useEffect(() => {
        localStorage.setItem("carrito", JSON.stringify(cart));
    }, [cart]);

    const addToCart = (evento) => {
        setCart((carritoAnterior) => {
            // Esta clave separa variantes del mismo evento, por ejemplo "general" y "vip".
            const claveCarrito = evento.claveCarrito ?? evento.id;
            const entradaExistente = carritoAnterior.find(
                (item) => (item.claveCarrito ?? item.id) === claveCarrito
            );

            if (entradaExistente) {
                return carritoAnterior.map((item) => {
                    const claveActual = item.claveCarrito ?? item.id;
                    if (claveActual !== claveCarrito) {
                        return item;
                    }

                    const asientosActuales = item.asientos ?? [];
                    const asientosNuevos = evento.asientos ?? [];

                    return {
                        ...item,
                        ...evento,
                        // Si ya existe la misma linea, acumulamos cantidad y fusionamos asientos.
                        cantidad: (item.cantidad ?? 0) + (evento.cantidad ?? 1),
                        asientos: Array.from(new Set([...asientosActuales, ...asientosNuevos]))
                    };
                });
            }

            return [
                ...carritoAnterior,
                {
                    ...evento,
                    claveCarrito,
                    cantidad: evento.cantidad ?? 1
                }
            ];
        });
    };

    const removeFromCart = (id) => {
        setCart((carritoAnterior) =>
            carritoAnterior.filter((item) => (item.claveCarrito ?? item.id) !== id)
        );
    };

    const updateQuantity = (id, newQuantity) => {
        if (newQuantity < 1) return;
        setCart((carritoAnterior) => {
            const entrada = carritoAnterior.find((item) => (item.claveCarrito ?? item.id) === id);

            // Las entradas con asiento no deben modificar cantidad con +/- porque perderian coherencia.
            if (entrada?.asientos?.length > 0) {
                return carritoAnterior;
            }

            return carritoAnterior.map((item) =>
                (item.claveCarrito ?? item.id) === id ? { ...item, cantidad: newQuantity } : item
            );
        });
    };

    const clearCart = () => {
        setCart([]);
    };

    // Función para finalizar la compra y enviarla al backend de Spring Boot
    const checkout = async () => {
        // Validación de seguridad: el usuario debe estar logueado y tener un ID válido en su sesión
        if (!usuarios || !usuarios.id) {
            console.error("Usuario o ID no encontrado:", usuarios);
            alert("Error: No se ha podido identificar al usuario. Por favor, cierra sesión y vuelve a entrar.");
            return { success: false, error: "Missing user ID" };
        }

        const payload = {
            idUsuario: usuarios.id,
            // Enviamos el id real del evento aunque en el carrito usemos una clave compuesta.
            items: cart.map(item => ({
                idEvento: item.idEvento ?? item.id,
                precio: item.precio,
                cantidad: item.cantidad,
                // Si el item tiene asientos (vienen del modal), los enviamos como texto JSON
                asientos: item.asientos ? JSON.stringify(item.asientos) : null
            }))
        };

        try {
            const response = await fetch(`${URL_SPRING}/api/compras`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` // Enviamos el JWT para autorizar la compra
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Error al procesar la compra");
            }

            clearCart();
            alert("¡Compra realizada con éxito!");
            return { success: true };
        } catch (error) {
            console.error("Error checkout:", error);
            alert("Error: " + error.message);
            return { success: false, error: error.message };
        }
    };

    return (
        <CarritoContext.Provider
            value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, checkout }}
        >
            {children}
        </CarritoContext.Provider>
    );
};
