import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Catalogo = () => {
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const cargarPerfumes = async () => {
            try {
                // Llamada al endpoint que configuramos en el backend
                const respuesta = await axios.get('http://localhost:5000/api/productos');
                setProductos(respuesta.data);
                setCargando(false);
            } catch (error) {
                console.error("Error al conectar con el servidor:", error);
                setCargando(false);
            }
        };
        cargarPerfumes();
    }, []);

    if (cargando) return <p>Cargando fragancias de Perfumería Violeta...</p>;

    return (
        <div style={{ padding: '20px' }}>
            <h2>Nuestro Catálogo ({productos.length} productos)</h2>
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
                gap: '20px' 
            }}>
                {productos.map((perfume) => (
                    <div key={perfume._id} style={{ 
                        border: '1px solid #ddd', 
                        borderRadius: '8px', 
                        padding: '10px',
                        textAlign: 'center'
                    }}>
                        {/* Usamos la ruta de imagen que cargamos en el seed */}
                        <img 
                            src={`http://localhost:5000${perfume.imagen}`} 
                            alt={perfume.nombre} 
                            style={{ width: '100%', height: '150px', objectFit: 'contain' }}
                        />
                        <h4 style={{ fontSize: '14px', margin: '10px 0' }}>{perfume.nombre}</h4>
                        <p style={{ color: '#666', fontSize: '12px' }}>{perfume.marca}</p>
                        <p style={{ fontWeight: 'bold', color: '#d4af37' }}>
                            ${perfume.precio.toLocaleString('es-CO')}
                        </p>
                        <button style={{
                            backgroundColor: '#4B0082',
                            color: 'white',
                            border: 'none',
                            padding: '8px 15px',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}>
                            Ver Detalle
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Catalogo;
