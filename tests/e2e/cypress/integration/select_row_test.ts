import DashTable from 'cypress/DashTable';

describe('delete', () => {
    describe('be pagination & sort', () => {
        beforeEach(() => cy.visit('http://localhost:8081'));

        it('can select row', () => {
            DashTable.getSelect(0).within(() => cy.get('input').click());
            DashTable.getSelect(0).within(() => cy.get('input').should('be.checked'));
        });

        it('can select row when sorted', () => {
            cy.get('tr th.column-0 .sort').click({ force: true });
            DashTable.getSelect(0).within(() => cy.get('input').click());
            DashTable.getSelect(0).within(() => cy.get('input').should('be.checked'));
        });

        it('select, sort, new row is not selected', () => {
            DashTable.getSelect(0).within(() => cy.get('input').click());
            DashTable.getSelect(0).within(() => cy.get('input').should('be.checked'));
            cy.get('tr th.column-0 .sort').click({ force: true });
            DashTable.getSelect(0).within(() => cy.get('input').should('not.be.checked'));
        });
    });

    describe('fe pagination & sort', () => {
        beforeEach(() => cy.visit('http://localhost:8080'));

        it('can select row', () => {
            DashTable.getSelect(0).within(() => cy.get('input').click());
            DashTable.getSelect(0).within(() => cy.get('input').should('be.checked'));
        });

        it('can select row when sorted', () => {
            cy.get('tr th.column-0 .sort').click({ force: true });
            DashTable.getSelect(0).within(() => cy.get('input').click());
            DashTable.getSelect(0).within(() => cy.get('input').should('be.checked'));
        });

        it('select, sort, new row is not selected', () => {
            DashTable.getSelect(0).within(() => cy.get('input').click());
            DashTable.getSelect(0).within(() => cy.get('input').should('be.checked'));
            cy.get('tr th.column-0 .sort').click({ force: true });
            DashTable.getSelect(0).within(() => cy.get('input').should('not.be.checked'));
        });
    });
});