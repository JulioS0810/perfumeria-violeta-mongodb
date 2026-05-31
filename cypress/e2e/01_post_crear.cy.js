// ==========================================
// PRUEBAS DE INTEGRACIÓN CON CYPRESS - PERFUMERÍA VIOLETA
// Módulo: Registro de Usuarios (Flujo de Creación / POST)
// Evidencias: GA9-220501096-AA1-EV02 / GA9-220501096-AA2-EV01
// Enfoque: Validación de inserción de datos limpios y persistencia inicial
// ==========================================

describe('Módulo de Registro de Usuarios', () => {
    
    beforeEach(() => {
        // GIVEN: El usuario o administrador se encuentra en la pantalla del formulario de registro
        cy.visit('http://localhost:3000/registro');
        cy.get('body').should('be.visible');
    });

    it('Debería registrar un nuevo usuario exitosamente en la interfaz gráfica', () => {
        // Genera un correo único basado en el tiempo actual para evitar el error 400 por duplicidad en MongoDB
        const correoUnico = `juana_${Date.now()}@test.com`;
        const nombreUsuario = 'Juana';

        // 1. INYECCIÓN DE DATOS (WHEN: Cuando el usuario completa el formulario con datos válidos)
        // Selecciona los inputs usando los atributos estandarizados globales en inglés
        cy.get('input[name="name"]').type(nombreUsuario); 
        cy.get('input[type="email"]').type(correoUnico);
        cy.get('input[type="password"]').type('Juana123');
        
        // 2. DISPARO DEL EVENTO
        // Hace clic en el botón Guardar para enviar el JSON payload hacia el backend (POST /api/usuarios)
        cy.get('button[type="submit"]').click();
        
        // 3. ASERCIÓN Y VALIDACIÓN (THEN: Entonces el sistema debe confirmar el éxito del almacenamiento)
        // CRITERIO DE ACEPTACIÓN 1: El SweetAlert de éxito debe aparecer visualmente en pantalla interrumpiendo el flujo
        cy.contains('¡Éxito!').should('be.visible');

        // CRITERIO DE ACEPTACIÓN 2: El nuevo registro debe verse reflejado dinámicamente en el DOM (en la lista/grilla inferior)
        cy.contains(nombreUsuario).should('exist');
    });
});
