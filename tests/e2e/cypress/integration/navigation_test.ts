import DashTable from 'cypress/DashTable';
import DOM from 'cypress/DOM';
import Key from 'cypress/Key';

function resolve<T>(chain: Cypress.Chainable<T>) {
    return new Cypress.Promise<Cypress.Chainable<T>>(r => r(chain));
}

describe('navigate', () => {
    beforeEach(() => {
        cy.visit('http://localhost:8080');
    });

    it.only('does not change column width', async () => {
        const startWidth = await resolve<JQuery<HTMLElement>>(DashTable.getCell(3, 3)).then((res: any) => {
            return (res as JQuery<HTMLElement>).outerWidth();
        });

        await resolve(DashTable.getCell(3, 3).click());

        const endWidth = await resolve(DashTable.getCell(3, 3)).then((res: any) => {
            return (res as JQuery<HTMLElement>).outerWidth();
        });

        expect(endWidth).to.equal(startWidth);

    });

    describe('with keyboard', () => {
        beforeEach(() => {
            DashTable.getCell(3, 3).click();
        });

        it('can move down', () => {
            DOM.focused.type(Key.ArrowDown);
            DashTable.getCell(4, 3).should('have.class', 'focused');
            DashTable.getCell(3, 3).should('not.have.class', 'focused');
        });

        it('can move left', () => {
            DOM.focused.type(Key.ArrowLeft);
            DashTable.getCell(3, 2).should('have.class', 'focused');
            DashTable.getCell(3, 3).should('not.have.class', 'focused');
        });

        it('can moved right', () => {
            DOM.focused.type(Key.ArrowRight);
            DashTable.getCell(3, 4).should('have.class', 'focused');
            DashTable.getCell(3, 3).should('not.have.class', 'focused');
        });

        it('can move up', () => {
            DOM.focused.type(Key.ArrowUp);
            DashTable.getCell(2, 3).should('have.class', 'focused');
            DashTable.getCell(3, 3).should('not.have.class', 'focused');
        });
    });

    describe('with mouse', () => {
        beforeEach(() => {
            DashTable.getCell(3, 3).click();
        });

        it('can select self', () => {
            DOM.focused.click();
            DashTable.getCell(3, 3).should('have.class', 'focused');
        });

        it('can select other', () => {
            DashTable.getCell(4, 4).click();
            DashTable.getCell(4, 4).should('have.class', 'focused');
            DashTable.getCell(3, 3).should('not.have.class', 'focused');
        });
    });
});
