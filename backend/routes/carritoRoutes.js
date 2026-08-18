const express = require('express');
const router = express.Router();
const carritoController = require('../controllers/carritoController');

router.get('/:usuarioId', carritoController.obtenerCarrito);
router.post('/:usuarioId/agregar', carritoController.agregarProducto);
router.put('/:usuarioId/actualizar', carritoController.actualizarCantidad);
router.delete('/:usuarioId/eliminar/:productoId', carritoController.eliminarProducto);
router.delete('/:usuarioId/vaciar', carritoController.vaciarCarrito);

module.exports = router;
