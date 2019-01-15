export default (value: any) => value === undefined || value === null || (typeof value === 'number' && isNaN(value));
