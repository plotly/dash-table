import DashTable from 'cypress/DashTable';
import { AppMode } from 'demo/AppMode';

describe('markdown cells', () => {
    describe('loading highlightjs', () => {
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
