import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";

import React, { useContext, useState } from 'react';
import Header from "../shared/Header";
import Footer from "../shared/Footer";
import { UsuarioHelperContext } from "./Helpers/UsuarioHelper";
import { useNavigate } from "react-router-dom";

function AddEvento() {
    const { addEvento } = useContext(UsuarioHelperContext)
    const navigate = useNavigate();

    async function procesa(ev) { 
        ev.preventDefault();
        // Objeto Evento (Tabla eventos)

        const imagenFile = ev.target.imagen.files[0]

        // Crear objeto FormData, ya que permite recoger la imagen
        const formData = new FormData();

        // En vez de crear los objetos por separado, se añaden al FormData y se procesa con Laravel
        formData.append('nombre', ev.target.nombre.value);
        formData.append('fechaInicio', ev.target.fechaInicio.value);
        formData.append('fechaFin', ev.target.fechaFin.value);
        formData.append('aforo', ev.target.aforo.value);
        formData.append('localizacion', ev.target.localizacion.value);
        formData.append('descripcion', ev.target.descripcion.value);
        formData.append('precio', ev.target.precio.value);
        formData.append('imagen', imagenFile);

        // Enviar petición a Laravel
        try{
            await addEvento(formData);
            alert("Evento añadido con éxito")
            navigate("/")
            ev.target.reset();
        }catch (error){
            console.error("Error al guardar")
            alert(error.message || "No se ha podido guardar el evento")
        }
    }

    return (
        <>
            <Header />
            <div className="container mb-5">
                <h2 className="mt-4">Hola Admin, añade un nuevo evento</h2>
                <form onSubmit={procesa}>
                    <div className="form-group">
                        <label>Nombre del evento</label><br />
                        <input type="text" name="nombre" className="form-control" required/><br />
                    </div>
                    <div className="form-group">
                        <label>Fecha de inicio del evento</label><br />
                        <input type="date" name="fechaInicio" className="form-control" required/><br />
                    </div>
                    <div className="form-group">
                        <label>Fecha de finalización del evento</label><br />
                        <input type="date" name="fechaFin" className="form-control" required/><br />
                    </div>
                    <div className="form-group">
                        <label>Aforo aproximado</label><br />
                        <input type="number" name="aforo" className="form-control" required/><br /> 
                    </div>
                    <div className="form-group">
                        <label>Precio</label>
                        <input type="number" name="precio"  className="form-control" required/><br />
                    </div>
                    <div className="form-group">
                        <label>Localización</label><br />
                        <input type="text" name="localizacion" className="form-control" required/><br />   
                    </div>
                    <div className="form-group">
                        <label>Descripción</label><br />
                        <textarea name="descripcion" placeholder="Escribe aquí la descripción del evento" className="form-control" required/> <br />    
                    </div>
                    <div className="form-group">
                        <label>Sube la imagen destacada del evento</label>
                        <input type="file" name="imagen" accept="image/*" className="form-control" required />  <br />       
                    </div>  

                    <input type="submit" value="Añadir evento" className="btn btn-primary" />
                </form>

            </div>





            <Footer />
        </>
    )
}

export default AddEvento