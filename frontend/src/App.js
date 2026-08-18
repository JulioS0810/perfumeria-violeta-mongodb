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
import Carrito from './components/Carrito';
import Login from './components/Login';
import Nosotros from './components/Nosotros';
import ProtectedRoute from './components/ProtectedRoute';
import AdminPanel from './components/AdminPanel';
import PagoResultado from './components/PagoResultado';

// Importación del servicio de datos (Capa de comunicación con el Backend)
import { productService } from './services/productService';

// MODIFICACIÓN: Importación corregida hacia tu carpeta de estilos
import './styles/styles.css';

const USUARIO_CARRITO_ID = (() => {
  const idGuardado = localStorage.getItem('carrito-violeta-user');
  const id = idGuardado || '64f1b3d2c7a9e9d1b6a0c123';
  localStorage.setItem('carrito-violeta-user', id);
  return id;
})();

const obtenerIdCarritoActual = (usuarioActual) => usuarioActual?._id || USUARIO_CARRITO_ID;

function App() {
  // ---------------------------------------------------------
  // ESTADOS GLOBALES
  // ---------------------------------------------------------
  const [productos, setProductos] = useState([]); // Almacena los perfumes traídos de MongoDB
  const [cargando, setCargando] = useState(true);  // Maneja el estado de espera (spinner)
  const [carrito, setCarrito] = useState(() => {
    const guardado = localStorage.getItem('carrito-violeta');
    return guardado ? JSON.parse(guardado) : [];
  });
  const [usuario, setUsuario] = useState(() => {
    const guardado = localStorage.getItem('usuario-violeta');
    return guardado ? JSON.parse(guardado) : null;
  });
  const [usuariosAdmin, setUsuariosAdmin] = useState([]);
  const [productosAdmin, setProductosAdmin] = useState([]);
  const [pagoCargando, setPagoCargando] = useState(false);

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

  useEffect(() => {
    const cargarCarrito = async () => {
      const usuarioId = obtenerIdCarritoActual(usuario);

      try {
        const respuesta = await fetch(`http://localhost:4000/api/carrito/${usuarioId}`);
        const data = await respuesta.json();

        if (respuesta.ok && data && Array.isArray(data.items)) {
          setCarrito(data.items);
          localStorage.setItem('carrito-violeta', JSON.stringify(data.items));
          return;
        }

        if (!usuario) {
          const guardadoLocal = JSON.parse(localStorage.getItem('carrito-violeta') || '[]');
          setCarrito(Array.isArray(guardadoLocal) ? guardadoLocal : []);
        }
      } catch (error) {
        console.error('❌ No se pudo cargar el carrito desde el backend:', error);
      }
    };

    cargarCarrito();
  }, [usuario]);

  useEffect(() => {
    localStorage.setItem('carrito-violeta', JSON.stringify(carrito));
  }, [carrito]);

  useEffect(() => {
    const cargarDatosAdmin = async () => {
      if (!usuario || !['propietario', 'admin', 'empleado'].includes(usuario.rol)) {
        return;
      }

      try {
        const [respuestaUsuarios, respuestaProductos] = await Promise.all([
          fetch('http://localhost:4000/api/usuarios'),
          fetch('http://localhost:4000/api/productos')
        ]);

        const usuariosData = await respuestaUsuarios.json();
        const productosData = await respuestaProductos.json();

        setUsuariosAdmin(Array.isArray(usuariosData) ? usuariosData : []);
        setProductosAdmin(Array.isArray(productosData) ? productosData : []);
      } catch (error) {
        console.error('❌ Error al cargar información administrativa:', error);
      }
    };

    cargarDatosAdmin();
  }, [usuario]);

  const agregarAlCarrito = async (producto) => {
    const carritoUsuarioId = obtenerIdCarritoActual(usuario);
    const payload = {
      productoId: producto._id,
      nombre: producto.nombre || producto.name,
      marca: producto.marca,
      precio: producto.precio,
      imagen: producto.imagen || '',
      cantidad: 1
    };

    try {
      const respuesta = await fetch(`http://localhost:4000/api/carrito/${carritoUsuarioId}/agregar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await respuesta.json();

      if (respuesta.ok && data.carrito && Array.isArray(data.carrito.items)) {
        setCarrito(data.carrito.items);
        return;
      }
    } catch (error) {
      console.error('❌ Error al guardar en el backend, usando carrito local:', error);
    }

    const productoExistente = carrito.find(item =>
      (item.productoId || item._id) === producto._id
    );

    if (productoExistente) {
      setCarrito(carritoAnterior => carritoAnterior.map(item =>
        (item.productoId || item._id) === producto._id
          ? { ...item, cantidad: Number(item.cantidad || 0) + 1 }
          : item
      ));
      return;
    }

    setCarrito(carritoAnterior => [
      ...carritoAnterior,
      {
        _id: producto._id,
        nombre: producto.nombre || producto.name,
        marca: producto.marca,
        precio: producto.precio,
        imagen: producto.imagen,
        cantidad: 1
      }
    ]);
  };

  const actualizarCantidad = async (id, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      await eliminarProducto(id);
      return;
    }

    const carritoUsuarioId = obtenerIdCarritoActual(usuario);

    try {
      const respuesta = await fetch(`http://localhost:4000/api/carrito/${carritoUsuarioId}/actualizar`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productoId: id, cantidad: nuevaCantidad })
      });

      const data = await respuesta.json();

      if (respuesta.ok && data.carrito && Array.isArray(data.carrito.items)) {
        setCarrito(data.carrito.items);
        return;
      }
    } catch (error) {
      console.error('❌ Error al actualizar cantidad en backend:', error);
    }

    setCarrito(carritoAnterior => carritoAnterior.map(item =>
      (item.productoId || item._id) === id
        ? { ...item, cantidad: nuevaCantidad }
        : item
    ));
  };

  const eliminarProducto = async (id) => {
    const carritoUsuarioId = obtenerIdCarritoActual(usuario);

    try {
      const respuesta = await fetch(`http://localhost:4000/api/carrito/${carritoUsuarioId}/eliminar/${id}`, {
        method: 'DELETE'
      });

      const data = await respuesta.json();

      if (respuesta.ok && data.carrito && Array.isArray(data.carrito.items)) {
        setCarrito(data.carrito.items);
        return;
      }
    } catch (error) {
      console.error('❌ Error al eliminar producto del backend:', error);
    }

    setCarrito(carritoAnterior => carritoAnterior.filter(item =>
      (item.productoId || item._id) !== id
    ));
  };

  const vaciarCarrito = async () => {
    const carritoUsuarioId = obtenerIdCarritoActual(usuario);

    try {
      const respuesta = await fetch(`http://localhost:4000/api/carrito/${carritoUsuarioId}/vaciar`, {
        method: 'DELETE'
      });

      const data = await respuesta.json();

      if (respuesta.ok && data.carrito && Array.isArray(data.carrito.items)) {
        setCarrito(data.carrito.items);
        return;
      }
    } catch (error) {
      console.error('❌ Error al vaciar carrito en backend:', error);
    }

    setCarrito([]);
  };

  const iniciarCheckout = async () => {
    if (!usuario?._id) {
      window.alert('Debes iniciar sesión para realizar el pago.');
      return;
    }

    if (carrito.length === 0) {
      window.alert('Agrega al menos un producto antes de pagar.');
      return;
    }

    setPagoCargando(true);

    try {
      const respuesta = await fetch('http://localhost:4000/api/pedidos/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuarioId: usuario._id })
      });
      const data = await respuesta.json();

      if (!respuesta.ok || !data.paymentUrl) {
        throw new Error(data.mensaje || 'No se pudo iniciar el pago');
      }

      window.location.assign(data.paymentUrl);
    } catch (error) {
      window.alert(error.message);
      setPagoCargando(false);
    }
  };

  const cerrarSesion = () => {
    localStorage.removeItem('usuario-violeta');
    localStorage.removeItem('carrito-violeta');
    localStorage.removeItem('carrito-violeta-user');
    setUsuario(null);
    setCarrito([]);
  };

  const onActualizarDatos = async () => {
    if (!usuario || !['propietario', 'admin', 'empleado'].includes(usuario.rol)) {
      return;
    }

    try {
      const [respuestaUsuarios, respuestaProductos] = await Promise.all([
        fetch('http://localhost:4000/api/usuarios'),
        fetch('http://localhost:4000/api/productos')
      ]);

      const usuariosData = await respuestaUsuarios.json();
      const productosData = await respuestaProductos.json();

      setUsuariosAdmin(Array.isArray(usuariosData) ? usuariosData : []);
      setProductosAdmin(Array.isArray(productosData) ? productosData : []);
    } catch (error) {
      console.error('❌ Error al actualizar datos administrativos:', error);
    }
  };

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
              const nombreProducto = p.nombre || p.name;
              const imagenProducto = p.imagen || '';
              const nameImagen = imagenProducto ? imagenProducto.split('/').pop() : 'default.png';
              const rutaFinal = imagenProducto ? `/imagenes/productos/${nameImagen}` : 'https://via.placeholder.com/250?text=Perfume';

              return (
                <div key={p._id} className="col-xl-3 col-lg-4 col-sm-6">
                  <div className="card h-100 shadow-sm border-0 card-hover-effect">
                    {/* Contenedor de Imagen */}
                    <div className="position-relative bg-light d-flex align-items-center justify-content-center" style={{ height: '250px' }}>
                      <img 
                        src={rutaFinal} 
                        className="card-img-top p-4" 
                        alt={nombreProducto} 
                        style={{ maxHeight: '100%', objectFit: 'contain' }}
                        onError={(e) => e.target.src = 'https://via.placeholder.com/250?text=Perfume'} 
                      />
                      <span className="badge position-absolute top-0 start-0 m-3 tag-genero">{p.genero}</span>
                    </div>

                    {/* Cuerpo de la Card */}
                    <div className="card-body text-center d-flex flex-column">
                      <h6 className="fw-bold mb-1">{nombreProducto}</h6>
                      <p className="text-muted small mb-2">{p.marca}</p>
                      <p className="fs-5 fw-bold text-violeta mt-auto">
                        ${Number(p.precio).toLocaleString('es-CO')}
                      </p>
                      <button
                        className="btn btn-violeta-outline w-100 mt-2"
                        onClick={() => agregarAlCarrito(p)}
                      >
                        Añadir
                      </button>
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
        <Navbar carrito={carrito} usuario={usuario} onCerrarSesion={cerrarSesion} />
        <Routes>
          <Route path="/" element={<VistaInicio />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/login" element={<Login onLogin={setUsuario} />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/pago/resultado" element={<PagoResultado />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute usuario={usuario} permitido={['propietario', 'admin', 'empleado']}>
                <AdminPanel
                  usuario={usuario}
                  usuariosAdmin={usuariosAdmin}
                  productosAdmin={productosAdmin}
                  onActualizarDatos={onActualizarDatos}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/carrito"
            element={
              <Carrito
                carrito={carrito}
                actualizarCantidad={actualizarCantidad}
                eliminarProducto={eliminarProducto}
                vaciarCarrito={vaciarCarrito}
                iniciarCheckout={iniciarCheckout}
                pagoCargando={pagoCargando}
              />
            }
          />
        </Routes>
        <footer className="bg-dark text-white py-4 mt-5 text-center">
          <p className="mb-0 opacity-75">© 2026 Perfumería Violeta | Bogotá, Colombia</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
