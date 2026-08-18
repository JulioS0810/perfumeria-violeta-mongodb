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
// 2. RUTA: OBTENER PRODUCTO POR ID (GET)
// ==========================================
/**
 * @route   GET /api/productos/:id
 * @desc    Obtiene un perfume específico por su ID.
 * @access  Público
 */
router.get('/:id', productoControllers.obtenerProductoPorId);

// ==========================================
// 3. RUTA: CREAR PRODUCTO (POST)
// ==========================================
/**
 * @route   POST /api/productos
 * @desc    Registra un nuevo perfume en la colección 'productos'.
 * @access  Privado/Admin
 */
router.post('/', productoControllers.crearProducto);

// ==========================================
// 4. RUTA: ACTUALIZAR PRODUCTO (PUT)
// ==========================================
/**
 * @route   PUT /api/productos/:id
 * @desc    Actualiza un perfume existente.
 * @access  Privado/Admin
 */
router.put('/:id', productoControllers.actualizarProducto);

// ==========================================
// 5. RUTA: ELIMINAR PRODUCTO (DELETE)
// ==========================================
/**
 * @route   DELETE /api/productos/:id
 * @desc    Elimina un perfume de la colección.
 * @access  Privado/Admin
 */
router.delete('/:id', productoControllers.eliminarProducto);

module.exports = router;
