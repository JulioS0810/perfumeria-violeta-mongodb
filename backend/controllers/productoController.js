// ==========================================
// CONTROLADOR DE PRODUCTOS (PERFUMES) - PERFUMERÍA VIOLETA
// Gestión de inventario en la base de datos NoSQL (MongoDB)
// Evidencia: GA8-220501096-AA1-EV02 (Módulos Integrados)
// ==========================================
const Producto = require('../models/Producto');

// ==========================================
// 1. OBTENER PRODUCTOS (GET)
// Soporta filtrado por género, marca y búsqueda por nombre
// ==========================================
exports.obtenerProductos = async (req, res) => {
    try {
        // Extraemos parámetros de consulta (Query Params) de la URL
        // Ejemplo: /api/productos?genero=Mujer&marca=Afnan
        const { genero, marca, nombre } = req.query;
        let filtro = {};

        // Si el usuario filtra por género (Hombre/Mujer/Unisex)
        if (genero) {
            filtro.genero = genero;
        }

        // Si el usuario filtra por una marca específica
        if (marca) {
            filtro.marca = marca;
        }

        // Búsqueda por nombre (insensible a mayúsculas/minúsculas)
        if (nombre) {
            filtro.nombre = { $regex: nombre, $options: 'i' };
        }

        // Buscamos en MongoDB aplicando el filtro y ordenando alfabéticamente
        const productos = await Producto.find(filtro).sort({ nombre: 1 });
        
        // Log de diagnóstico para el desarrollador en la terminal
        console.log(`📡 GET /api/productos: Enviando ${productos.length} fragancias al frontend`);
        
        res.status(200).json(productos);
    } catch (error) {
        console.error("❌ Error en obtenerProductos:", error);
        res.status(500).json({ 
            mensaje: 'Error al recuperar el catálogo de perfumes',
            error: error.message 
        });
    }
};

// ==========================================
// 2. CREAR PRODUCTO (POST)
// Permite el registro manual de nuevas fragancias
// ==========================================
exports.crearProducto = async (req, res) => {
    try {
        // Validación de seguridad: Verificar que el cuerpo no esté vacío
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ mensaje: 'No se recibieron datos para el nuevo producto' });
        }

        // Creamos una nueva instancia del modelo Producto con los datos recibidos
        const nuevoProducto = new Producto(req.body);
        
        // Guardamos el documento en la colección de MongoDB
        const productoGuardado = await nuevoProducto.save();
        
        console.log(`✨ Producto creado exitosamente: ${nuevoProducto.nombre}`);
        res.status(201).json(productoGuardado);
    } catch (error) {
        console.error("❌ Error en crearProducto:", error);
        res.status(400).json({ 
            mensaje: 'Error al intentar registrar el perfume', 
            error: error.message 
        });
    }
};

// ==========================================
// 3. OBTENER PRODUCTO POR ID (GET)
// Útil para la vista de "Detalle del Producto"
// ==========================================
exports.obtenerProductoPorId = async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id);
        if (!producto) {
            return res.status(404).json({ mensaje: 'Perfume no encontrado' });
        }
        res.status(200).json(producto);
    } catch (error) {
        console.error("❌ Error en obtenerProductoPorId:", error);
        res.status(500).json({ mensaje: 'Error al buscar el detalle del perfume' });
    }
};
