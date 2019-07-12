import DashTable from 'cypress/DashTable';
import DOM from 'cypress/DOM';

import { AppMode } from 'demo/AppMode';

describe(`column, mode=${AppMode.Clearable}`, () => {
    beforeEach(() => {
        cy.visit(`http://localhost:8080?mode=${AppMode.Clearable}`);
        DashTable.toggleScroll(false);
    });

    it('can delete column', () => {
        DashTable.getHeader(0, 0).within(() => cy.get('span.column-header-name').should('have.html', 'rows'));
        DashTable.deleteColumnById(0, 'rows');
        DashTable.getHeader(0, 0).within(() => cy.get('span.column-header-name').should('have.html', 'City'));
        DashTable.getHeader(1, 0).within(() => cy.get('span.column-header-name').should('have.html', 'Canada'));
        DashTable.getHeader(2, 0).within(() => cy.get('span.column-header-name').should('have.html', 'Toronto'));
        DashTable.deleteColumnById(1, 'ccc'); // Canada
        DashTable.getHeader(0, 0).within(() => cy.get('span.column-header-name').should('have.html', 'City'));
        DashTable.getHeader(1, 0).within(() => cy.get('span.column-header-name').should('have.html', 'America'));
        DashTable.getHeader(2, 0).within(() => cy.get('span.column-header-name').should('have.html', 'New York City'));
        DashTable.deleteColumnById(0, 'fff'); // Boston
        DashTable.getHeader(0, 0).within(() => cy.get('span.column-header-name').should('have.html', 'City'));
        DashTable.getHeader(1, 0).within(() => cy.get('span.column-header-name').should('have.html', 'America'));
        DashTable.getHeader(2, 0).within(() => cy.get('span.column-header-name').should('have.html', 'New York City'));
        DashTable.getHeader(0, 1).within(() => cy.get('span.column-header-name').should('have.html', 'France'));
        DashTable.getHeader(1, 1).within(() => cy.get('span.column-header-name').should('have.html', 'Paris'));
    });

    it('can clear column', () => {
        DashTable.getFilter(0).click();
        DOM.focused.type(`is num`);
        DashTable.getFilter(1).click();
        DOM.focused.type(`is num`);
        DashTable.getFilter(2).click();
        DOM.focused.type(`is num`);
        DashTable.getFilter(3).click();
        DOM.focused.type(`is num`);
        DashTable.getFilter(4).click();
        DOM.focused.type(`is num`);

        DashTable.clearColumnById(0, 'rows');
        DashTable.clearColumnById(1, 'ccc'); // Canada
        DashTable.clearColumnById(0, 'fff'); // Boston

        DashTable.getHeader(2, 0).within(() => cy.get('span.column-header-name').should('have.html', 'rows'));
        DashTable.getHeader(2, 1).within(() => cy.get('span.column-header-name').should('have.html', 'Toronto'));
        DashTable.getHeader(0, 2).within(() => cy.get('span.column-header-name').should('have.html', 'Montréal'));
        DashTable.getHeader(1, 3).within(() => cy.get('span.column-header-name').should('have.html', 'New York City'));
        DashTable.getHeader(0, 4).within(() => cy.get('span.column-header-name').should('have.html', 'Boston'));

        DashTable.getCell(0, 0).within(() => cy.get('.dash-cell-value').should('have.html', ''));
        DashTable.getCell(0, 1).within(() => cy.get('.dash-cell-value').should('have.html', ''));
        DashTable.getCell(0, 2).within(() => cy.get('.dash-cell-value').should('have.html', ''));
        DashTable.getCell(0, 3).within(() => cy.get('.dash-cell-value').should('have.html', '1'));
        DashTable.getCell(0, 4).within(() => cy.get('.dash-cell-value').should('have.html', ''));

        DashTable.getFilter(0).within(() => cy.get('input').should('have.value', ''));
        DashTable.getFilter(1).within(() => cy.get('input').should('have.value', ''));
        DashTable.getFilter(2).within(() => cy.get('input').should('have.value', ''));
        DashTable.getFilter(3).within(() => cy.get('input').should('have.value', 'is num'));
        DashTable.getFilter(4).within(() => cy.get('input').should('have.value', ''));
    });
});