// ==========================================
// 1. IMPORTACIÓN DE MÓDULOS
// ==========================================
const express = require('express');
const conectarDB = require('./config/db'); // Función para conectar a MongoDB
const cors = require('cors'); // Permite conexión entre Frontend y Backend
require('dotenv').config(); // Carga las variables de entorno del archivo .env

// ==========================================
// 2. INICIALIZACIÓN DE LA APLICACIÓN
// ==========================================
const app = express();

// ==========================================
// 3. CONEXIÓN A LA BASE DE DATOS
// ==========================================
// Conecta a MongoDB (Asegúrate de tener MongoDB Compass abierto)
conectarDB();

// ==========================================
// 4. MIDDLEWARES
// ==========================================
app.use(cors()); // Habilita el intercambio de recursos de origen cruzado
app.use(express.json()); // Permite que el servidor reciba y entienda formato JSON

// ==========================================
// 5. RUTAS DE PRUEBA Y DIAGNÓSTICO
// ==========================================

// Ruta raíz para verificar que el servidor vive
app.get('/', (req, res) => {
    res.send('🌸 Servidor de Perfumería Violeta - Backend en Línea');
});

// Ruta de diagnóstico para Postman
// Si entras a http://localhost:4000/api/diagnostico y funciona, la conexión es total.
app.get('/api/diagnostico', (req, res) => {
    res.json({ 
        mensaje: "¡Conexión exitosa!",
        estado: "El servidor Node.js está recibiendo peticiones de Postman correctamente." 
    });
});

// ==========================================
// 6. RUTAS DEL SISTEMA (ENDPOINTS)
// ==========================================

// Rutas para los Productos (Perfumes)
app.use('/api/productos', require('./routes/productoRoutes'));

// Rutas para la Gestión de Usuarios
// IMPORTANTE: Asegúrate de que el archivo en la carpeta routes se llame 'usuarioRoutes.js'
app.use('/api/usuarios', require('./routes/usuarioRoutes'));

// ==========================================
// 7. ARRANQUE DEL SERVIDOR
// ==========================================
// Usa el puerto definido en .env o el 4000 por defecto
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log('---------------------------------------------------------');
    console.log(`🚀 Backend corriendo en: http://localhost:${PORT}`);
    console.log(`✅ Prueba la conexión aquí: http://localhost:${PORT}/api/diagnostico`);
    console.log('---------------------------------------------------------');
});