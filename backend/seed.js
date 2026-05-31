// ==========================================
// SCRIPT DE SEMILLADO (SEEDER) - PERFUMERÍA VIOLETA
// Propósito: Carga masiva de 132 productos con datos validados.
// Evidencia: GA8-220501096-AA1-EV02 (Módulos Integrados)
// ==========================================

require('dotenv').config();
const mongoose = require('mongoose');
const conectarDB = require('./config/db');
const Producto = require('./models/Producto');

// ==========================================
// 1. BASE DE DATOS DE PRODUCTOS (LISTADO COMPLETO)
// Datos extraídos fielmente del diseño SQL original.
// ==========================================
const perfumes = [
    { name: "212 Heroes Forever Young Carolina Herrera", marca: "Carolina Herrera", genero: "Mujer" },
    { name: "212 NYC Carolina Herrera", marca: "Carolina Herrera", genero: "Hombre" },
    { name: "212 Sexy Carolina Herrera", marca: "Carolina Herrera", genero: "Hombre" },
    { name: "212 Vip Rose Carolina Herrera", marca: "Carolina Herrera", genero: "Mujer" },
    { name: "212 Vip Carolina Herrera", marca: "Carolina Herrera", genero: "Hombre" },
    { name: "3 am Sean John", marca: "Sean John", genero: "Hombre" },
    { name: "9 am Dive Afnan", marca: "Afnan", genero: "Hombre" },
    { name: "9 am Pour Femme Afnan", marca: "Afnan", genero: "Mujer" },
    { name: "9 pm Afnan", marca: "Afnan", genero: "Hombre" },
    { name: "9 pm Pour Femme Afnan", marca: "Afnan", genero: "Mujer" },
    { name: "Acqua Di Gio Giorgio Armani", marca: "Giorgio Armani", genero: "Hombre" },
    { name: "Acqua Di Gio Profondo Giorgio Armani", marca: "Giorgio Armani", genero: "Hombre" },
    { name: "Acqua Di Gio Profumo Giorgio Armani", marca: "Giorgio Armani", genero: "Hombre" },
    { name: "Acqua Di Giogia Giorgio Armani", marca: "Giorgio Armani", genero: "Mujer" },
    { name: "Asad Bourbon Lattafa", marca: "Lattafa", genero: "Hombre" },
    { name: "Asad Lattafa", marca: "Lattafa", genero: "Hombre" },
    { name: "Asad Zanzibar Lattafa", marca: "Lattafa", genero: "Hombre" },
    { name: "Bad Boy Carolina Herrera", marca: "Carolina Herrera", genero: "Hombre" },
    { name: "Bad Boy Cobalt Elixir Carolina Herrera", marca: "Carolina Herrera", genero: "Hombre" },
    { name: "Bad Boy Extreme Carolina Herrera", marca: "Carolina Herrera", genero: "Hombre" },
    { name: "Baiser Vole de Cartier", marca: "Cartier", genero: "Mujer" },
    { name: "Because it´s You Giorgio Armani", marca: "Giorgio Armani", genero: "Mujer" },
    { name: "Bitter Peach Tom Ford", marca: "Tom Ford", genero: "Hombre" },
    { name: "Black Opium Intense Yves Saint Laurent", marca: "Yves Saint Laurent", genero: "Mujer" },
    { name: "Blue Noir Narciso Rodriguez", marca: "Narciso Rodriguez", genero: "Hombre" },
    { name: "CH Carolina Herrera", marca: "Carolina Herrera", genero: "Mujer" },
    { name: "Chance Eau Vive Chanel", marca: "Chanel", genero: "Mujer" },
    { name: "Chanel Nº 5 Chanel", marca: "Chanel", genero: "Mujer" },
    { name: "Classique Jean Paul Gaultier", marca: "Jean Paul Gaultier", genero: "Mujer" },
    { name: "Club de Nuit Intense Armaf", marca: "Armaf", genero: "Hombre" },
    { name: "Club de Nuit Maleka Armaf", marca: "Armaf", genero: "Mujer" },
    { name: "Club de Nuit Precieux Armaf", marca: "Armaf", genero: "Hombre" },
    { name: "Club de Nuit Woman Armaf", marca: "Armaf", genero: "Mujer" },
    { name: "Coco Eau de Parfum Chanel", marca: "Chanel", genero: "Mujer" },
    { name: "Coco Mademoiselle Chanel", marca: "Chanel", genero: "Mujer" },
    { name: "Code Profumo Giorgio Armani", marca: "Giorgio Armani", genero: "Hombre" },
    { name: "Costa Azzurra Tom Ford", marca: "Tom Ford", genero: "Hombre" },
    { name: "Declaration Essence de Cartier", marca: "Cartier", genero: "Hombre" },
    { name: "Declaration Parfum de Cartier", marca: "Cartier", genero: "Hombre" },
    { name: "Declaration Eau de Toilette de Cartier", marca: "Cartier", genero: "Hombre" },
    { name: "Delices de Cartier", marca: "Cartier", genero: "Mujer" },
    { name: "Dior Homme Intense Christian Dior", marca: "Christian Dior", genero: "Hombre" },
    { name: "Dior Homme Parfum Christian Dior", marca: "Christian Dior", genero: "Hombre" },
    { name: "Dior Homme Sport Christian Dior", marca: "Christian Dior", genero: "Hombre" },
    { name: "Dylan Blue Versace", marca: "Versace", genero: "Hombre" },
    { name: "Eclaire Lattafa", marca: "Lattafa", genero: "Mujer" },
    { name: "Eros Energy Versace", marca: "Versace", genero: "Hombre" },
    { name: "Eros Flame Versace", marca: "Versace", genero: "Hombre" },
    { name: "Eros Versace", marca: "Versace", genero: "Hombre" },
    { name: "Fakhar Rose Lattafa", marca: "Lattafa", genero: "Mujer" },
    { name: "Fusion D'Issey Issey Miyake", marca: "Issey Miyake", genero: "Hombre" },
    { name: "Good Girl Carolina Herrera", marca: "Carolina Herrera", genero: "Mujer" },
    { name: "H24 D'Hermes", marca: "Hermes", genero: "Hombre" },
    { name: "Hawas Black Rasasi", marca: "Rasasi", genero: "Hombre" },
    { name: "Hawas Elixir Rasasi", marca: "Rasasi", genero: "Hombre" },
    { name: "Hawas Fire Rasasi", marca: "Rasasi", genero: "Hombre" },
    { name: "Hawas Ice Rasasi", marca: "Rasasi", genero: "Hombre" },
    { name: "Hawas Kobra Rasasi", marca: "Rasasi", genero: "Hombre" },
    { name: "Hawas Malibu Rasasi", marca: "Rasasi", genero: "Hombre" },
    { name: "Haya Lattafa", marca: "Lattafa", genero: "Mujer" },
    { name: "Hypnotic Poison Christian Dior", marca: "Christian Dior", genero: "Mujer" },
    { name: "I am King Sean John", marca: "Sean John", genero: "Hombre" },
    { name: "Imagination Louis Vuitton", marca: "Louis Vuitton", genero: "Hombre" },
    { name: "L'eau D'issey Pour Homme Intense Issey Miyake", marca: "Issey Miyake", genero: "Hombre" },
    { name: "L'eau D'issey Pour Homme Sport Issey Miyake", marca: "Issey Miyake", genero: "Hombre" },
    { name: "L'eau Super Majeure Issey Miyake", marca: "Issey Miyake", genero: "Hombre" },
    { name: "Joy Christian Dior", marca: "Christian Dior", genero: "Mujer" },
    { name: "Khamrah Lattafa", marca: "Lattafa", genero: "Hombre" },
    { name: "L'Homme L'intense Yves Saint Laurent", marca: "Yves Saint Laurent", genero: "Hombre" },
    { name: "L'Homme L'Eau Prada", marca: "Prada", genero: "Hombre" },
    { name: "L'Homme Prada", marca: "Prada", genero: "Hombre" },
    { name: "La Belle Jean Paul Gaultier", marca: "Jean Paul Gaultier", genero: "Mujer" },
    { name: "La Belle Paradise Garden Jean Paul Gaultier", marca: "Jean Paul Gaultier", genero: "Mujer" },
    { name: "La Nuit de L'Homme Yves Saint Laurent", marca: "Yves Saint Laurent", genero: "Hombre" },
    { name: "La Panthere de Cartier", marca: "Cartier", genero: "Mujer" },
    { name: "La Rosa Armaf", marca: "Armaf", genero: "Mujer" },
    { name: "Lacoste Blanc Pure Lacoste", marca: "Lacoste", genero: "Hombre" },
    { name: "Lacoste L'Homme Edt Lacoste", marca: "Lacoste", genero: "Hombre" },
    { name: "Lacoste L'Homme Intense Lacoste", marca: "Lacoste", genero: "Hombre" },
    { name: "Lacoste L.12.12 Pour Lui French Panache Lacoste", marca: "Lacoste", genero: "Hombre" },
    { name: "Lacoste L.12.12 Rouge Lacoste", marca: "Lacoste", genero: "Hombre" },
    { name: "Le Baiser Du Dragon de Cartier", marca: "Cartier", genero: "Mujer" },
    { name: "Le Beau Jean Paul Gaultier", marca: "Jean Paul Gaultier", genero: "Hombre" },
    { name: "Le Beau Paradise Garden Jean Paul Gaultier", marca: "Jean Paul Gaultier", genero: "Hombre" },
    { name: "Le Femme Armaf", marca: "Armaf", genero: "Mujer" },
    { name: "Le Male Le Parfum Jean Paul Gaultier", marca: "Jean Paul Gaultier", genero: "Hombre" },
    { name: "Libre L'Absolu Platine Yves Saint Laurent", marca: "Yves Saint Laurent", genero: "Mujer" },
    { name: "Lovers Louis Vuitton", marca: "Louis Vuitton", genero: "Hombre" },
    { name: "Mayar Cherry Intense Lattafa", marca: "Lattafa", genero: "Mujer" },
    { name: "Mayar Lattafa", marca: "Lattafa", genero: "Mujer" },
    { name: "Midnight Poison Christian Dior", marca: "Christian Dior", genero: "Mujer" },
    { name: "Miss Armaf Chic Armaf", marca: "Armaf", genero: "Mujer" },
    { name: "Miss Dior Christian Dior", marca: "Christian Dior", genero: "Mujer" },
    { name: "Mon Paris Yves Saint Laurent", marca: "Yves Saint Laurent", genero: "Mujer" },
    { name: "Muscat Ormonde Jayne", marca: "Ormonde Jayne", genero: "Hombre" },
    { name: "My Way Giorgio Armani", marca: "Giorgio Armani", genero: "Mujer" },
    { name: "Nautica Life Energy Nautica", marca: "Nautica", genero: "Hombre" },
    { name: "Nautica Pure Blue Nautica", marca: "Nautica", genero: "Hombre" },
    { name: "Nautica Voyage Nautica", marca: "Nautica", genero: "Hombre" },
    { name: "Nuit D'issey Issey Miyake", marca: "Issey Miyake", genero: "Hombre" },
    { name: "Odyssey Candee Armaf", marca: "Armaf", genero: "Mujer" },
    { name: "Ombre Leather Tom Ford", marca: "Tom Ford", genero: "Hombre" },
    { name: "Ombre Nomade Louis Vuitton", marca: "Louis Vuitton", genero: "Hombre" },
    { name: "Ormonde Man Ormonde Jayne", marca: "Ormonde Jayne", genero: "Hombre" },
    { name: "Ormonde Woman Ormonde Jayne", marca: "Ormonde Jayne", genero: "Mujer" },
    { name: "Pasha de Cartier", marca: "Cartier", genero: "Hombre" },
    { name: "Poison Christian Dior", marca: "Christian Dior", genero: "Mujer" },
    { name: "Pur Oud Louis Vuitton", marca: "Louis Vuitton", genero: "Hombre" },
    { name: "Roma Passione Laura Biagiotti", marca: "Laura Biagiotti", genero: "Hombre" },
    { name: "Roma Uomo Laura Biagiotti", marca: "Laura Biagiotti", genero: "Hombre" },
    { name: "Romamor Uomo Laura Biagiotti", marca: "Laura Biagiotti", genero: "Hombre" },
    { name: "Royal Elixir Ormonde Jayne", marca: "Ormonde Jayne", genero: "Hombre" },
    { name: "Santos de Cartier", marca: "Cartier", genero: "Hombre" },
    { name: "Sauvage Christian Dior", marca: "Christian Dior", genero: "Hombre" },
    { name: "Sauvage Elixir Christian Dior", marca: "Christian Dior", genero: "Hombre" },
    { name: "Sauvage Parfum Christian Dior", marca: "Christian Dior", genero: "Hombre" },
    { name: "Scandal Absolu Jean Paul Gaultier", marca: "Jean Paul Gaultier", genero: "Mujer" },
    { name: "Scandal Jean Paul Gaultier", marca: "Jean Paul Gaultier", genero: "Hombre" },
    { name: "Si Girogio Armani", marca: "Giorgio Armani", genero: "Mujer" },
    { name: "Sky Di Gioa Giorgio Armani", marca: "Giorgio Armani", genero: "Mujer" },
    { name: "Stronger With You Giorgio Armani", marca: "Giorgio Armani", genero: "Hombre" },
    { name: "Stronger With You Oud Giorgio Armani", marca: "Giorgio Armani", genero: "Hombre" },
    { name: "Terre D'Hermes", marca: "Hermes", genero: "Hombre" },
    { name: "Ultra Male Jean Paul Gaultier", marca: "Jean Paul Gaultier", genero: "Hombre" },
    { name: "Unforgivable Sean John", marca: "Sean John", genero: "Hombre" },
    { name: "Very Good Girl Carolina Herrera", marca: "Carolina Herrera", genero: "Mujer" },
    { name: "Vetiveria Ormonde Jayne", marca: "Ormonde Jayne", genero: "Hombre" },
    { name: "Voyage D'Hermes", marca: "Hermes", genero: "Hombre" },
    { name: "Y Le Parfum Yves Saint Laurent", marca: "Yves Saint Laurent", genero: "Hombre" },
    { name: "Y Live Yves Saint Laurent", marca: "Yves Saint Laurent", genero: "Hombre" },
    { name: "Yara Lattafa", marca: "Lattafa", genero: "Mujer" },
    { name: "Yum Yum Armaf", marca: "Armaf", genero: "Mujer" }
];

// ==========================================
// 2. FUNCIÓN PRINCIPAL DE IMPORTACIÓN
// ==========================================
const importarDatos = async () => {
    try {
        console.log('🔗 Iniciando conexión a MongoDB...');
        await conectarDB();
        
        // Limpieza de datos previos para asegurar que no queden registros antiguos
        console.log('🧹 Limpiando colección de productos...');
        await Producto.deleteMany({}); 

        console.log('🚀 Procesando información de 132 fragancias validadas...');
        const productosProcesados = perfumes.map(item => ({
            name: item.name,
            marca: item.marca,
            // Genera un precio aleatorio comercial para las pruebas
            precio: Math.floor(Math.random() * (600000 - 200000)) + 200000,
            descripcion: `Fragancia premium de la línea ${item.name}.`,
            genero: item.genero, // Integración directa del género definido manualmente
            categoria: "Lujo",
            imagen: `/imagenes/productos/${item.name}.webp`,
            stock: 15
        }));

        // Inserción masiva en la base de datos
        await Producto.insertMany(productosProcesados);
        console.log(`✅ ¡Éxito! Se han cargado ${productosProcesados.length} perfumes correctamente.`);
        
        // Cierre de seguridad de la conexión
        await mongoose.connection.close();
        process.exit(0);

    } catch (error) {
        console.error('❌ Error crítico al cargar datos:', error);
        process.exit(1);
    }
};

// Ejecución del script
importarDatos();
