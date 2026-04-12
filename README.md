# 🌸 Plataforma Web Perfumería Violeta - Backend NoSQL

Este repositorio contiene el desarrollo del backend para la **Plataforma Web Perfumería Violeta**, correspondiente a la evidencia **GA7-220501096-AA5-EV03** del programa de Análisis y Desarrollo de Software del SENA.

## 🚀 Tecnologías Utilizadas

Este proyecto ha sido migrado de una arquitectura relacional a una arquitectura **NoSQL** utilizando el Stack MERN:

* **Node.js**: Entorno de ejecución para JavaScript.
* **Express.js**: Framework para la creación de la API REST.
* **MongoDB**: Base de datos orientada a documentos.
* **Mongoose**: ODM para el modelado de datos y validaciones de esquema.
* **Postman**: Herramienta utilizada para las pruebas funcionales de los servicios web.

## 🛠️ Características del Proyecto

* **Persistencia de Datos**: Almacenamiento flexible en documentos JSON.
* **Seguridad**: Configuración de seguridad en el modelo de usuario para evitar la exposición de contraseñas (`select: false`).
* **Escalabilidad**: Gestión eficiente de catálogos de productos (actualmente con 132 registros).
* **Arquitectura Limpia**: Separación de responsabilidades en Modelos, Controladores y Rutas.

## 📂 Estructura del Backend

```text
backend/
├── config/       # Configuración de conexión a MongoDB
├── controllers/  # Lógica de negocio de los servicios
├── models/       # Esquemas de datos (Mongoose)
├── routes/       # Definición de los endpoints de la API
└── index.js      # Punto de entrada del servidor
