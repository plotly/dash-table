import DashTable, { DashTableHelper } from 'cypress/DashTable';

import { AppMode, AppFlavor } from 'demo/AppMode';

describe('select rows & columns in multiple tables without id', () => {
    let table1: DashTableHelper;
    let table2: DashTableHelper;

    beforeEach(() => {
        cy.visit(`http://localhost:8080?mode=${AppMode.TaleOfTwoTables}&flavor=${[AppFlavor.ColumnSelectableSingle,AppFlavor.NoId].join(';')}`).then(() => {
            const ids: string[] = [];
            return cy.get('.dash-spreadsheet-container').parent().each(el => {
                const id = el.attr('id');
                if (id) {
                    ids.push(id);
                }
            }).then(() => ids);
        }).then(ids => {
            cy.log('table ids', ids);
            expect(ids.length).to.equal(2);

            table1 = new DashTableHelper(ids[0]);
            table2 = new DashTableHelper(ids[1]);
        });

        DashTable.toggleScroll(false);
    });

    it('can select a row in both tables', () => {
        table1.getSelect(0).within(() => cy.get('input').click());
        table1.getSelect(0).within(() => cy.get('input').should('be.checked'));

        table2.getSelect(1).within(() => cy.get('input').click());
        table2.getSelect(1).within(() => cy.get('input').should('be.checked'));

        table1.getSelect(0).within(() => cy.get('input').should('be.checked'));
        table1.getSelect(1).within(() => cy.get('input').should('not.be.checked'));
    });

    it('can select a column in both tables', () => {
        table1.selectColumnById(0, 'ccc');
        table1.getSelectColumnById(2, 'ccc').should('be.checked');

        table2.selectColumnById(0, 'rows');
        table2.getSelectColumnById(2, 'rows').should('be.checked');

        table1.getSelectColumnById(2, 'ccc').should('be.checked');
        table1.getSelectColumnById(2, 'rows').should('not.be.checked');
    });
});