require('dotenv').config();
const mongoose = require('mongoose');
const conectarDB = require('./config/db');
const Producto = require('./models/Producto');

const perfumes = [
    "212 Heroes Forever Young Carolina Herrera", "212 NYC Carolina Herrera", "212 Sexy Carolina Herrera", "212 Vip Rose Carolina Herrera", "212 Vip Carolina Herrera",
    "3 am Sean John", "9 am Dive Afnan", "9 am Pour Femme Afnan", "9 pm Afnan", "9 pm Pour Femme Afnan",
    "Acqua Di Gio Giorgio Armani", "Acqua Di Gio Profondo Giorgio Armani", "Acqua Di Gio Profumo Giorgio Armani", "Acqua Di Giogia Giorgio Armani",
    "Asad Bourbon Lattafa", "Asad Lattafa", "Asad Zanzibar Lattafa", "Bad Boy Carolina Herrera", "Bad Boy Cobalt Elixir Carolina Herrera",
    "Bad Boy Extreme Carolina Herrera", "Baiser Vole de Cartier", "Because it´s You Giorgio Armani", "Bitter Peach Tom Ford",
    "Black Opium Intense Yves Saint Laurent", "Blue Noir Narciso Rodriguez", "CH Carolina Herrera", "Chance Eau Vive Chanel",
    "Chanel Nº 5 Chanel", "Classique Jean Paul Gaultier", "Club de Nuit Intense Armaf", "Club de Nuit Maleka Armaf",
    "Club de Nuit Precieux Armaf", "Club de Nuit Woman Armaf", "Coco Eau de Parfum Chanel", "Coco Mademoiselle Chanel",
    "Code Profumo Giorgio Armani", "Costa Azzurra Tom Ford", "Declaration Essence de Cartier", "Declaration Parfum de Cartier",
    "Declaration Eau de Toilette de Cartier", "Delices de Cartier", "Dior Homme Intense Christian Dior", "Dior Homme Parfum Christian Dior", "Dior Homme Sport Christian Dior",
    "Dylan Blue Versace", "Eclaire Lattafa", "Eros Energy Versace", "Eros Flame Versace", "Eros Versace", "Fakhar Rose Lattafa",
    "Fusion D'Issey Issey Miyake", "Good Girl Carolina Herrera", "H24 D'Hermes", "Hawas Black Rasasi", "Hawas Elixir Rasasi",
    "Hawas Fire Rasasi", "Hawas Ice Rasasi", "Hawas Kobra Rasasi", "Hawas Malibu Rasasi", "Haya Lattafa", "Hypnotic Poison Christian Dior",
    "I am King Sean John", "Imagination Louis Vuitton", "L'eau D'issey Pour Homme Intense Issey Miyake", "L'eau D'issey Pour Homme Sport Issey Miyake", "L'eau Super Majeure Issey Miyake",
    "Joy Christian Dior", "Khamrah Lattafa", "L'Homme L'intense Yves Saint Laurent", "L'Homme L'Eau Prada", "L'Homme Prada",
    "La Belle Jean Paul Gaultier", "La Belle Paradise Garden Jean Paul Gaultier", "La Nuit de L'Homme Yves Saint Laurent",
    "La Panthere de Cartier", "La Rosa Armaf", "Lacoste Blanc Pure Lacoste", "Lacoste L'Homme Edt Lacoste", "Lacoste L'Homme Intense Lacoste",
    "Lacoste L.12.12 Pour Lui French Panache Lacoste", "Lacoste L.12.12 Rouge Lacoste", "Le Baiser Du Dragon de Cartier", "Le Beau Jean Paul Gaultier",
    "Le Beau Paradise Garden Jean Paul Gaultier", "Le Femme Armaf", "Le Male Le Parfum Jean Paul Gaultier",
    "Libre L'Absolu Platine Yves Saint Laurent", "Lovers Louis Vuitton", "Mayar Cherry Intense Lattafa", "Mayar Lattafa",
    "Midnight Poison Christian Dior", "Miss Armaf Chic Armaf", "Miss Dior Christian Dior", "Mon Paris Yves Saint Laurent",
    "Muscat Ormonde Jayne", "My Way Giorgio Armani", "Nautica Life Energy Nautica", "Nautica Pure Blue Nautica", "Nautica Voyage Nautica",
    "Nuit D'issey Issey Miyake", "Odyssey Candee Armaf", "Ombre Leather Tom Ford", "Ombre Nomade Louis Vuitton",
    "Ormonde Man Ormonde Jayne", "Ormonde Woman Ormonde Jayne", "Pasha de Cartier", "Poison Christian Dior", "Pur Oud Louis Vuitton",
    "Roma Passione Laura Biagiotti", "Roma Uomo Laura Biagiotti", "Romamor Uomo Laura Biagiotti", "Royal Elixir Ormonde Jayne",
    "Santos de Cartier", "Sauvage Christian Dior", "Sauvage Elixir Christian Dior", "Sauvage Parfum Christian Dior",
    "Scandal Absolu Jean Paul Gaultier", "Scandal Jean Paul Gaultier", "Si Girogio Armani", "Sky Di Gioa Giorgio Armani",
    "Stronger With You Giorgio Armani", "Stronger With You Oud Giorgio Armani", "Terre D'Hermes", "Ultra Male Jean Paul Gaultier",
    "Unforgivable Sean John", "Very Good Girl Carolina Herrera", "Vetiveria Ormonde Jayne", "Voyage D'Hermes",
    "Y Le Parfum Yves Saint Laurent", "Y Live Yves Saint Laurent", "Yara Lattafa", "Yum Yum Armaf"
];

const obtenerMarca = (nombre) => {
    if (nombre.includes("Christian Dior")) return "Christian Dior";
    if (nombre.includes("Carolina Herrera")) return "Carolina Herrera";
    if (nombre.includes("Jean Paul Gaultier")) return "Jean Paul Gaultier";
    if (nombre.includes("Yves Saint Laurent")) return "Yves Saint Laurent";
    if (nombre.includes("Issey Miyake")) return "Issey Miyake";
    if (nombre.includes("Giorgio Armani")) return "Giorgio Armani";
    if (nombre.includes("Louis Vuitton")) return "Louis Vuitton";
    if (nombre.includes("Ormonde Jayne")) return "Ormonde Jayne";
    if (nombre.includes("Laura Biagiotti")) return "Laura Biagiotti";
    if (nombre.includes("Sean John")) return "Sean John";
    if (nombre.includes("de Cartier")) return "Cartier";
    if (nombre.includes("Cartier")) return "Cartier";
    if (nombre.includes("Lacoste")) return "Lacoste";
    if (nombre.includes("Nautica")) return "Nautica";
    if (nombre.includes("Tom Ford")) return "Tom Ford";
    
    // Para marcas de una sola palabra al final
    return nombre.split(' ').pop();
};

const determinarGenero = (nombre) => {
    const femininos = [
        'Woman', 'Rose', 'Femme', 'Girl', 'Miss', 'La Belle', 'Si ', 'Joy', 
        'Yara', 'Haya', 'Mayar', 'Nº 5', 'Coco', 'Mademoiselle', 'Baiser', 
        'Panthere', 'Giogia', 'Delices', 'Libre', 'Mon Paris', 'Good Girl'
    ];
    return femininos.some(p => nombre.includes(p)) ? 'Mujer' : 'Hombre';
};

const importarDatos = async () => {
    try {
        console.log('🔗 Conectando a MongoDB...');
        await conectarDB();
        
        console.log('🧹 Limpiando base de datos...');
        await Producto.deleteMany({}); 

        console.log('🚀 Procesando 132 productos...');
        const productosProcesados = perfumes.map(nombre => ({
            nombre: nombre,
            marca: obtenerMarca(nombre),
            precio: Math.floor(Math.random() * (600000 - 200000)) + 200000,
            descripcion: `Fragancia premium de la línea ${nombre}.`,
            genero: determinarGenero(nombre),
            categoria: "Lujo",
            imagen: `/imagenes/productos/${nombre}.webp`,
            stock: 15
        }));

        await Producto.insertMany(productosProcesados);
        console.log(`✅ ¡Éxito! ${productosProcesados.length} perfumes cargados correctamente.`);
        
        await mongoose.connection.close();
        process.exit(0);

    } catch (error) {
        console.error('❌ Error al cargar datos:', error);
        process.exit(1);
    }
};

importarDatos();