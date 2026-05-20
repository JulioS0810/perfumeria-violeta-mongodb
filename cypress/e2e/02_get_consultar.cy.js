describe('Caso de Prueba 003 - Operación PUT', () => {
  it('Debería permitir la sobreescritura completa de los datos de un usuario', () => {
    cy.visit('http://localhost:3000/registro');
    
    // 1. Limpiar de manera segura e inyectar el texto sin espacios extra
    cy.get('input[name="name"]').clear().type('Ana Modificada', { delay: 50 });
    cy.get('input[type="email"]').clear().type('ana.modificada@test.com', { delay: 50 });
    cy.get('input[type="password"]').clear().type('NuevaClave123');
    
    // 2. Gatillar el evento de envío al servidor
    cy.get('button[type="submit"]').click();
    
    // 3. Verificación de la respuesta en la interfaz
    cy.contains('¡Éxito!').should('be.visible');
  });
});
