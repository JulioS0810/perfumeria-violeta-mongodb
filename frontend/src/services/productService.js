/**
 * SERVICIO DE PRODUCTOS - PERFUMERÍA VIOLETA
 * Este módulo se encarga de la comunicación entre el Frontend (React) 
 * y el Backend (Node.js/Express) utilizando la arquitectura REST.
 */

// URL BASE de la API: Se utiliza la IP privada para permitir integración en red local (Pruebas en móviles)
const API_URL = "http://192.168.5.105:4000/api/productos";

export const productService = {
    /**
     * Obtiene la lista completa de perfumes (132 registros) desde MongoDB.
     * Implementa manejo de errores para garantizar la estabilidad de la UI.
     * @returns {Promise<Array>} Arreglo de objetos de perfumes o array vacío en caso de error.
     */
    getTodosLosProductos: async () => {
        try {
            // Realiza la petición asíncrona al endpoint del Backend
            const response = await fetch(API_URL);
            
            // Validación de la respuesta del servidor
            if (!response.ok) {
                throw new Error(`Error en la comunicación con el servidor: ${response.status}`);
            }

            // Conversión de la respuesta a formato JSON (Datos provenientes de MongoDB)
            const data = await response.json();
            
            console.log(`✅ Integración exitosa: ${data.length} productos recibidos.`);
            return data;
        } catch (error) {
            // Log de diagnóstico para el desarrollador en la consola del navegador
            console.error("❌ Fallo en la conexión con el Backend de Perfumería Violeta:", error);
            
            // Retorno resiliente: evita que el componente .map() del frontend falle
            return [];
        }
    },

    /**
     * Obtiene el detalle de un perfume específico mediante su ID único de MongoDB (_id).
     * @param {string} id - El identificador del producto.
     * @returns {Promise<Object|null>} Objeto del producto o null si ocurre un error.
     */
    getProductoPorId: async (id) => {
        try {
            const response = await fetch(`${API_URL}/${id}`);
            
            if (!response.ok) {
                throw new Error(`Producto no encontrado o error de servidor: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`❌ Error al obtener el detalle del producto ${id}:`, error);
            return null;
        }
    }
};
