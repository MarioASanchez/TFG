import { createContext, useState, useEffect, useContext } from "react";
import { UsuarioHelperContext } from "../../Usuario/Helpers/UsuarioHelper";
import { mostrarError, mostrarExito } from "./Notificaciones";

export const CarritoContext = createContext();

export const CarritoProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        try {
            const savedCart = localStorage.getItem("carrito");
            return savedCart ? JSON.parse(savedCart) : [];
        } catch (e) {
            console.error("Error al cargar el carrito:", e);
            return [];
        }
    });

    const { usuarios, token } = useContext(UsuarioHelperContext);
    const URL_SPRING = import.meta.env.VITE_API_USERS_URL;

    useEffect(() => {
        localStorage.setItem("carrito", JSON.stringify(cart));
    }, [cart]);

    const addToCart = (event) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item.id === event.id);
            if (existingItem) {
                return prevCart.map((item) =>
                    item.id === event.id ? { ...item, cantidad: item.cantidad + 1 } : item
                );
            }
            return [...prevCart, { ...event, cantidad: 1 }];
        });
    };

    const removeFromCart = (id) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    };

    const updateQuantity = (id, newQuantity) => {
        if (newQuantity < 1) return;
        setCart((prevCart) =>
            prevCart.map((item) =>
                item.id === id ? { ...item, cantidad: newQuantity } : item
            )
        );
    };

    const clearCart = () => {
        setCart([]);
    };

    // Función para finalizar la compra y enviarla al backend de Spring Boot
    const checkout = async () => {
        // Validación de seguridad: el usuario debe estar logueado y tener un ID válido en su sesión
        if (!usuarios || !usuarios.id) {
            console.error("Usuario o ID no encontrado:", usuarios);
            mostrarError("Error: No se ha podido identificar al usuario. Por favor, cierra sesión y vuelve a entrar.");
            return { success: false, error: "Missing user ID" };
        }

        const payload = {
            idUsuario: usuarios.id,
            // Mapeamos los items del carrito al formato que espera el servidor Java
            items: cart.map(item => ({
                idEvento: item.id,
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
            mostrarExito("¡Compra realizada con éxito!");
            return { success: true };
        } catch (error) {
            console.error("Error checkout:", error);
            mostrarError("Error: " + error.message);
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
