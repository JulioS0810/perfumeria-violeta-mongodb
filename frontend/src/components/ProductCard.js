import React from 'react';

const ProductCard = ({ producto }) => {
  return (
    <div className="col-md-4 mb-4">
      <div className="card-producto">
        <div className="img-contenedor">
          <img 
            src={producto.imagen || 'https://via.placeholder.com/250'} 
            className="img-producto" 
            alt={producto.nombre} 
          />
        </div>
        <div className="card-body-personalizado">
          <p className="marca-texto">{producto.marca}</p>
          <h5 className="nombre-producto">{producto.nombre}</h5>
          <p className="precio-producto">${producto.precio.toLocaleString()}</p>
          <button className="btn-violeta">
            <i className="fa-solid fa-plus me-2"></i>
            Agregar al Carrito
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;