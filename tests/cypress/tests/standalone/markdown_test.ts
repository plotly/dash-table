import DashTable from 'cypress/DashTable';
import DOM from 'cypress/DOM';
import Key from 'cypress/Key';
import { AppMode, AppFlavor } from 'demo/AppMode';

describe('markdown cells', () => {
    describe('sorting', () => {
        beforeEach(() => {
            cy.visit(`http://localhost:8080?mode=${AppMode.Markdown}`);
        });

        it('headers', () => {
            // raw value: {row number % 6} pound symbols followed by "row {row number}"
            // displayed value: "row {row number}"
            cy.get('tr th.column-0 .column-header--sort').click();
            cy.get('tr th.column-0 .column-header--sort').click();

            // rows 1, 10, 100, 1000 all have 4 pound symbols
            // row 1001 has 5 pound symbols and row 1002 has 0 pound symbols;
            // first cell should have displayed value "1002"
            DashTable.getCell(0, 0).within(() => cy.get('.dash-cell-value > p').should('have.html', 'row 1002'));

            cy.get('tr th.column-0 .column-header--sort').click();
            // rows 999, 998, 997, 996 have, respectively, 3, 2, 1, and 0 pound symbols;
            // first cell should have displayed value "##### row 995"
            DashTable.getCell(0, 0).within(() => cy.get('.dash-cell-value > h5').should('have.html', 'row 995'));
        });

        it('emphasized text', () => {
            // raw value: "*{row number}*" for odd row numbers and "_{row number}_" for even row numbers
            // displayed value: "{row number}"
            cy.get('tr th.column-1 .column-header--sort').last().click();
            cy.get('tr th.column-1 .column-header--sort').last().click();

            // "*" < "_"; first cell should start with "*", i.e., be in an odd-numbered row
            DashTable.getCell(0, 1).within(() => cy.get('.dash-cell-value > p > em').should('have.html', '1'));

            cy.get('tr th.column-1 .column-header--sort').last().click();
            // first cell should start with "_", i.e., be in an even-numbered row
            DashTable.getCell(0, 1).within(() => cy.get('.dash-cell-value > p > em').should('have.html', '998'));
        });

        it('links', () => {
            // raw value: "[Learn about {row number}](http://en.wikipedia.org/wiki/{row number})"
            // displayed value: "Learn about {row number}"
            cy.get('tr th.column-2 .column-header--sort').last().click();
            cy.get('tr th.column-2 .column-header--sort').last().click();

            // "]" > "0"; first cell should have row number 1000
            DashTable.getCell(0, 2).within(() => cy.get('.dash-cell-value > p > a').should('have.html', 'Learn about 1000'));
            DashTable.getCell(0, 2).within(() => cy.get('.dash-cell-value > p > a').should('have.attr', 'href', 'http://en.wikipedia.org/wiki/1000'));

            // "]" > "9"; first cell should have row number 9
            cy.get('tr th.column-2 .column-header--sort').last().click();
            DashTable.getCell(0, 2).within(() => cy.get('.dash-cell-value > p > a').should('have.html', 'Learn about 9'));
            DashTable.getCell(0, 2).within(() => cy.get('.dash-cell-value > p > a').should('have.attr', 'href', 'http://en.wikipedia.org/wiki/9'));
        });

        it('images', () => {
            // raw value: "![{plotly logo}](image alt text {row number})"
            cy.get('tr th.column-8 .column-header--sort').last().click();
            cy.get('tr th.column-8 .column-header--sort').last().click();

            DashTable.getCell(0, 8).within(() => cy.get('.dash-cell-value > p > img').should('have.attr', 'alt', 'image 1 alt text'));

            cy.get('tr th.column-8 .column-header--sort').last().click();
            DashTable.getCell(0, 8).within(() => cy.get('.dash-cell-value > p > img').should('have.attr', 'alt', 'image 999 alt text'))
        });

        it('tables', () => {
            // raw value: "
            // Current | Next
            // --- | ---
            // {row number} | {row number + 1}"
            // displayed value: html table with the above entries

            cy.get('tr th.column-4 .column-header--sort').last().click();
            cy.get('tr th.column-4 .column-header--sort').last().click();

            DashTable.getCell(0, 4).within(() => cy.get('.dash-cell-value > table > tbody > tr > td').first().should('have.html', '1'));

            cy.get('tr th.column-4 .column-header--sort').last().click();
            DashTable.getCell(0, 4).within(() => cy.get('.dash-cell-value > table > tbody > tr > td').first().should('have.html', '999'));
        });
    });

    describe('filtering', () => {
        beforeEach(() => {
            cy.visit(`http://localhost:8080?mode=${AppMode.Markdown}&flavor=${AppFlavor.FilterNative}`);
        });

        it('general', () => {
            DashTable.getFilterById('markdown-headers').click();

            DOM.focused.type(`row 5`);
            DashTable.getFilterById('markdown-italics').click();

            DashTable.getCellById(0, 'markdown-headers').within(() => cy.get('.dash-cell-value h5').should('have.html', 'row 5'));
            // results should be 5, 51, ..., 59, 500, ..., 599
            cy.get('.dash-spreadsheet .cell-1-1 table tbody tr td.dash-cell.column-0').should('have.length', 111);

            DOM.focused.type(`7`);
            DashTable.getFilterById('markdown-code-blocks').click();

            DashTable.getCellById(0, 'markdown-italics').within(() => cy.get('.dash-cell-value p em').should('have.html', '57'));
            // results should be 57, 507, ..., 567 571, ..., 579, 587, ..., 597
            cy.get('.dash-spreadsheet .cell-1-1 table tbody tr td.dash-cell.column-0').should('have.length', 20);

            DOM.focused.type(`58`);
            DashTable.getFilterById('markdown-quotes').click();

            DashTable.getCellById(0, 'markdown-code-blocks').within(() => cy.get('.dash-cell-value pre code').should('have.html', 'def hello_table(587):\n  print("hello, " + i)'));
        });

        describe('links', () => {
            it('by link text', () => {
                DashTable.getFilterById('markdown-links').click();
                DOM.focused.type(`Learn about 1234`);
                DOM.focused.type(`${Key.Enter}`);

                cy.get('.dash-spreadsheet .cell-1-1 table tbody tr td.dash-cell.column-2').should('have.length', 1);
                DashTable.getCellById(0, 'markdown-links').within(() => cy.get('.dash-cell-value > p > a').should('have.attr', 'href', 'http://en.wikipedia.org/wiki/1234'));
            });

            it('by link value', () => {
                DashTable.getFilterById('markdown-links').click();
                DOM.focused.type(`/wiki/4321`);
                DOM.focused.type(`${Key.Enter}`);
                cy.get('.dash-spreadsheet .cell-1-1 table tbody tr td.dash-cell.column-2').should('have.length', 1);
                DashTable.getCellById(0, 'markdown-links').within(() => cy.get('.dash-cell-value > p > a').should('have.html', 'Learn about 4321'));

            });
        });

        it('images by alt text', () => {
            DashTable.getFilterById('markdown-images').click();
            DOM.focused.type(`314`);
            DOM.focused.type(`${Key.Enter}`);

            cy.get('.dash-spreadsheet .cell-1-1 table tbody tr td.dash-cell.column-8').should('have.length', 15);
            DashTable.getCellById(0, 'markdown-images').within(() => cy.get('.dash-cell-value > p > img').should('have.attr', 'alt', 'image 314 alt text'));
        });
    });

});
