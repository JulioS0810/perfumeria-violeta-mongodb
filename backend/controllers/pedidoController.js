// Controlador de checkout y pagos. La tarjeta nunca pasa por este servidor.
const crypto = require('crypto');
const mongoose = require('mongoose');
const Carrito = require('../models/Carrito');
const Pedido = require('../models/Pedido');
const Producto = require('../models/Producto');

// Genera la firma exigida por Wompi usando la referencia y el total del pedido.
const construirFirmaIntegridad = (referencia, total) => {
    const contenido = `${referencia}${Math.round(total * 100)}COP`;
    return crypto
        .createHash('sha256')
        .update(`${contenido}${process.env.WOMPI_INTEGRITY_SECRET}`)
        .digest('hex');
};

// Evita consultas MongoDB con identificadores mal formados.
const validarUsuarioId = usuarioId => mongoose.Types.ObjectId.isValid(usuarioId);

/**
 * Crea un pedido con precios y stock comprobados directamente en MongoDB.
 * En modo demo marca la compra como pagada localmente; con Wompi devuelve una URL externa.
 */
exports.crearCheckout = async (req, res) => {
    try {
        const { usuarioId } = req.body;

        if (!validarUsuarioId(usuarioId)) {
            return res.status(400).json({ mensaje: 'El usuario no es válido' });
        }

        const carrito = await Carrito.findOne({ usuarioId, estado: 'activo' });
        if (!carrito || carrito.items.length === 0) {
            return res.status(400).json({ mensaje: 'El carrito está vacío' });
        }

        // Los precios del navegador no se utilizan: se consultan de nuevo desde el catálogo.
        const ids = carrito.items.map(item => item.productoId);
        const productos = await Producto.find({ _id: { $in: ids } });
        const productosPorId = new Map(productos.map(producto => [producto._id.toString(), producto]));
        const items = [];

        for (const item of carrito.items) {
            const producto = productosPorId.get(item.productoId.toString());

            if (!producto) {
                return res.status(400).json({ mensaje: `El producto ${item.nombre} ya no existe` });
            }

            if (producto.stock < item.cantidad) {
                return res.status(400).json({
                    mensaje: `Stock insuficiente para ${producto.nombre}`
                });
            }

            items.push({
                productoId: producto._id,
                nombre: producto.nombre,
                marca: producto.marca,
                precio: producto.precio,
                imagen: producto.imagen || '',
                cantidad: item.cantidad
            });
        }

        const total = items.reduce(
            (acumulado, item) => acumulado + item.precio * item.cantidad,
            0
        );
        const referencia = `PV-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`;
        const wompiConfigurado = Boolean(
            process.env.WOMPI_PUBLIC_KEY && process.env.WOMPI_INTEGRITY_SECRET
        );

        const pedido = await Pedido.create({
            usuarioId,
            referencia,
            items,
            subtotal: total,
            total,
            estado: 'pendiente'
        });

        // El modo demo permite presentar el flujo completo sin credenciales ni cobros reales.
        if (!wompiConfigurado || process.env.PAYMENT_MODE === 'demo') {
            for (const item of items) {
                await Producto.findOneAndUpdate(
                    { _id: item.productoId, stock: { $gte: item.cantidad } },
                    { $inc: { stock: -item.cantidad } }
                );
            }

            pedido.estado = 'pagado';
            pedido.transaccionId = `DEMO-${pedido._id}`;
            pedido.fechaPago = new Date();
            await pedido.save();

            await Carrito.findOneAndUpdate(
                { usuarioId },
                {
                    $set: {
                        items: [],
                        subtotal: 0,
                        total: 0,
                        estado: 'comprado'
                    }
                }
            );

            const resultadoDemo = new URL('http://localhost:3000/pago/resultado');
            resultadoDemo.searchParams.set('status', 'APPROVED');
            resultadoDemo.searchParams.set('modo', 'demo');
            resultadoDemo.searchParams.set('pedidoId', pedido._id.toString());

            return res.status(201).json({
                mensaje: 'Pago demo realizado correctamente',
                modoPago: 'demo',
                pedido,
                paymentUrl: resultadoDemo.toString()
            });
        }

        // Para un pago real solo se envían datos públicos y la firma de integridad.
        const parametros = new URLSearchParams({
            'public-key': process.env.WOMPI_PUBLIC_KEY,
            currency: 'COP',
            'amount-in-cents': String(Math.round(total * 100)),
            reference: referencia,
            'signature:integrity': construirFirmaIntegridad(referencia, total),
            'redirect-url': process.env.WOMPI_REDIRECT_URL || 'http://localhost:3000/pago/resultado'
        });

        return res.status(201).json({
            mensaje: 'Pedido creado, continúa con el pago',
            pedido,
            paymentUrl: `${process.env.WOMPI_CHECKOUT_URL || 'https://checkout.wompi.co/p/'}?${parametros.toString()}`
        });
    } catch (error) {
        console.error('❌ Error al crear checkout:', error);
        return res.status(500).json({ mensaje: 'No se pudo iniciar el pago' });
    }
};

/** Devuelve el detalle de un pedido para la pantalla de seguimiento. */
exports.obtenerPedido = async (req, res) => {
    try {
        const pedido = await Pedido.findById(req.params.id);
        if (!pedido) {
            return res.status(404).json({ mensaje: 'Pedido no encontrado' });
        }
        return res.json(pedido);
    } catch (error) {
        return res.status(500).json({ mensaje: 'No se pudo consultar el pedido' });
    }
};

/**
 * Procesa los cambios de estado enviados por Wompi.
 * Un pago aprobado descuenta stock y vacía el carrito una sola vez.
 */
exports.webhookWompi = async (req, res) => {
    try {
        const evento = req.body;
        const transaccion = evento?.data?.transaction;
        const referencia = transaccion?.reference;

        if (!referencia || evento?.event !== 'transaction.updated') {
            return res.status(200).json({ recibido: true });
        }

        const pedido = await Pedido.findOne({ referencia });
        if (!pedido) {
            return res.status(404).json({ mensaje: 'Pedido no encontrado' });
        }

        // Si existe secreto de eventos, se valida antes de modificar el pedido.
        if (process.env.WOMPI_EVENTS_SECRET && evento.signature) {
            const propiedades = evento.signature.properties || [];
            const valores = propiedades.map(propiedad => {
                const partes = propiedad.split('.');
                return partes.reduce((valor, parte) => valor?.[parte], evento);
            });
            const contenido = `${valores.join('')}${evento.timestamp}${process.env.WOMPI_EVENTS_SECRET}`;
            const firma = crypto.createHash('sha256').update(contenido).digest('hex');

            if (firma !== evento.signature.checksum) {
                return res.status(401).json({ mensaje: 'Firma de webhook inválida' });
            }
        }

        if (pedido.estado === 'pagado' || pedido.estado === 'pagado_stock_pendiente') {
            return res.status(200).json({ recibido: true });
        }

        pedido.transaccionId = transaccion.id || '';

        if (transaccion.status === 'APPROVED') {
            // El filtro stock >= cantidad evita dejar existencias negativas.
            let stockDisponible = true;

            for (const item of pedido.items) {
                const actualizado = await Producto.findOneAndUpdate(
                    { _id: item.productoId, stock: { $gte: item.cantidad } },
                    { $inc: { stock: -item.cantidad } },
                    { new: true }
                );

                if (!actualizado) {
                    stockDisponible = false;
                    break;
                }
            }

            pedido.estado = stockDisponible ? 'pagado' : 'pagado_stock_pendiente';
            pedido.fechaPago = new Date();

            if (stockDisponible) {
                await Carrito.findOneAndUpdate(
                    { usuarioId: pedido.usuarioId },
                    {
                        $set: {
                            items: [],
                            subtotal: 0,
                            total: 0,
                            estado: 'comprado'
                        }
                    }
                );
            }
        } else if (['DECLINED', 'ERROR', 'VOIDED'].includes(transaccion.status)) {
            pedido.estado = 'rechazado';
        }

        await pedido.save();
        return res.status(200).json({ recibido: true });
    } catch (error) {
        console.error('❌ Error en webhook de Wompi:', error);
        return res.status(500).json({ mensaje: 'Error procesando webhook' });
    }
};
