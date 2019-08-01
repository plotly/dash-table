export default (
    i: number,
    flag?: boolean | boolean[]
): boolean => typeof flag === 'boolean' ?
    flag :
    !!flag && flag[i];