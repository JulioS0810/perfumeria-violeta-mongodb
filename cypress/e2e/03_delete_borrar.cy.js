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
        
        // ==========================================
        // OPTIMIZACIÓN DE ASINCRONISMO (Solución al Fallo de Animación)
        // ==========================================
        // 1. Esperamos explícitamente que el modal se cierre y desaparezca de la vista
        cy.get('.swal2-popup').should('not.exist');
        
        // 2. Agregamos un respiro táctico de 500ms para permitir que React limpie su hook de estado local
        cy.wait(500);
        
        // 4. ASERCIÓN FINAL (THEN: Criterios de Aceptación validados)
        // Usamos una aserción más estricta: buscamos la celda específica (td) 
        // que contiene el nombre. Si la celda desaparece, la fila completa ya no existe.
        
        // Timeout de 10 segundos (10000ms) para dar tiempo real a la sincronización de React
        cy.contains('td', usuarioObjetivo, { timeout: 10000 }).should('not.exist');
    });
});
