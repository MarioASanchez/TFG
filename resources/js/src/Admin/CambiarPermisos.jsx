import { useContext, useEffect } from 'react'
import Header from '../shared/Header'
import Footer from '../shared/Footer'
import { AdminHelperContext } from './Helpers/AdminHelper'

function CambiarPermisos() {
    const { datosUsuarios, obtenerUsuarios, cambiarPermisos } = useContext(AdminHelperContext)

    useEffect(() => {
        obtenerUsuarios();
    }, [])

    return (
        <div className="d-flex flex-column min-vh-100 bg-light">
            <Header />
            <main className="container grow my-5">
                <h2 className="text-center mb-4 fw-bold text-dark">Gestión de Permisos de Usuario</h2>

                <div className="shadow-sm border rounded-3 overflow-hidden bg-white">
                    <table className="table table-hover align-middle m-0">
                        <thead className="text-uppercase small fw-bold" style={{ backgroundColor: '#f3e5f5', color: '#6a1b9a' }}>
                            <tr>
                                <th scope="col" className="ps-4">ID</th>
                                <th scope="col">Nombre de usuario</th>
                                <th scope="col">Estado de Administrador</th>
                                <th scope="col" className="text-end pe-4">Cambiar permisos</th>
                            </tr>
                        </thead>
                        <tbody className="table-group-divider border-top-0">
                            {datosUsuarios.map((elemento) => (
                                <tr key={elemento.id}> 
                                    <td className="ps-4 fw-bold">{elemento.id}</td>
                                    <td className="fw-semibold">{elemento.nombreUsuario}</td>
                                    <td>
                                        {elemento.admin ? (
                                            <span className="badge rounded-pill bg-success-subtle text-success border border-success-subtle px-3 py-2">
                                                <i className="bi bi-shield-check me-1"></i> Es administrador
                                            </span>
                                        ) : (
                                            <span className="badge rounded-pill bg-light text-secondary border px-3 py-2">
                                                <i className="bi bi-person me-1"></i> No es administrador
                                            </span>
                                        )}
                                    </td>
                                    <td className="text-end pe-4">
                                        <button
                                            onClick={() => cambiarPermisos(elemento.id)}
                                            className="btn btn-sm btn-outline-primary rounded-pill shadow-sm fw-semibold"
                                            style={{ borderColor: '#6a1b9a', color: '#6a1b9a' }}
                                        >
                                            <i className="bi bi-arrow-left-right me-1"></i> Cambiar permiso
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
           
            <Footer />
        </div>
    )
}

export default CambiarPermisos