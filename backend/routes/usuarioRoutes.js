// ==========================================
// RUTAS DE USUARIOS
// Definición de Endpoints para la Gestión de Usuarios
// ==========================================
const express = require('express');
const router = express.Router();

// Importamos el controlador que contiene la lógica de persistencia en MongoDB
const usuarioController = require('../controllers/usuarioController');

// ==========================================
// 1. RUTA: OBTENER TODOS LOS USUARIOS (GET)
// ==========================================
/**
 * @route   GET /api/usuarios
 * @desc    Obtiene la lista de usuarios registrados.
 * Nota: La seguridad de excluir el password se maneja en el modelo/controlador.
 */
router.get('/', usuarioController.obtenerUsuarios);

// ==========================================
// 2. RUTA: REGISTRAR UN NUEVO USUARIO (POST)
// ==========================================
/**
 * @route   POST /api/usuarios
 * @desc    Recibe los datos del frontend/Postman y los guarda en la base de datos NoSQL.
 */
router.post('/', usuarioController.crearUsuario);

// ==========================================
// 3. RUTA: ELIMINAR USUARIO (DELETE)
// ==========================================
/**
 * @route   DELETE /api/usuarios/:id
 * @desc    Elimina un documento de la colección basándose en su _id de MongoDB.
 */
// Validación de seguridad para asegurar que la función existe en el controlador
if (usuarioController.eliminarUsuario) {
    router.delete('/:id', usuarioController.eliminarUsuario);
} else {
    // Mensaje preventivo en consola para el desarrollador
    console.warn("⚠️ Advertencia: La función eliminarUsuario no está definida en usuarioController.js");
}

module.exports = router;
