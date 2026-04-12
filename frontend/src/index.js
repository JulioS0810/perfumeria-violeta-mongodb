import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

/* * IMPORTACIÓN DE ESTILOS - PERFUMERÍA VIOLETA
 * Se cargan en orden jerárquico para asegurar que las variables 
 * y los ajustes responsive funcionen correctamente.
 */
import './styles/variables.css';
import './styles/styles.css';
import './styles/components.css';
import './styles/responsive.css';

// Configuración del nodo raíz de React
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);