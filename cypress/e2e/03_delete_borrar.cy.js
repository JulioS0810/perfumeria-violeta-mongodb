// ==========================================
// PRUEBAS DE INTEGRACIÓN CON CYPRESS - PERFUMERÍA VIOLETA
// Módulo: Gestión de Usuarios (Flujo de Eliminación de Registros)
// Evidencias: GA9-220501096-AA1-EV02 / GA9-220501096-AA2-EV01
// Enfoque: Validación estricta sobre la entidad de Usuarios Registrados
// ==========================================

describe('Caso de Prueba 003 - Operación DELETE (Usuarios)', () => {

    beforeEach(() => {
        // GIVEN: El administrador accede directamente a la vista de registro e historial de usuarios
        cy.visit('http://localhost:3000/registro');
        
        // Verificación de seguridad del entorno: Asegurar que la interfaz cargó completamente
        cy.get('body').should('be.visible');
    });

    it('Debería remover específicamente a Juana de la lista y de la base de datos tras confirmar en SweetAlert2', () => {
        const usuarioObjetivo = 'Juana';

        // 1. VERIFICACIÓN DE ESTADO INICIAL (Profundidad del caso de prueba)
        // Validamos que el usuario "Juana" existe visiblemente en la pantalla antes de disparar la acción
        cy.contains(usuarioObjetivo).should('exist');
        
        // 2. ACCIÓN (WHEN: Cuando el usuario ejecuta la acción de borrado)
        // Localizamos el contenedor de la fila que tiene a Juana y hacemos clic en su botón específico de Eliminar
        cy.contains(usuarioObjetivo)
          .parent()
          .contains('Eliminar')
          .click();
        
        // 3. INTERSECCIÓN DE INTERFAZ GRÁFICA (Validación del flujo UI)
        // Certificamos que el modal de advertencia de SweetAlert2 aparece correctamente en pantalla
        cy.get('.swal2-popup').should('be.visible');
        
        // Hacemos clic en el botón de confirmación del modal ("Sí, eliminar")
        cy.get('.swal2-confirm').click();
        
        // 4. ASERCIÓN FINAL (THEN: Criterios de Aceptación validados)
        // CRITERIO DE ACEPTACIÓN: El usuario debe desaparecer por completo del DOM inmediatamente 
        // sin requerir una recarga manual (F5) de la aplicación de React.
        cy.contains(usuarioObjetivo).should('not.exist');
    });
});
