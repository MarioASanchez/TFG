import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { mostrarError, mostrarExito, mostrarAdios } from "../../shared/Helpers/Notificaciones";


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
                });

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
            mostrarExito(`Has creado un nuevo usuario ${obj.nombre}`)
            navigate("/login");
        } catch (error) {
            mostrarError("Error al intentar registrarte, prueba otra vez")
            return { success: false, error: error.message };
        }
    };

    const logout = () => {
        setUsuarios(null);
        setToken(null);
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        mostrarAdios();
        navigate("/")
    };

    const cambiarDatos = async (obj) => {
        try {
            const response = await fetch(`${URL_SPRING}/cambiarDatos/${obj.id}`, {
                method: "PATCH",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nombreUsuario: obj.nuevoUsername,
                    nombre: obj.nuevoNombre,
                    apellidos: obj.nuevoApellido

                })
            });
            
            mostrarExito("Datos cambiados con éxito")

        } catch (error) {
            mostrarError("Ese nombre de usuario ya está escogido...")
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
                logout();
                mostrarAdios();
            } else if (response.status === 401) {
                mostrarError("Tu sesión ha caducado. Prueba otra vez");
                logout();
            } else {
                console.error("No se ha podido borrar");
            }
        } catch (error) {
            console.error("Error al eliminar tu cuenta", error);
        }
    }

    const guardarPreferencias = async (idUsuario, idsEtiquetas) => {
        const payload = {
            idUsuario: idUsuario,
            idsEtiquetas: idsEtiquetas
        };
        console.log("Enviando a Spring:", JSON.stringify(payload));
        const response = await fetch(`${URL_SPRING}/preferencias`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorMsg = await response.text();
            throw new Error(errorMsg || "Hubo un problema al guardar las etiquetas en el servidor");
        }
   
        return await response.text();
    };

    return (
        <UsuarioHelperContext.Provider
            value={{ usuarios, setUsuarios, token, login, logout, register, cambiarDatos, eliminarCuenta, guardarPreferencias }}
        >
            {children}
        </UsuarioHelperContext.Provider>
    );
};
