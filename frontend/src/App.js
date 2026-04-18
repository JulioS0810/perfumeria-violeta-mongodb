// ==========================================
// COMPONENTE PRINCIPAL: App.js
// Propósito: Gestión de Rutas e Integración de Módulos (Productos y Usuarios)
// Proyecto: Perfumería Violeta - Evidencia GA8-EV02
// ==========================================

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Importación de componentes de la interfaz
import Navbar from './components/Navbar';
import Registro from './components/Registro';

// Importación del servicio de datos (Capa de comunicación con el Backend)
import { productService } from './services/productService';

// MODIFICACIÓN: Importación corregida hacia tu carpeta de estilos
import './styles/styles.css';

function App() {
  // ---------------------------------------------------------
  // ESTADOS GLOBALES
  // ---------------------------------------------------------
  const [productos, setProductos] = useState([]); // Almacena los perfumes traídos de MongoDB
  const [cargando, setCargando] = useState(true);  // Maneja el estado de espera (spinner)

  // ---------------------------------------------------------
  // EFECTO DE CARGA (INTEGRACIÓN)
  // ---------------------------------------------------------
  useEffect(() => {
    const cargarProductos = async () => {
      try {
        // Llamada asíncrona a la API configurada en el backend
        const datos = await productService.getTodosLosProductos();
        // Validamos que los datos sean un array para evitar errores de renderizado
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
  // SUB-COMPONENTE: VISTA DE INICIO (Home + Catálogo)
  // ---------------------------------------------------------
  const VistaInicio = () => (
    <>
      {/* SECCIÓN HERO: Banner principal con identidad de marca */}
      <header 
        className="hero-section text-white d-flex align-items-center justify-content-center mb-5"
        style={{ 
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/imagenes/foto_portada.png')`,
          backgroundSize: 'cover', backgroundPosition: 'center'
        }}
      >
        <div className="container text-center py-5">
          <h1 className="display-2 brand-text mb-3 text-white">Perfumería Violeta</h1>
          <p className="lead fs-3 fw-light italic">El aroma abraza tu esencia</p>
          <div className="mt-4">
            <a href="#catalogo" className="btn btn-outline-light btn-lg px-5 me-3">Catálogo</a>
            <Link to="/registro" className="btn btn-lg px-5 btn-registro-hero">
              ¿Aún no eres usuario? Regístrate
            </Link>
          </div>
        </div>
      </header>

      {/* SECCIÓN CATÁLOGO: Módulo de productos dinámico */}
      <main className="container mb-5" id="catalogo">
        <div className="d-flex justify-content-between align-items-center mb-5 border-bottom pb-3">
          <h2 className="mb-0 fw-bold text-violeta">Colección Exclusiva</h2>
          <p className="text-muted mb-0"><strong>{productos.length}</strong> Fragancias disponibles</p>
        </div>

        <div className="row g-4">
          {!cargando ? (
            productos.map(p => {
              // Limpiamos la ruta de la imagen para que funcione localmente
              const nombreImagen = p.imagen.split('/').pop();
              const rutaFinal = `/imagenes/productos/${nombreImagen}`;

              return (
                <div key={p._id} className="col-xl-3 col-lg-4 col-sm-6">
                  <div className="card h-100 shadow-sm border-0 card-hover-effect">
                    {/* Contenedor de Imagen */}
                    <div className="position-relative bg-light d-flex align-items-center justify-content-center" style={{ height: '250px' }}>
                      <img 
                        src={rutaFinal} 
                        className="card-img-top p-4" 
                        alt={p.nombre} 
                        style={{ maxHeight: '100%', objectFit: 'contain' }}
                        onError={(e) => e.target.src = 'https://via.placeholder.com/250?text=Perfume'} 
                      />
                      <span className="badge position-absolute top-0 start-0 m-3 tag-genero">{p.genero}</span>
                    </div>

                    {/* Cuerpo de la Card */}
                    <div className="card-body text-center d-flex flex-column">
                      <h6 className="fw-bold mb-1">{p.nombre}</h6>
                      <p className="text-muted small mb-2">{p.marca}</p>
                      <p className="fs-5 fw-bold text-violeta mt-auto">
                        ${p.precio.toLocaleString('es-CO')}
                      </p>
                      <button className="btn btn-violeta-outline w-100 mt-2">Añadir</button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            // Feedback visual mientras cargan los datos
            <div className="col-12 text-center py-5">
              <div className="spinner-border text-violeta" role="status"></div>
              <p className="mt-2 text-muted">Sincronizando catálogo con MongoDB...</p>
            </div>
          )}
        </div>
      </main>
    </>
  );

  // ---------------------------------------------------------
  // RENDERIZADO GLOBAL (Estructura de la App)
  // ---------------------------------------------------------
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<VistaInicio />} />
          <Route path="/registro" element={<Registro />} />
        </Routes>
        <footer className="bg-dark text-white py-4 mt-5 text-center">
          <p className="mb-0 opacity-75">© 2026 Perfumería Violeta | Bogotá, Colombia</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
