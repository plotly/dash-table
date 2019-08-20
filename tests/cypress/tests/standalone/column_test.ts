import DashTable from 'cypress/DashTable';
import DOM from 'cypress/DOM';

import { AppMode, AppFlavor } from 'demo/AppMode';

describe(`column, mode=${AppMode.Actionable}, flavor=${AppFlavor.Merged}, ${AppFlavor.ColumnSelectableMulti}`, () => {
    beforeEach(() => {
        cy.visit(`http://localhost:8080?mode=${AppMode.Actionable}&flavor=${[AppFlavor.Merged, AppFlavor.ColumnSelectableMulti].join(';')}`);
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

    it('can hide column', () => {
        DashTable.getHeader(0, 0).within(() => cy.get('span.column-header-name').should('have.html', 'rows'));
        DashTable.hideColumnById(0, 'rows');
        DashTable.getHeader(0, 0).within(() => cy.get('span.column-header-name').should('have.html', 'City'));
        DashTable.getHeader(1, 0).within(() => cy.get('span.column-header-name').should('have.html', 'Canada'));
        DashTable.getHeader(2, 0).within(() => cy.get('span.column-header-name').should('have.html', 'Toronto'));
        DashTable.hideColumnById(0, 'ccc'); // Canada
        DashTable.getHeader(0, 0).within(() => cy.get('span.column-header-name').should('have.html', 'City'));
        DashTable.getHeader(1, 0).within(() => cy.get('span.column-header-name').should('have.html', 'Canada'));
        DashTable.getHeader(2, 0).within(() => cy.get('span.column-header-name').should('have.html', 'Montréal'));
        DashTable.hideColumnById(0, 'fff'); // Boston
        DashTable.getHeader(0, 0).within(() => cy.get('span.column-header-name').should('have.html', 'City'));
        DashTable.getHeader(1, 0).within(() => cy.get('span.column-header-name').should('have.html', 'Canada'));
        DashTable.getHeader(0, 1).within(() => cy.get('span.column-header-name').should('have.html', 'America'));
        DashTable.getHeader(1, 1).within(() => cy.get('span.column-header-name').should('have.html', 'New York City'));
        DashTable.getHeader(0, 0).within(() => cy.get('span.column-header-name').should('have.html', 'City'));
        DashTable.getHeader(0, 2).within(() => cy.get('span.column-header-name').should('have.html', 'France'));
        DashTable.getHeader(1, 2).within(() => cy.get('span.column-header-name').should('have.html', 'Paris'));
    });
});

describe(`column, mode=${AppMode.Actionable}, flavor=${AppFlavor.Merged}, ${AppFlavor.ColumnSelectableMulti}`, () => {
    beforeEach(() => {
        cy.visit(`http://localhost:8080?mode=${AppMode.Actionable}&flavor=${[AppFlavor.Merged, AppFlavor.ColumnSelectableMulti].join(';')}`);
        DashTable.toggleScroll(false);
    });

    it(`can select multiple columns`, () => {
        DashTable.selectColumnById(0, 'ccc');
        DashTable.getSelectColumnById(0, 'rows').should('not.be.checked');
        DashTable.getSelectColumnById(1, 'rows').should('not.be.checked');
        DashTable.getSelectColumnById(2, 'rows').should('not.be.checked');
        DashTable.getSelectColumnById(0, 'ccc').should('be.checked');
        DashTable.getSelectColumnById(1, 'ccc').should('be.checked');
        DashTable.getSelectColumnById(2, 'ccc').should('be.checked');
        DashTable.getSelectColumnById(0, 'ddd').should('be.checked');
        DashTable.getSelectColumnById(0, 'eee').should('be.checked');
        DashTable.getSelectColumnById(1, 'eee').should('be.checked');
        DashTable.getSelectColumnById(0, 'fff').should('be.checked');
        DashTable.getSelectColumnById(0, 'ggg').should('be.checked');
        DashTable.getSelectColumnById(1, 'ggg').should('be.checked');

        DashTable.selectColumnById(0, 'rows');
        DashTable.getSelectColumnById(0, 'rows').should('be.checked');
        DashTable.getSelectColumnById(1, 'rows').should('be.checked');
        DashTable.getSelectColumnById(2, 'rows').should('be.checked');
        DashTable.getSelectColumnById(0, 'ccc').should('be.checked');
        DashTable.getSelectColumnById(1, 'ccc').should('be.checked');
        DashTable.getSelectColumnById(2, 'ccc').should('be.checked');
        DashTable.getSelectColumnById(0, 'ddd').should('be.checked');
        DashTable.getSelectColumnById(0, 'eee').should('be.checked');
        DashTable.getSelectColumnById(1, 'eee').should('be.checked');
        DashTable.getSelectColumnById(0, 'fff').should('be.checked');
        DashTable.getSelectColumnById(0, 'ggg').should('be.checked');
        DashTable.getSelectColumnById(1, 'ggg').should('be.checked');

        DashTable.selectColumnById(0, 'ccc');
        DashTable.selectColumnById(0, 'rows');
        DashTable.getSelectColumnById(0, 'rows').should('not.be.checked');
        DashTable.getSelectColumnById(1, 'rows').should('not.be.checked');
        DashTable.getSelectColumnById(2, 'rows').should('not.be.checked');
        DashTable.getSelectColumnById(0, 'ccc').should('not.be.checked');
        DashTable.getSelectColumnById(1, 'ccc').should('not.be.checked');
        DashTable.getSelectColumnById(2, 'ccc').should('not.be.checked');
        DashTable.getSelectColumnById(0, 'ddd').should('not.be.checked');
        DashTable.getSelectColumnById(0, 'eee').should('not.be.checked');
        DashTable.getSelectColumnById(1, 'eee').should('not.be.checked');
        DashTable.getSelectColumnById(0, 'fff').should('not.be.checked');
        DashTable.getSelectColumnById(0, 'ggg').should('not.be.checked');
        DashTable.getSelectColumnById(1, 'ggg').should('not.be.checked');
    });

    it(`can't select top row by selecting some column subsets`, () => {
        DashTable.selectColumnById(1, 'ccc');
        DashTable.selectColumnById(1, 'ggg');
        DashTable.getSelectColumnById(0, 'rows').should('not.be.checked');
        DashTable.getSelectColumnById(1, 'rows').should('not.be.checked');
        DashTable.getSelectColumnById(2, 'rows').should('not.be.checked');
        DashTable.getSelectColumnById(0, 'ccc').should('not.be.checked');
        DashTable.getSelectColumnById(1, 'ccc').should('be.checked');
        DashTable.getSelectColumnById(2, 'ccc').should('be.checked');
        DashTable.getSelectColumnById(0, 'ddd').should('be.checked');
        DashTable.getSelectColumnById(0, 'eee').should('not.be.checked');
        DashTable.getSelectColumnById(1, 'eee').should('not.be.checked');
        DashTable.getSelectColumnById(0, 'fff').should('not.be.checked');
        DashTable.getSelectColumnById(0, 'ggg').should('be.checked');
        DashTable.getSelectColumnById(1, 'ggg').should('be.checked');
    });

    it(`can select top row by selecting all column subsets`, () => {
        DashTable.selectColumnById(1, 'ccc');
        DashTable.selectColumnById(0, 'eee');
        DashTable.selectColumnById(0, 'ggg');
        DashTable.getSelectColumnById(0, 'rows').should('not.be.checked');
        DashTable.getSelectColumnById(1, 'rows').should('not.be.checked');
        DashTable.getSelectColumnById(2, 'rows').should('not.be.checked');
        DashTable.getSelectColumnById(0, 'ccc').should('be.checked');
        DashTable.getSelectColumnById(1, 'ccc').should('be.checked');
        DashTable.getSelectColumnById(2, 'ccc').should('be.checked');
        DashTable.getSelectColumnById(0, 'ddd').should('be.checked');
        DashTable.getSelectColumnById(0, 'eee').should('be.checked');
        DashTable.getSelectColumnById(1, 'eee').should('be.checked');
        DashTable.getSelectColumnById(0, 'fff').should('be.checked');
        DashTable.getSelectColumnById(0, 'ggg').should('be.checked');
        DashTable.getSelectColumnById(1, 'ggg').should('be.checked');
    });
});

describe(`column, mode=${AppMode.Actionable}, flavor=${AppFlavor.Merged}, ${AppFlavor.ColumnSelectableSingle}`, () => {
    beforeEach(() => {
        cy.visit(`http://localhost:8080?mode=${AppMode.Actionable}&flavor=${[AppFlavor.Merged, AppFlavor.ColumnSelectableSingle].join(';')}`);
        DashTable.toggleScroll(false);
    });

    it(`can select multiple columns`, () => {
        DashTable.selectColumnById(0, 'ccc');
        DashTable.getSelectColumnById(0, 'rows').should('not.be.checked');
        DashTable.getSelectColumnById(1, 'rows').should('not.be.checked');
        DashTable.getSelectColumnById(2, 'rows').should('not.be.checked');
        DashTable.getSelectColumnById(0, 'ccc').should('be.checked');
        DashTable.getSelectColumnById(1, 'ccc').should('not.be.checked');
        DashTable.getSelectColumnById(2, 'ccc').should('not.be.checked');
        DashTable.getSelectColumnById(0, 'ddd').should('not.be.checked');
        DashTable.getSelectColumnById(0, 'eee').should('not.be.checked');
        DashTable.getSelectColumnById(1, 'eee').should('not.be.checked');
        DashTable.getSelectColumnById(0, 'fff').should('not.be.checked');
        DashTable.getSelectColumnById(0, 'ggg').should('not.be.checked');
        DashTable.getSelectColumnById(1, 'ggg').should('not.be.checked');

        DashTable.selectColumnById(1, 'ccc');
        DashTable.getSelectColumnById(0, 'rows').should('not.be.checked');
        DashTable.getSelectColumnById(1, 'rows').should('not.be.checked');
        DashTable.getSelectColumnById(2, 'rows').should('not.be.checked');
        DashTable.getSelectColumnById(0, 'ccc').should('not.be.checked');
        DashTable.getSelectColumnById(1, 'ccc').should('be.checked');
        DashTable.getSelectColumnById(2, 'ccc').should('not.be.checked');
        DashTable.getSelectColumnById(0, 'ddd').should('not.be.checked');
        DashTable.getSelectColumnById(0, 'eee').should('not.be.checked');
        DashTable.getSelectColumnById(1, 'eee').should('not.be.checked');
        DashTable.getSelectColumnById(0, 'fff').should('not.be.checked');
        DashTable.getSelectColumnById(0, 'ggg').should('not.be.checked');
        DashTable.getSelectColumnById(1, 'ggg').should('not.be.checked');

        DashTable.selectColumnById(2, 'ccc');
        DashTable.getSelectColumnById(0, 'rows').should('not.be.checked');
        DashTable.getSelectColumnById(1, 'rows').should('not.be.checked');
        DashTable.getSelectColumnById(2, 'rows').should('not.be.checked');
        DashTable.getSelectColumnById(0, 'ccc').should('not.be.checked');
        DashTable.getSelectColumnById(1, 'ccc').should('not.be.checked');
        DashTable.getSelectColumnById(2, 'ccc').should('be.checked');
        DashTable.getSelectColumnById(0, 'ddd').should('not.be.checked');
        DashTable.getSelectColumnById(0, 'eee').should('not.be.checked');
        DashTable.getSelectColumnById(1, 'eee').should('not.be.checked');
        DashTable.getSelectColumnById(0, 'fff').should('not.be.checked');
        DashTable.getSelectColumnById(0, 'ggg').should('not.be.checked');
        DashTable.getSelectColumnById(1, 'ggg').should('not.be.checked');

        DashTable.selectColumnById(0, 'rows');
        DashTable.getSelectColumnById(0, 'rows').should('not.be.checked');
        DashTable.getSelectColumnById(1, 'rows').should('not.be.checked');
        DashTable.getSelectColumnById(2, 'rows').should('be.checked');
        DashTable.getSelectColumnById(0, 'ccc').should('not.be.checked');
        DashTable.getSelectColumnById(1, 'ccc').should('not.be.checked');
        DashTable.getSelectColumnById(2, 'ccc').should('not.be.checked');
        DashTable.getSelectColumnById(0, 'ddd').should('not.be.checked');
        DashTable.getSelectColumnById(0, 'eee').should('not.be.checked');
        DashTable.getSelectColumnById(1, 'eee').should('not.be.checked');
        DashTable.getSelectColumnById(0, 'fff').should('not.be.checked');
        DashTable.getSelectColumnById(0, 'ggg').should('not.be.checked');
        DashTable.getSelectColumnById(1, 'ggg').should('not.be.checked');
    });
});

describe(`column, mode=${AppMode.Actionable}`, () => {
    beforeEach(() => {
        cy.visit(`http://localhost:8080?mode=${AppMode.Actionable}`);
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
        DashTable.getHeader(1, 0).within(() => cy.get('span.column-header-name').should('have.html', 'Canada'));
        DashTable.getHeader(2, 0).within(() => cy.get('span.column-header-name').should('have.html', 'Montréal'));
        DashTable.deleteColumnById(0, 'fff'); // Boston
        DashTable.getHeader(0, 1).within(() => cy.get('span.column-header-name').should('have.html', 'City'));
        DashTable.getHeader(1, 1).within(() => cy.get('span.column-header-name').should('have.html', 'America'));
        DashTable.getHeader(2, 1).within(() => cy.get('span.column-header-name').should('have.html', 'New York City'));
        DashTable.getHeader(0, 2).within(() => cy.get('span.column-header-name').should('have.html', 'City'));
        DashTable.getHeader(1, 2).within(() => cy.get('span.column-header-name').should('have.html', 'France'));
        DashTable.getHeader(2, 2).within(() => cy.get('span.column-header-name').should('have.html', 'Paris'));
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
        DashTable.getHeader(2, 2).within(() => cy.get('span.column-header-name').should('have.html', 'Montréal'));
        DashTable.getHeader(2, 3).within(() => cy.get('span.column-header-name').should('have.html', 'New York City'));
        DashTable.getHeader(2, 4).within(() => cy.get('span.column-header-name').should('have.html', 'Boston'));

        DashTable.getCell(0, 0).within(() => cy.get('.dash-cell-value').should('have.html', ''));
        DashTable.getCell(0, 1).within(() => cy.get('.dash-cell-value').should('have.html', ''));
        DashTable.getCell(0, 2).within(() => cy.get('.dash-cell-value').should('have.html', '100'));
        DashTable.getCell(0, 3).within(() => cy.get('.dash-cell-value').should('have.html', '1'));
        DashTable.getCell(0, 4).within(() => cy.get('.dash-cell-value').should('have.html', ''));

        DashTable.getFilter(0).within(() => cy.get('input').should('have.value', ''));
        DashTable.getFilter(1).within(() => cy.get('input').should('have.value', ''));
        DashTable.getFilter(2).within(() => cy.get('input').should('have.value', 'is num'));
        DashTable.getFilter(3).within(() => cy.get('input').should('have.value', 'is num'));
        DashTable.getFilter(4).within(() => cy.get('input').should('have.value', ''));
    });

    it('can hide column', () => {
        DashTable.getHeader(0, 0).within(() => cy.get('span.column-header-name').should('have.html', 'rows'));
        DashTable.hideColumnById(0, 'rows');
        DashTable.getHeader(0, 0).within(() => cy.get('span.column-header-name').should('have.html', 'City'));
        DashTable.getHeader(1, 0).within(() => cy.get('span.column-header-name').should('have.html', 'Canada'));
        DashTable.getHeader(2, 0).within(() => cy.get('span.column-header-name').should('have.html', 'Toronto'));
        DashTable.hideColumnById(0, 'ccc'); // Canada
        DashTable.getHeader(0, 0).within(() => cy.get('span.column-header-name').should('have.html', 'City'));
        DashTable.getHeader(1, 0).within(() => cy.get('span.column-header-name').should('have.html', 'Canada'));
        DashTable.getHeader(2, 0).within(() => cy.get('span.column-header-name').should('have.html', 'Montréal'));
        DashTable.hideColumnById(0, 'fff'); // Boston
        DashTable.getHeader(0, 1).within(() => cy.get('span.column-header-name').should('have.html', 'City'));
        DashTable.getHeader(1, 1).within(() => cy.get('span.column-header-name').should('have.html', 'America'));
        DashTable.getHeader(2, 1).within(() => cy.get('span.column-header-name').should('have.html', 'New York City'));
        DashTable.getHeader(0, 2).within(() => cy.get('span.column-header-name').should('have.html', 'City'));
        DashTable.getHeader(1, 2).within(() => cy.get('span.column-header-name').should('have.html', 'France'));
        DashTable.getHeader(2, 2).within(() => cy.get('span.column-header-name').should('have.html', 'Paris'));
    });
});