// ==========================================
// CONFIGURACIÓN DE BASE DE DATOS (MongoDB)
// ==========================================
const mongoose = require('mongoose');

const conectarDB = async () => {
    try {
        // Usa la variable de entorno del .env o la URL local por defecto
        const url = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/perfumeriaVioleta';
        
        // Configuración de conexión a MongoDB mediante Mongoose
        const connection = await mongoose.connect(url);

        const host = connection.connection.host;
        const port = connection.connection.port;
        const dbName = connection.connection.name;

        console.log(`✅ MongoDB Conectado en: ${host}:${port}`);
        console.log(`🌸 Base de Datos activa: ${dbName}`); 

    } catch (error) {
        console.error(`❌ Error de conexión a la base de datos: ${error.message}`);
        // Detiene la aplicación si no hay conexión para evitar errores en cascada
        process.exit(1); 
    }
};

module.exports = conectarDB;
