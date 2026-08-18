// Modelo de pedidos: conserva una copia de los productos y del total al momento de comprar.
const mongoose = require('mongoose');

// Los datos se congelan dentro del pedido para mantener el historial aunque cambie el catálogo.
const pedidoItemSchema = new mongoose.Schema({
    productoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Producto',
        required: true
    },
    nombre: { type: String, required: true, trim: true },
    marca: { type: String, required: true, trim: true },
    precio: { type: Number, required: true, min: 0 },
    imagen: { type: String, default: '' },
    cantidad: { type: Number, required: true, min: 1 }
}, { _id: false });

// Estados posibles del ciclo de vida de una compra.
const pedidoSchema = new mongoose.Schema({
    usuarioId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true,
        index: true
    },
    referencia: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    items: {
        type: [pedidoItemSchema],
        required: true,
        validate: items => items.length > 0
    },
    subtotal: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
    estado: {
        type: String,
        enum: [
            'pendiente',
            'pagado',
            'rechazado',
            'cancelado',
            'pagado_stock_pendiente'
        ],
        default: 'pendiente',
        index: true
    },
    transaccionId: { type: String, default: '' },
    fechaPago: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model('Pedido', pedidoSchema);
