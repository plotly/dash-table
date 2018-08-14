describe('Navigation Test', function () {
    it('navigates', function () {
        cy.visit('http://localhost:8080');

        let td2Element = cy.get('#table tbody tr td.column-2').first();
        td2Element.click();

        let focusedElement = cy.focused().first();
        focusedElement.type('{rightarrow}');
        focusedElement = cy.focused().first();
        focusedElement.type('{rightarrow}');

        let td4Element = cy.get('#table tbody tr td.column-4').first();
        td4Element.should('have.class', 'focused');

        focusedElement = cy.focused().first();
        focusedElement.type('{leftarrow}');
        focusedElement = cy.focused().first();
        focusedElement.type('{leftarrow}');

        td2Element = cy.get('#table tbody tr td.column-2').first();
        td2Element.should('have.class', 'focused');

        focusedElement = cy.focused().first();
        focusedElement.type('{downarrow}');
        focusedElement = cy.focused().first();
        focusedElement.type('{downarrow}');

        let tr3td2Element = cy.get('#table tbody tr td.column-2').eq(2);
        tr3td2Element.should('have.class', 'focused');

        focusedElement = cy.focused().first();
        focusedElement.type('{uparrow}');
        focusedElement = cy.focused().first();
        focusedElement.type('{uparrow}');
        focusedElement = cy.focused().first();
        focusedElement.type('{rightarrow}');
        focusedElement = cy.focused().first();
        focusedElement.type('{rightarrow}');

        td4Element = cy.get('#table tbody tr td.column-4').first();
        td4Element.should('have.class', 'focused');

        let td4Input = cy.get('#table tbody tr td.column-4 input').first();
        td4Input.click({ force: true });
        td4Input.type(' Allo{enter}');

        focusedElement = cy.focused().first();
        focusedElement.type('{enter}');
        focusedElement = cy.focused().first();
        focusedElement.type('{uparrow}');

        let tr2td4Element = cy.get('#table tbody tr td.column-4').eq(1);
        tr2td4Element.should('have.class', 'focused');

        focusedElement = cy.focused().first();
        focusedElement.type('{shift}{downarrow}{downarrow}{rightarrow}{rightarrow}{leftarrow}');

        let selectedCells = cy.get('#table td.cell--selected');
        selectedCells.should('length', 6);
    });
});
