import { ColumnType, INumberColumn } from 'dash-table/components/Table/props';
import { coerce } from 'dash-table/reconcile/number';

const DEFAULT_COERCE_SUCCESS = [
    { input: 42, output: 42, name: 'from number' },
    { input: '42', output: 42, name: 'from number string' },
    { input: '-42', output: -42, name: 'from negative number string' },
    { input: '4.242', output: 4.242, name: 'from float string' },
    { input: '-4.242', output: -4.242, name: 'from negative float string' }
];

const ALLOW_NAN_COERCE_SUCCESS = [
    { input: NaN, output: NaN, name: 'from NaN' }
];

const ALLOW_NULLY_COERCE_SUCCESS = [
    { input: undefined, output: undefined, name: 'from undefined' },
    { input: null, output: null, name: 'from null' }
];

const DEFAULT_COERCE_FAILURE = [
    { input: undefined, name: 'from undefined' },
    { input: null, name: 'from null' },
    { input: NaN, name: 'from NaN' },
    { input: {}, name: 'from object' },
    { input: true, name: 'from boolean' },
    { input: 'abc', name: 'from alphanumeric string' }
];

const ALLOW_NAN_COERCE_FAILURE = DEFAULT_COERCE_FAILURE.filter(entry => typeof entry.input !== 'number' || !isNaN(entry.input));
const ALLOW_NULLY_COERCE_FAILURE = DEFAULT_COERCE_FAILURE.filter(entry => entry.input !== undefined && entry.input !== null);

describe('coerce to number', () => {
    describe('default', () => {
        DEFAULT_COERCE_SUCCESS.forEach(entry => {
            it(entry.name, () => {
                const res = coerce(entry.input);

                expect(res.success).to.equal(true);
                expect(res.value).to.equal(entry.output);
            });
        });

        DEFAULT_COERCE_FAILURE.forEach(entry => {
            it(entry.name, () => {
                const res = coerce(entry.input);

                expect(res.success).to.equal(false);
            });
        });
    });

    describe('allow_nan=true', () => {
        const options: INumberColumn = {
            type: ColumnType.Numeric,
            validation: {
                allow_nan: true
            }
        };

        ALLOW_NAN_COERCE_SUCCESS.forEach(entry => {
            it(entry.name, () => {
                const res = coerce(entry.input, options);

                expect(res.success).to.equal(true);
                expect(isNaN(res.value)).to.equal(true);

            });
        });

        DEFAULT_COERCE_SUCCESS.forEach(entry => {
            it(entry.name, () => {
                const res = coerce(entry.input, options);

                expect(res.success).to.equal(true);
                expect(res.value).to.equal(entry.output);
            });
        });

        ALLOW_NAN_COERCE_FAILURE.forEach(entry => {
            it(entry.name, () => {
                const res = coerce(entry.input, options);

                expect(res.success).to.equal(false);
            });
        });
    });

    describe('allow_nully=true', () => {
        const options: INumberColumn = {
            type: ColumnType.Numeric,
            validation: {
                allow_nully: true
            }
        };

        ALLOW_NULLY_COERCE_SUCCESS.forEach(entry => {
            it(entry.name, () => {
                const res = coerce(entry.input, options);

                expect(res.success).to.equal(true);
                expect(res.value).to.equal(entry.output);
            });
        });

        DEFAULT_COERCE_SUCCESS.forEach(entry => {
            it(entry.name, () => {
                const res = coerce(entry.input, options);

                expect(res.success).to.equal(true);
                expect(res.value).to.equal(entry.output);
            });
        });

        ALLOW_NULLY_COERCE_FAILURE.forEach(entry => {
            it(entry.name, () => {
                const res = coerce(entry.input, options);

                expect(res.success).to.equal(false);
            });
        });
    });
});