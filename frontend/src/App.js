// ==========================================
// COMPONENTE PRINCIPAL: App.js
// Propósito: Gestión de Rutas e Integración de Módulos (Productos y Usuarios)
// Proyecto: Perfumería Violeta - Evidencia GA8-EV02
// ==========================================

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Importación de componentes locales
import Navbar from './components/Navbar';
import Registro from './components/Registro';

// Importación del servicio de comunicación con el Backend
import { productService } from './services/productService';

// Estilos globales
import './App.css';

function App() {
  // ---------------------------------------------------------
  // ESTADOS GLOBALES
  // ---------------------------------------------------------
  const [productos, setProductos] = useState([]); // Almacena los 132 perfumes de MongoDB
  const [cargando, setCargando] = useState(true);  // Estado de carga para feedback al usuario

  // ---------------------------------------------------------
  // EFECTO DE CARGA: INTEGRACIÓN CON EL BACKEND
  // ---------------------------------------------------------
  useEffect(() => {
    const cargarProductos = async () => {
      try {
        console.log("📡 Solicitando catálogo a la API...");
        const datos = await productService.getTodosLosProductos();
        
        // Validamos que los datos sean un array antes de asignar
        setProductos(Array.isArray(datos) ? datos : []);
      } catch (error) {
        console.error("❌ Error de integración con MongoDB:", error);
      } finally {
        setCargando(false);
      }
    };
    cargarProductos();
  }, []);

  // ---------------------------------------------------------
  // SUB-COMPONENTE: VISTA DE INICIO (HOME + CATÁLOGO)
  // ---------------------------------------------------------
  const VistaInicio = () => (
    <>
      {/* SECCIÓN HERO: Identidad de Marca */}
      <header 
        className="hero-section text-white d-flex align-items-center justify-content-center mb-5"
        style={{ 
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/imagenes/foto_portada.png')`,
          backgroundSize: 'cover', 
          backgroundPosition: 'center'
        }}
      >
        <div className="container text-center py-5">
          <h1 className="display-2 brand-text mb-3 text-white">Perfumería Violeta</h1>
          <p className="lead fs-3 fw-light italic">El aroma abraza tu esencia</p>
          <div className="mt-4">
            <a href="#catalogo" className="btn btn-outline-light btn-lg px-5 me-3">Ver Catálogo</a>
            <Link to="/registro" className="btn btn-lg px-5 btn-registro-hero">
              ¿Aún no eres usuario? Regístrate
            </Link>
          </div>
        </div>
      </header>

      {/* SECCIÓN CATÁLOGO: Módulo de Inventario Integrado */}
      <main className="container mb-5" id="catalogo">
        <div className="d-flex justify-content-between align-items-center mb-5 border-bottom pb-3">
          <h2 className="mb-0 fw-bold" style={{color: '#6a1b9a'}}>Colección Exclusiva</h2>
          <p className="text-muted mb-0"><strong>{productos.length}</strong> Fragancias disponibles</p>
        </div>

        <div className="row g-4">
          {!cargando ? (
            productos.map(p => {
              // Lógica para procesar la ruta de la imagen proveniente de MongoDB
              const nombreImagen = p.imagen.split('/').pop();
              const rutaFinal = `/imagenes/productos/${nombreImagen}`;

              return (
                <div key={p._id} className="col-xl-3 col-lg-4 col-sm-6">
                  <div className="card h-100 shadow-sm border-0 card-hover-effect">
                    {/* Badge de Género */}
                    <div className="position-relative bg-light d-flex align-items-center justify-content-center" style={{ height: '250px' }}>
                      <img 
                        src={rutaFinal} 
                        className="card-img-top p-4" 
                        alt={p.nombre} 
                        style={{ maxHeight: '100%', objectFit: 'contain' }}
                        onError={(e) => e.target.src = 'https://via.placeholder.com/250?text=Perfume'} 
                      />
                      <span className="badge position-absolute top-0 start-0 m-3 tag-genero">
                        {p.genero}
                      </span>
                    </div>

                    {/* Información del Producto */}
                    <div className="card-body text-center d-flex flex-column">
                      <h6 className="fw-bold mb-1">{p.nombre}</h6>
                      <p className="text-muted small mb-2">{p.marca}</p>
                      <p className="fs-5 fw-bold text-violeta mt-auto">
                        ${p.precio.toLocaleString('es-CO')}
                      </p>
                      <button className="btn btn-violeta-outline w-100 mt-2">
                        Añadir al carrito
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            // Spinner de carga mientras responde el servidor
            <div className="col-12 text-center py-5">
              <div className="spinner-border" style={{color: '#6a1b9a'}} role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="mt-3 text-muted">Sincronizando con base de datos NoSQL...</p>
            </div>
          )}
        </div>
      </main>
    </>
  );

  // ---------------------------------------------------------
  // RENDERIZADO PRINCIPAL (Router)
  // ---------------------------------------------------------
  return (
    <Router>
      <div className="App">
        {/* Módulo de Navegación persistente */}
        <Navbar />

        <Routes>
          <Route path="/" element={<VistaInicio />} />
          <Route path="/registro" element={<Registro />} />
        </Routes>

        {/* Footer Informativo */}
        <footer className="bg-dark text-white py-4 mt-5 text-center">
          <div className="container">
            <p className="mb-0 opacity-75">© 2026 Perfumería Violeta | Bogotá, Colombia</p>
            <small className="opacity-50">Evidencia GA8-220501096-AA1-EV02</small>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
