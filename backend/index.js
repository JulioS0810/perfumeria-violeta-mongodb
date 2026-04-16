// =========================================================
// SERVIDOR PRINCIPAL - PERFUMERÍA VIOLETA
// Proyecto: GA7-220501096-AA5-EV04
// Aprendiz: Julio César Suárez Garavito
// Arquitectura: Node.js, Express y MongoDB
// =========================================================

// 1. IMPORTACIÓN DE MÓDULOS ESENCIALES
const express = require('express'); // Framework para la creación de la API REST
const conectarDB = require('./config/db'); // Importa la lógica de conexión a la base de datos NoSQL
const cors = require('cors'); // Middleware para habilitar la comunicación entre Frontend y Backend
require('dotenv').config(); // Carga variables de entorno (como el puerto y la URI de la DB)

// =========================================================
// 2. INICIALIZACIÓN DE LA APLICACIÓN
// =========================================================
const app = express();

// =========================================================
// 3. CONEXIÓN A LA BASE DE DATOS
// =========================================================
// Se invoca la función conectarDB para establecer el vínculo con MongoDB.
// IMPORTANTE: El servicio de MongoDB debe estar activo en el sistema 
// para que esta función no retorne un error de conexión.
conectarDB();

// =========================================================
// 4. MIDDLEWARES (PROCESAMIENTO DE INFORMACIÓN)
// =========================================================
app.use(cors()); // Permite peticiones desde el origen de nuestro Frontend (React)
app.use(express.json()); // Habilita la lectura de cuerpos JSON (necesario para pruebas en Postman)

// =========================================================
// 5. RUTAS DE PRUEBA Y DIAGNÓSTICO
// =========================================================

/**
 * @route   GET /
 * @desc    Ruta raíz para verificar que el servidor está escuchando
 */
app.get('/', (req, res) => {
    res.send('🌸 Servidor de Perfumería Violeta - Backend en Línea');
});

/**
 * @route   GET /api/diagnostico
 * @desc    Punto de control para validar conectividad inicial en Postman
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

// Enrutador para la gestión del inventario de perfumes
app.use('/api/productos', require('./routes/productoRoutes'));

// Enrutador principal para la gestión y registro de usuarios (Pruebas de la EV04)
app.use('/api/usuarios', require('./routes/usuarioRoutes'));

// =========================================================
// 7. ARRANQUE DEL SERVIDOR
// =========================================================
// Se define el puerto lógico. Si no existe en el .env, se usa el puerto 4000 por defecto.
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log('=========================================================');
    console.log(`🚀 SERVIDOR INICIADO EN EL PUERTO: ${PORT}`);
    console.log(`🔗 URL BASE: http://localhost:${PORT}`);
    console.log(`✅ ESTADO: Backend listo para recibir peticiones`);
    console.log('=========================================================');
});
