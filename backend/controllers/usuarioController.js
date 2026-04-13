// ==========================================
// CONTROLADOR DE USUARIOS - PERFUMERÍA VIOLETA
// Propósito: Gestionar el ciclo de vida de los usuarios en MongoDB
// ==========================================

const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs'); // Necesario para la seguridad de contraseñas

// ==========================================
// 1. OBTENER USUARIOS (GET)
// ==========================================
exports.obtenerUsuarios = async (req, res) => {
    try {
        // Traemos todos los registros de la colección 'usuarios'
        // .sort({ creado: -1 }) hace que los más nuevos aparezcan primero (como en el video)
        const usuarios = await Usuario.find().sort({ creado: -1 });
        
        res.json(usuarios);
    } catch (error) {
        console.error("❌ Error al listar usuarios:", error);
        res.status(500).json({ msg: 'Hubo un error al obtener los usuarios' });
    }
};

// ==========================================
// 2. REGISTRAR USUARIO (POST)
// ==========================================
exports.crearUsuario = async (req, res) => {
    // Extraemos los datos enviados desde el formulario de React
    const { email, password, nombre } = req.body;

    try {
        // A. VALIDACIÓN PREVIA: Verificar que no falten datos esenciales
        if (!email || !password || !nombre) {
            return res.status(400).json({ msg: 'Todos los campos son obligatorios' });
        }

        // B. UNICIDAD: Comprobar si el correo ya existe en MongoDB
        let usuarioExistente = await Usuario.findOne({ email });
        if (usuarioExistente) {
            return res.status(400).json({ msg: 'El correo ya está registrado' });
        }

        // C. INSTANCIA: Creamos el nuevo objeto siguiendo el Modelo
        const nuevoUsuario = new Usuario(req.body);

        // D. SEGURIDAD: Encriptación de contraseña (Hasing)
        // Generamos una semilla de seguridad (salt) de 10 rondas
        const salt = await bcryptjs.genSalt(10);
        // Hasheamos la clave plana para que en MongoDB sea ilegible por humanos
        nuevoUsuario.password = await bcryptjs.hash(password, salt);

        // E. PERSISTENCIA: Guardamos en la base de datos
        await nuevoUsuario.save();
        
        console.log(`✅ Nuevo usuario en MongoDB: ${email}`);

        // F. LIMPIEZA: No enviamos el password de vuelta al cliente por seguridad
        const respuestaSegura = nuevoUsuario.toObject();
        delete respuestaSegura.password;

        res.status(201).json({
            msg: 'Usuario creado con éxito en MongoDB',
            usuario: respuestaSegura
        });

    } catch (error) {
        console.error("❌ Error en el registro:", error);
        res.status(500).json({ msg: 'Error interno al procesar el registro' });
    }
};

// ==========================================
// 3. ELIMINAR USUARIO (DELETE)
// ==========================================
exports.eliminarUsuario = async (req, res) => {
    try {
        // Obtenemos el ID desde los parámetros de la URL (req.params.id)
        const idUsuario = req.params.id;

        // Intentamos buscar y borrar en un solo paso
        const usuarioBorrado = await Usuario.findByIdAndDelete(idUsuario);

        if (!usuarioBorrado) {
            return res.status(404).json({ msg: 'El usuario no existe en la base de datos' });
        }

        console.log(`🗑️ Usuario eliminado: ${idUsuario}`);
        res.json({ msg: 'Usuario eliminado correctamente de MongoDB' });

    } catch (error) {
        console.error("❌ Error al eliminar:", error);
        res.status(500).json({ msg: 'Error al intentar borrar el registro' });
    }
};
