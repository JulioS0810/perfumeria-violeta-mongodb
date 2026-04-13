// ==========================================
// SERVIDOR PRINCIPAL - PERFUMERÍA VIOLETA
// Arquitectura: Node.js, Express y MongoDB
// ==========================================

// 1. IMPORTACIÓN DE MÓDULOS
const express = require('express');
const conectarDB = require('./config/db'); // Función de conexión a base de datos NoSQL
const cors = require('cors'); // Middleware para permitir peticiones externas (Frontend)
require('dotenv').config(); // Carga de variables de entorno seguras

// ==========================================
// 2. INICIALIZACIÓN DE LA APLICACIÓN
// ==========================================
const app = express();

// ==========================================
// 3. CONEXIÓN A LA BASE DE DATOS
// ==========================================
// Se inicia la conexión con el clúster o instancia local de MongoDB
conectarDB();

// ==========================================
// 4. MIDDLEWARES (PROCESAMIENTO DE DATOS)
// ==========================================
app.use(cors()); // Habilita el intercambio de recursos entre dominios
app.use(express.json()); // Permite el mapeo automático de cuerpos JSON en las peticiones

// ==========================================
// 5. RUTAS DE PRUEBA Y DIAGNÓSTICO
// ==========================================
/**
 * @route   GET /
 * @desc    Verificación básica de disponibilidad del servidor
 */
app.get('/', (req, res) => {
    res.send('🌸 Servidor de Perfumería Violeta - Backend en Línea');
});

/**
 * @route   GET /api/diagnostico
 * @desc    Endpoint de control para pruebas de conectividad en Postman
 */
app.get('/api/diagnostico', (req, res) => {
    res.json({ 
        mensaje: "¡Conexión exitosa!",
        estado: "El servidor Node.js está operando correctamente." 
    });
});

// ==========================================
// 6. RUTAS DEL SISTEMA (API ENDPOINTS)
// ==========================================

// Enrutador para la gestión de inventario de perfumes
app.use('/api/productos', require('./routes/productoRoutes'));

// Enrutador para la gestión y registro de usuarios
app.use('/api/usuarios', require('./routes/usuarioRoutes'));

// ==========================================
// 7. ARRANQUE DEL SERVIDOR
// ==========================================
// Definición del puerto lógico (Prioriza .env para despliegue profesional)
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log('=========================================================');
    console.log(`🚀 SERVIDOR INICIADO EN EL PUERTO: ${PORT}`);
    console.log(`🔗 URL BASE: http://localhost:${PORT}`);
    console.log(`✅ ESTADO: Backend listo para recibir peticiones`);
    console.log('=========================================================');
});
