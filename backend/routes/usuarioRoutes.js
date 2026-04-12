const express = require('express');
const router = express.Router();
// Importamos el controlador con todas sus funciones
const usuarioController = require('../controllers/usuarioController');

/**
 * @route   GET /api/usuarios
 * @desc    Obtener todos los usuarios (sin mostrar contraseñas)
 * @access  Público (para fines de la evidencia GA7-EV03)
 */
router.get('/', usuarioController.obtenerUsuarios);

/**
 * @route   POST /api/usuarios
 * @desc    Registrar un nuevo usuario
 * @access  Público
 */
router.post('/', usuarioController.crearUsuario);

/**
 * @route   DELETE /api/usuarios/:id
 * @desc    Eliminar un usuario por su ID
 * @access  Privado/Admin
 */
// Se asegura de que usuarioController.eliminarUsuario esté definido para evitar el TypeError
if (usuarioController.eliminarUsuario) {
    router.delete('/:id', usuarioController.eliminarUsuario);
} else {
    console.warn("Advertencia: La función eliminarUsuario no está definida en el controlador.");
}

module.exports = router;