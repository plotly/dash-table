import DashTable from 'cypress/DashTable';

import { AppMode, AppFlavor } from 'demo/AppMode';

describe('filter', () => {
    beforeEach(() => {
        cy.visit(`http://localhost:8080?mode=${AppMode.Default}&flavor=${AppFlavor.FilterNative}`);
        DashTable.toggleScroll(false);
    });

    it('typing invalid followed by valid query fragment does not reset invalid', () => {
        DashTable.clickFilterInputById('ccc');
        DashTable.focusedType(`is prime2`);
        DashTable.clickFilterInputById('ddd');
        DashTable.focusedType('lt 20000');
        DashTable.clickFilterInputById('eee');

        DashTable.getFilterInputById('ccc').should('have.value', 'is prime2');
        DashTable.getFilterInputById('ddd').should('have.value', 'lt 20000');
    });

    it('reset updates results and filter fields', () => {
        let cell_0;
        let cell_1;

        DashTable.getCellById(0, 'ccc')
            .within(() => cy.get('.dash-cell-value')
                .then($el => cell_0 = $el[0].innerHTML));

        DashTable.getCellById(1, 'ccc')
            .within(() => cy.get('.dash-cell-value')
                .then($el => cell_1 = $el[0].innerHTML));

        DashTable.clickFilterInputById('ccc');
        DashTable.focusedType(`gt 100`);
        DashTable.clickFilterInputById('ddd');
        DashTable.focusedType('lt 20000');
        DashTable.clickFilterInputById('eee');
        DashTable.focusedType('is prime');
        DashTable.clickFilterInputById('bbb');
        DashTable.focusedType(`Wet`);
        DashTable.clickFilterInputById('ccc');

        DashTable.getCellById(0, 'ccc').within(() => cy.get('.dash-cell-value').should('have.html', '101'));
        DashTable.getCellById(1, 'ccc').within(() => cy.get('.dash-cell-value').should('have.html', '109'));

        DashTable.getFilterInputById('bbb').should('have.value', 'Wet');
        DashTable.getFilterInputById('ccc').should('have.value', 'gt 100');
        DashTable.getFilterInputById('ddd').should('have.value', 'lt 20000');
        DashTable.getFilterInputById('eee').should('have.value', 'is prime');

        cy.get('.clear-filters').click();

        DashTable.getCellById(0, 'ccc').within(() => cy.get('.dash-cell-value').should('have.html', cell_0));
        DashTable.getCellById(1, 'ccc').within(() => cy.get('.dash-cell-value').should('have.html', cell_1));

        DashTable.getFilterInputById('bbb').should('have.value', '');
        DashTable.getFilterInputById('ccc').should('have.value', '');
        DashTable.getFilterInputById('ddd').should('have.value', '');
        DashTable.getFilterInputById('eee').should('have.value', '');
    });
});