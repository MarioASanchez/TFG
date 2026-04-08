import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import { Route, Routes } from "react-router-dom";
// Importaciones de los diferentes Componentes y sus Provider
import Index from "./Index/Index";
import React from "react";
import Perfil from "./Perfil/Perfil";
import { IndexHelperProvider } from "./Index/helpers/IndexHelper";
import Eventos from "./shared/Eventos";
import Login from "./Usuario/Login";
import Register from "./Usuario/Register";
import { UsuarioHelperProvider } from "./Usuario/Helpers/UsuarioHelper";
import { CarritoProvider } from "./shared/Helpers/CarritoHelper";
import AddEvento from "./Admin/AddEvento";
import CambiarPermisos from "./Admin/CambiarPermisos";
import { AdminHelperProvider } from "./Admin/Helpers/AdminHelper";
import RutasProtegidas from "./Admin/RutasProtegidas";

export default function App() {
    return (
        <>
            <IndexHelperProvider>
                <UsuarioHelperProvider>
                    <AdminHelperProvider>
                        <CarritoProvider>
                            <Routes>
                                {/* Rutas públicas */}
                                <Route path="/" element={<Index />} />
                                <Route path="/registro" element={<Register />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/eventos" element={<Eventos />} />
                                {/* Rutas de usuario */}
                                <Route path="/perfil/:id" element={<RutasProtegidas><Perfil /></RutasProtegidas> } />
                                {/* Funciones de Admin */}
                                <Route path="/addEvento" element={<RutasProtegidas adminOnly={true}><AddEvento /></RutasProtegidas>} />
                                <Route path="/permisos" element={<RutasProtegidas adminOnly={true}><CambiarPermisos /></RutasProtegidas>}></Route>
                            </Routes>
                        </CarritoProvider>
                    </AdminHelperProvider>
                </UsuarioHelperProvider>
            </IndexHelperProvider>
        </>
    );
}
