import {
    ColumnType,
    INumberTypeConfiguration,
    ITextTypeConfiguration,
    NumberSpecificValidationFailure,
    NumberValidationFailure,
    TextValidationFailure,
    ValidationFailure,
    IVisibleColumn
} from 'dash-table/components/Table/props';

interface ICoerceResult {
    action?: ValidationFailure;
    success: boolean;
    value?: any;
}

export class AnyStrategy {
    static coerce(value: any): ICoerceResult {
        return { success: true, value };
    }
}

export class NumberStrategy {
    static coerce(value: any, options?: INumberTypeConfiguration): ICoerceResult {
        const allowNaN = Boolean(options && options.validation && options.validation.allow_nan);
        const onFailure = (options && options.validation && options.validation.on_failure) || NumberSpecificValidationFailure.NaN;

        const result = this.coerceImpl(value, allowNaN);
        return result.success ?
            result :
            this.reconcileImpl(onFailure);
    }

    private static coerceImpl(value: any, allowNaN: boolean) {
        const type = typeof value;

        switch (type) {
            case 'number':
                return {
                    success: !isNaN(value) || allowNaN,
                    value
                };
            case 'string':
                return { success: /(-)?\d+([.]\d+)?/.test(value), value: parseFloat(value) };
            default:
                return { success: false, value };
        }
    }

    private static reconcileImpl(action: NumberValidationFailure) {
        return action === NumberSpecificValidationFailure.NaN ?
            { success: true, value: NaN, action } :
            { success: false, action };
    }
}

export class TextStrategy {
    static coerce(value: any, options?: ITextTypeConfiguration): ICoerceResult {
        const allowNully = Boolean(options && options.validation && options.validation.allow_nully);
        const onFailure = (options && options.validation && options.validation.on_failure) || ValidationFailure.Skip;

        const result = this.coerceImpl(value, allowNully);
        return result.success ?
            result :
            this.reconcileImpl(onFailure);

    }

    private static coerceImpl(value: any, allowNully: boolean) {
        return {
            success: (value !== undefined && value !== null) || allowNully,
            value: value.toString()
        };
    }

    private static reconcileImpl(action: TextValidationFailure) {
        return { success: false, action };
    }
}

export default (value: any, c: IVisibleColumn) => {
    switch (c.type) {
        case ColumnType.Number:
            return NumberStrategy.coerce(value, c.number);
        case ColumnType.Text:
            return TextStrategy.coerce(value, c.text);
        case ColumnType.Any:
        default:
            return AnyStrategy.coerce(value);
    }
};