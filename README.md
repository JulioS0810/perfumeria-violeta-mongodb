# 🛒 Perfumería Violeta - Documentación de Arquitectura e Integración

**Evidencias:** GA8-220501096-AA1-EV01 / GA4-220501095-AA2-EV05 / **GA9 (Pruebas de Software)**

Este repositorio contiene la solución técnica y arquitectónica de la plataforma "Perfumería Violeta", desarrollada bajo el stack MERN (MongoDB, Express, React, Node.js). El proyecto demuestra la integración de una base de datos NoSQL, una API REST robusta y una interfaz reactiva.

## 🛠️ 10.1 Manual de Instalación (Local)

Para poner en marcha la arquitectura en un entorno de desarrollo, siga estos pasos:

1. **Prerrequisitos:** Asegúrese de tener instalado Node.js y MongoDB.
2. **Descarga de Dependencias:**
   - Carpeta Servidor: `cd backend && npm install`
   - Carpeta Interfaz: `cd frontend && npm install`
3. **Configuración de Base de Datos:**
   - Verifique que el servicio de MongoDB esté activo localmente.
   - Configure el archivo `.env` en `/backend` con su `MONGO_URI`.
4. **Ejecución:**
   - Inicie el backend: `node index.js` (Puerto 4000).
   - Inicie el frontend: `npm start` (Puerto 3000).

## 🚀 10.2 Manual de Despliegue

Proceso para llevar la arquitectura a un entorno de producción:

- **Persistencia:** Migrar a un cluster en MongoDB Atlas.
- **Backend:** Desplegar `/backend` en Render o Railway, configurando variables de entorno.
- **Frontend:** Generar build optimizado (`npm run build`) y desplegar en Vercel o Netlify.

## 📖 10.3 Manual Técnico de Uso (API Endpoints)

Interacción con los componentes de la arquitectura actualizados para la fase de pruebas GA9:

### Módulo de Productos

- `GET /api/productos`: Visualización dinámica de fragancias.
- `POST /api/productos`: Registro de nuevos productos (Admin).
- `DELETE /api/productos/:id`: Eliminación de registros.

### Módulo de Usuarios (CRUD Completo - GA9)

- `GET /api/usuarios`: Lista todos los usuarios registrados.
- `POST /api/usuarios`: Registro con encriptación `bcryptjs`.
- `PUT /api/usuarios/:id`: Actualización total de datos de usuario.
- `PATCH /api/usuarios/:id`: Actualización parcial (ej. cambio de roles/perfiles).
- `DELETE /api/usuarios/:id`: Eliminación definitiva de cuenta.
- `HEAD /api/usuarios`: Verificación de disponibilidad del endpoint.

## 📂 Estructura de Carpetas

- `/backend`: Modelos de Mongoose, controladores con lógica de negocio y rutas REST.
- `/frontend`: Componentes de React y lógica de consumo de API (Hooks/Context).

---

**Aprendiz:** Julio César Suárez  
**Instructora:** Elizabeth Gelves Gelves  
**SENA - ADSO - 2026**
