/**
 * SERVICIO DE PRODUCTOS - PERFUMERÍA VIOLETA
 * Este módulo se encarga de la comunicación entre el Frontend (React) 
 * y el Backend (Node.js/Express) utilizando la arquitectura REST.
 */

// CORRECCIÓN: Usamos localhost para desarrollo interno y evitamos errores por cambio de red (Wi-Fi/Ethernet)
const API_URL = "http://localhost:4000/api/productos";

export const productService = {
    /**
     * Obtiene la lista completa de perfumes (132 registros) desde MongoDB.
     */
    getTodosLosProductos: async () => {
        try {
            console.log("📡 Intentando conectar con:", API_URL);
            
            const response = await fetch(API_URL);
            
            if (!response.ok) {
                throw new Error(`Error en la comunicación con el servidor: ${response.status}`);
            }

            const data = await response.json();
            
            console.log(`✅ Integración exitosa: ${data.length} productos recibidos.`);
            return data;
        } catch (error) {
            console.error("❌ Fallo en la conexión con el Backend de Perfumería Violeta:", error);
            
            // Retorno resiliente: evita que el componente .map() del frontend falle
            return [];
        }
    },

    /**
     * Obtiene el detalle de un perfume específico mediante su ID único de MongoDB (_id).
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
