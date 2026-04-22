🛒 Perfumería Violeta - Documentación de Arquitectura e Integración
Evidencias: GA8-220501096-AA1-EV01 / GA4-220501095-AA2-EV05

Este repositorio contiene la solución técnica y arquitectónica de la plataforma "Perfumería Violeta", desarrollada bajo el stack MERN (MongoDB, Express, React, Node.js). El proyecto demuestra la integración de una base de datos NoSQL, una API REST y una interfaz reactiva.

🛠️ 10.1 Manual de Instalación (Local)
Para poner en marcha la arquitectura en un entorno de desarrollo, siga estos pasos basados en la configuración actual del proyecto:

Prerrequisitos: Asegúrese de tener instalado Node.js y MongoDB.

Descarga de Dependencias:

Desde la raíz, entre a la carpeta del servidor: cd backend && npm install

Desde la raíz, entre a la carpeta de la interfaz: cd frontend && npm install

Configuración de Base de Datos:

Verifique que el servicio de MongoDB esté activo.

Configure el archivo .env en /backend con su cadena de conexión (Connection String).

Ejecución:

Inicie el backend: npm start (Puerto 4000).

Inicie el frontend: npm start (Puerto 3000).

🚀 10.2 Manual de Despliegue (Arquitectura Integrada)
Este apartado describe el proceso para llevar la arquitectura de red local a un entorno de producción:

Capa de Persistencia: Migrar la base de datos a un cluster en MongoDB Atlas.

Capa de Lógica (Backend): * Desplegar el contenido de /backend en servicios como Render o Railway.

Configurar variables de entorno para la URI de la base de datos en el panel del host.

Capa de Interfaz (Frontend):

Generar los archivos optimizados: npm run build.

Desplegar la carpeta /build en Vercel o Netlify.

Sincronización: Actualizar el punto de enlace (endpoint) en el frontend para conectar con la URL de producción del backend.

📖 10.3 Manual Técnico de Uso
Guía de interacción con los componentes de la arquitectura:

Estructura API: * GET /api/productos: Visualización dinámica de las 132 fragancias cargadas.

POST /api/productos: Registro de nuevos productos en el catálogo (Admin).

DELETE /api/productos/:id: Eliminación de registros en tiempo real.

Interoperabilidad: El sistema es accesible en red local mediante la IP: http://192.168.5.105:3000.

Estructura de Carpetas:

/backend: Modelos de Mongoose, controladores y rutas.

/frontend: Componentes de React y lógica de consumo de API.

Aprendiz: Julio César Suárez Garavito

Instructores: Elizabeth Gelves Gelves / Julian (Técnico)

SENA - 2026
