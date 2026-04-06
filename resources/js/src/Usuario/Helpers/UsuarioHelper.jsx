import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

export const UsuarioHelperContext = createContext();

export const UsuarioHelperProvider = ({ children }) => {
    const [usuarios, setUsuarios] = useState(() => {
        try {
            const usuarioGuardado = localStorage.getItem("usuario");
            return usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
        } catch (e) {
            console.error("Error al cargar el usuario:", e);
            return null;
        }
    });

    const [token, setToken] = useState(localStorage.getItem("token"));

    const navigate = useNavigate();
    const URL_SPRING = import.meta.env.VITE_API_USERS_URL;
    const URL_LARAVEL = import.meta.env.VITE_API_EVENTS_URL;

    const login = async (obj) => {
        try {
            const response = await fetch(
                `${URL_SPRING}/login`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: obj.email,
                        password: obj.password
                    })
                }
            );

            if (!response.ok) throw new Error("Credenciales incorrectas");

            const data = await response.json();

            setUsuarios(data.usuario);
            setToken(data.token);

            localStorage.setItem("token", data.token);
            localStorage.setItem("usuario", JSON.stringify(data.usuario));

            return { success: true };

        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            return { success: false, error: error.message };
        }
    };

    const register = async (obj) => {
        try {
            await fetch(`${URL_SPRING}/registro`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nombreUsuario: obj.nombreUsuario,
                    nombre: obj.nombre,
                    apellidos: obj.apellidos,
                    password: obj.password,
                    email: obj.email,
                    direccion: obj.direccion,
                    admin: false,
                    puntosAcumulados: 0
                }),
            });

            navigate("/login");
        } catch (error) {
            console.error("Error al registrar", error);
            return { success: false, error: error.message };
        }
    };

    const logout = () => {
        setUsuarios(null);
        setToken(null);
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        alert("Has cerrado sesión. ¡Nos vemos pronto!")
        navigate("/")
    };

    const cambiarDatos = async () => {
        try {

        } catch (error) {
            console.error("Error al modificar tus datos", error);
            return { success: false, error: error.message };
        }
    }

const eliminarCuenta = async (idUsuario) => {
    try {
        const response = await fetch(`${URL_SPRING}/eliminarCuenta/${idUsuario}`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json'   
            }
        });

        if (response.ok) {
            logout(); // Usamos tu función de logout que ya limpia todo
            alert("Has borrado tu cuenta");
        } else if (response.status === 401) {
            // ¡AQUÍ CAZAMOS EL ERROR! Si da 401, el token caducó o es inválido.
            alert("Tu sesión ha caducado por seguridad. Vuelve a iniciar sesión.");
            logout(); // Expulsamos al usuario para que renueve el token
        } else {
            console.error("No se ha podido borrar");
        }
    } catch (error) {
        console.error("Error al eliminar tu cuenta", error);
    }
}

    return (
        <UsuarioHelperContext.Provider
            value={{ usuarios, setUsuarios, token, login, logout, register, cambiarDatos, eliminarCuenta }}
        >
            {children}
        </UsuarioHelperContext.Provider>
    );
};
