import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AdminHelperContext = createContext();

export const AdminHelperProvider = ({ children }) => {
    const [datosUsuarios, setDatosUsuarios] = useState([]);
    const [token, setToken] = useState(localStorage.getItem("token"));

    const navigate = useNavigate();
    const URL_SPRING = import.meta.env.VITE_API_USERS_URL;
    const URL_LARAVEL = import.meta.env.VITE_API_EVENTS_URL;


    const addEvento = async (formData) => {
        try {
            const response = await fetch(`${URL_LARAVEL}/addEvento`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw data;
            }

            return data;
        } catch (error) {
            console.log(error);
        }

    }

    const obtenerUsuarios = async () => {
        try {
            const response = await fetch(`${URL_SPRING}/permisos`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Error server: ${response.status}`);
            }

            const data = await response.json();
            setDatosUsuarios(data);
            console.log(data)

        } catch (error) {
            console.error("Error en la petición:", error);
        }
    };

    const cambiarPermisos = async (id) => {
        try {
            // Al usar @RequestParam en Spring, el ID va en la URL después del '?'
            const response = await fetch(`${URL_SPRING}/permisos?id=${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error("No se pudo actualizar el rango del usuario");
            }

            const usuarioActualizado = await response.json();

            setDatosUsuarios((prevUsuarios) =>
                prevUsuarios.map((u) => (u.id === id ? usuarioActualizado : u))
            );

            console.log("Usuario actualizado con éxito:", usuarioActualizado);

        } catch (error) {
            console.error("Error al cambiar permisos:", error);
        }
    };

    return (
        <AdminHelperContext.Provider value={{ datosUsuarios, token, addEvento, obtenerUsuarios, cambiarPermisos }}>
            {children}
        </AdminHelperContext.Provider>
    )
}


