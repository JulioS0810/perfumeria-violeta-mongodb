// Definimos la URL de la API (Asegúrate de que tu servidor backend esté corriendo en este puerto)
const API_URL = "http://localhost:4000/api/productos";

export const productService = {
    /**
     * Obtiene la lista de los 132 perfumes desde el Backend (MongoDB)
     */
    getTodosLosProductos: async () => {
        try {
            const response = await fetch(API_URL);
            
            if (!response.ok) {
                throw new Error(`Error en la red: ${response.status}`);
            }

            const data = await response.json();
            
            // Retornamos los datos que vienen de MongoDB
            return data;
        } catch (error) {
            console.error("No se pudo conectar con el Backend de Perfumería Violeta:", error);
            // Retornamos un array vacío para evitar que la app se rompa si el servidor está apagado
            return [];
        }
    },

    /**
     * Opcional: Obtener un solo producto por ID
     */
    getProductoPorId: async (id) => {
        try {
            const response = await fetch(`${API_URL}/${id}`);
            return await response.json();
        } catch (error) {
            console.error("Error al obtener el detalle del producto:", error);
            return null;
        }
    }
};