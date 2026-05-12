// ==========================================
// RUTAS DE USUARIOS - PERFUMERÍA VIOLETA
// Definición de Endpoints para la Gestión de Usuarios
// ==========================================

const express = require('express');
const router = express.Router();

// Importamos el controlador con la lógica de negocio y persistencia
const usuarioController = require('../controllers/usuarioController');

// ==========================================
// 1. RUTA: OBTENER TODOS LOS USUARIOS (GET / HEAD)
// ==========================================
/**
 * @route   GET /api/usuarios
 * @desc    Obtiene la lista de usuarios registrados en MongoDB.
 * @access  Público
 */
router.get('/', usuarioController.obtenerUsuarios);

/**
 * @route   HEAD /api/usuarios
 * @desc    Verifica la disponibilidad del endpoint sin descargar el cuerpo.
 */
router.head('/', usuarioController.obtenerUsuarios);

// ==========================================
// 2. RUTA: REGISTRAR UN NUEVO USUARIO (POST)
// ==========================================
/**
 * @route   POST /api/usuarios
 * @desc    Recibe datos del Frontend y los guarda en la base de datos.
 * @access  Público
 */
router.post('/', usuarioController.crearUsuario);

// ==========================================
// 3. RUTA: ACTUALIZAR USUARIO (PUT / PATCH)
// ==========================================
/**
 * @route   PUT /api/usuarios/:id
 * @desc    Actualiza la información completa de un usuario por ID.
 * @access  Privado/Administrador
 */
router.put('/:id', usuarioController.actualizarUsuario);

/**
 * @route   PATCH /api/usuarios/:id
 * @desc    Actualiza de forma parcial datos de un usuario (ej. solo el correo).
 * @access  Privado/Administrador
 */
router.patch('/:id', usuarioController.actualizarUsuario);

// ==========================================
// 4. RUTA: ELIMINAR USUARIO POR ID (DELETE)
// ==========================================
/**
 * @route   DELETE /api/usuarios/:id
 * @desc    Elimina un documento de la colección basándose en su ID único.
 * @access  Privado/Administrador
 */
router.delete('/:id', usuarioController.eliminarUsuario);

// Exportamos el router para que sea utilizado en index.js
module.exports = router;
