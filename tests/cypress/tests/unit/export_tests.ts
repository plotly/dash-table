import {transformMultDimArray, getMergeRanges} from 'dash-table/components/Button/ExportButton';

describe('export', () => {
    describe('findMaxLength', () => {
        it('array with only strings', () => {
            const testedArray = ['a', 'b', 'c', 'd'];
            const transformedArray = transformMultDimArray(testedArray, 0);
            const expectedArray = [['a'], ['b'], ['c'], ['d']];
            expect(transformedArray).to.deep.equal(expectedArray);
        });
    });
    // describe('findMaxLength', () => {
    //     it('array with only strings', () => {
    //         const testedArray = ['a', 'b', 'c', 'd'];
    //         const maxLength = findMaxLength(testedArray);
    //         expect(maxLength).to.equal(0);
    //     });
    //     it ('array with strings and strings array with same length', () => {
    //         const testedArray = ['a', ['b', 'c'], ['b', 'd']];
    //         const maxLength = findMaxLength(testedArray);
    //         expect(maxLength).to.equal(2);
    //     });
    //     it ('2D strings array', () => {
    //         const testedArray = [['a', 'b', 'c'], ['b', 'c', 'd'], ['b', 'd', 'a']]; 
    //         const maxLength = findMaxLength(testedArray);
    //         expect(maxLength).to.equal(3);
    //     });
    //     it ('multidimensional array', () => {
    //         const testedArray = [['a', 'b'], ['b', 'c', 'd'], ['a', 'b', 'd', 'a']]; 
    //         const maxLength = findMaxLength(testedArray);
    //         expect(maxLength).to.equal(4);
    //     });
    //     it ('multidimensional array with strings', () => {
    //         const testedArray = ['rows', ['a', 'b'], ['b', 'c', 'd'], ['a', 'b', 'd', 'a']]; 
    //         const maxLength = findMaxLength(testedArray);
    //         expect(maxLength).to.equal(4);
    //     });
    // });

    // describe('transformMultDimArray', () => {
    //     it('array with only strings', () => {
    //         const testedArray = ['a', 'b', 'c', 'd'];
    //         const transformedArray = transformMultDimArray(testedArray, 0);
    //         const expectedArray = [['a'], ['b'], ['c'], ['d']];
    //         expect(transformedArray).to.deep.equal(expectedArray);
    //     });
    //     it ('array with strings and strings array with same length', () => {
    //         const testedArray = ['a', ['b', 'c'], ['b', 'd']];
    //         const transformedArray = transformMultDimArray(testedArray, 2);
    //         const expectedArray = [['a', 'a'], ['b', 'c'], ['b', 'd']];
    //         expect(transformedArray).to.deep.equal(expectedArray);
    //     });
    //     it ('2D strings array', () => {
    //         const testedArray = [['a', 'b', 'c'], ['b', 'c', 'd'], ['b', 'd', 'a']]; 
    //         const transformedArray = transformMultDimArray(testedArray, 3);
    //         const expectedArray = [['a', 'b', 'c'], ['b', 'c', 'd'], ['b', 'd', 'a']];
    //         expect(transformedArray).to.deep.equal(expectedArray);

    //     });
    //     it ('multidimensional array', () => {
    //         const testedArray = [['a', 'b'], ['b', 'c', 'd'], ['a', 'b', 'd', 'a']]; 
    //         const transformedArray = transformMultDimArray(testedArray, 4);
    //         const expectedArray = [['a', 'b', ""], ['b', 'c', 'd', ""], ['a', 'b', 'd', 'a']];
    //         expect(transformedArray).to.deep.equal(expectedArray);

    //     });
    //     it ('multidimensional array with strings', () => {
    //         const testedArray = ['rows', ['a', 'b'], ['b', 'c', 'd'], ['a', 'b', 'd', 'a']]; 
    //         const transformedArray = transformMultDimArray(testedArray, 4);
    //         const expectedArray = [['rows', 'rows', 'rows'], ['a', 'b', ""], ['b', 'c', 'd', ""], ['a', 'b', 'd', 'a']];
    //         expect(transformedArray).to.deep.equal(expectedArray);
    //     });
    // });
});

