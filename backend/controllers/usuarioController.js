// ==========================================
// CONTROLADOR DE USUARIOS
// Lógica para el Registro y Consulta de Usuarios
// ==========================================
const Usuario = require('../models/Usuario');

// Listar todos los usuarios
exports.obtenerUsuarios = async (req, res) => {
    try {
        // El campo 'password' se excluye automáticamente por el modelo (select: false)
        const usuarios = await Usuario.find();
        res.json(usuarios);
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error al obtener los usuarios');
    }
};

// Registrar un nuevo usuario
exports.crearUsuario = async (req, res) => {
    try {
        const usuario = new Usuario(req.body);
        await usuario.save();

        // Creamos una respuesta local segura eliminando el password antes de enviar al cliente
        const usuarioRespuesta = usuario.toObject();
        delete usuarioRespuesta.password;

        res.status(201).json(usuarioRespuesta);
    } catch (error) {
        console.log(error);
        // Manejo de errores de validación o correos duplicados
        res.status(400).send('Error al registrar el usuario');
    }
};
