export default function resolve<T>(chain: Cypress.Chainable<T>) {
    return new Cypress.Promise<Cypress.Chainable<T>>(r => r(chain));
}