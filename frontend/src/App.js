// ==========================================
// COMPONENTE PRINCIPAL: App.js
// Propósito: Configurar rutas y estructura global
// Proyecto: Plataforma Web Perfumería Violeta
// ==========================================

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Registro from './components/Registro';
import { productService } from './services/productService';

function App() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  // 1. CARGA DE PRODUCTOS (CATÁLOGO)
  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const datos = await productService.getTodosLosProductos();
        setProductos(Array.isArray(datos) ? datos : []);
      } catch (error) {
        console.error("❌ Error al conectar con MongoDB:", error);
      } finally {
        setCargando(false);
      }
    };
    cargarProductos();
  }, []);

  // 2. VISTA DE INICIO (HOME + CATÁLOGO)
  const VistaInicio = () => (
    <>
      <header 
        className="hero-section text-white d-flex align-items-center justify-content-center mb-5"
        style={{ 
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/imagenes/foto_portada.png')`,
          backgroundSize: 'cover', backgroundPosition: 'center'
        }}
      >
        <div className="container text-center py-5">
          <h1 className="display-2 brand-text mb-3 text-white">Perfumería Violeta</h1>
          <p className="lead fs-3 fw-light">El aroma abraza tu esencia</p>
          <div className="mt-4">
            <a href="#catalogo" className="btn btn-outline-light btn-lg px-5 me-3">Catálogo</a>
            {/* BOTÓN DE ACCESO AL REGISTRO */}
            <Link to="/registro" className="btn btn-lg px-5" style={{backgroundColor: '#6a1b9a', color: 'white'}}>
              ¿Aún no eres usuario? Regístrate
            </Link>
          </div>
        </div>
      </header>

      <main className="container mb-5" id="catalogo">
        <div className="d-flex justify-content-between align-items-center mb-5 border-bottom pb-3">
          <h2 className="mb-0 fw-bold" style={{color: '#6a1b9a'}}>Colección Exclusiva</h2>
          <p className="text-muted mb-0"><strong>{productos.length}</strong> Productos</p>
        </div>

        <div className="row g-4">
          {!cargando ? (
            productos.map(p => {
              const nombreImagen = p.imagen.split('/').pop();
              const rutaFinal = `/imagenes/productos/${nombreImagen}`;
              return (
                <div key={p._id} className="col-xl-3 col-lg-4 col-sm-6">
                  <div className="card h-100 shadow-sm border-0">
                    <div className="position-relative bg-light d-flex align-items-center justify-content-center" style={{ height: '250px' }}>
                      <img src={rutaFinal} className="card-img-top p-4" alt={p.nombre} style={{ maxHeight: '100%', objectFit: 'contain' }}
                        onError={(e) => e.target.src = 'https://via.placeholder.com/250?text=Perfume'} />
                      <span className="badge position-absolute top-0 start-0 m-3" style={{backgroundColor: '#6a1b9a'}}>{p.genero}</span>
                    </div>
                    <div className="card-body text-center">
                      <h6 className="fw-bold">{p.nombre}</h6>
                      <p className="text-muted small">{p.marca}</p>
                      <p className="fs-5 fw-bold" style={{color: '#6a1b9a'}}>${p.precio.toLocaleString('es-CO')}</p>
                      <button className="btn btn-violeta-outline w-100">Añadir</button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-12 text-center py-5"><div className="spinner-border text-primary"></div></div>
          )}
        </div>
      </main>
    </>
  );

  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<VistaInicio />} />
          <Route path="/registro" element={<Registro />} />
        </Routes>
        <footer className="bg-dark text-white py-4 mt-5 text-center">
          <p className="mb-0 opacity-75">© 2026 Perfumería Violeta - Bogotá, Colombia</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
