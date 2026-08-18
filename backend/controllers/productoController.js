// ==========================================
// CONTROLADOR DE PRODUCTOS (PERFUMES) - PERFUMERÍA VIOLETA
// Gestión de inventario en la base de datos NoSQL (MongoDB)
// Evidencia: GA9-220501096-AA1-EV01 (Módulos Refactorizados)
// ==========================================
const Producto = require('../models/Producto');

/**
 * @route   GET /api/productos
 * @desc    Soporta filtrado por género, marca y búsqueda por nombre con ordenamiento alfabético
 * @access  Public
 * @param   {Object} req - Objeto de petición HTTP de Express
 * @param   {Object} req.query - Parámetros de consulta (Query Params) de la URL
 * @param   {string} [req.query.genero] - Filtro por categoría de género (Hombre/Mujer/Unisex)
 * @param   {string} [req.query.marca] - Filtro por marca del diseñador
 * @param   {string} [req.query.nombre] - Término de búsqueda parcial en español
 * @param   {Object} res - Objeto de respuesta HTTP de Express
 * @returns {Promise<void>} Retorna un estatus 200 con el arreglo de productos, o 500 si ocurre un fallo en el servidor
 */
exports.obtenerProductos = async (req, res) => {
    try {
        // Extraemos parámetros de consulta (Query Params) de la URL usando la nomenclatura en español
        // Ejemplo: /api/productos?genero=Mujer&marca=Lattafa&nombre=Yara
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

        // Validamos que 'nombre' tenga contenido real antes de agregarlo al filtro de la base de datos
        if (nombre && typeof nombre === 'string' && nombre.trim() !== '') {
            filtro.nombre = { $regex: nombre.trim(), $options: 'i' };
        }

        // Buscamos en MongoDB aplicando el filtro y ordenando alfabéticamente por el campo nombre
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

/**
 * @route   PUT /api/productos/:id
 * @desc    Actualiza un perfume existente por su ID
 * @access  Private/Admin
 * @param   {Object} req - Objeto de petición de Express
 * @param   {string} req.params.id - ID del producto a actualizar
 * @param   {Object} res - Objeto de respuesta de Express
 * @returns {Promise<void>} Retorna estatus 200 con el producto actualizado, o 404/400 si hay error
 */
exports.actualizarProducto = async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ mensaje: 'No se recibieron datos para actualizar' });
        }

        const productoActualizado = await Producto.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );

        if (!productoActualizado) {
            return res.status(404).json({ mensaje: 'Perfume no encontrado' });
        }

        console.log(`🔄 Producto actualizado: ${productoActualizado.nombre}`);
        res.status(200).json({
            mensaje: 'Producto actualizado correctamente',
            producto: productoActualizado
        });
    } catch (error) {
        console.error("❌ Error en actualizarProducto:", error);
        res.status(400).json({
            mensaje: 'Error al actualizar el producto',
            error: error.message
        });
    }
};

/**
 * @route   DELETE /api/productos/:id
 * @desc    Elimina un perfume de la base de datos por su ID
 * @access  Private/Admin
 * @param   {Object} req - Objeto de petición de Express
 * @param   {string} req.params.id - ID del producto a eliminar
 * @param   {Object} res - Objeto de respuesta de Express
 * @returns {Promise<void>} Retorna estatus 200 si se elimina, o 404 si no existe
 */
exports.eliminarProducto = async (req, res) => {
    try {
        const productoEliminado = await Producto.findByIdAndDelete(req.params.id);

        if (!productoEliminado) {
            return res.status(404).json({ mensaje: 'Perfume no encontrado' });
        }

        console.log(`🗑️ Producto eliminado: ${productoEliminado.nombre}`);
        res.status(200).json({
            mensaje: 'Producto eliminado correctamente',
            id: req.params.id
        });
    } catch (error) {
        console.error("❌ Error en eliminarProducto:", error);
        res.status(500).json({
            mensaje: 'Error al eliminar el producto',
            error: error.message
        });
    }
};
