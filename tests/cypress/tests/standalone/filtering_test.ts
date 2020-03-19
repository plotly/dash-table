import DashTable from 'cypress/DashTable';
import DOM from 'cypress/DOM';
import Key from 'cypress/Key';

import { AppMode, AppFlavor } from 'demo/AppMode';

describe(`filter special characters`, () => {
    beforeEach(() => {
        cy.visit(`http://localhost:8080?mode=${AppMode.ColumnsInSpace}`);
        DashTable.toggleScroll(false);
    });

    it('can filter on special column id', () => {
        DashTable.getFilterInputById('b+bb').click({ force: true });
        DOM.focused.type(`Wet${Key.Enter}`);

        DashTable.getFilterInputById('c cc').click({ force: true });
        DOM.focused.type(`gt 90${Key.Enter}`);

        DashTable.getFilterInputById('d:dd').click({ force: true });
        DOM.focused.type(`lt 12500${Key.Enter}`);

        DashTable.getFilterInputById('e-ee').click({ force: true });
        DOM.focused.type(`is prime${Key.Enter}`);

        DashTable.getFilterInputById('f_ff').click({ force: true });
        DOM.focused.type(`le 106${Key.Enter}`);

        DashTable.getFilterInputById('g.gg').click({ force: true });
        DOM.focused.type(`gt 1000${Key.Enter}`);
        DashTable.getFilterInputById('b+bb').click({ force: true });

        DashTable.getCellById(0, 'rows').within(() => cy.get('.dash-cell-value').should('have.html', '101'));
        DashTable.getCellById(1, 'rows').should('not.exist');
        DashTable.getFilterInputById('b+bb').should('have.value', 'Wet');
        DashTable.getFilterInputById('c cc').should('have.value', 'gt 90');
        DashTable.getFilterInputById('d:dd').should('have.value', 'lt 12500');
        DashTable.getFilterInputById('e-ee').should('have.value', 'is prime');
        DashTable.getFilterInputById('f_ff').should('have.value', 'le 106');
        DashTable.getFilterInputById('g.gg').should('have.value', 'gt 1000');
    });
});

describe('filter', () => {
    beforeEach(() => {
        cy.visit(`http://localhost:8080?mode=${AppMode.Default}&flavor=${AppFlavor.FilterNative}`);
        DashTable.toggleScroll(false);
    });

    it('handles hovering onto other filtering cells', () => {
        DashTable.getFilterInputById('ccc').click({ force: true });
        DOM.focused.type(`gt 100`);
        DashTable.getFilterInputById('ddd').click({ force: true });
        DOM.focused.type('lt 20000');

        DashTable.getCellById(0, 'eee').trigger('mouseover');

        DashTable.getFilterInputById('ccc').should('have.value', 'gt 100');
        DashTable.getFilterInputById('ddd').should('have.value', 'lt 20000');
    });

    it('handles invalid queries', () => {
        let cell_0;
        let cell_1;

        DashTable.getCellById(0, 'ccc')
            .within(() => cy.get('.dash-cell-value')
                .then($el => cell_0 = $el[0].innerHTML));

        DashTable.getCellById(1, 'ccc')
            .within(() => cy.get('.dash-cell-value')
                .then($el => cell_1 = $el[0].innerHTML));

        DashTable.getFilterInputById('ddd').click({ force: true });
        DOM.focused.type('"20 a000');
        DashTable.getFilterInputById('eee').click({ force: true });
        DOM.focused.type('is prime2');
        DashTable.getFilterInputById('bbb').click({ force: true });
        DOM.focused.type('! !"');
        DashTable.getFilterInputById('ccc').click({ force: true });

        DashTable.getCellById(0, 'ccc').within(() => cy.get('.dash-cell-value').should('have.html', cell_0));
        DashTable.getCellById(1, 'ccc').within(() => cy.get('.dash-cell-value').should('have.html', cell_1));

        DashTable.getFilterInputById('bbb').should('have.value', '! !"');
        DashTable.getFilterInputById('ddd').should('have.value', '"20 a000');
        DashTable.getFilterInputById('eee').should('have.value', 'is prime2');

        DashTable.getFilterById('bbb').should('have.class', 'invalid');
        DashTable.getFilterById('ddd').should('have.class', 'invalid');
        DashTable.getFilterById('eee').should('have.class', 'invalid');
    });

    it('filters `Text` columns with `contains` without operator', () => {
        DashTable.getFilterInputById('bbb').click({ force: true });
        DOM.focused.type('Tr');
        DashTable.getFilterInputById('ccc').click({ force: true });

        DashTable.getFilterInputById('bbb').should('have.value', 'Tr');
        DashTable.getCellById(0, 'bbb-readonly').within(() => cy.get('.dash-cell-value').should('have.html', 'label: Tropical Beaches'));
    });

    it('filters `Numeric` columns with `equal` without operator', () => {
        DashTable.getFilterInputById('ccc').click({ force: true });
        DOM.focused.type('100');
        DashTable.getFilterInputById('bbb').click({ force: true });

        DashTable.getFilterInputById('ccc').should('have.value', '100');
        DashTable.getCellById(0, 'ccc').within(() => cy.get('.dash-cell-value').should('have.html', '100'));
    });

    it('does not use text-based relational operators unless they are followed by a space', () => {
        DashTable.getCellById(2, 'ccc').click();
        DOM.focused.type(`le5${Key.Enter}`);

        DashTable.getFilterInputById('ccc').click({ force: true });
        DOM.focused.type(`le5${Key.Enter}`);
        DashTable.getCellById(0, 'ccc').within(() => cy.get('.dash-cell-value').should('have.html', 'le5'));
        DashTable.getCellById(0, 'rows').within(() => cy.get('.dash-cell-value').should('have.html', '3'));

        cy.get('.clear-filters').click();

        DashTable.getFilterInputById('ccc').click({ force: true });
        DOM.focused.type(`le 5${Key.Enter}`);
        DashTable.getCellById(0, 'ccc').within(() => cy.get('.dash-cell-value').should('have.html', '1'));
        DashTable.getCellById(1, 'ccc').within(() => cy.get('.dash-cell-value').should('have.html', '2'));
        DashTable.getCellById(2, 'ccc').within(() => cy.get('.dash-cell-value').should('have.html', '4'));
        DashTable.getCellById(3, 'ccc').within(() => cy.get('.dash-cell-value').should('have.html', '5'));
    });

    it('uses symbol relational operators that are not followed by a space', () => {
        DashTable.getFilterInputById('ccc').click({ force: true });
        DOM.focused.type(`<=5${Key.Enter}`);
        DashTable.getCellById(0, 'ccc').within(() => cy.get('.dash-cell-value').should('have.html', '1'));
        DashTable.getCellById(1, 'ccc').within(() => cy.get('.dash-cell-value').should('have.html', '2'));
        DashTable.getCellById(2, 'ccc').within(() => cy.get('.dash-cell-value').should('have.html', '3'));
        DashTable.getCellById(3, 'ccc').within(() => cy.get('.dash-cell-value').should('have.html', '4'));
        DashTable.getCellById(4, 'ccc').within(() => cy.get('.dash-cell-value').should('have.html', '5'));
    });

    it('typing invalid followed by valid query fragment does not reset invalid', () => {
        DashTable.getFilterInputById('ccc').click({ force: true });
        DOM.focused.type(`is prime2`);
        DashTable.getFilterInputById('ddd').click({ force: true });
        DOM.focused.type('lt 20000');
        DashTable.getFilterInputById('eee').click({ force: true });

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

        DashTable.getFilterInputById('ccc').click({ force: true });
        DOM.focused.type(`gt 100`);
        DashTable.getFilterInputById('ddd').click({ force: true });
        DOM.focused.type('lt 20000');
        DashTable.getFilterInputById('eee').click({ force: true });
        DOM.focused.type('is prime');
        DashTable.getFilterInputById('bbb').click({ force: true });
        DOM.focused.type(`Wet`);
        DashTable.getFilterInputById('ccc').click({ force: true });

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