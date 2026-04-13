// ==========================================
// CONTROLADOR DE PRODUCTOS (PERFUMES)
// Gestión de inventario en la base de datos NoSQL
// ==========================================
const Producto = require('../models/Producto');

// Listar todos los perfumes
exports.obtenerProductos = async (req, res) => {
    try {
        // Ordenamos por fecha de creación para mostrar los más nuevos primero
        const productos = await Producto.find().sort({ fechaCreacion: -1 });
        
        // Log de diagnóstico para monitorear el tráfico desde el servidor
        console.log(`📡 Enviando ${productos.length} productos al frontend`);
        
        res.json(productos);
    } catch (error) {
        console.error("Error en obtenerProductos:", error);
        res.status(500).json({ mensaje: 'Error al buscar productos' });
    }
};

// Crear un nuevo perfume
exports.crearProducto = async (req, res) => {
    try {
        // Validación de integridad: Evita guardar documentos vacíos
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ mensaje: 'El cuerpo de la solicitud no puede estar vacío' });
        }

        const nuevoProducto = new Producto(req.body);
        await nuevoProducto.save();
        
        console.log(`✨ Producto creado exitosamente: ${nuevoProducto.nombre}`);
        res.status(201).json(nuevoProducto);
    } catch (error) {
        console.error("Error en crearProducto:", error);
        res.status(400).json({ 
            mensaje: 'Error al crear producto', 
            error: error.message 
        });
    }
};
