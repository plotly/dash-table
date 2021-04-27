export default <T>(tableFlag: T, columnFlag: T | undefined): T =>
    columnFlag === undefined ? tableFlag : columnFlag;
