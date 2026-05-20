describe('Caso de Prueba 003 - Operación DELETE', () => {
  it('Debería remover específicamente a Juana del DOM y de la base de datos', () => {
    cy.visit('http://localhost:3000/registro');
    
    // 1. Localiza la fila exacta que contenga el nombre de Juana
    cy.contains('td', 'Juana')
      .parent()
      .contains('Eliminar')
      .click();
    
    // 2. Confirma la eliminación en la ventana flotante de SweetAlert2
    cy.get('.swal2-confirm').click();
    
    // 3. Valida que el nombre Juana desapareció de la grilla visual
    cy.contains('td', 'Juana').should('not.exist');
  });
});
