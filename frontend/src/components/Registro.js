// ==========================================
// COMPONENTE: Registro.js
// Propósito: CRUD de Usuarios (Crear, Leer, Eliminar) con manejo de errores full-stack
// Proyecto: Perfumería Violeta - Estandarizado a "name"
// ==========================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Registro = () => {
    const navigate = useNavigate();
    // 🛠️ ESTADO LOCAL: Datos del formulario estandarizados con las claves del backend ("name")
    const [usuario, setUsuario] = useState({ name: '', email: '', password: '' });
    // 🛠️ ESTADO LOCAL: Almacena el array de usuarios devuelto por MongoDB para pintar la tabla
    const [listaUsuarios, setListaUsuarios] = useState([]);

    // Hook de efecto para cargar los usuarios automáticamente apenas se monte el componente en pantalla
    useEffect(() => { 
        obtenerUsuarios(); 
    }, []);

    // 📡 PETICIÓN GET: Obtiene la lista actualizada de usuarios desde la API Rest
    const obtenerUsuarios = async () => {
        try {
            const res = await fetch('http://localhost:4000/api/usuarios');
            const data = await res.json();
            setListaUsuarios(data); // Setea el estado para renderizar dinámicamente las filas de la tabla
        } catch (error) { 
            console.error("Error al listar usuarios desde el backend:", error); 
        }
    };

    // 🔄 CONTROLADOR DE CAMBIOS: Sincroniza en tiempo real los inputs del formulario con el estado "usuario"
    const handleChange = (e) => {
        setUsuario({ ...usuario, [e.target.name]: e.target.value });
    };

    // 🚀 ENVÍO DEL FORMULARIO (PETICIÓN POST): Maneja la creación del registro y captura excepciones
    const handleSubmit = async (e) => {
        e.preventDefault(); // Previene la recarga por defecto de la página
        try {
            const res = await fetch('http://localhost:4000/api/usuarios', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(usuario) // Convierte el objeto del estado a JSON puro para la red
            });

            // CASO EXITOSO: El backend procesa el registro e inserta el documento (Status 2xx)
            if (res.ok) {
                Swal.fire('¡Éxito!', 'Usuario registrado correctamente', 'success');
                setUsuario({ name: '', email: '', password: '' }); // Resetea los campos del formulario
                obtenerUsuarios(); // Sincroniza la tabla de inmediato reflejando el cambio en tiempo real
            } 
            // CASO ERROR CONTROLADO: El backend rechaza la petición (ej: Status 400 - Correo Duplicado)
            else {
                const errorData = await res.json();

                const mensaje = errorData.msg || 'El usuario ya se encuentra registrado en el sistema.';

                Swal.fire({
                    icon: 'warning',
                    title: 'No se pudo registrar',
                    text: mensaje,
                    confirmButtonColor: '#6a1b9a'
                }).then(() => {
                    if (mensaje.toLowerCase().includes('ya está registrado') || mensaje.toLowerCase().includes('ya se encuentra registrado')) {
                        navigate('/login');
                    }
                });
            }
        } catch (error) { 
            // CASO ERROR DE RED: Si el servidor está apagado o no hay conectividad
            Swal.fire('Error', 'No se pudo establecer conexión con el backend', 'error'); 
        }
    };

    // 🗑️ PETICIÓN DELETE: Elimina un registro de MongoDB usando su identificador único (_id)
    const eliminarUser = async (id) => {
        // Modal de confirmación preventivo para evitar borrados accidentales
        const confirmar = await Swal.fire({
            title: '¿Eliminar usuario?',
            text: "Se borrará de MongoDB permanentemente",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6'
        });

        // Si el administrador confirma la acción destructiva
        if (confirmar.isConfirmed) {
            try {
                const res = await fetch(`http://localhost:4000/api/usuarios/${id}`, { method: 'DELETE' });
                
                if (res.ok) {
                    Swal.fire('Eliminado', 'Registro borrado con éxito de la base de datos', 'success');
                    obtenerUsuarios(); // Actualiza la tabla automáticamente removiendo la fila
                } else {
                    Swal.fire('Error', 'El backend no pudo procesar la eliminación', 'error');
                }
            } catch (error) { 
                Swal.fire('Error', 'No se pudo eliminar el registro', 'error'); 
            }
        }
    };

    return (
        <div className="container mt-5" style={{ minHeight: '70vh' }}>
            <div className="row g-4">
                
                {/* COLUMNA: FORMULARIO DE REGISTRO */}
                <div className="col-md-4">
                    <div className="card shadow border-0 p-4 rounded-4">
                        <h3 className="text-center mb-4" style={{color: '#4a148c'}}>Registro</h3>
                        <form onSubmit={handleSubmit}>
                            {/* Input: Nombre de Usuario */}
                            <input 
                                type="text" 
                                name="name" 
                                className="form-control mb-3" 
                                placeholder="Nombre completo" 
                                value={usuario.name} 
                                onChange={handleChange} 
                                required 
                            />
                            {/* Input: Correo Electrónico */}
                            <input 
                                type="email" 
                                name="email" 
                                className="form-control mb-3" 
                                placeholder="Correo electrónico" 
                                value={usuario.email} 
                                onChange={handleChange} 
                                required 
                            />
                            {/* Input: Contraseña */}
                            <input 
                                type="password" 
                                name="password" 
                                className="form-control mb-3" 
                                placeholder="Contraseña" 
                                value={usuario.password} 
                                onChange={handleChange} 
                                required 
                            />
                            {/* Botón de Envíos */}
                            <button type="submit" className="btn btn-lg w-100 text-white" style={{backgroundColor: '#6a1b9a'}}>
                                Guardar
                            </button>

                            <div className="text-center mt-3">
                                <span className="text-muted">¿Ya tienes cuenta?</span>
                                <button
                                    type="button"
                                    className="btn btn-link text-violeta fw-bold p-0 ms-2"
                                    onClick={() => navigate('/login')}
                                >
                                    Inicia sesión
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* COLUMNA: TABLA DE GESTIÓN DE USUARIOS EN BD */}
                <div className="col-md-8">
                    <div className="card shadow border-0 p-4 rounded-4">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h3 style={{color: '#4a148c'}}>Usuarios en DB</h3>
                            {/* Botón de actualización manual */}
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
                                    {/* Mapeo dinámico de la lista de usuarios recuperada desde MongoDB */}
                                    {listaUsuarios.map(u => (
                                        <tr key={u._id}>
                                            {/* Renderizado de la propiedad string "u.name" devuelta en el JSON */}
                                            <td className="fw-bold">{u.name}</td>
                                            <td>{u.email}</td>
                                            <td className="text-center">
                                                {/* Invocación de la función eliminar pasando el ID del documento de Mongo */}
                                                <button onClick={() => eliminarUser(u._id)} className="btn btn-danger btn-sm">
                                                    Eliminar
                                                </button>
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
