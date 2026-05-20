describe('Módulo de Registro de Usuarios', () => {
    it('Debería registrar un nuevo usuario exitosamente en la interfaz gráfica', () => {
        // Genera un correo único basado en el tiempo actual para evitar el error 400
        const correoUnico = `juana_${Date.now()}@test.com`;

        cy.visit('http://localhost:3000/registro');
        
        // Selecciona los inputs usando los nuevos atributos estandarizados
        cy.get('input[name="name"]').type('Juana'); 
        cy.get('input[type="email"]').type(correoUnico);
        cy.get('input[type="password"]').type('Juana123');
        
        // Hace clic en el botón Guardar
        cy.get('button[type="submit"]').click();
        
        // Validar que el SweetAlert de éxito aparezca en pantalla
        cy.contains('¡Éxito!').should('be.visible');
    });
});
