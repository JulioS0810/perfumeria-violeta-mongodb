import React from 'react';
import { Link } from 'react-router-dom';

const Carrito = ({
  carrito = [],
  actualizarCantidad,
  eliminarProducto,
  vaciarCarrito,
  iniciarCheckout,
  pagoCargando
}) => {
  const subtotal = carrito.reduce((total, item) => {
    return total + (Number(item.precio || 0) * Number(item.cantidad || 0));
  }, 0);

  if (carrito.length === 0) {
    return (
      <div className="container py-5 text-center">
        <div className="card shadow-sm border-0 p-5 rounded-4">
          <h2 className="text-violeta mb-3">Tu carrito está vacío</h2>
          <p className="text-muted mb-4">Aún no has agregado fragancias a tu compra.</p>
          <Link to="/" className="btn btn-violeta px-4">
            Ver catálogo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0 text-violeta">Carrito de compras</h2>
        <button className="btn btn-outline-danger btn-sm" onClick={vaciarCarrito}>
          Vaciar carrito
        </button>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          {carrito.map((item) => {
            const nombreProducto = item.nombre || item.name;
            const idProducto = item.productoId || item._id;
            const imagenProducto = typeof item.imagen === 'string' && item.imagen
              ? item.imagen.startsWith('http')
                ? item.imagen
                : `/imagenes/productos/${item.imagen.split('/').pop()}`
              : 'https://via.placeholder.com/250?text=Perfume';

            return (
              <div key={idProducto} className="card shadow-sm border-0 mb-3 rounded-4">
                <div className="row g-0 align-items-center p-3">
                  <div className="col-md-3 text-center">
                    <img
                      src={imagenProducto}
                      alt={nombreProducto}
                      style={{ maxHeight: '120px', objectFit: 'contain' }}
                      className="img-fluid"
                    />
                  </div>

                  <div className="col-md-5 px-3">
                    <h5 className="fw-bold mb-1">{nombreProducto}</h5>
                    <p className="text-muted mb-2">{item.marca}</p>
                    <p className="fw-bold text-violeta mb-0">
                      ${Number(item.precio).toLocaleString('es-CO')}
                    </p>
                  </div>

                  <div className="col-md-2 text-center">
                    <div className="d-flex align-items-center justify-content-center border rounded-pill">
                      <button
                        className="btn btn-sm px-3"
                        onClick={() => actualizarCantidad(idProducto, item.cantidad - 1)}
                      >
                        -
                      </button>
                      <span className="fw-bold px-2">{item.cantidad}</span>
                      <button
                        className="btn btn-sm px-3"
                        onClick={() => actualizarCantidad(idProducto, item.cantidad + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="col-md-2 text-end">
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => eliminarProducto(idProducto)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="col-lg-4">
          <div className="card shadow-sm border-0 rounded-4 p-4">
            <h4 className="mb-3 text-violeta">Resumen</h4>
            <div className="d-flex justify-content-between mb-2">
              <span>Subtotal</span>
              <strong>${subtotal.toLocaleString('es-CO')}</strong>
            </div>
            <div className="d-flex justify-content-between mb-3">
              <span>Envío</span>
              <strong>Gratis</strong>
            </div>
            <hr />
            <div className="d-flex justify-content-between mb-4">
              <span className="fw-bold">Total</span>
              <span className="fw-bold text-violeta">${subtotal.toLocaleString('es-CO')}</span>
            </div>

            <button
              className="btn btn-violeta w-100 mb-2"
              onClick={iniciarCheckout}
              disabled={pagoCargando}
            >
              {pagoCargando ? 'Preparando pago...' : 'Finalizar compra'}
            </button>
            <Link to="/" className="btn btn-outline-secondary w-100">
              Seguir comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Carrito;
