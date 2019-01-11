import coercer from 'dash-table/coerce/text';

import { ChangeValidation, TextSpecificChangeValidation } from 'dash-table/components/Table/props';

describe('coerce to text', () => {
    describe('a number', () => {
        const value = 42;

        it('with default validation', () => {
            const coerced = coercer(value);

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

        it('with ToString validation', () => {
            const coerced = coercer(value, {
                validation: {
                    on_change: TextSpecificChangeValidation.ToString
                }
            });

            expect(coerced.value).to.equal(value.toString());
            expect(coerced.success).to.equal(true);
            expect(coerced.action).to.equal(TextSpecificChangeValidation.ToString);
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

            expect(coerced.value).to.equal(value);
            expect(coerced.success).to.equal(false);
            expect(coerced.action).to.equal(ChangeValidation.Prevent);
        });
    });

    describe('a string', () => {
        const value = '42';

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

        it('with ToString validation', () => {
            const coerced = coercer(value, {
                validation: {
                    on_change: TextSpecificChangeValidation.ToString
                }
            });

            expect(coerced.success).to.equal(false);
            expect(coerced.action).to.equal(TextSpecificChangeValidation.ToString);
        });

        it('with ToString validation, allowNully=true', () => {
            const coerced = coercer(value, {
                validation: {
                    allow_nully: true,
                    on_change: TextSpecificChangeValidation.ToString
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

        it('with ToString validation', () => {
            const coerced = coercer(value, {
                validation: {
                    on_change: TextSpecificChangeValidation.ToString
                }
            });

            expect(coerced.value).to.equal(value.toString());
            expect(coerced.success).to.equal(true);
            expect(coerced.action).to.equal(TextSpecificChangeValidation.ToString);
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