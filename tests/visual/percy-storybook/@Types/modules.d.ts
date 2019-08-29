declare var module: any;

declare module '*.csv' {
    const value: any;

    export default value;
}

declare module '@storybook/react' {
    export const storiesOf: any;
    export const addDecorator: any;
}

declare module 'sheetclip' {
    const value: any;
    export default value;
}

declare module 'fast-isnumeric' {
    const value: (value: any) => boolean;

    export default value;
}

declare class Remarkable {
    constructor();
    render(value: string): any;
}

declare interface RemarkableCtor {
    new(): Remarkable;
}

declare module 'remarkable' {
    export const Remarkable: RemarkableCtor;
}