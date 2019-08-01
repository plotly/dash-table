export default (
    i: number,
    last: number,
    flag?: boolean | boolean[] | 'last'
): boolean => typeof flag === 'string' ?
        i === last :
        typeof flag === 'boolean' ?
            flag :
            !!flag && flag[i];