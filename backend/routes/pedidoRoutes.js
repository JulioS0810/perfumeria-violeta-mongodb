const express = require('express');
const pedidoController = require('../controllers/pedidoController');

const router = express.Router();

// Crea un pedido pendiente o ejecuta el checkout demo local.
router.post('/checkout', pedidoController.crearCheckout);

// Recibe la confirmación de una transacción enviada por Wompi.
router.post('/webhook/wompi', pedidoController.webhookWompi);

// Permite consultar el estado de un pedido mediante su identificador.
router.get('/:id', pedidoController.obtenerPedido);

module.exports = router;
