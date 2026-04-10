import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";

import React, { useContext } from 'react';
import React, { useContext } from 'react';
import Header from "../shared/Header";
import Footer from "../shared/Footer";
import { UsuarioHelperContext } from "../Usuario/Helpers/UsuarioHelper";
import { AdminHelperContext } from "./Helpers/AdminHelper";
import { mostrarError, mostrarExito } from "../shared/Helpers/Notificaciones";

function AddEvento() {
    const { usuarios } = useContext(UsuarioHelperContext)
    const { addEvento } = useContext(AdminHelperContext)

    async function procesa(ev) {
    async function procesa(ev) {
        ev.preventDefault();

        const imagenFile = ev.target.imagen.files[0]
        const formData = new FormData();

        formData.append('nombre', ev.target.nombre.value);
        formData.append('fechaInicio', ev.target.fechaInicio.value);
        formData.append('fechaFin', ev.target.fechaFin.value);
        formData.append('aforo', ev.target.aforo.value);
        formData.append('localizacion', ev.target.localizacion.value);
        formData.append('descripcion', ev.target.descripcion.value);
        formData.append('precio', ev.target.precio.value);
        formData.append('imagen', imagenFile);

        const etiquetasString = ev.target.etiqueta.value;
        const etiquetasArray = etiquetasString.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)

        etiquetasArray.forEach(tag => {
            formData.append('etiquetas[]', tag);
        });

        try {
        try {
            await addEvento(formData);
            mostrarExito("Evento añadido con éxito")
            ev.target.reset();
        } catch (error) {
        } catch (error) {
            console.error(error.message)
            mostrarError("No se ha podido guardar el evento")
            mostrarError("No se ha podido guardar el evento")
        }
    }

    return (
        <>
            <Header />
            <div className="container mb-5">
                <h2 className="mt-4">Hola {usuarios.nombre}, anade un nuevo evento</h2>
                <form onSubmit={procesa}>
                    <div className="form-group">
                        <label>Nombre del evento</label><br />
                        <input type="text" name="nombre" className="form-control" required /><br />
                        <input type="text" name="nombre" className="form-control" required /><br />
                    </div>
                    <div className="form-group">
                        <label>Fecha de inicio del evento</label><br />
                        <input type="date" name="fechaInicio" className="form-control" required /><br />
                        <input type="date" name="fechaInicio" className="form-control" required /><br />
                    </div>
                    <div className="form-group">
                        <label>Fecha de finalización del evento</label><br />
                        <input type="date" name="fechaFin" className="form-control" required /><br />
                    </div>
                    <div className="form-group">
                        <label>Aforo aproximado</label><br />
                        <input type="number" name="aforo" className="form-control" required /><br />
                        <input type="number" name="aforo" className="form-control" required /><br />
                    </div>
                    <div className="form-group">
                        <label>Precio</label>
                        <input type="number" name="precio" className="form-control" required /><br />
                        <input type="number" name="precio" className="form-control" required /><br />
                    </div>
                    <div className="form-group">
                        <label>Localización</label><br />
                        <input type="text" name="localizacion" className="form-control" required /><br />
                    </div>
                    <div className="form-group">
                        <label>Descripción</label><br />
                        <textarea name="descripcion" placeholder="Escribe aqui la descripcion del evento" className="form-control" required /> <br />
                    </div>
                    <div className="form-group">
                        <label>Etiquetas (añádelas separadas por comas ",")</label>
                        <input type="text" name="etiqueta" className="form-control" required placeholder="Deportes, Musica, Rock, Casual" /> <br />
                    </div>
                    <div className="form-group">
                        <label>Sube la imagen destacada del evento</label>
                        <input type="file" name="imagen" accept="image/*" className="form-control" required /> <br />
                    </div>

                    <input type="submit" value="Anadir evento" className="btn btn-primary" />
                </form>
            </div>

            <Footer />
        </>
    )
}

export default AddEvento
