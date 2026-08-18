// Controlador del carrito persistido por usuario.
const Carrito = require('../models/Carrito');

// Recalcula los importes después de cualquier modificación de los ítems.
const calcularTotales = (carrito) => {
    const subtotal = carrito.items.reduce((acumulado, item) => {
        return acumulado + (item.precio * item.cantidad);
    }, 0);

    carrito.subtotal = subtotal;
    carrito.total = subtotal;

    return carrito;
};

// Devuelve el carrito existente o crea uno vacío para el usuario solicitado.
exports.obtenerCarrito = async (req, res) => {
    try {
        const { usuarioId } = req.params;

        let carrito = await Carrito.findOne({ usuarioId });

        if (!carrito) {
            carrito = new Carrito({
                usuarioId,
                items: [],
                subtotal: 0,
                total: 0,
                estado: 'activo'
            });

            await carrito.save();
        }

        res.status(200).json(carrito);
    } catch (error) {
        console.error('❌ Error al obtener el carrito:', error);
        res.status(500).json({
            mensaje: 'Error al consultar el carrito de compras',
            error: error.message
        });
    }
};

// Añade un producto o incrementa la cantidad si ya existe en el carrito.
exports.agregarProducto = async (req, res) => {
    try {
        const { usuarioId } = req.params;
        const { productoId, nombre, marca, precio, imagen, cantidad } = req.body;

        if (!productoId || !nombre || !marca || !precio || !cantidad) {
            return res.status(400).json({
                mensaje: 'Faltan datos para agregar el producto al carrito'
            });
        }

        let carrito = await Carrito.findOne({ usuarioId });

        if (!carrito) {
            carrito = new Carrito({
                usuarioId,
                items: [],
                subtotal: 0,
                total: 0,
                estado: 'activo'
            });
        }

        carrito.estado = 'activo';

        const cantidadFinal = Number(cantidad);

        const itemExistente = carrito.items.find(
            item => item.productoId.toString() === productoId.toString()
        );

        if (itemExistente) {
            itemExistente.cantidad += cantidadFinal;
        } else {
            carrito.items.push({
                productoId,
                nombre,
                marca,
                precio: Number(precio),
                imagen: imagen || '',
                cantidad: cantidadFinal
            });
        }

        calcularTotales(carrito);
        await carrito.save();

        res.status(200).json({
            mensaje: 'Producto agregado al carrito correctamente',
            carrito
        });
    } catch (error) {
        console.error('❌ Error al agregar el producto:', error);
        res.status(500).json({
            mensaje: 'Error al agregar el producto al carrito',
            error: error.message
        });
    }
};

// Actualiza la cantidad usando el identificador real del producto, no el del subdocumento.
exports.actualizarCantidad = async (req, res) => {
    try {
        const { usuarioId } = req.params;
        const { productoId, cantidad } = req.body;

        if (!productoId || !cantidad) {
            return res.status(400).json({
                mensaje: 'Debe enviar el producto y la cantidad a actualizar'
            });
        }

        const carrito = await Carrito.findOne({ usuarioId });

        if (!carrito) {
            return res.status(404).json({ mensaje: 'No existe un carrito para este usuario' });
        }

        const item = carrito.items.find(
            producto => producto.productoId.toString() === productoId.toString()
        );

        if (!item) {
            return res.status(404).json({ mensaje: 'El producto no está en el carrito' });
        }

        const nuevaCantidad = Number(cantidad);

        if (nuevaCantidad <= 0) {
            carrito.items = carrito.items.filter(
                producto => producto.productoId.toString() !== productoId.toString()
            );
        } else {
            item.cantidad = nuevaCantidad;
        }

        calcularTotales(carrito);
        await carrito.save();

        res.status(200).json({
            mensaje: 'Cantidad actualizada correctamente',
            carrito
        });
    } catch (error) {
        console.error('❌ Error al actualizar cantidad:', error);
        res.status(500).json({
            mensaje: 'Error al actualizar la cantidad del carrito',
            error: error.message
        });
    }
};

// Elimina todos los ítems que correspondan al producto indicado.
exports.eliminarProducto = async (req, res) => {
    try {
        const { usuarioId, productoId } = req.params;

        const carrito = await Carrito.findOne({ usuarioId });

        if (!carrito) {
            return res.status(404).json({ mensaje: 'No existe un carrito para este usuario' });
        }

        const cantidadAntes = carrito.items.length;

        carrito.items = carrito.items.filter(
            item => item.productoId.toString() !== productoId.toString()
        );

        if (carrito.items.length === cantidadAntes) {
            return res.status(404).json({ mensaje: 'El producto no se encontró en el carrito' });
        }

        calcularTotales(carrito);
        await carrito.save();

        res.status(200).json({
            mensaje: 'Producto eliminado del carrito',
            carrito
        });
    } catch (error) {
        console.error('❌ Error al eliminar producto:', error);
        res.status(500).json({
            mensaje: 'Error al eliminar el producto del carrito',
            error: error.message
        });
    }
};

// Vacía los ítems y reinicia los totales sin eliminar el documento del carrito.
exports.vaciarCarrito = async (req, res) => {
    try {
        const { usuarioId } = req.params;

        let carrito = await Carrito.findOne({ usuarioId });

        if (!carrito) {
            return res.status(404).json({ mensaje: 'No existe un carrito para este usuario' });
        }

        carrito.items = [];
        carrito.subtotal = 0;
        carrito.total = 0;
        carrito.estado = 'activo';

        await carrito.save();

        res.status(200).json({
            mensaje: 'Carrito vaciado correctamente',
            carrito
        });
    } catch (error) {
        console.error('❌ Error al vaciar carrito:', error);
        res.status(500).json({
            mensaje: 'Error al vaciar el carrito',
            error: error.message
        });
    }
};
