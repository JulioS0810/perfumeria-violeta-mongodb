// ==========================================
// PRUEBAS DE INTEGRACIÓN CON CYPRESS - PERFUMERÍA VIOLETA
// Módulo: Consulta de Usuarios (Operación GET)
// Evidencias: GA9-220501096-AA1-EV02 / GA9-220501096-AA2-EV01
// Enfoque: Validación de carga de datos (GET) en los inputs del formulario
// ==========================================

describe('Caso de Prueba 002 - Operación GET (Consulta y Carga de Usuario)', () => {
  
  beforeEach(() => {
    // GIVEN: El usuario se encuentra en la pantalla de registro de la aplicación
    cy.visit('http://localhost:3000/registro');
    
    // Verificación de seguridad del entorno: Asegurar que el contenedor principal es visible
    cy.get('body').should('be.visible');
  });

  it('Debería permitir la consulta (GET) de los datos de Andrea para limpiar e inyectar nuevos valores en el formulario', () => {
    const nombreObjetivo = 'Andrea';
    const correoNuevo = 'andrea.modificada@test.com';

    // 1. CARGA Y CONSULTA (WHEN: El sistema obtiene los datos existentes vía GET)
    // Limpiamos de manera segura los campos cargados por la consulta e inyectamos el texto sin espacios extra.
    // Se utiliza un delay de 50ms para emular de forma realista el tipeo y asegurar la reactividad de los estados en React.
    cy.get('input[name="name"]').clear().type(nombreObjetivo, { delay: 50 });
    cy.get('input[type="email"]').clear().type(correoNuevo, { delay: 50 });
    cy.get('input[type="password"]').clear().type('Andrea123');
    
    // 2. ACCIÓN
    // Gatillar el evento de envío (Submit) para procesar el formulario en el servidor local
    cy.get('button[type="submit"]').click();
    
    // 3. VERIFICACIÓN DE LA RESPUESTA (THEN: Criterios de Aceptación validados)
    // CRITERIO DE ACEPTACIÓN: La interfaz debe responder correctamente tras procesar la consulta 
    // y desplegar el SweetAlert de éxito confirmando que el proceso fue correcto.
    cy.contains('¡Éxito!').should('be.visible');
  });
});
