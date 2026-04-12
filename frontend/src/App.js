import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import { productService } from './services/productService';

function App() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const datos = await productService.getTodosLosProductos();
        setProductos(Array.isArray(datos) ? datos : []);
      } catch (error) {
        console.error("Error al cargar productos:", error);
      } finally {
        setCargando(false);
      }
    };
    cargarProductos();
  }, []);

  return (
    <div className="App">
      <Navbar />
      
      <header 
        className="hero-section text-white d-flex align-items-center justify-content-center mb-5"
        style={{ 
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/imagenes/foto_portada.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="container text-center py-5">
          <h1 className="display-2 brand-text mb-3 text-white">Perfumería Violeta</h1>
          <p className="lead fs-3 fw-light">El aroma abraza tu esencia</p>
          <div className="mt-4">
            <a href="#catalogo" className="btn btn-outline-light btn-lg px-5">Explorar Catálogo</a>
          </div>
        </div>
      </header>

      <main className="container mb-5" id="catalogo">
        <div className="d-flex justify-content-between align-items-center mb-5 border-bottom pb-3">
          <h2 className="mb-0 fw-bold" style={{color: '#6a1b9a'}}>Colección Exclusiva</h2>
          <p className="text-muted mb-0">
            <strong>{productos.length}</strong> Fragancias Disponibles
          </p>
        </div>

        <div className="row g-4">
          {!cargando ? (
            productos.map(p => {
              // --- CORRECCIÓN DE RUTA AQUÍ ---
              // Si p.imagen es solo "perfume.jpg", le ponemos la ruta completa.
              // Si ya trae "/imagenes/productos/...", lo dejamos igual.
              const nombreImagen = p.imagen.split('/').pop(); // Extrae solo el nombre final
              const rutaFinal = `/imagenes/productos/${nombreImagen}`;

              return (
                <div key={p._id} className="col-xl-3 col-lg-4 col-sm-6">
                  <div className="card h-100 shadow-sm border-0 card-producto">
                    <div className="position-relative bg-light rounded-top d-flex align-items-center justify-content-center" style={{ height: '250px' }}>
                      <img 
                        src={rutaFinal} 
                        className="card-img-top p-4" 
                        alt={p.nombre} 
                        style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                        onError={(e) => { 
                          // Si falla la ruta local, intenta buscarla en la raíz por si acaso
                          if (e.target.src !== 'https://via.placeholder.com/250?text=Sin+Imagen') {
                            e.target.src = 'https://via.placeholder.com/250?text=Sin+Imagen';
                          }
                        }}
                      />
                      <span className="badge position-absolute top-0 start-0 m-3" style={{backgroundColor: '#6a1b9a'}}>
                        {p.genero}
                      </span>
                    </div>
                    <div className="card-body d-flex flex-column text-center">
                      <h6 className="card-title mb-2 fw-bold" style={{ height: '2.5rem', overflow: 'hidden' }}>
                        {p.nombre}
                      </h6>
                      <p className="text-muted small mb-2">{p.marca}</p>
                      <p className="fs-5 fw-bold mb-3" style={{color: '#6a1b9a'}}>
                        ${p.precio.toLocaleString('es-CO')}
                      </p>
                      <button className="btn btn-violeta-outline mt-auto w-100">
                        <i className="fa-solid fa-cart-shopping me-2"></i>Añadir
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-12 text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
              <p className="mt-3">Cargando catálogo...</p>
            </div>
          )}
        </div>
      </main>

      <footer className="bg-dark text-white py-4 mt-5">
        <div className="container text-center">
          <p className="mb-0 opacity-75">© 2026 Perfumería Violeta - Bogotá, Colombia</p>
        </div>
      </footer>
    </div>
  );
}

export default App;