import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

export const UsuarioHelperContext = createContext();

export const UsuarioHelperProvider = ({ children }) => {
    const [usuarios, setUsuarios] = useState(() => {
        const usuarioGuardado = localStorage.getItem("usuario");
        return usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
    });

    const [token, setToken] = useState(localStorage.getItem("token"));

    const navigate = useNavigate();
    const URL_SPRING = import.meta.env.VITE_API_USERS_URL;

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

    return (
        <UsuarioHelperContext.Provider
            value={{ usuarios, setUsuarios, login, logout, register }}
        >
            {children}
        </UsuarioHelperContext.Provider>
    );
};
