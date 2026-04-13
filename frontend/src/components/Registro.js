// ==========================================
// COMPONENTE: Registro.js
// Propósito: CRUD de Usuarios (Crear, Leer, Eliminar)
// ==========================================

import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const Registro = () => {
    const [usuario, setUsuario] = useState({ nombre: '', email: '', password: '' });
    const [listaUsuarios, setListaUsuarios] = useState([]);

    // Cargar la lista al entrar
    useEffect(() => { obtenerUsuarios(); }, []);

    const obtenerUsuarios = async () => {
        try {
            const res = await fetch('http://localhost:4000/api/usuarios');
            const data = await res.json();
            setListaUsuarios(data);
        } catch (error) { console.error("Error al listar", error); }
    };

    const handleChange = (e) => {
        setUsuario({ ...usuario, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:4000/api/usuarios', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(usuario)
            });
            if (res.ok) {
                Swal.fire('¡Éxito!', 'Usuario registrado correctamente', 'success');
                setUsuario({ nombre: '', email: '', password: '' });
                obtenerUsuarios(); // Actualiza la tabla automáticamente
            }
        } catch (error) { Swal.fire('Error', 'No se pudo conectar al backend', 'error'); }
    };

    const eliminarUser = async (id) => {
        const confirmar = await Swal.fire({
            title: '¿Eliminar usuario?',
            text: "Se borrará de MongoDB permanentemente",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            confirmButtonColor: '#d33'
        });

        if (confirmar.isConfirmed) {
            try {
                await fetch(`http://localhost:4000/api/usuarios/${id}`, { method: 'DELETE' });
                Swal.fire('Eliminado', 'Registro borrado', 'success');
                obtenerUsuarios();
            } catch (error) { Swal.fire('Error', 'No se pudo eliminar', 'error'); }
        }
    };

    return (
        <div className="container mt-5" style={{ minHeight: '70vh' }}>
            <div className="row g-4">
                {/* FORMULARIO */}
                <div className="col-md-4">
                    <div className="card shadow border-0 p-4 rounded-4">
                        <h3 className="text-center mb-4" style={{color: '#4a148c'}}>Registro</h3>
                        <form onSubmit={handleSubmit}>
                            <input type="text" name="nombre" className="form-control mb-3" placeholder="Nombre" value={usuario.nombre} onChange={handleChange} required />
                            <input type="email" name="email" className="form-control mb-3" placeholder="Email" value={usuario.email} onChange={handleChange} required />
                            <input type="password" name="password" className="form-control mb-3" placeholder="Contraseña" value={usuario.password} onChange={handleChange} required />
                            <button type="submit" className="btn btn-lg w-100 text-white" style={{backgroundColor: '#6a1b9a'}}>Guardar</button>
                        </form>
                    </div>
                </div>

                {/* TABLA DE GESTIÓN */}
                <div className="col-md-8">
                    <div className="card shadow border-0 p-4 rounded-4">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h3 style={{color: '#4a148c'}}>Usuarios en DB</h3>
                            <button onClick={obtenerUsuarios} className="btn btn-outline-primary btn-sm">Actualizar</button>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-hover">
                                <thead className="table-light">
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Correo</th>
                                        <th className="text-center">Acción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listaUsuarios.map(u => (
                                        <tr key={u._id}>
                                            <td className="fw-bold">{u.nombre}</td>
                                            <td>{u.email}</td>
                                            <td className="text-center">
                                                <button onClick={() => eliminarUser(u._id)} className="btn btn-danger btn-sm">Eliminar</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Registro;
