// ==========================================
// COMPONENTE: Registro.js
// Propósito: Interfaz de usuario para capturar y enviar 
// datos de nuevos usuarios a MongoDB.
// ==========================================

import React, { useState } from 'react';
import Swal from 'sweetalert2'; // Importación de la librería para alertas visuales

const Registro = () => {
    // 1. Definición del estado del formulario
    const [usuario, setUsuario] = useState({
        nombre: '',
        email: '',
        password: ''
    });

    // 2. Función para capturar los cambios en los campos de texto
    const handleChange = (e) => {
        setUsuario({
            ...usuario,
            [e.target.name]: e.target.value
        });
    };

    // 3. Función principal para procesar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault(); // Previene la recarga de la página

        // Validación simple en el Frontend antes de enviar
        if (usuario.nombre.trim() === '' || usuario.email.trim() === '' || usuario.password.trim() === '') {
            Swal.fire({
                icon: 'warning',
                title: 'Campos incompletos',
                text: 'Por favor, llena todos los campos para continuar.',
                confirmButtonColor: '#6a1b9a'
            });
            return;
        }

        try {
            // Llamada al Backend (Asegúrate de que el servidor Node.js esté activo)
            const respuesta = await fetch('http://localhost:4000/api/usuarios', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(usuario)
            });

            const resultado = await respuesta.json();

            if (respuesta.ok) {
                // ÉXITO: El usuario se guardó en MongoDB
                Swal.fire({
                    icon: 'success',
                    title: '¡Registro Exitoso!',
                    text: `El usuario ${usuario.nombre} ha sido creado correctamente en la base de datos.`,
                    confirmButtonColor: '#4a148c'
                });

                // Limpiar el formulario para un nuevo registro
                setUsuario({ nombre: '', email: '', password: '' });

                // Aquí es donde puedes ir a MongoDB Compass y darle a "Refresh"
                console.log("Dato guardado en MongoDB:", resultado);

            } else {
                // ERROR: Por ejemplo, si el correo ya existe
                Swal.fire({
                    icon: 'error',
                    title: 'Error al registrar',
                    text: resultado.msg || 'No se pudo completar la acción',
                    confirmButtonColor: '#d33'
                });
            }

        } catch (error) {
            // ERROR DE CONEXIÓN: El backend no responde
            Swal.fire({
                icon: 'error',
                title: 'Error de servidor',
                text: 'No hay conexión con el backend. Verifica que Node.js esté corriendo.',
                confirmButtonColor: '#d33'
            });
        }
    };

    // 4. Renderizado del formulario (Interfaz)
    return (
        <div className="contenedor-registro" style={estilos.contenedor}>
            <div style={estilos.tarjeta}>
                <h2 style={estilos.titulo}>Registro de Usuario</h2>
                <p style={estilos.subtitulo}>Sistema de Gestión - Perfumería Violeta</p>

                <form onSubmit={handleSubmit} style={estilos.formulario}>
                    <div style={estilos.campo}>
                        <label>Nombre:</label>
                        <input
                            type="text"
                            name="nombre"
                            placeholder="Ingresa tu nombre"
                            value={usuario.nombre}
                            onChange={handleChange}
                            style={estilos.input}
                        />
                    </div>

                    <div style={estilos.campo}>
                        <label>Correo:</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="ejemplo@correo.com"
                            value={usuario.email}
                            onChange={handleChange}
                            style={estilos.input}
                        />
                    </div>

                    <div style={estilos.campo}>
                        <label>Contraseña:</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Crea una clave segura"
                            value={usuario.password}
                            onChange={handleChange}
                            style={estilos.input}
                        />
                    </div>

                    <button type="submit" style={estilos.boton}>
                        Guardar en MongoDB
                    </button>
                </form>
            </div>
        </div>
    );
};

// 5. Estilos en línea para una presentación rápida y limpia
const estilos = {
    contenedor: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5'
    },
    tarjeta: {
        background: 'white',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px'
    },
    titulo: {
        textAlign: 'center',
        color: '#4a148c',
        marginBottom: '10px'
    },
    subtitulo: {
        textAlign: 'center',
        color: '#666',
        fontSize: '0.9rem',
        marginBottom: '25px'
    },
    formulario: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
    },
    campo: {
        display: 'flex',
        flexDirection: 'column',
        gap: '5px'
    },
    input: {
        padding: '10px',
        borderRadius: '6px',
        border: '1px solid #ddd',
        fontSize: '1rem'
    },
    boton: {
        backgroundColor: '#6a1b9a',
        color: 'white',
        padding: '12px',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '1rem',
        fontWeight: 'bold',
        marginTop: '10px'
    }
};

export default Registro;
