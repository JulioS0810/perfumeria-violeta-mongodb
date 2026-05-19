# 🛒 Perfumería Violeta - Documentación de Arquitectura e Integración

**Evidencias:** GA8-220501096-AA1-EV01 / GA4-220501095-AA2-EV05 / **GA9-220501096-AA3-EV01-EV02 (Pruebas de Software)**

Este repositorio contiene la solución técnica y arquitectónica de la plataforma "Perfumería Violeta", desarrollada bajo el stack MERN (MongoDB, Express, React, Node.js). El proyecto demuestra la integración de una base de datos NoSQL, una API REST robusta, una interfaz reactiva y una suite automatizada de pruebas de extremo a extremo (E2E).

---

## 🔒 Nota de Seguridad y Optimización del Entorno

Como directriz de seguridad y optimización para la gestión del entorno local, el proyecto ha migrado su ciclo de construcción y ejecución desde el ecosistema de NPM tradicional hacia **pnpm**. Esta decisión metodológica mitiga vulnerabilidades por dependencias duplicadas, garantiza la inmutabilidad del árbol de nodos mediante un almacenamiento centralizado direccionable por contenido, y optimiza los tiempos de respuesta del servidor y del framework Cypress.

---

## 🛠️ 10.1 Manual de Instalación (Local)

Para poner en marcha la arquitectura en un entorno de desarrollo utilizando **pnpm**, siga estos pasos:

1. **Prerrequisitos:** Asegúrese de tener instalado Node.js, MongoDB y el gestor de paquetes pnpm de forma global (`npm install -g pnpm`).
2. **Descarga de Dependencias:**
   - Carpeta Servidor: `cd backend && pnpm install`
   - Carpeta Interfaz: `cd frontend && pnpm install`
3. **Configuración de Base de Datos:**
   - Verifique que el servicio de MongoDB esté activo localmente (MongoDB Compass).
   - Configure el archivo `.env` en `/backend` con su respectiva `MONGO_URI`.
4. **Ejecución del Entorno:**
   - Inicie el backend: `pnpm run start` (Puerto 4000).
   - Inicie el frontend: `pnpm run start` (Puerto 3000).

---

## 🚀 10.2 Manual de Despliegue

Proceso para llevar la arquitectura a un entorno de producción:

- **Persistencia:** Migrar a un cluster en MongoDB Atlas.
- **Backend:** Desplegar `/backend` en Render o Railway, configurando las variables de entorno.
- **Frontend:** Generar el build optimizado a través de `pnpm run build` y desplegar en Vercel o Netlify.

---

## 🧪 10.3 Plan de Pruebas Automatizadas Ejecutadas (GA9)

Para dar cumplimiento a los requerimientos de control de calidad del SENA, se implementó una estrategia de pruebas en dos niveles: validación de respuestas crudas de la API (Backend) y automatización interactiva de interfaz (Frontend) con **Cypress**.

Para garantizar un escenario limpio, transparente y modular, **cada método HTTP se ejecuta a través de scripts de prueba ("Specs") totalmente independientes**:

### Ejecución de Pruebas E2E (Cypress)

1. Asegúrese de tener los servidores de Frontend y Backend corriendo localmente.
2. Abra la consola interactiva de Cypress ejecutando en la raíz del proyecto:

```bash
npx cypress open
