import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ carrito = [], usuario = null, onCerrarSesion }) => {
  const totalItems = carrito.reduce((total, item) => total + Number(item.cantidad || 0), 0);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
      <div className="container">
        {/* Logo y Name */}
        <a className="navbar-brand d-flex align-items-center" href="/">
          <img 
            src="/imagenes/Logo PerfumeriaVioleta.png" 
            alt="Perfumería Violeta" 
            style={{ height: '50px', width: 'auto', marginRight: '10px' }}
            onError={(e) => { e.target.src = 'https://via.placeholder.com/50?text=PV'; }}
          />
          <span className="brand-text fw-bold" style={{ color: '#6a1b9a', fontSize: '1.4rem' }}>
            Perfumería Violeta
          </span>
        </a>

        {/* Botón Hamburguesa para Móviles */}
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarContent"
          aria-controls="navbarContent" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Enlaces de Navegación */}
        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <a className="nav-link px-3" href="/">Inicio</a>
            </li>
            <li className="nav-item">
              <Link className="nav-link px-3" to="/#catalogo">Catálogo</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link px-3" to="/nosotros">Nosotros</Link>
            </li>
            
            {/* Iconos de Acción */}
            <li className="nav-item ms-lg-3">
              <Link className="nav-link position-relative" to="/carrito">
                <i className="fa-solid fa-bag-shopping fs-5"></i>
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {totalItems}
                </span>
              </Link>
            </li>
            <li className="nav-item ms-lg-2">
              {usuario ? (
                <div className="d-flex align-items-center gap-2 ms-lg-3">
                  {['propietario', 'admin', 'empleado'].includes(usuario.rol) && (
                    <Link className="btn btn-outline-violeta btn-sm" to="/admin">
                      Admin
                    </Link>
                  )}
                  <span className="fw-bold text-violeta small text-uppercase">
                    {usuario.name}
                  </span>
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={onCerrarSesion}
                  >
                    Cerrar
                  </button>
                </div>
              ) : (
                <Link className="btn btn-violeta ms-lg-3 px-4" to="/login">
                  <i className="fa-solid fa-user me-2"></i>Ingresar
                </Link>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
