import DashTable from 'cypress/DashTable';

describe('delete', () => {
    describe('be', () => {
        beforeEach(() => cy.visit('http://localhost:8081'));

        it('can delete row', () => {
            DashTable.getCell(0, 0).within(() => cy.get('.dash-cell-value').should('have.html', '0'));
            DashTable.getDelete(0).click();
            DashTable.getCell(0, 0).within(() => cy.get('.dash-cell-value').should('have.html', '1'));
        });

        it('can delete row when sorted', () => {
            cy.get('tr th.column-0 .sort').click({ force: true });
            DashTable.getCell(0, 2).within(() => cy.get('.cell-value').should('have.html', '28155'));
            DashTable.getDelete(0).click();
            DashTable.getCell(0, 2).within(() => cy.get('.cell-value').should('have.html', '28154'));
        });
    });

    describe('fe', () => {
        beforeEach(() => cy.visit('http://localhost:8080'));

        it('can delete row', () => {
            DashTable.getCell(0, 0).within(() => cy.get('.dash-cell-value').should('have.html', '1'));
            DashTable.getDelete(0).click();
            DashTable.getCell(0, 0).within(() => cy.get('.dash-cell-value').should('have.html', '2'));
        });

        it('can delete row when sorted', () => {
            cy.get('tr th.column-0 .sort').click({ force: true });
            DashTable.getCell(0, 0).within(() => cy.get('.dash-cell-value').should('have.html', '4999'));
            DashTable.getDelete(0).click();
            DashTable.getCell(0, 0).within(() => cy.get('.dash-cell-value').should('have.html', '4998'));
        });
    });
});