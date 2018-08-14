import DashTable from 'cypress/DashTable';
import DOM from 'cypress/DOM';
import Key from 'cypress/Key';

describe('select', () => {
    beforeEach(() => {
        cy.visit('http://localhost:8080');
    });

    describe('with keyboard', () => {
        beforeEach(() => {
            DashTable.getCell(2, 2).click();
        });

        it('can select down', () => {
            DOM.focused.type(`${Key.Shift}${Key.ArrowDown}`);
            DashTable.getSelectedCells().should('have.length', 2);
            DashTable.getCell(2, 2).should('have.class', 'cell--selected');
            DashTable.getCell(3, 2).should('have.class', 'cell--selected');
        });

        it('can select left', () => {
            DOM.focused.type(`${Key.Shift}${Key.ArrowLeft}`);
            DashTable.getSelectedCells().should('have.length', 2);
            DashTable.getCell(2, 2).should('have.class', 'cell--selected');
            DashTable.getCell(2, 1).should('have.class', 'cell--selected');
        });

        it('can select right', () => {
            DOM.focused.type(`${Key.Shift}${Key.ArrowRight}`);
            DashTable.getSelectedCells().should('have.length', 2);
            DashTable.getCell(2, 2).should('have.class', 'cell--selected');
            DashTable.getCell(2, 3).should('have.class', 'cell--selected');
        });

        it('can select up', () => {
            DOM.focused.type(`${Key.Shift}${Key.ArrowUp}`);
            DashTable.getSelectedCells().should('have.length', 2);
            DashTable.getCell(2, 2).should('have.class', 'cell--selected');
            DashTable.getCell(1, 2).should('have.class', 'cell--selected');
        });

        it('can select down twice', () => {
            DOM.focused.type(`${Key.Shift}${Key.ArrowDown}`);
            DOM.focused.type(`${Key.Shift}${Key.ArrowDown}`);
            DashTable.getSelectedCells().should('have.length', 3);
            DashTable.getCell(2, 2).should('have.class', 'cell--selected');
            DashTable.getCell(3, 2).should('have.class', 'cell--selected');
            DashTable.getCell(4, 2).should('have.class', 'cell--selected');
        });

        it('can select down then up', () => {
            DOM.focused.type(`${Key.Shift}${Key.ArrowDown}`);
            DOM.focused.type(`${Key.Shift}${Key.ArrowUp}`);
            DashTable.getSelectedCells().should('have.length', 1);
            DashTable.getCell(2, 2).should('have.class', 'cell--selected');
        });

        it('can select down then right', () => {
            DOM.focused.type(`${Key.Shift}${Key.ArrowDown}`);
            DOM.focused.type(`${Key.Shift}${Key.ArrowRight}`);
            DashTable.getSelectedCells().should('have.length', 4);
            DashTable.getCell(2, 2).should('have.class', 'cell--selected');
            DashTable.getCell(3, 2).should('have.class', 'cell--selected');
            DashTable.getCell(2, 3).should('have.class', 'cell--selected');
            DashTable.getCell(3, 3).should('have.class', 'cell--selected');
        });
    });

    describe('with mouse', () => {
        beforeEach(() => {
            DashTable.getCell(2, 2).click();
        });

        it('can select (4,4)', () => {
            DOM.focused.type(Key.Shift, { release: false });
            DashTable.getCell(4, 4).click();
            DashTable.getSelectedCells().should('have.length', 9);

            for (let row = 2; row <= 4; ++row) {
                for (let column = 2; column <= 4; ++column) {
                    DashTable.getCell(row, column).should('have.class', 'cell--selected');
                }
            }
        })
    });
});
