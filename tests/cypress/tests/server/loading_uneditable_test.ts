import DashTable, { State } from 'cypress/DashTable';
import DOM from 'cypress/DOM';
import Key from 'cypress/Key';

describe('loading states uneditable', () => {

    beforeEach(() => {
        cy.visit('http://localhost:8084');
    });

    it('does not permit editing when data are loading', () => {
        // Table is editable
        DashTable
            .getCell(0, 0)
            .click()
            .find('.dash-input-cell-value-container > input').should('have.length', 1);

        // Trigger data callback
        cy.get('#change-data-property').click();
        DOM.focused.type(`change_data${Key.Enter}`);

        // Table is not editable
        DashTable
            .getCell(0, 0, State.Loading)
            .click()
            .find('.dash-input-cell-value-container > input').should('have.length', 0);

        DOM.focused.type(`Hello${Key.Enter}`);
        DashTable.getCell(1, 0, State.Any).click();

        DashTable
            .getCell(0, 0, State.Any)
            .within(() => cy.get('.dash-cell-value')
                .should('not.have.html', 'Hello'));

        cy.wait(5000);

        // Table is editable
        DashTable
            .getCell(0, 0)
            .click()
            .find('.dash-input-cell-value-container > input').should('have.length', 1);

        DOM.focused.type(`Hello${Key.Enter}`);
        DashTable.getCell(1, 0).click();

        DashTable
            .getCell(0, 0)
            .within(() => cy.get('.dash-cell-value')
                .should('have.html', 'Hello'));
    });

    it('permits editing when a non-data prop is being changed', () => {
        // Table is editable
        DashTable
            .getCell(0, 0)
            .click()
            .find('.dash-input-cell-value-container > input').should('have.length', 1);

        // Trigger non-data callback
        cy.get('#change-other-property').click();
        DOM.focused.type(`dont_change_data${Key.Enter}`);

        // Table is editable
        DashTable
            .getCell(0, 0)
            .click()
            .find('.dash-input-cell-value-container > input').should('have.length', 1);

        DOM.focused.type(`Hello${Key.Enter}`);
        DashTable.getCell(1, 0).click();

        DashTable
            .getCell(0, 0)
            .within(() => cy.get('.dash-cell-value')
                .should('have.html', 'Hello'));
    });

    it('does not permit copy-paste when data are loading', () => {
        // Table is editable
        DashTable
            .getCell(0, 0)
            .click()
            .find('.dash-input-cell-value-container > input').should('have.length', 1);

        // Trigger data callback
        cy.get('#change-data-property').click();
        DOM.focused.type(`change_data${Key.Enter}`);

        // Table is not editable
        DashTable
            .getCell(0, 0, State.Loading)
            .click()
            .find('.dash-input-cell-value-container > input').should('have.length', 0);

        DOM.focused.type(`${Key.Meta}c`);

        DashTable
            .getCell(0, 1, State.Loading)
            .click();

        DashTable
            .getCell(0, 1, State.Loading)
            .click()
            .find('.dash-input-cell-value-container > input').should('have.length', 0);

        DOM.focused.type(`${Key.Meta}v`);

        DashTable
            .getCell(0, 0, State.Loading)
            .click();

        DashTable.getCell(0, 1, State.Loading)
            .within(() => cy.get('.dash-cell-value')
                .should('not.have.html', '0'));

        cy.wait(5000);

        // Table is editable
        DashTable
            .getCell(0, 1)
            .click();

        DOM.focused.type(`${Key.Meta}v`);

        DashTable
            .getCell(0, 0)
            .click();

        DashTable.getCell(0, 1)
            .within(() => cy.get('.dash-cell-value')
                .should('have.html', '0'));
    });

    it('permits copy-paste when a non-data prop is loading', () => {
        // Table is editable
        DashTable
            .getCell(0, 0)
            .click()
            .find('.dash-input-cell-value-container > input').should('have.length', 1);

        // Trigger non-data callback
        cy.get('#change-other-property').click();
        DOM.focused.type(`dont_change_data${Key.Enter}`);

        DashTable
            .getCell(0, 0)
            .click();

        DOM.focused.type(`${Key.Meta}c`);

        DashTable
            .getCell(0, 1)
            .click();

        DOM.focused.type(`${Key.Meta}v`);

        DashTable
            .getCell(0, 0)
            .click();

        DashTable.getCell(0, 1)
            .within(() => cy.get('.dash-cell-value')
                .should('have.html', '0'));
    });

});
