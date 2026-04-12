const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
    nombre: { 
        type: String, 
        required: true, 
        trim: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        lowercase: true, 
        trim: true 
    },
    password: { 
        type: String, 
        required: true, 
        select: false // <--- ESTA ES LA CORRECCIÓN CLAVE
    },
    rol: { 
        type: String, 
        default: 'cliente' 
    },
    fechaCreacion: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('Usuario', usuarioSchema);