import DashTable from 'cypress/DashTable';
import { AppMode, AppFlavor } from 'demo/AppMode';

describe(`edit, mode=${AppMode.Typed}`, () => {
    describe('edit headers, canceled edit', () => {
        beforeEach(() => {
            cy.visit(`http://localhost:8080?mode=${AppMode.SingleHeaders}`);
            DashTable.toggleScroll(false);
        });
        it('preserves column name if edit is canceled', () => {
            cy.window().then((win: any) => {
                // user presses cancel -> prompt returns null
                cy.stub(win, 'prompt').returns(null);
            });
            cy.get('.dash-header.column-0:not(.phantom-cell) .column-header--edit').eq(0).click();
            cy.get('.dash-header.column-0:not(.phantom-cell) > div > span:last-child').should('have.html', 'rows');
        });
    });

    describe(`edit headers, mode=${AppMode.SingleHeaders}`, () => {
        beforeEach(() => {
            cy.visit(`http://localhost:8080?mode=${AppMode.SingleHeaders}`);
            DashTable.toggleScroll(false);
        });
        it('allows changing single-row column 0 header', () => {
            cy.window().then((win: any) => {
                cy.stub(win, 'prompt').returns('Russia');
            });
            cy.get('.dash-header.column-0:not(.phantom-cell) .column-header--edit').eq(0).click();
            cy.get('.dash-header.column-0:not(.phantom-cell) > div > span:last-child').should('have.html', 'Russia');
        });
        it('changing the column 1 header should not change any other headers', () => {
            cy.window().then((win: any) => {
                cy.stub(win, 'prompt').returns('Alaska');
            });
            cy.get('.dash-header.column-1:not(.phantom-cell) .column-header--edit').eq(0).click();
            cy.get('.dash-header.column-0:not(.phantom-cell) > div > span:last-child').should('have.html', 'rows');
            cy.get('.dash-header.column-1:not(.phantom-cell) > div > span:last-child').should('have.html', 'Alaska');
        });
    });
});
