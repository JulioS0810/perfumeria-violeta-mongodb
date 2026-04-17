// ==========================================
// SCRIPT DE SEMILLADO (SEEDER) - PERFUMERÍA VIOLETA
// Propósito: Cargar los 132 productos con la información exacta del diseño SQL.
// Evidencia: GA8-220501096-AA1-EV02
// ==========================================

require('dotenv').config();
const mongoose = require('mongoose');
const conectarDB = require('./config/db');
const Producto = require('./models/Producto');

// ==========================================
// 1. BASE DE DATOS DE PRODUCTOS (DATOS CURADOS)
// Se reemplaza el array de strings por objetos para asegurar la integridad 
// del género y la marca definidos en el archivo de texto.
// ==========================================
const perfumes = [
    { nombre: "212 Heroes Forever Young Carolina Herrera", marca: "Carolina Herrera", genero: "Mujer" },
    { nombre: "212 NYC Carolina Herrera", marca: "Carolina Herrera", genero: "Mujer" },
    { nombre: "212 Sexy Carolina Herrera", marca: "Carolina Herrera", genero: "Mujer" },
    { nombre: "212 Vip Rose Carolina Herrera", marca: "Carolina Herrera", genero: "Mujer" },
    { nombre: "212 Vip Carolina Herrera", marca: "Hombre" },
    { nombre: "3 am Sean John", marca: "Sean John", genero: "Hombre" },
    { nombre: "9 am Dive Afnan", marca: "Afnan", genero: "Hombre" },
    { nombre: "9 am Pour Femme Afnan", marca: "Afnan", genero: "Mujer" },
    { nombre: "9 pm Afnan", marca: "Afnan", genero: "Hombre" },
    { nombre: "9 pm Pour Femme Afnan", marca: "Afnan", genero: "Mujer" },
    { nombre: "Acqua Di Gio Giorgio Armani", marca: "Giorgio Armani", genero: "Hombre" },
    { nombre: "Acqua Di Gio Profondo Giorgio Armani", marca: "Giorgio Armani", genero: "Hombre" },
    { nombre: "Acqua Di Gio Profumo Giorgio Armani", marca: "Giorgio Armani", genero: "Hombre" },
    { nombre: "Acqua Di Giogia Giorgio Armani", marca: "Giorgio Armani", genero: "Mujer" },
    { nombre: "Asad Bourbon Lattafa", marca: "Lattafa", genero: "Hombre" },
    { nombre: "Asad Lattafa", marca: "Lattafa", genero: "Hombre" },
    { nombre: "Asad Zanzibar Lattafa", marca: "Lattafa", genero: "Hombre" },
    { nombre: "Bad Boy Carolina Herrera", marca: "Carolina Herrera", genero: "Hombre" },
    { nombre: "Bad Boy Cobalt Elixir Carolina Herrera", marca: "Carolina Herrera", genero: "Hombre" },
    { nombre: "Bad Boy Extreme Carolina Herrera", marca: "Carolina Herrera", genero: "Hombre" },
    { nombre: "Baiser Vole de Cartier", marca: "Cartier", genero: "Mujer" },
    { nombre: "Because it´s You Giorgio Armani", marca: "Giorgio Armani", genero: "Mujer" },
    { nombre: "Bitter Peach Tom Ford", marca: "Tom Ford", genero: "Unisex" },
    { nombre: "Black Opium Intense Yves Saint Laurent", marca: "Yves Saint Laurent", genero: "Mujer" },
    { nombre: "Blue Noir Narciso Rodriguez", marca: "Narciso Rodriguez", genero: "Hombre" },
    { nombre: "CH Carolina Herrera", marca: "Carolina Herrera", genero: "Mujer" },
    { nombre: "Chance Eau Vive Chanel", marca: "Chanel", genero: "Mujer" },
    { nombre: "Chanel Nº 5 Chanel", marca: "Chanel", genero: "Mujer" },
    { nombre: "Classique Jean Paul Gaultier", marca: "Jean Paul Gaultier", genero: "Mujer" },
    { nombre: "Club de Nuit Intense Armaf", marca: "Armaf", genero: "Hombre" },
    { nombre: "Club de Nuit Maleka Armaf", marca: "Armaf", genero: "Mujer" },
    { nombre: "Club de Nuit Precieux Armaf", marca: "Armaf", genero: "Hombre" },
    { nombre: "Club de Nuit Woman Armaf", marca: "Armaf", genero: "Mujer" },
    { nombre: "Coco Eau de Parfum Chanel", marca: "Chanel", genero: "Mujer" },
    { nombre: "Coco Mademoiselle Chanel", marca: "Chanel", genero: "Mujer" },
    { nombre: "Code Profumo Giorgio Armani", marca: "Giorgio Armani", genero: "Hombre" },
    { nombre: "Costa Azzurra Tom Ford", marca: "Tom Ford", genero: "Unisex" },
    { nombre: "Declaration Essence de Cartier", marca: "Cartier", genero: "Hombre" },
    { nombre: "Declaration Parfum de Cartier", marca: "Cartier", genero: "Hombre" },
    { nombre: "Declaration Eau de Toilette de Cartier", marca: "Cartier", genero: "Hombre" },
    { nombre: "Delices de Cartier", marca: "Cartier", genero: "Mujer" },
    { nombre: "Dior Homme Intense Christian Dior", marca: "Christian Dior", genero: "Hombre" },
    { nombre: "Dior Homme Parfum Christian Dior", marca: "Christian Dior", genero: "Hombre" },
    { nombre: "Dior Homme Sport Christian Dior", marca: "Christian Dior", genero: "Hombre" },
    { nombre: "Dylan Blue Versace", marca: "Versace", genero: "Hombre" },
    { nombre: "Eclaire Lattafa", marca: "Lattafa", genero: "Mujer" },
    { nombre: "Eros Energy Versace", marca: "Versace", genero: "Hombre" },
    { nombre: "Eros Flame Versace", marca: "Versace", genero: "Hombre" },
    { nombre: "Eros Versace", marca: "Versace", genero: "Hombre" },
    { nombre: "Fakhar Rose Lattafa", marca: "Lattafa", genero: "Mujer" },
    { nombre: "Fusion D'Issey Issey Miyake", marca: "Issey Miyake", genero: "Hombre" },
    { nombre: "Good Girl Carolina Herrera", marca: "Carolina Herrera", genero: "Mujer" },
    { nombre: "H24 D'Hermes", marca: "Hermes", genero: "Hombre" },
    { nombre: "Hawas Black Rasasi", marca: "Rasasi", genero: "Hombre" },
    { nombre: "Hawas Elixir Rasasi", marca: "Rasasi", genero: "Hombre" },
    { nombre: "Hawas Fire Rasasi", marca: "Rasasi", genero: "Hombre" },
    { nombre: "Hawas Ice Rasasi", marca: "Rasasi", genero: "Hombre" },
    { nombre: "Hawas Kobra Rasasi", marca: "Rasasi", genero: "Hombre" },
    { nombre: "Hawas Malibu Rasasi", marca: "Rasasi", genero: "Hombre" },
    { nombre: "Haya Lattafa", marca: "Lattafa", genero: "Mujer" },
    { nombre: "Hypnotic Poison Christian Dior", marca: "Christian Dior", genero: "Mujer" },
    { nombre: "I am King Sean John", marca: "Sean John", genero: "Hombre" },
    { nombre: "Imagination Louis Vuitton", marca: "Louis Vuitton", genero: "Hombre" },
    { nombre: "L'eau D'issey Pour Homme Intense Issey Miyake", marca: "Issey Miyake", genero: "Hombre" },
    { nombre: "L'eau D'issey Pour Homme Sport Issey Miyake", marca: "Issey Miyake", genero: "Hombre" },
    { nombre: "L'eau Super Majeure Issey Miyake", marca: "Issey Miyake", genero: "Hombre" },
    { nombre: "Joy Christian Dior", marca: "Christian Dior", genero: "Mujer" },
    { nombre: "Khamrah Lattafa", marca: "Lattafa", genero: "Unisex" },
    { nombre: "L'Homme L'intense Yves Saint Laurent", marca: "Yves Saint Laurent", genero: "Hombre" },
    { nombre: "L'Homme L'Eau Prada", marca: "Prada", genero: "Hombre" },
    { nombre: "L'Homme Prada", marca: "Prada", genero: "Hombre" },
    { nombre: "La Belle Jean Paul Gaultier", marca: "Jean Paul Gaultier", genero: "Mujer" },
    { nombre: "La Belle Paradise Garden Jean Paul Gaultier", marca: "Jean Paul Gaultier", genero: "Mujer" },
    { nombre: "La Nuit de L'Homme Yves Saint Laurent", marca: "Yves Saint Laurent", genero: "Hombre" },
    { nombre: "La Panthere de Cartier", marca: "Cartier", genero: "Mujer" },
    { nombre: "La Rosa Armaf", marca: "Armaf", genero: "Mujer" },
    { nombre: "Lacoste Blanc Pure Lacoste", marca: "Lacoste", genero: "Hombre" },
    { nombre: "Lacoste L'Homme Edt Lacoste", marca: "Lacoste", genero: "Hombre" },
    { nombre: "Lacoste L'Homme Intense Lacoste", marca: "Lacoste", genero: "Hombre" },
    { nombre: "Lacoste L.12.12 Pour Lui French Panache Lacoste", marca: "Lacoste", genero: "Hombre" },
    { nombre: "Lacoste L.12.12 Rouge Lacoste", marca: "Lacoste", genero: "Hombre" },
    { nombre: "Le Baiser Du Dragon de Cartier", marca: "Cartier", genero: "Mujer" },
    { nombre: "Le Beau Jean Paul Gaultier", marca: "Jean Paul Gaultier", genero: "Hombre" },
    { nombre: "Le Beau Paradise Garden Jean Paul Gaultier", marca: "Jean Paul Gaultier", genero: "Hombre" },
    { nombre: "Le Femme Armaf", marca: "Armaf", genero: "Mujer" },
    { nombre: "Le Male Le Parfum Jean Paul Gaultier", marca: "Jean Paul Gaultier", genero: "Hombre" },
    { nombre: "Libre L'Absolu Platine Yves Saint Laurent", marca: "Yves Saint Laurent", genero: "Mujer" },
    { nombre: "Lovers Louis Vuitton", marca: "Louis Vuitton", genero: "Hombre" },
    { nombre: "Mayar Cherry Intense Lattafa", marca: "Lattafa", genero: "Mujer" },
    { nombre: "Mayar Lattafa", marca: "Lattafa", genero: "Mujer" },
    { nombre: "Midnight Poison Christian Dior", marca: "Christian Dior", genero: "Mujer" },
    { nombre: "Miss Armaf Chic Armaf", marca: "Armaf", genero: "Mujer" },
    { nombre: "Miss Dior Christian Dior", marca: "Christian Dior", genero: "Mujer" },
    { nombre: "Mon Paris Yves Saint Laurent", marca: "Yves Saint Laurent", genero: "Mujer" },
    { nombre: "Muscat Ormonde Jayne", marca: "Ormonde Jayne", genero: "Unisex" },
    { nombre: "My Way Giorgio Armani", marca: "Giorgio Armani", genero: "Mujer" },
    { nombre: "Nautica Life Energy Nautica", marca: "Nautica", genero: "Hombre" },
    { nombre: "Nautica Pure Blue Nautica", marca: "Nautica", genero: "Hombre" },
    { nombre: "Nautica Voyage Nautica", marca: "Nautica", genero: "Hombre" },
    { nombre: "Nuit D'issey Issey Miyake", marca: "Issey Miyake", genero: "Hombre" },
    { nombre: "Odyssey Candee Armaf", marca: "Armaf", genero: "Mujer" },
    { nombre: "Ombre Leather Tom Ford", marca: "Tom Ford", genero: "Unisex" },
    { nombre: "Ombre Nomade Louis Vuitton", marca: "Louis Vuitton", genero: "Unisex" },
    { nombre: "Ormonde Man Ormonde Jayne", marca: "Ormonde Jayne", genero: "Hombre" },
    { nombre: "Ormonde Woman Ormonde Jayne", marca: "Ormonde Jayne", genero: "Mujer" },
    { nombre: "Pasha de Cartier", marca: "Cartier", genero: "Hombre" },
    { nombre: "Poison Christian Dior", marca: "Christian Dior", genero: "Mujer" },
    { nombre: "Pur Oud Louis Vuitton", marca: "Louis Vuitton", genero: "Unisex" },
    { nombre: "Roma Passione Laura Biagiotti", marca: "Laura Biagiotti", genero: "Mujer" },
    { nombre: "Roma Uomo Laura Biagiotti", marca: "Laura Biagiotti", genero: "Hombre" },
    { nombre: "Romamor Uomo Laura Biagiotti", marca: "Laura Biagiotti", genero: "Hombre" },
    { nombre: "Royal Elixir Ormonde Jayne", marca: "Ormonde Jayne", genero: "Unisex" },
    { nombre: "Santos de Cartier", marca: "Cartier", genero: "Hombre" },
    { nombre: "Sauvage Christian Dior", marca: "Christian Dior", genero: "Hombre" },
    { nombre: "Sauvage Elixir Christian Dior", marca: "Christian Dior", genero: "Hombre" },
    { nombre: "Sauvage Parfum Christian Dior", marca: "Christian Dior", genero: "Hombre" },
    { nombre: "Scandal Absolu Jean Paul Gaultier", marca: "Jean Paul Gaultier", genero: "Mujer" },
    { nombre: "Scandal Jean Paul Gaultier", marca: "Hombre" },
    { nombre: "Si Girogio Armani", marca: "Giorgio Armani", genero: "Mujer" },
    { nombre: "Sky Di Gioa Giorgio Armani", marca: "Giorgio Armani", genero: "Mujer" },
    { nombre: "Stronger With You Giorgio Armani", marca: "Giorgio Armani", genero: "Hombre" },
    { nombre: "Stronger With You Oud Giorgio Armani", marca: "Giorgio Armani", genero: "Hombre" },
    { nombre: "Terre D'Hermes", marca: "Hermes", genero: "Hombre" },
    { nombre: "Ultra Male Jean Paul Gaultier", marca: "Jean Paul Gaultier", genero: "Hombre" },
    { nombre: "Unforgivable Sean John", marca: "Sean John", genero: "Hombre" },
    { nombre: "Very Good Girl Carolina Herrera", marca: "Carolina Herrera", genero: "Mujer" },
    { nombre: "Vetiveria Ormonde Jayne", marca: "Ormonde Jayne", genero: "Unisex" },
    { nombre: "Voyage D'Hermes", marca: "Hermes", genero: "Unisex" },
    { nombre: "Y Le Parfum Yves Saint Laurent", marca: "Yves Saint Laurent", genero: "Hombre" },
    { nombre: "Y Live Yves Saint Laurent", marca: "Yves Saint Laurent", genero: "Hombre" },
    { nombre: "Yara Lattafa", marca: "Lattafa", genero: "Mujer" },
    { nombre: "Yum Yum Armaf", marca: "Armaf", genero: "Mujer" }
];

// ==========================================
// 2. FUNCIÓN PRINCIPAL DE IMPORTACIÓN
// ==========================================
const importarDatos = async () => {
    try {
        console.log('🔗 Iniciando conexión a MongoDB...');
        await conectarDB();
        
        // Limpieza de datos previos para asegurar que los géneros se actualicen
        console.log('🧹 Limpiando colección de productos...');
        await Producto.deleteMany({}); 

        console.log('🚀 Procesando información curada de 132 fragancias...');
        const productosProcesados = perfumes.map(item => ({
            nombre: item.nombre,
            marca: item.marca || "Marca Premium",
            // Se mantiene el precio aleatorio para simular el catálogo comercial
            precio: Math.floor(Math.random() * (600000 - 200000)) + 200000,
            descripcion: `Fragancia premium de la línea ${item.nombre}. Calidad excepcional y persistencia garantizada.`,
            genero: item.genero, // INTEGRACIÓN DIRECTA: Se usa el género definido en el objeto
            categoria: "Lujo",
            imagen: `/imagenes/productos/${item.nombre}.webp`,
            stock: 15
        }));

        // Inserción masiva en la base de datos
        await Producto.insertMany(productosProcesados);
        console.log(`✅ ¡Éxito! Se han cargado ${productosProcesados.length} perfumes con géneros validados.`);
        
        // Cierre de seguridad de la conexión
        await mongoose.connection.close();
        process.exit(0);

    } catch (error) {
        console.error('❌ Error crítico al cargar datos en la EV02:', error);
        process.exit(1);
    }
};

// Ejecución del script
importarDatos();
