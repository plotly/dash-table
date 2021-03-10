import DashTable from 'cypress/DashTable';

import { BasicModes, AppMode } from 'demo/AppMode';

Object.values([...BasicModes, AppMode.Markdown, AppMode.MixedMarkdown]).forEach(mode => {
    describe(`navigate-1, mode=${mode}`, () => {
        beforeEach(() => {
            cy.visit(`http://localhost:8080?mode=${mode}`);
            DashTable.toggleScroll(false);
        });

        describe('with mouse', () => {
            beforeEach(() => {
                DashTable.clickCell(3, 1);
            });

            it('can select a cell and scroll it out of the viewport', () => {
                DashTable.toggleScroll(true);
                DashTable.clickCell(4, 2);
                DashTable.scrollToBottom();
                DashTable.getCellInLastRowOfColumn(3).click();
                DashTable.getCell(4, 2).should('not.have.class', 'focused');
            });
        });
    });
});
