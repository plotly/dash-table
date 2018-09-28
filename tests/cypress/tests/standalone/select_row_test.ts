import DashTable from 'cypress/DashTable';

describe('select row', () => {
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

        it.only('select, sort, new row is not selected', () => {
            // cy.window().then(win => cy.spy(win.console, 'log'));
            DashTable.getSelect(0).within(() => cy.get('input').click());
            DashTable.getSelect(0).within(() => cy.get('input').should('be.checked'));
            cy.get('tr th.column-0 .sort').click({ force: true });
            DashTable.getSelect(0).within(() => cy.get('input').should('not.be.checked'));
        });
    });
});