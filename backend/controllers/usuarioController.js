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
        // .sort({ fechaCreacion: -1 }) asegura que los más nuevos aparezcan primero
        const usuarios = await Usuario.find().sort({ fechaCreacion: -1 });
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
    const { email, password, nombre } = req.body;

    try {
        if (!email || !password || !nombre) {
            return res.status(400).json({ msg: 'Todos los campos son obligatorios' });
        }

        let usuarioExistente = await Usuario.findOne({ email });
        if (usuarioExistente) {
            return res.status(400).json({ msg: 'El correo ya está registrado' });
        }

        const nuevoUsuario = new Usuario(req.body);

        // SEGURIDAD: Hashing de contraseña
        const salt = await bcryptjs.genSalt(10);
        nuevoUsuario.password = await bcryptjs.hash(password, salt);

        await nuevoUsuario.save();
        console.log(`✅ Nuevo usuario en MongoDB: ${email}`);

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
// 3. ACTUALIZAR USUARIO (PUT / PATCH)
// ==========================================
exports.actualizarUsuario = async (req, res) => {
    try {
        const idUsuario = req.params.id;
        const datosNuevos = req.body;

        // Si el usuario intenta actualizar el password, debemos hashearlo de nuevo
        if (datosNuevos.password) {
            const salt = await bcryptjs.genSalt(10);
            datosNuevos.password = await bcryptjs.hash(datosNuevos.password, salt);
        }

        // Buscamos y actualizamos. { new: true } devuelve el documento ya modificado.
        const usuarioActualizado = await Usuario.findByIdAndUpdate(
            idUsuario,
            { $set: datosNuevos },
            { new: true }
        );

        if (!usuarioActualizado) {
            return res.status(404).json({ msg: 'El usuario no existe' });
        }

        console.log(`🔄 Usuario actualizado: ${idUsuario}`);
        res.json({
            msg: 'Usuario actualizado correctamente en MongoDB',
            usuario: usuarioActualizado
        });

    } catch (error) {
        console.error("❌ Error al actualizar:", error);
        res.status(500).json({ msg: 'Error al intentar actualizar el registro' });
    }
};

// ==========================================
// 4. ELIMINAR USUARIO (DELETE)
// ==========================================
exports.eliminarUsuario = async (req, res) => {
    try {
        const idUsuario = req.params.id;
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
