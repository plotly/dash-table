import DashTable from 'cypress/DashTable';
import { AppMode, AppFlavor } from 'demo/AppMode';

describe(`edit, mode=${AppMode.Typed}`, () => {
    describe(`edit headers, mode=${AppMode.Typed}`, () => {
        beforeEach(() => {
            cy.visit(`http://localhost:8080?mode=${AppMode.Typed}`);
            DashTable.toggleScroll(false);
        });

        it('changing the column 0 header should not change any column 0 headers below it', () => {
            cy.window().then((win: any) => {
                cy.stub(win, 'prompt').returns('Hello');
            });
            cy.get('.dash-header.column-0 .column-header--edit').eq(0).click();
            cy.get('.dash-header.column-0 > div > span:last-child').should('have.html', `Hello`);
            cy.get('table > tbody > tr:nth-child(2) > th.dash-header.column-0 > div > span:last-child').should('have.html', `rows`);
        });

        it('changing the column 1 header should not change any other headers', () => {
            cy.window().then((win: any) => {
                cy.stub(win, 'prompt').returns('Aloha');
            });
            cy.get('.dash-header.column-1 .column-header--edit').eq(0).click();
            cy.get('.dash-header.column-1 > div > span:last-child').should('have.html', `Aloha`);
            cy.get('.dash-header.column-2 > div > span:last-child').should('have.html', `City`);
        });
    });

    describe(`edit headers, mode=${AppMode.Default},flavor=${AppFlavor.Merged}`, () => {
        beforeEach(() => {
            cy.visit(`http://localhost:8080?mode=${AppMode.Default}&flavor=${AppFlavor.Merged}`);
            DashTable.toggleScroll(false);
        });
        it('changing the column 0 header should not change any column 0 headers below it', () => {
            cy.window().then((win: any) => {
                cy.stub(win, 'prompt').returns('Otter');
            });
            cy.get('.dash-header.column-0 .column-header--edit').eq(0).click();
            cy.get('.dash-header.column-0 > div > span:last-child').should('have.html', `Otter`);
            cy.get('table > tbody > tr:nth-child(2) > th.dash-header.column-0 > div > span:last-child').should('have.html', `rows`);
        });
        it('changing the column 1 header should not change any other headers', () => {
            cy.window().then((win: any) => {
                cy.stub(win, 'prompt').returns('Aloha');
            });
            cy.get('.dash-header.column-1 .column-header--edit').eq(0).click();
            cy.get('.dash-header.column-0 > div > span:last-child').should('have.html', `rows`);
            cy.get('.dash-header.column-1 > div > span:last-child').should('have.html', `Aloha`);
            cy.get('.dash-header.column-6 > div > span:last-child').should('have.html', ``);
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
            cy.get('.dash-header.column-0 .column-header--edit').eq(0).click();
            cy.get('.dash-header.column-0 > div > span:last-child').should('have.html', 'Russia');
        });
        it('changing the column 1 header should not change any other headers', () => {
            cy.window().then((win: any) => {
                cy.stub(win, 'prompt').returns('Alaska');
            });
            cy.get('.dash-header.column-1 .column-header--edit').eq(0).click();
            cy.get('.dash-header.column-0 > div > span:last-child').should('have.html', 'rows');
            cy.get('.dash-header.column-1 > div > span:last-child').should('have.html', 'Alaska');
        });
    });
});
