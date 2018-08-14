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

    // describe('with mouse', () => {
    //     beforeEach(() => {
    //         DashTable.getCell(2, 2).click();
    //     });

    //     it('can select self', () => {
    //         DOM.focused.click();
    //         DashTable.getCell(2, 2).should('have.class', 'focused');
    //     });

    //     it('can select other', () => {
    //         DashTable.getCell(3, 3).click();
    //         DashTable.getCell(3, 3).should('have.class', 'focused');
    //         DashTable.getCell(2, 2).should('not.have.class', 'focused');
    //     });
    // });

    // it('with mouse', () => {
    //     let td2Element = cy.get('#table tbody tr td.column-2').first();
    //     td2Element.click();

    //     let focusedElement = cy.focused().first();
    //     focusedElement.type('{rightarrow}');
    //     focusedElement = cy.focused().first();
    //     focusedElement.type('{rightarrow}');

    //     let td4Element = cy.get('#table tbody tr td.column-4').first();
    //     td4Element.should('have.class', 'focused');

    //     focusedElement = cy.focused().first();
    //     focusedElement.type('{leftarrow}');
    //     focusedElement = cy.focused().first();
    //     focusedElement.type('{leftarrow}');

    //     td2Element = cy.get('#table tbody tr td.column-2').first();
    //     td2Element.should('have.class', 'focused');

    //     focusedElement = cy.focused().first();
    //     focusedElement.type('{downarrow}');
    //     focusedElement = cy.focused().first();
    //     focusedElement.type('{downarrow}');

    //     let tr3td2Element = cy.get('#table tbody tr td.column-2').eq(2);
    //     tr3td2Element.should('have.class', 'focused');

    //     focusedElement = cy.focused().first();
    //     focusedElement.type('{uparrow}');
    //     focusedElement = cy.focused().first();
    //     focusedElement.type('{uparrow}');
    //     focusedElement = cy.focused().first();
    //     focusedElement.type('{rightarrow}');
    //     focusedElement = cy.focused().first();
    //     focusedElement.type('{rightarrow}');

    //     td4Element = cy.get('#table tbody tr td.column-4').first();
    //     td4Element.should('have.class', 'focused');

    //     let td4Input = cy.get('#table tbody tr td.column-4 input').first();
    //     td4Input.click({ force: true });
    //     td4Input.type(' Allo{enter}');

    //     focusedElement = cy.focused().first();
    //     focusedElement.type('{enter}');
    //     focusedElement = cy.focused().first();
    //     focusedElement.type('{uparrow}');

    //     let tr2td4Element = cy.get('#table tbody tr td.column-4').eq(1);
    //     tr2td4Element.should('have.class', 'focused');

    //     focusedElement = cy.focused().first();
    //     focusedElement.type('{shift}{downarrow}{downarrow}{rightarrow}{rightarrow}{leftarrow}');

    //     let selectedCells = cy.get('#table td.cell--selected');
    //     selectedCells.should('length', 6);

    //     cy.scrollTo(0, 0);
    //     cy.screenshot('navigation_test', { capture: 'viewport' });
    // });
});
