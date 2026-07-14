// ==========================================
// PRUEBAS DE INTEGRACIÓN CON CYPRESS - PERFUMERÍA VIOLETA
// Módulo: Consulta de Usuarios (Operación GET)
// Evidencias: GA9-220501096-AA1-EV02 / GA9-220501096-AA2-EV01
// Enfoque: Validación estricta de lectura de datos del DOM (Método GET)
// ==========================================

describe('Caso de Prueba 002 - Operación GET (Consulta de Usuarios)', () => {
  
  beforeEach(() => {
    // GIVEN: El entorno accede a la interfaz de administración
    cy.visit('http://localhost:3000/registro');
    cy.get('body').should('be.visible');
  });

  it('Debería consultar la lista general y verificar la existencia de un usuario base en la tabla', () => {
    // Definimos el usuario que ya debe existir previamente en tu MongoDB local
    const usuarioBase = 'Julio';

    // 1. VERIFICACIÓN DEL FLUJO DE LECTURA (GET)
    // El frontend ya debió disparar el método GET hacia /api/usuarios al cargar la página.
    // Comprobamos de forma estricta que la tabla contenga al usuario objetivo.
    cy.get('table')
      .contains(usuarioBase)
      .should('be.visible');

    // 2. COMPROBACIÓN DE ESTRUCTURA REACTIVA
    // Validamos que la fila que contiene al usuario posea su respectivo botón de acción.
    cy.get('table')
      .contains(usuarioBase)
      .parent()
      .contains('Eliminar')
      .should('be.visible');
      
    // NOTA TÉCNICA: Al remover los comandos .type() y .click() del formulario, 
    // mitigamos al 100% el error de duplicidad (POST 201) y garantizamos la pureza de la BD.
  });
});
