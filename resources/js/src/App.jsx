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
import AddEvento from "./Usuario/AddEvento";

export default function App() {
    return (
        <>
            <IndexHelperProvider>
                <UsuarioHelperProvider>
                    <CarritoProvider>
                        <Routes>
                            <Route path="/" element={<Index />} />
                            <Route path="/perfil/:id" element={<Perfil />} />
                            <Route path="/registro" element={<Register />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/eventos" element={<Eventos />} />
                            {/* Funciones de Admin */}
                            <Route path="/addEvento" element={<AddEvento />} />
                        </Routes>
                    </CarritoProvider>
                </UsuarioHelperProvider>
            </IndexHelperProvider>
        </>
    );
}
