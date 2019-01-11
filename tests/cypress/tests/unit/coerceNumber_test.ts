import coercer from 'dash-table/coerce/number';

import { ChangeValidation, NumberSpecificChangeValidation } from 'dash-table/components/Table/props';

describe('coerce to number', () => {
    describe('a number', () => {
        const value = 42;

        it('with default validation', () => {
            const coerced = coercer(value);

            expect(coerced.value).to.equal(value);
            expect(coerced.success).to.equal(true);
            expect(coerced.action).to.equal(undefined);
        });

        it('with Passthrough validation', () => {
            const coerced = coercer(value, {
                validation: {
                    on_change: ChangeValidation.Passthrough
                }
            });

            expect(coerced.value).to.equal(value);
            expect(coerced.success).to.equal(true);
            expect(coerced.action).to.equal(undefined);
        });

        it('with Skip validation', () => {
            const coerced = coercer(value, {
                validation: {
                    on_change: ChangeValidation.Skip
                }
            });

            expect(coerced.value).to.equal(value);
            expect(coerced.success).to.equal(true);
            expect(coerced.action).to.equal(undefined);
        });

        it('with Prevent validation', () => {
            const coerced = coercer(value, {
                validation: {
                    on_change: ChangeValidation.Prevent
                }
            });

            expect(coerced.value).to.equal(value);
            expect(coerced.success).to.equal(true);
            expect(coerced.action).to.equal(undefined);
        });
    });

    describe('a string', () => {
        const value = '42';
        const nValue = 42;

        it('with default validation', () => {
            const coerced = coercer(value);

            expect(coerced.value).to.equal(nValue);
            expect(coerced.success).to.equal(true);
            expect(coerced.action).to.equal(undefined);
        });

        it('with Passthrough validation', () => {
            const coerced = coercer(value, {
                validation: {
                    on_change: ChangeValidation.Passthrough
                }
            });

            expect(coerced.value).to.equal(nValue);
            expect(coerced.success).to.equal(true);
            expect(coerced.action).to.equal(undefined);
        });

        it('with Skip validation', () => {
            const coerced = coercer(value, {
                validation: {
                    on_change: ChangeValidation.Skip
                }
            });

            expect(coerced.value).to.equal(nValue);
            expect(coerced.success).to.equal(true);
            expect(coerced.action).to.equal(undefined);
        });

        it('with Prevent validation', () => {
            const coerced = coercer(value, {
                validation: {
                    on_change: ChangeValidation.Prevent
                }
            });

            expect(coerced.value).to.equal(nValue);
            expect(coerced.success).to.equal(true);
            expect(coerced.action).to.equal(undefined);
        });
    });

    describe('a NaN', () => {
        const value = NaN;

        it('with default validation', () => {
            const coerced = coercer(value);

            expect(isNaN(coerced.value)).to.equal(true);
            expect(coerced.success).to.equal(true);
            expect(coerced.action).to.equal(ChangeValidation.Passthrough);
        });

        it('with default validation, allowNaN=true', () => {
            const coerced = coercer(value, {
                validation: {
                    allow_nan: true
                }
            });

            expect(isNaN(coerced.value)).to.equal(true);
            expect(coerced.success).to.equal(true);
            expect(coerced.action).to.equal(undefined);
        });

        it('with Passthrough validation', () => {
            const coerced = coercer(value, {
                validation: {
                    on_change: ChangeValidation.Passthrough
                }
            });

            expect(isNaN(coerced.value)).to.equal(true);
            expect(coerced.success).to.equal(true);
            expect(coerced.action).to.equal(ChangeValidation.Passthrough);
        });

        it('with Passthrough validation, allowNaN=true', () => {
            const coerced = coercer(value, {
                validation: {
                    allow_nan: true,
                    on_change: ChangeValidation.Passthrough
                }
            });

            expect(isNaN(coerced.value)).to.equal(true);
            expect(coerced.success).to.equal(true);
            expect(coerced.action).to.equal(undefined);
        });

        it('with Skip validation', () => {
            const coerced = coercer(value, {
                validation: {
                    on_change: ChangeValidation.Skip
                }
            });

            expect(coerced.success).to.equal(false);
            expect(coerced.action).to.equal(ChangeValidation.Skip);
        });

        it('with Skip validation, allowNaN=true', () => {
            const coerced = coercer(value, {
                validation: {
                    allow_nan: true,
                    on_change: ChangeValidation.Skip
                }
            });

            expect(isNaN(coerced.value)).to.equal(true);
            expect(coerced.success).to.equal(true);
            expect(coerced.action).to.equal(undefined);
        });

        it('with Prevent validation', () => {
            const coerced = coercer(value, {
                validation: {
                    on_change: ChangeValidation.Prevent
                }
            });

            expect(coerced.success).to.equal(false);
            expect(coerced.action).to.equal(ChangeValidation.Prevent);
        });

        it('with Prevent validation, allowNaN=true', () => {
            const coerced = coercer(value, {
                validation: {
                    allow_nan: true,
                    on_change: ChangeValidation.Prevent
                }
            });

            expect(isNaN(coerced.value)).to.equal(true);
            expect(coerced.success).to.equal(true);
            expect(coerced.action).to.equal(undefined);
        });
    });

    describe('a Null', () => {
        const value = null;

        it('with default validation', () => {
            const coerced = coercer(value);

            expect(coerced.success).to.equal(true);
            expect(coerced.action).to.equal(ChangeValidation.Passthrough);
        });

        it('with default validation, allowNully=true', () => {
            const coerced = coercer(value, {
                validation: {
                    allow_nully: true
                }
            });

            expect(value).to.equal(value);
            expect(coerced.success).to.equal(true);
            expect(coerced.action).to.equal(undefined);
        });

        it('with Passthrough validation', () => {
            const coerced = coercer(value, {
                validation: {
                    on_change: ChangeValidation.Passthrough
                }
            });

            expect(value).to.equal(value);
            expect(coerced.success).to.equal(true);
            expect(coerced.action).to.equal(ChangeValidation.Passthrough);
        });

        it('with Passthrough validation, allowNully=true', () => {
            const coerced = coercer(value, {
                validation: {
                    allow_nully: true,
                    on_change: ChangeValidation.Passthrough
                }
            });

            expect(value).to.equal(value);
            expect(coerced.success).to.equal(true);
            expect(coerced.action).to.equal(undefined);
        });

        it('with Skip validation', () => {
            const coerced = coercer(value, {
                validation: {
                    on_change: ChangeValidation.Skip
                }
            });

            expect(coerced.success).to.equal(false);
            expect(coerced.action).to.equal(ChangeValidation.Skip);
        });

        it('with Skip validation, allowNully=true', () => {
            const coerced = coercer(value, {
                validation: {
                    allow_nully: true,
                    on_change: ChangeValidation.Skip
                }
            });

            expect(value).to.equal(value);
            expect(coerced.success).to.equal(true);
            expect(coerced.action).to.equal(undefined);
        });

        it('with Prevent validation', () => {
            const coerced = coercer(value, {
                validation: {
                    on_change: ChangeValidation.Prevent
                }
            });

            expect(coerced.success).to.equal(false);
            expect(coerced.action).to.equal(ChangeValidation.Prevent);
        });

        it('with Prevent validation, allowNully=true', () => {
            const coerced = coercer(value, {
                validation: {
                    allow_nully: true,
                    on_change: ChangeValidation.Prevent
                }
            });

            expect(value).to.equal(value);
            expect(coerced.success).to.equal(true);
            expect(coerced.action).to.equal(undefined);
        });
    });


    describe('a non-number string', () => {
        const value = 'abc';

        it('with default validation', () => {
            const coerced = coercer(value);

            expect(coerced.value).to.equal(value);
            expect(coerced.success).to.equal(true);
            expect(coerced.action).to.equal(ChangeValidation.Passthrough);
        });

        it('with NaN validation', () => {
            const coerced = coercer(value, {
                validation: {
                    on_change: NumberSpecificChangeValidation.NaN
                }
            });

            expect(isNaN(coerced.value)).to.equal(true);
            expect(coerced.success).to.equal(true);
            expect(coerced.action).to.equal(NumberSpecificChangeValidation.NaN);
        });

        it('with Passthrough validation', () => {
            const coerced = coercer(value, {
                validation: {
                    on_change: ChangeValidation.Passthrough
                }
            });

            expect(coerced.value).to.equal(value);
            expect(coerced.success).to.equal(true);
            expect(coerced.action).to.equal(ChangeValidation.Passthrough);
        });

        it('with Skip validation', () => {
            const coerced = coercer(value, {
                validation: {
                    on_change: ChangeValidation.Skip
                }
            });

            expect(coerced.success).to.equal(false);
            expect(coerced.action).to.equal(ChangeValidation.Skip);
        });

        it('with Prevent validation', () => {
            const coerced = coercer(value, {
                validation: {
                    on_change: ChangeValidation.Prevent
                }
            });

            expect(coerced.success).to.equal(false);
            expect(coerced.action).to.equal(ChangeValidation.Prevent);
        });
    });

    describe('an object', () => {
        const value = {};

        it('with default validation', () => {
            const coerced = coercer(value);

            expect(coerced.value).to.equal(value);
            expect(coerced.success).to.equal(true);
            expect(coerced.action).to.equal(ChangeValidation.Passthrough);
        });

        it('with Passthrough validation', () => {
            const coerced = coercer(value, {
                validation: {
                    on_change: ChangeValidation.Passthrough
                }
            });

            expect(coerced.value).to.equal(value);
            expect(coerced.success).to.equal(true);
            expect(coerced.action).to.equal(ChangeValidation.Passthrough);
        });

        it('with NaN validation', () => {
            const coerced = coercer(value, {
                validation: {
                    on_change: NumberSpecificChangeValidation.NaN
                }
            });

            expect(isNaN(coerced.value)).to.equal(true);
            expect(coerced.success).to.equal(true);
            expect(coerced.action).to.equal(NumberSpecificChangeValidation.NaN);
        });

        it('with Skip validation', () => {
            const coerced = coercer(value, {
                validation: {
                    on_change: ChangeValidation.Skip
                }
            });

            expect(coerced.success).to.equal(false);
            expect(coerced.action).to.equal(ChangeValidation.Skip);
        });

        it('with Prevent validation', () => {
            const coerced = coercer(value, {
                validation: {
                    on_change: ChangeValidation.Prevent
                }
            });

            expect(coerced.success).to.equal(false);
            expect(coerced.action).to.equal(ChangeValidation.Prevent);
        });
    });
});