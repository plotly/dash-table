import DashTable from 'cypress/DashTable';
import DOM from 'cypress/DOM';
import Key from 'cypress/Key';

describe('loading states uneditable', () => {

    beforeEach(() => {
        cy.visit('http://localhost:8084');
    });

    it('does not permit editing when data are loading', () => {

        DashTable
            .getCell(0, 0)
            .click()
            .find('.dash-input-cell-value-container > input').should('have.length', 1);
        DashTable
            .getCell(0, 1)
            .click()
            .find('.dash-input-cell-value-container > input').should('have.length', 1);

        cy.get('#change-property').click();
        DOM.focused.type(`change_data`);

        DashTable
            .getCell(0, 0)
            .click()
            .find('.dash-input-cell-value-container > input').should('have.length', 0);

        DashTable
            .getCell(0, 1)
            .click()
            .find('.dash-input-cell-value-container > input').should('have.length', 0);

        DashTable.getCell(0, 2).click();
        DOM.focused.type(`Hello`);

        cy.wait(5000);

        DashTable.getCell(0, 2).click();
        DOM.focused.type(`World`);

        DashTable
            .getCell(0, 0)
            .click()
            .find('.dash-input-cell-value-container > input').should('have.length', 1);
        DashTable
            .getCell(0, 1)
            .click()
            .find('.dash-input-cell-value-container > input').should('have.length', 1);

        DashTable
            .getCell(0, 2)
            .within(() => cy.get('.dash-cell-value')
                .should('have.html', 'World'));

    });

    it('permits editing when a non-data prop is being changed', () => {
        DashTable
            .getCell(0, 0)
            .click()
            .find('.dash-input-cell-value-container > input').should('have.length', 1);
        DashTable
            .getCell(0, 1)
            .click()
            .find('.dash-input-cell-value-container > input').should('have.length', 1);

        cy.get('#change-property').click();
        DOM.focused.type(`dont_change_data${Key.Enter}`);

        DashTable.getCell(0, 2).click();
        DOM.focused.type(`Hello`);

        DashTable
            .getCell(0, 0)
            .click()
            .find('.dash-input-cell-value-container > input').should('have.length', 1);

        DashTable
            .getCell(0, 1)
            .click()
            .find('.dash-input-cell-value-container > input').should('have.length', 1);

        DashTable
            .getCell(0, 2)
            .within(() => cy.get('.dash-cell-value')
                .should('have.html', 'Hello'));

        cy.wait(5000);

        DashTable.getCell(0, 2).click();
        DOM.focused.type(`World`);

        DashTable
            .getCell(0, 0)
            .click()
            .find('.dash-input-cell-value-container > input').should('have.length', 1);
        DashTable
            .getCell(0, 1)
            .click()
            .find('.dash-input-cell-value-container > input').should('have.length', 1);

        DashTable
            .getCell(0, 2)
            .within(() => cy.get('.dash-cell-value')
                .should('have.html', 'World'));

    });

    it('does not permit copy-paste when data are loading', () => {

	cy.get('#change-property').click();
	DOM.focused.type(`change_data${Key.Enter}`);

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
		    .should('have.html', '1291006'));

	cy.wait(5000);

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

	cy.get('#change-property').click();
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
