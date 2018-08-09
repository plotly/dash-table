describe('Test Stub', function () {
    it('assert that <title> is correct', function () {
        cy.visit('http://localhost:8080');
        cy.title().should('include', 'dash-table')
    });
});
