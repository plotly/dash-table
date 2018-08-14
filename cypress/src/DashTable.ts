export default class DashTable {
    static getCell(row: number, column: number) {
        return cy.get(`#table tbody tr td.column-${column + 1}`).eq(row);
    }

    static getSelectedCells() {
        return cy.get(`#table tbody td.cell--selected`);
    }
}