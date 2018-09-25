import * as R from 'ramda';

import derivedViewportDataframe from 'dash-table/derived/viewportDataframe';

describe.only('derived viewport', () => {
    const viewportDataframe = derivedViewportDataframe();

    describe('virtual dataframe <= page size', () => {
        describe('with no pagination', () => {
            it('returns entire dataframe', () => {
                const result = viewportDataframe(
                    false,
                    { displayed_pages: 1, current_page: 0, page_size: 250 },
                    R.map(() => { }, R.range(0, 5)),
                    R.range(0, 5)
                );

                expect(result.dataframe.length).to.equal(5);
                expect(result.indices.length).to.equal(5);
            });
        });

        describe('with fe pagination', () => {
            it('returns entire dataframe', () => {
                const result = viewportDataframe(
                    'fe',
                    { displayed_pages: 1, current_page: 0, page_size: 250 },
                    R.map(() => { }, R.range(0, 5)),
                    R.range(0, 5)
                );

                expect(result.dataframe.length).to.equal(5);
                expect(result.indices.length).to.equal(5);
            });
        });

        describe('with be pagination', () => {
            it('returns entire dataframe', () => {
                const result = viewportDataframe(
                    'be',
                    { displayed_pages: 1, current_page: 0, page_size: 250 },
                    R.map(() => { }, R.range(0, 5)),
                    R.range(0, 5)
                );

                expect(result.dataframe.length).to.equal(5);
                expect(result.indices.length).to.equal(5);
            });
        });
    });
});