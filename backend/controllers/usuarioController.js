const Usuario = require('../models/Usuario');

// Obtener todos los usuarios (Prueba GET para la evidencia)
const obtenerUsuarios = async (req, res) => {
    try {
        // El signo '-' indica que queremos excluir ese campo específicamente
        const usuarios = await Usuario.find().select('-password'); 
        
        res.status(200).json(usuarios);
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error al obtener los usuarios');
    }
};

// Crear un nuevo usuario (POST)
const crearUsuario = async (req, res) => {
    try {
        let usuario = new Usuario(req.body);
        await usuario.save();
        
        // Al responder, enviamos el objeto pero eliminamos el password 
        // de la respuesta local por si acaso
        const usuarioRespuesta = usuario.toObject();
        delete usuarioRespuesta.password;

        res.status(201).json(usuarioRespuesta);
    } catch (error) {
        console.log(error);
        res.status(400).send('Error al registrar el usuario');
    }
};

module.exports = {
    obtenerUsuarios,
    crearUsuario
};