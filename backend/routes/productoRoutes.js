const express = require('express');
const router = express.Router();
const productoControllers = require('../controllers/productoController');

// Ruta para obtener productos: GET /api/productos
router.get('/', productoControllers.obtenerProductos);
router.post('/', productoControllers.crearProducto);

module.exports = router;