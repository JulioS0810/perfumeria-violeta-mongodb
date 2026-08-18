import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ usuario, permitido = [], children }) => {
  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  if (permitido.length > 0 && !permitido.includes(usuario.rol)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
