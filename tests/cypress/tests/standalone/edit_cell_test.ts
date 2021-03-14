import DashTable from 'cypress/DashTable';
import Key from 'cypress/Key';

import { AppMode } from 'demo/AppMode';

describe(`edit, mode=${AppMode.Date}`, () => {
    beforeEach(() => {
        cy.visit(`http://localhost:8080?mode=${AppMode.Date}`);
        DashTable.toggleScroll(false);
    });

    it('can edit date cell with a date string', () => {
        DashTable.clickCellById(0, 'ccc');
        DashTable.focusedType(`17-8-21${Key.Enter}`);
        DashTable.getCellById(0, 'ccc').within(() => cy.get('.dash-cell-value').should('have.html', `2017-08-21`));
    });

    it('cannot edit date cell with a non-date string', () => {
        DashTable.clickCellById(0, 'ccc');
        DashTable.focusedType(`abc${Key.Enter}`);
        DashTable.getCellById(0, 'ccc').within(() => cy.get('.dash-cell-value').should('not.have.html', `abc`));
    });

    describe('copy/paste', () => {
        describe('string into a date', () => {
            let copiedValue;

            beforeEach(() => {
                DashTable.getCellById(0, 'bbb-readonly').within(
                    () => cy.get('.dash-cell-value').then($cells => copiedValue = $cells[0].innerHTML)
                );

                DashTable.clickCellById(0, 'bbb-readonly');
                DashTable.focusedType(`${Key.Meta}c`);
            });

            it('does nothing', () => {
                DashTable.clickCellById(0, 'ccc');
                DashTable.focusedType(`${Key.Meta}v`);
                DashTable.getCellById(0, 'ccc').within(
                    () => cy.get('.dash-cell-value').should('not.have.value', copiedValue)
                );
            });
        });

        describe('date into a date', () => {
            let copiedValue;

            beforeEach(() => {
                DashTable.getCellById(0, 'ddd').within(
                    () => cy.get('.dash-cell-value').then($cells => copiedValue = $cells[0].innerHTML)
                );

                DashTable.clickCellById(0, 'ddd');
                DashTable.focusedType(`${Key.Meta}c`);
            });

            it('copies value', () => {
                DashTable.clickCellById(0, 'ccc');
                DashTable.focusedType(`${Key.Meta}v`);
                DashTable.getCellById(0, 'ccc').within(
                    () => cy.get('.dash-cell-value').should('have.value', copiedValue)
                );
            });
        });
    });
});
