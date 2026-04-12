const mongoose = require('mongoose');

const conectarDB = async () => {
    try {
        // Usamos la variable de entorno del .env o la URL local por defecto
        const url = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/perfumeriaVioleta';
        
        // Conexión a MongoDB
        const connection = await mongoose.connect(url);

        const host = connection.connection.host;
        const port = connection.connection.port;
        const dbName = connection.connection.name; // <--- Nombre real de la BD

        console.log(`✅ MongoDB Conectado en: ${host}:${port}`);
        console.log(`🌸 Base de Datos activa: ${dbName}`); 

    } catch (error) {
        console.error(`❌ Error de conexión a la base de datos: ${error.message}`);
        process.exit(1); // Detiene la app si no hay conexión
    }
};

module.exports = conectarDB;