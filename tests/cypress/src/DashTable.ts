export default class DashTable {
    static getCell(row: number, column: number) {
        return cy.get(`#table .dash-spreadsheet:not(.dash-loading) tbody tr td.column-${column}`).wait(5000).eq(row);
    }

    static getCellById(row: number, column: string) {
        return cy.get(`#table .dash-spreadsheet:not(.dash-loading) tbody tr td[data-dash-column="${column}"]`).wait(5000).eq(row);
    }

    static getFilter(column: number) {
        return cy.get(`#table .dash-spreadsheet:not(.dash-loading) tbody tr th.dash-filter.column-${column}`).wait(5000);
    }

    static getFilterById(column: string) {
        return cy.get(`#table .dash-spreadsheet:not(.dash-loading) tbody tr th.dash-filter[data-dash-column="${column}"]`).wait(5000);
    }

    static getHeader(row: number, column: number) {
        return cy.get(`#table .dash-spreadsheet:not(.dash-loading) tbody tr th.dash-header.column-${column}`).wait(5000).eq(row);
    }

    static getHeaderById(row: number, column: string) {
        return cy.get(`#table .dash-spreadsheet:not(.dash-loading) tbody tr th.dash-header[data-dash-column="${column}"]`).wait(5000).eq(row);
    }

    static focusCell(row: number, column: number) {
        // somehow we need to scrollIntoView AFTER click, or it doesn't
        // work right. Why?
        return this.getCell(row, column).click().scrollIntoView();
    }

    static focusCellById(row: number, column: string) {
        return this.getCellById(row, column).click().scrollIntoView();
    }

    static clearColumnById(row: number, column: string) {
        return cy.get(`#table .dash-spreadsheet:not(.dash-loading) tbody tr th.dash-header[data-dash-column="${column}"] .column-header--clear`).wait(5000).eq(row).click();
    }

    static deleteColumnById(row: number, column: string) {
        return cy.get(`#table .dash-spreadsheet:not(.dash-loading) tbody tr th.dash-header[data-dash-column="${column}"] .column-header--delete`).wait(5000).eq(row).click();
    }

    static hideColumnById(row: number, column: string) {
        return cy.get(`#table .dash-spreadsheet:not(.dash-loading) tbody tr th.dash-header[data-dash-column="${column}"] .column-header--hide`).wait(5000).eq(row).click();
    }

    static getSelectColumnById(row: number, column: string) {
        return cy.get(`#table .dash-spreadsheet:not(.dash-loading) tbody tr th.dash-header[data-dash-column="${column}"] .column-header--select input`).wait(5000).eq(row);
    }

    static selectColumnById(row: number, column: string) {
        return DashTable.getSelectColumnById(row, column).click();
    }

    static getDelete(row: number) {
        return cy.get(`#table .dash-spreadsheet:not(.dash-loading) tbody tr td.dash-delete-cell`).wait(5000).eq(row);
    }

    static getSelect(row: number) {
        return cy.get(`#table .dash-spreadsheet:not(.dash-loading) tbody tr td.dash-select-cell`).wait(5000).eq(row);
    }

    static getActiveCell() {
        return cy.get(`#table .dash-spreadsheet:not(.dash-loading) tbody td.focused`).wait(5000);
    }

    static getSelectedCells() {
        return cy.get(`#table .dash-spreadsheet:not(.dash-loading) tbody td.cell--selected`).wait(5000);
    }

    static scrollToTop() {
        cy.get(`.cell.cell-1-1.dash-fixed-content`).invoke(`outerHeight`).then(height => {
            cy.scrollTo(0, -height);
        });
    }

    static scrollToBottom() {
        cy.get(`.cell.cell-1-1.dash-fixed-content`).invoke(`outerHeight`).then(height => {
            cy.scrollTo(0, height);
        });
    }

    static getCellInLastRowOfColumn(column: number) {
        const cellInLastRow = cy.get(`td.dash-cell.column-${column}`).last().then(elem => {
            const lastRow = elem ? elem.attr(`data-dash-row`) : undefined;
            return lastRow ? cy.get(`td.dash-cell.column-${column}[data-dash-row="${lastRow}"`) : undefined;
        });
        return cellInLastRow;
    }

    static getCellFromDataDash(row: number, column: number) {
        return cy.get(`td.column-${column}[data-dash-row="${row}"]`);
    }

    static toggleScroll(toggled: boolean) {
        cy.get('.row-1').then($el => {
            $el[0].style.overflow = toggled ? '' : 'unset';
        });
    }
}
