// ==========================================
// PRUEBAS DE INTEGRACIÓN CON CYPRESS - PERFUMERÍA VIOLETA
// Módulo: Gestión de Usuarios (Flujo de Eliminación de Registros)
// Evidencias: GA9-220501096-AA1-EV02 / GA9-220501096-AA2-EV01
// Enfoque: Validación asíncrona de borrado físico en BD y reactividad del DOM
// ==========================================

describe('Caso de Prueba 003 - Operación DELETE (Usuarios)', () => {

    beforeEach(() => {
        // GIVEN: El administrador accede a la vista de gestión
        cy.visit('http://localhost:3000/registro');
        
        // Verificación de seguridad del entorno: Asegurar renderizado inicial
        cy.get('body').should('be.visible');
    });

    it('Debería remover específicamente a Juana de la lista y de la base de datos tras confirmar en SweetAlert2', () => {
        const usuarioObjetivo = 'Juana';

        // 1. VERIFICACIÓN DE ESTADO INICIAL
        // Confirmamos que el elemento existe antes de intentar cualquier acción
        cy.contains(usuarioObjetivo).should('exist');
        
        // 2. ACCIÓN (WHEN)
        // Localizamos el contenedor de la fila mediante el usuario y disparamos el evento clic
        cy.contains(usuarioObjetivo)
          .parent()
          .contains('Eliminar')
          .click();
        
        // 3. INTERACCIÓN CON SWEETALERT2 (UI FLOW)
        // Validamos la presencia del modal de confirmación
        cy.get('.swal2-popup').should('be.visible');
        cy.get('.swal2-confirm').click();
        
        // ==========================================
        // OPTIMIZACIÓN DE ASINCRONISMO (Resiliencia de Pruebas)
        // ==========================================
        
        // A. Esperamos a que los modales (confirmación/éxito) desaparezcan por completo.
        // El timeout de 10s garantiza que las animaciones de salida de Swal2 no bloqueen la prueba.
        cy.get('.swal2-popup', { timeout: 10000 }).should('not.exist');
        
        // B. Respiro táctico para permitir que el Hook 'useEffect' de React 
        // procese el filtrado del estado local tras la respuesta de la API.
        cy.wait(500);
        
        // 4. ASERCIÓN FINAL (THEN)
        // Validamos la inexistencia del nodo en el DOM con una búsqueda específica en celdas (td).
        // Si el Backend respondió 200 y el Frontend filtró el estado, 'Juana' debe haber desaparecido.
        cy.contains('td', usuarioObjetivo, { timeout: 10000 }).should('not.exist');
    });
});
