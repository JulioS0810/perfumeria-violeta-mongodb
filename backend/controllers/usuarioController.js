// ==========================================
// CONTROLADOR DE USUARIOS
// Lógica para el Registro y Consulta de Usuarios
// ==========================================
const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs'); // Librería para encriptar contraseñas

// ==========================================
// 1. LISTAR USUARIOS (GET)
// ==========================================
exports.obtenerUsuarios = async (req, res) => {
    try {
        // Traemos todos los usuarios. 
        // Nota: El password se excluye gracias a 'select: false' en el Modelo.
        const usuarios = await Usuario.find().sort({ creado: -1 });
        res.json(usuarios);
    } catch (error) {
        console.error("❌ Error en obtenerUsuarios:", error);
        res.status(500).json({ msg: 'Hubo un error al obtener los usuarios' });
    }
};

// ==========================================
// 2. REGISTRAR USUARIO (POST)
// ==========================================
exports.crearUsuario = async (req, res) => {
    // Extraemos email y password del cuerpo de la petición (del formulario)
    const { email, password } = req.body;

    try {
        // A. VALIDACIÓN: Verificar que el usuario sea único
        let usuario = await Usuario.findOne({ email });
        if (usuario) {
            return res.status(400).json({ msg: 'El correo ya está registrado en Perfumería Violeta' });
        }

        // B. INSTANCIA: Creamos el nuevo usuario con los datos del formulario
        usuario = new Usuario(req.body);

        // C. SEGURIDAD: Encriptar la contraseña antes de guardar
        // Generamos un 'salt' (una semilla de encriptación)
        const salt = await bcryptjs.genSalt(10);
        // Reemplazamos el password plano por el hash encriptado
        usuario.password = await bcryptjs.hash(password, salt);

        // D. PERSISTENCIA: Guardamos en MongoDB
        await usuario.save();
        console.log(`✅ Usuario registrado con éxito: ${email}`);

        // E. RESPUESTA: Enviamos el objeto creado (sin password) para confirmar al Frontend
        const usuarioRespuesta = usuario.toObject();
        delete usuarioRespuesta.password;

        res.status(201).json({
            msg: 'Usuario creado correctamente',
            usuario: usuarioRespuesta
        });

    } catch (error) {
        console.error("❌ Error en crearUsuario:", error);
        res.status(400).json({ msg: 'No se pudo completar el registro' });
    }
};

// ==========================================
// 3. ELIMINAR USUARIO (DELETE)
// ==========================================
// Esta función permite completar el ciclo que viste en el video de la instructora
exports.eliminarUsuario = async (req, res) => {
    try {
        // Buscamos por el ID que viene en la URL
        let usuario = await Usuario.findById(req.params.id);

        if (!usuario) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        await Usuario.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Usuario eliminado exitosamente de MongoDB' });
        
    } catch (error) {
        console.error("❌ Error en eliminarUsuario:", error);
        res.status(500).json({ msg: 'Error al intentar eliminar el registro' });
    }
};
