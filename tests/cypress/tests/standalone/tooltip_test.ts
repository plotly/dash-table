import DashTable from 'cypress/DashTable';

import { AppMode } from 'demo/AppMode';

describe(`tooltips, mode=${AppMode.Tooltips}`, () => {
    beforeEach(() => {
        cy.visit(`http://localhost:8080?mode=${AppMode.Tooltips}`);
        DashTable.toggleScroll(false);
    });

    it('displays html', () => {
        DashTable.getCellById(0, 'bbb-readonly').trigger('mouseover');
        cy.get('.dash-table-tooltip').should('not.be.visible');
        cy.wait(0);
        cy.get('.dash-table-tooltip').should('be.visible');
        cy.get('.dash-table-tooltip').within(t => expect(t[0].innerHTML).to.not.be.undefined);
        cy.get('.dash-table-tooltip').within(t => expect(!!t[0].children && !!t[0].children.length).to.be.true);
        cy.wait(5000);
        cy.get('.dash-table-tooltip').should('not.be.visible');
    });

    it('displays text', () => {
        DashTable.getCellById(6, 'ccc').trigger('mouseover');
        cy.get('.dash-table-tooltip').should('not.be.visible');
        cy.wait(0);
        cy.get('.dash-table-tooltip').should('be.visible');
        cy.get('.dash-table-tooltip').within(t => expect(t[0].innerText).to.equal('There is death in the hane'));
        cy.get('.dash-table-tooltip').within(t => expect(!!t[0].children && !!t[0].children.length).to.be.false);
        cy.wait(5000);
        cy.get('.dash-table-tooltip').should('not.be.visible');
    });
});

describe(`tooltips, mode=${AppMode.FixedTooltips}`, () => {
    beforeEach(() => {
        cy.visit(`http://localhost:8080?mode=${AppMode.FixedTooltips}`);
        DashTable.toggleScroll(false);
    });

    it('displays in fixed column', () => {
        DashTable.getCellById(6, 'rows').trigger('mouseover');
        cy.get('.dash-table-tooltip').should('not.be.visible');
        cy.wait(0);
        cy.get('.dash-table-tooltip').should('be.visible');
        cy.get('.dash-table-tooltip').within(t => expect(t[0].innerText).to.equal('Learn the eyestealing tesuji'));
        cy.get('.dash-table-tooltip').within(t => expect(!!t[0].children && !!t[0].children.length).to.be.false);
        cy.wait(5000);
        cy.get('.dash-table-tooltip').should('not.be.visible');
    });

    it('displays in fixed row', () => {
        DashTable.getCellById(0, 'ddd').trigger('mouseover');
        cy.get('.dash-table-tooltip').should('not.be.visible');
        cy.wait(0);
        cy.get('.dash-table-tooltip').should('be.visible');
        cy.get('.dash-table-tooltip').within(t => expect(t[0].innerText).to.equal('Hane, Cut, Placement'));
        cy.wait(5000);
        cy.get('.dash-table-tooltip').should('not.be.visible');
    });

    it('displays in fixed row & column', () => {
        DashTable.getCellById(0, 'rows').trigger('mouseover');
        cy.get('.dash-table-tooltip').should('not.be.visible');
        cy.wait(0);
        cy.get('.dash-table-tooltip').should('be.visible');
        cy.get('.dash-table-tooltip').within(t => expect(t[0].innerText).to.equal('Learn the eyestealing tesuji'));
        cy.get('.dash-table-tooltip').within(t => expect(!!t[0].children && !!t[0].children.length).to.be.false);
        cy.wait(5000);
        cy.get('.dash-table-tooltip').should('not.be.visible');
    });
});