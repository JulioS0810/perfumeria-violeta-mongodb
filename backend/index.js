// =========================================================
// SERVIDOR PRINCIPAL - PERFUMERÍA VIOLETA
// Proyecto: GA7-220501096-AA5-EV04
// Aprendiz: Julio César Suárez Garavito
// Arquitectura: Node.js, Express y MongoDB
// =========================================================

// 1. IMPORTACIÓN DE MÓDULOS ESENCIALES
const express = require('express'); // Framework para la creación de la API REST
const conectarDB = require('./config/db'); // Importa la lógica de conexión a la base de datos
const cors = require('cors'); // Middleware para permitir peticiones desde el Frontend (React)
require('dotenv').config(); // Carga de variables de entorno seguras (.env)

// =========================================================
// 2. INICIALIZACIÓN DE LA APLICACIÓN
// =========================================================
const app = express();

// =========================================================
// 3. CONEXIÓN A LA BASE DE DATOS
// =========================================================
// Se invoca la función para conectar con la instancia local de MongoDB.
// Nota: Es vital tener el servicio activo en el sistema para evitar el error ECONNREFUSED.
conectarDB();

// =========================================================
// 4. MIDDLEWARES (PROCESAMIENTO DE DATOS)
// =========================================================
app.use(cors()); // Habilita el intercambio de recursos entre dominios
app.use(express.json()); // Permite que el servidor entienda el formato JSON en las peticiones

// =========================================================
// 5. RUTAS DE PRUEBA Y DIAGNÓSTICO
// =========================================================

/**
 * @route   GET /
 * @desc    Verificación inicial de disponibilidad del servidor
 */
app.get('/', (req, res) => {
    res.send('🌸 Servidor de Perfumería Violeta - Backend en Línea');
});

/**
 * @route   GET /api/diagnostico
 * @desc    Endpoint de control para validar la comunicación en Postman
 */
app.get('/api/diagnostico', (req, res) => {
    res.json({ 
        mensaje: "¡Conexión exitosa!",
        estado: "El servidor Node.js está operando correctamente." 
    });
});

// =========================================================
// 6. RUTAS DEL SISTEMA (API ENDPOINTS)
// =========================================================

// Enrutador para la gestión del inventario de productos
app.use('/api/productos', require('./routes/productoRoutes'));

// Enrutador para la gestión y registro de usuarios (Usado en el video de la EV04)
app.use('/api/usuarios', require('./routes/usuarioRoutes'));

// =========================================================
// 7. ARRANQUE DEL SERVIDOR
// =========================================================
// Definición del puerto lógico (Prioriza el puerto del archivo .env o usa el 4000 por defecto)
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log('=========================================================');
    console.log(`🚀 SERVIDOR INICIADO EN EL PUERTO: ${PORT}`);
    console.log(`🔗 URL BASE: http://localhost:${PORT}`);
    console.log(`✅ ESTADO: Backend listo para recibir peticiones`);
    console.log('=========================================================');
});
