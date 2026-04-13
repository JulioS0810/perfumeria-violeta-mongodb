// ==========================================
// RUTAS DE PRODUCTOS (PERFUMES)
// Definición de Endpoints para el Inventario
// ==========================================
const express = require('express');
const router = express.Router();

// Importamos el controlador que maneja la lógica de los productos en MongoDB
const productoControllers = require('../controllers/productoController');

// ==========================================
// 1. RUTA: LISTAR PRODUCTOS (GET)
// ==========================================
/**
 * @route   GET /api/productos
 * @desc    Obtiene todos los perfumes almacenados en la base de datos NoSQL.
 * @access  Público
 */
router.get('/', productoControllers.obtenerProductos);

// ==========================================
// 2. RUTA: CREAR PRODUCTO (POST)
// ==========================================
/**
 * @route   POST /api/productos
 * @desc    Registra un nuevo perfume en la colección 'productos'.
 * @access  Público
 */
router.post('/', productoControllers.crearProducto);

module.exports = router;
