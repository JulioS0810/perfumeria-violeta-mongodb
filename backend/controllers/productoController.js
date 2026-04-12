const Producto = require('../models/Producto');

// Listar perfumes
exports.obtenerProductos = async (req, res) => {
    try {
        // .sort({ fechaCreacion: -1 }) opcional para mostrar los más nuevos primero
        const productos = await Producto.find().sort({ fechaCreacion: -1 });
        
        // Verificación para el desarrollador
        console.log(`📡 Enviando ${productos.length} productos al frontend`);
        
        res.json(productos);
    } catch (error) {
        console.error("Error en obtenerProductos:", error);
        res.status(500).json({ mensaje: 'Error al buscar productos' });
    }
};

// Crear perfume
exports.crearProducto = async (req, res) => {
    try {
        // Validamos que el cuerpo de la petición no venga vacío
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ mensaje: 'El cuerpo de la solicitud no puede estar vacío' });
        }

        const nuevoProducto = new Producto(req.body);
        await nuevoProducto.save();
        
        console.log(`✨ Producto creado: ${nuevoProducto.nombre}`);
        res.status(201).json(nuevoProducto);
    } catch (error) {
        console.error("Error en crearProducto:", error);
        res.status(400).json({ 
            mensaje: 'Error al crear producto', 
            error: error.message // Enviamos el mensaje de error específico para debug
        });
    }
};