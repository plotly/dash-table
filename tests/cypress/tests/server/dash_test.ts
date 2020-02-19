import DashTable from 'cypress/DashTable';
import DOM from 'cypress/DOM';
import Key from 'cypress/Key';

describe('dash basic', () => {
    beforeEach(() => {
        cy.visit('http://localhost:8081');
    });

    describe('ArrowKeys navigation', () => {
        describe('When active, but not focused', () => {
            // https://github.com/plotly/dash-table/issues/141
            it('can edit last, update data on "arrowleft", and move one cell to the left', () => {
                const startingCell = [249, 1];
                const targetCell = [249, 0];
                DashTable.focusCell(startingCell[0], startingCell[1]);
                DOM.focused.then($input => {
                    const initialValue = $input.val();

                    DOM.focused.type(`abc${Key.ArrowLeft}`);

                    cy.get('#container').should($container => {
                        expect($container.first()[0].innerText).to.equal(`[249][1] = ${initialValue} -> abc`);
                    });
                });
                DashTable.getCell(targetCell[0], targetCell[1]).should('have.class', 'focused');
            });

            // https://github.com/plotly/dash-table/issues/141
            it('can edit last, update data on "arrowup", and move one cell up', () => {
                const startingCell = [249, 0];
                const targetCell = [248, 0];
                DashTable.focusCell(startingCell[0], startingCell[1]);
                DOM.focused.then($input => {
                    const initialValue = $input.val();

                    DOM.focused.type(`abc${Key.ArrowUp}`);

                    cy.get('#container').should($container => {
                        expect($container.first()[0].innerText).to.equal(`[249][0] = ${initialValue} -> abc`);
                    });
                });
                DashTable.getCell(targetCell[0], targetCell[1]).should('have.class', 'focused');
            });

            // https://github.com/plotly/dash-table/issues/141
            it('can edit last, update data on "arrowright", and move one cell to the right', () => {
                const startingCell = [249, 0];
                const targetCell = [249, 1];
                DashTable.focusCell(startingCell[0], startingCell[1]);
                DOM.focused.then($input => {
                    const initialValue = $input.val();

                    DOM.focused.type(`abc${Key.ArrowRight}`);

                    cy.get('#container').should($container => {
                        expect($container.first()[0].innerText).to.equal(`[249][0] = ${initialValue} -> abc`);
                    });
                });
                DashTable.getCell(targetCell[0], targetCell[1]).should('have.class', 'focused');
            });

            // https://github.com/plotly/dash-table/issues/141
            it('can edit last, update data on "arrowdown", and move one cell down', () => {
                const startingCell = [249, 0];
                const targetCell = [249, 1];
                DashTable.focusCell(startingCell[0], startingCell[1]);
                DOM.focused.then($input => {
                    const initialValue = $input.val();

                    DOM.focused.type(`abc${Key.ArrowRight}`);

                    cy.get('#container').should($container => {
                        expect($container.first()[0].innerText).to.equal(`[249][0] = ${initialValue} -> abc`);
                    });
                });
                DashTable.getCell(targetCell[0], targetCell[1]).should('have.class', 'focused');
            });
        });
    });

    it('can edit last and update data when clicking outside of cell', () => {
        DashTable.focusCell(249, 0);
        DOM.focused.then($input => {
            const initialValue = $input.val();

            DOM.focused.type(`abc`);
            DashTable.getCell(248, 0).click();

            cy.get('#container').should($container => {
                expect($container.first()[0].innerText).to.equal(`[249][0] = ${initialValue} -> abc`);
            });
        });
    });

    it('can get cell with double click', () => {
        DashTable.getCell(3, 1).within(() => cy.get('div').dblclick());
        DashTable.getCell(3, 1).should('have.class', 'focused');
    });
});
