import DashTable from 'cypress/DashTable';
import Key from 'cypress/Key';
import { AppMode, AppFlavor } from 'demo/AppMode';

describe('markdown cells', () => {
    describe('filtering', () => {
        beforeEach(() => {
            cy.visit(`http://localhost:8080?mode=${AppMode.Markdown}&flavor=${AppFlavor.FilterNative}`);
        });

        it('general', () => {
            DashTable.getFilterById('markdown-headers').click();

            DashTable.focusedType(`row 5`);
            DashTable.getFilterById('markdown-italics').click();

            DashTable.getCellById(0, 'markdown-headers').within(() => cy.get('.dash-cell-value h5').should('have.html', 'row 5'));
            // results should be 5, 51, ..., 59, 500, ..., 599
            cy.get('.dash-spreadsheet .cell-1-1 table tbody tr td.dash-cell.column-0:not(.phantom-cell)').should('have.length', 111);

            DashTable.focusedType(`7`);
            DashTable.getFilterById('markdown-code-blocks').click();

            DashTable.getCellById(0, 'markdown-italics').within(() => cy.get('.dash-cell-value p em').should('have.html', '57'));
            // results should be 57, 507, ..., 567 571, ..., 579, 587, ..., 597
            cy.get('.dash-spreadsheet .cell-1-1 table tbody tr td.dash-cell.column-0:not(.phantom-cell)').should('have.length', 20);

            DashTable.focusedType(`58`);
            DashTable.getFilterById('markdown-quotes').click();

            DashTable.getCellById(0, 'markdown-links').within(() => cy.get('.dash-cell-value p a').should('have.html', 'Learn about 587'));
        });

        describe('links', () => {
            it('by link text', () => {
                DashTable.getFilterById('markdown-links').click();
                DashTable.focusedType(`Learn about 1234`);
                DashTable.focusedType(`${Key.Enter}`);

                cy.get('.dash-spreadsheet .cell-1-1 table tbody tr td.dash-cell.column-2:not(.phantom-cell)').should('have.length', 1);
                DashTable.getCellById(0, 'markdown-links').within(() => cy.get('.dash-cell-value > p > a').should('have.attr', 'href', 'http://en.wikipedia.org/wiki/1234'));
            });

            it('by link value', () => {
                DashTable.getFilterById('markdown-links').click();
                DashTable.focusedType(`/wiki/4321`);
                DashTable.focusedType(`${Key.Enter}`);
                cy.get('.dash-spreadsheet .cell-1-1 table tbody tr td.dash-cell.column-2:not(.phantom-cell)').should('have.length', 1);
                DashTable.getCellById(0, 'markdown-links').within(() => cy.get('.dash-cell-value > p > a').should('have.html', 'Learn about 4321'));

            });
        });

        it('images by alt text', () => {
            DashTable.getFilterById('markdown-images').click();
            DashTable.focusedType(`314`);
            DashTable.focusedType(`${Key.Enter}`);

            cy.get('.dash-spreadsheet .cell-1-1 table tbody tr td.dash-cell.column-8:not(.phantom-cell)').should('have.length', 15);
            DashTable.getCellById(0, 'markdown-images').within(() => cy.get('.dash-cell-value > p > img').should('have.attr', 'alt', 'image 314 alt text'));
        });
    });

    describe('loading highlightjs', () => {
        it('loads highlight.js and does not attach hljs to window', () => {
            cy.visit(`http://localhost:8080?mode=${AppMode.Markdown}`);
            // wait for highlight.js to highlight code
            DashTable.getCellById(0, 'markdown-code-blocks').within(() => cy.get('code.language-python'));
            cy.window().should('not.have.property', 'hljs');
        });
        it('uses window.hljs if defined', () => {
            // define custom hljs object that always returns 'hljs override', and attach it to the window
            cy.on('window:before:load', win => {
                win.hljs = {
                    getLanguage: (lang) => false, // force auto-highlight
                    highlightAuto: (str) => { return { value: 'hljs override' } }
                };
            });
            cy.visit(`http://localhost:8080?mode=${AppMode.Markdown}`);
            DashTable.getCellById(0, 'markdown-code-blocks').within(() => cy.get('code.language-python').should('have.html', 'hljs override'));
        });
    });
});
