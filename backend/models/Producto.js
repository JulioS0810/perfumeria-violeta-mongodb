// ==========================================
// MODELO DE PRODUCTO (PERFUMES) - PERFUMERÍA VIOLETA
// Esquema de la base de datos NoSQL (MongoDB)
// Evidencia: GA9-220501096-AA1-EV01 (Módulos Refactorizados)
// ==========================================
const mongoose = require('mongoose');

const ProductoSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    marca: {
        type: String,
        required: true,
        trim: true
    },
    precio: {
        type: Number,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    genero: {
        type: String,
        required: true,
        enum: ['Hombre', 'Mujer', 'Unisex'], // Solo permite estos valores
        default: 'Unisex'
    },
    categoria: {
        type: String, // Ejemplo: Floral, Cítrico, Amaderado
        required: true
    },
    imagen: {
        type: String, // URL de la imagen del producto
        default: 'https://via.placeholder.com/300'
    },
    stock: {
        type: Number,
        default: 10
    },
    fechaCreacion: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Producto', ProductoSchema);
