// ==========================================
// PRUEBAS DE INTEGRACIÓN CON CYPRESS - PERFUMERÍA VIOLETA
// Módulo: Consulta e Inserción de Usuarios (Operaciones GET / POST)
// Evidencias: GA9-220501096-AA1-EV02 / GA9-220501096-AA2-EV01 / GA9-220501096-AA3-EV01-EV02
// Enfoque: Validación de persistencia limpia, reactividad en React y manejo de excepciones únicos en MongoDB
// ==========================================

describe('Caso de Prueba 002 - Operación GET / POST (Consulta e Inserción Dinámica)', () => {
  
  beforeEach(() => {
    // GIVEN: El entorno de automatización accede directamente a la interfaz de administración y registro
    cy.visit('http://localhost:3000/registro');
    
    // Verificación estructural de seguridad: Validar que el árbol de renderizado del DOM cargó al 100%
    cy.get('body').should('be.visible');
  });

  it('Debería inyectar de forma reactiva valores limpios en el formulario y procesar la persistencia sin colisiones de duplicidad', () => {
    // OPTIMIZACIÓN CLAVE PARA SUSTENTACIÓN:
    // Generamos un Timestamp (marca de tiempo única en milisegundos) para concatenarlo al email.
    // Esto mitiga de raíz el error HTTP 400 (Bad Request) causado por el índice único de MongoDB ({ unique: true } en email).
    const timestamp = Date.now();
    const nombreObjetivo = 'Andrea';
    const correoDinamico = `andrea.modificada_${timestamp}@test.com`;

    // 1. LIMPIEZA E INYECCIÓN DE DATOS (Manejo Reactivo de Estados en React)
    // .clear() asegura que no existan datos residuales en los inputs.
    // { delay: 50 } emula de forma precisa el tipeo de un cliente humano para asegurar los ciclos del Hook useState.
    
    // Campo Nombre (Mapeado correctamente al atributo 'name' requerido por el Backend global)
    cy.get('input[name="name"]')
      .clear()
      .type(nombreObjetivo, { delay: 50 });

    // Campo Email (Inyección de la cadena única dinámica creada en este hilo de prueba)
    cy.get('input[type="email"]')
      .clear()
      .type(correoDinamico, { delay: 50 });

    // Campo Password (Seguridad - Credencial base que será encriptada mediante Bcryptjs en el controlador)
    cy.get('input[type="password"]')
      .clear()
      .type('Andrea123');
    
    // 2. DISPARO DE ACCIÓN ASÍNCRONA (WHEN)
    // Gatillar el evento submit del formulario haciendo clic en el nodo botón principal
    cy.get('button[type="submit"]').click();
    
    // 3. VALIDACIÓN DE CRITERIOS DE ACEPTACIÓN (THEN)
    // Al ser un correo totalmente nuevo, el Backend (Puerto 4000) procesará el controlador de forma exitosa,
    // persistirá el registro en MongoDB y retornará un código de estado HTTP 201 Created.
    // Como consecuencia directa, SweetAlert2 debe inyectar el componente visual de éxito en el DOM.
    cy.contains('¡Éxito!').should('be.visible');
  });
});
