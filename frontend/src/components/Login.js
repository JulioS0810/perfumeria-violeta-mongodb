import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const Login = ({ onLogin }) => {
    const navigate = useNavigate();
    const [formulario, setFormulario] = useState({ email: '', password: '' });
    const [cargando, setCargando] = useState(false);

    const handleChange = (e) => {
        setFormulario({ ...formulario, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setCargando(true);

        try {
            const respuesta = await fetch('http://localhost:4000/api/usuarios/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formulario)
            });

            const data = await respuesta.json();

            if (!respuesta.ok) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error de acceso',
                    text: data.msg || 'No se pudo iniciar sesión',
                    confirmButtonColor: '#6a1b9a'
                });
                return;
            }

            localStorage.setItem('usuario-violeta', JSON.stringify(data.usuario));
            localStorage.setItem('carrito-violeta-user', data.usuario._id);
            onLogin(data.usuario);

            Swal.fire({
                icon: 'success',
                title: 'Bienvenido',
                text: `Has ingresado como ${data.usuario.name}`,
                confirmButtonColor: '#6a1b9a'
            }).then(() => {
                if (data.usuario.rol === 'propietario' || data.usuario.rol === 'admin' || data.usuario.rol === 'empleado') {
                    navigate('/admin');
                } else {
                    navigate('/');
                }
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo conectar con el servidor',
                confirmButtonColor: '#6a1b9a'
            });
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-5">
                    <div className="card shadow border-0 rounded-4 p-4">
                        <h3 className="text-center mb-4 text-violeta">Iniciar sesión</h3>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="email"
                                name="email"
                                className="form-control mb-3"
                                placeholder="Correo electrónico"
                                value={formulario.email}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="password"
                                name="password"
                                className="form-control mb-3"
                                placeholder="Contraseña"
                                value={formulario.password}
                                onChange={handleChange}
                                required
                            />
                            <button type="submit" className="btn btn-violeta w-100" disabled={cargando}>
                                {cargando ? 'Ingresando...' : 'Ingresar'}
                            </button>

                            <div className="text-center mt-3">
                                <span className="text-muted">¿No tienes cuenta?</span>
                                <Link to="/registro" className="ms-2 text-violeta fw-bold">
                                    Regístrate aquí
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
