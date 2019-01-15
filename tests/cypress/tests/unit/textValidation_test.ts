import { ColumnType, ITextColumn } from 'dash-table/components/Table/props';
import isNully from 'dash-table/reconcile/isNully';
import { validate } from 'dash-table/reconcile/text';

const DEFAULT_VALIDATE_SUCCESS = [
    { input: '42', output: '42', name: 'from string' }
];

const ALLOW_NULL_VALIDATE_SUCCESS = [
    { input: NaN, output: null, name: 'from NaN' },
    { input: undefined, output: null, name: 'from undefined' },
    { input: null, output: null, name: 'from null' }
];

const DEFAULT_VALIDATE_FAILURE = [
    { input: NaN, output: null, name: 'from NaN' },
    { input: undefined, output: null, name: 'from undefined' },
    { input: null, output: null, name: 'from null' },
    { input: 42, output: '42', name: 'from number' },
    { input: true, output: 'true', name: 'from boolean' },
    { input: [], output: '[]', name: 'from array' },
    { input: {}, output: '{}', name: 'from object' }
];

const ALLOW_NULL_VALIDATE_FAILURE = DEFAULT_VALIDATE_FAILURE.filter(entry => !isNully(entry.input));

describe('validate string', () => {
    describe('default', () => {
        DEFAULT_VALIDATE_SUCCESS.forEach(entry => {
            it(entry.name, () => {
                const res = validate(entry.input);

                expect(res.success).to.equal(true);
                expect(res.value).to.equal(entry.output);
            });
        });

        DEFAULT_VALIDATE_FAILURE.forEach(entry => {
            it(entry.name, () => {
                const res = validate(entry.input);

                expect(res.success).to.equal(false);
            });
        });
    });

    describe('allow_null=true', () => {
        const options: ITextColumn = {
            type: ColumnType.Text,
            validation: {
                allow_null: true
            }
        };

        DEFAULT_VALIDATE_SUCCESS.forEach(entry => {
            it(entry.name, () => {
                const res = validate(entry.input, options);

                expect(res.success).to.equal(true);
                expect(res.value).to.equal(entry.output);
            });
        });

        ALLOW_NULL_VALIDATE_SUCCESS.forEach(entry => {
            it(entry.name, () => {
                const res = validate(entry.input, options);

                expect(res.success).to.equal(true);
                expect(res.value).to.equal(entry.output);
            });
        });

        ALLOW_NULL_VALIDATE_FAILURE.forEach(entry => {
            it(entry.name, () => {
                const res = validate(entry.input, options);

                expect(res.success).to.equal(false);
            });
        });
    });
});