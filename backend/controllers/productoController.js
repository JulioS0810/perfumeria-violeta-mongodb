// ==========================================
// CONTROLADOR DE PRODUCTOS (PERFUMES) - PERFUMERÍA VIOLETA
// Gestión de inventario en la base de datos NoSQL (MongoDB)
// Evidencia: GA9-220501096-AA1-EV01 (Módulos Refactorizados)
// ==========================================
const Producto = require('../models/Producto');

/**
 * @route   GET /api/productos
 * @desc    Soporta filtrado por género, marca y búsqueda por name con ordenamiento alfabético
 * @access  Public
 * @param   {Object} req - Objeto de petición HTTP de Express
 * @param   {Object} req.query - Parámetros de consulta (Query Params) de la URL
 * @param   {string} [req.query.genero] - Filtro por categoría de género (Hombre/Mujer/Unisex)
 * @param   {string} [req.query.marca] - Filtro por marca del diseñador
 * @param   {string} [req.query.name] - Término de búsqueda parcial insensible a mayúsculas/minúsculas
 * @param   {Object} res - Objeto de respuesta HTTP de Express
 * @returns {Promise<void>} Retorna un estatus 200 con el arreglo de productos, o 500 si ocurre un fallo en el servidor
 */
exports.obtenerProductos = async (req, res) => {
    try {
        // Extraemos parámetros de consulta (Query Params) de la URL
        // Ejemplo: /api/productos?genero=Mujer&marca=Afnan
        const { genero, marca, name } = req.query;
        let filtro = {};

        // Si el usuario filtra por género (Hombre/Mujer/Unisex)
        if (genero) {
            filtro.genero = genero;
        }

        // Si el usuario filtra por una marca específica
        if (marca) {
            filtro.marca = marca;
        }

        // Búsqueda por name (insensible a mayúsculas/minúsculas)
        if (name && name.trim() !== '') {
            filtro.nombre = { $regex: name, $options: 'i' };
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

/**
 * @route   POST /api/productos
 * @desc    Permite el registro manual de nuevas fragancias validando la integridad del payload
 * @access  Private/Admin
 * @param   {Object} req - Objeto de petición de Express que contiene los campos del producto en el body
 * @param   {Object} res - Objeto de respuesta de Express para confirmar la creación del documento
 * @returns {Promise<void>} Retorna estatus 201 con el producto guardado, o 400 por error de validación
 */
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
        
        console.log(`✨ Producto creado exitosamente: ${nuevoProducto.name}`);
        res.status(201).json(productoGuardado);
    } catch (error) {
        console.error("❌ Error en crearProducto:", error);
        res.status(400).json({ 
            mensaje: 'Error al intentar registrar el perfume', 
            error: error.message 
        });
    }
};

/**
 * @route   GET /api/productos/:id
 * @desc    Busca de forma aislada un único perfume utilizando su Object ID de MongoDB
 * @access  Public
 * @param   {Object} req - Objeto de petición de Express que transporta los parámetros de ruta
 * @param   {string} req.params.id - El ID hexadecimal de 24 caracteres correspondiente al producto
 * @param   {Object} res - Objeto de respuesta de Express
 * @returns {Promise<void>} Retorna estatus 200 con el detalle del perfume, o 404 si no se encuentra
 */
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
