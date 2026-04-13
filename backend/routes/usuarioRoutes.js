// ==========================================
// RUTAS DE USUARIOS - PERFUMERÍA VIOLETA
// Definición de Endpoints para la Gestión de Usuarios
// ==========================================

const express = require('express');
const router = express.Router();

// Importamos el controlador con la lógica de negocio y persistencia
const usuarioController = require('../controllers/usuarioController');

// ==========================================
// 1. RUTA: OBTENER TODOS LOS USUARIOS (GET)
// ==========================================
/**
 * @route   GET /api/usuarios
 * @desc    Obtiene la lista de usuarios registrados en MongoDB.
 * @access  Público (por ahora)
 */
router.get('/', usuarioController.obtenerUsuarios);

// ==========================================
// 2. RUTA: REGISTRAR UN NUEVO USUARIO (POST)
// ==========================================
/**
 * @route   POST /api/usuarios
 * @desc    Recibe datos del Frontend (React) y los guarda en la base de datos.
 * @access  Público
 */
router.post('/', usuarioController.crearUsuario);

// ==========================================
// 3. RUTA: ELIMINAR USUARIO POR ID (DELETE)
// ==========================================
/**
 * @route   DELETE /api/usuarios/:id
 * @desc    Elimina un documento de la colección basándose en su ID único.
 * @access  Privado/Administrador
 */
router.delete('/:id', usuarioController.eliminarUsuario);

// Exportamos el router para que sea utilizado en index.js
module.exports = router;
