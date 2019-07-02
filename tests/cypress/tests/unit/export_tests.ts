import { findMaxLength, transformMultDimArray, getMergeRanges } from 'dash-table/components/Button/ExportButton';

describe('export', () => {
    describe('findMaxLength', () => {
        it('empty array', () => {
            const testedArray = [];
            const maxLength = findMaxLength(testedArray);
            expect(maxLength).to.equal(0);
        });
        it('array with only strings', () => {
            const testedArray = ['a', 'b', 'c', 'd'];
            const maxLength = findMaxLength(testedArray);
            expect(maxLength).to.equal(0);
        });
        it ('array with strings and strings array with same length', () => {
            const testedArray = ['a', ['b', 'c'], ['b', 'd']];
            const maxLength = findMaxLength(testedArray);
            expect(maxLength).to.equal(2);
        });
        it ('2D strings array', () => {
            const testedArray = [['a', 'b', 'c'], ['b', 'c', 'd'], ['b', 'd', 'a']]; 
            const maxLength = findMaxLength(testedArray);
            expect(maxLength).to.equal(3);
        });
        it ('multidimensional array', () => {
            const testedArray = [['a', 'b'], ['b', 'c', 'd'], ['a', 'b', 'd', 'a']]; 
            const maxLength = findMaxLength(testedArray);
            expect(maxLength).to.equal(4);
        });
        it ('multidimensional array with strings', () => {
            const testedArray = ['rows', ['a', 'b'], ['b', 'c', 'd'], ['a', 'b', 'd', 'a']]; 
            const maxLength = findMaxLength(testedArray);
            expect(maxLength).to.equal(4);
        });
    });

    describe('transformMultDimArray', () => {
        it('array with only strings', () => {
            const testedArray = [];
            const transformedArray = transformMultDimArray(testedArray, 0);
            const expectedArray = [];
            console.log(transformedArray);
            expect(transformedArray).to.deep.equal(expectedArray);
        });
        it('array with only strings', () => {
            const testedArray = ['a', 'b', 'c', 'd'];
            const transformedArray = transformMultDimArray(testedArray, 0);
            const expectedArray = [['a'], ['b'], ['c'], ['d']];
            expect(transformedArray).to.deep.equal(expectedArray);
        });
        it ('array with strings and strings array with same length', () => {
            const testedArray = ['a', ['b', 'c'], ['b', 'd']];
            const transformedArray = transformMultDimArray(testedArray, 2);
            const expectedArray = [['a', 'a'], ['b', 'c'], ['b', 'd']];
            expect(transformedArray).to.deep.equal(expectedArray);
        });
        it ('2D strings array', () => {
            const testedArray = [['a', 'b', 'c'], ['b', 'c', 'd'], ['b', 'd', 'a']]; 
            const transformedArray = transformMultDimArray(testedArray, 3);
            const expectedArray = [['a', 'b', 'c'], ['b', 'c', 'd'], ['b', 'd', 'a']];
            expect(transformedArray).to.deep.equal(expectedArray);

        });
        it ('multidimensional array', () => {
            const testedArray = [['a', 'b'], ['b', 'c', 'd'], ['a', 'b', 'd', 'a']]; 
            const transformedArray = transformMultDimArray(testedArray, 4);
            const expectedArray = [['a', 'b', "", ""], ['b', 'c', 'd', ""], ['a', 'b', 'd', 'a']];
            expect(transformedArray).to.deep.equal(expectedArray);

        });
        it ('multidimensional array with strings', () => {
            const testedArray = ['rows', ['a', 'b'], ['b', 'c', 'd'], ['a', 'b', 'd', 'a']]; 
            const transformedArray = transformMultDimArray(testedArray, 4);
            const expectedArray = [['rows', 'rows', 'rows', 'rows'], ['a', 'b', "", ""], ['b', 'c', 'd', ""], ['a', 'b', 'd', 'a']];
            expect(transformedArray).to.deep.equal(expectedArray);
        });
    });

    describe('getMergeRanges', () => {
        it('no merge', () => {
            const testedArray = [['a', 'b', 'c', 'd'],
                                 ['a', 'b', 'c', 'd'],
                                 ['a', 'b', 'c', 'd']];
            const mergedRanges = getMergeRanges(testedArray);
            const expectedRanges = [];
            expect(mergedRanges).to.deep.equal(expectedRanges);
        });
        it('duplicate values - no merge', () => {
            const testedArray = [['a', 'b', 'c', 'a'],
                                 ['a', 'b', 'c', 'a'],
                                 ['a', 'b', 'c', 'a']];
            const mergedRanges = getMergeRanges(testedArray);
            const expectedRanges = [];
            expect(mergedRanges).to.deep.equal(expectedRanges);
        });
        it('merge 2 cells right with a different value in between', () => {
            const testedArray = [['a', 'b', 'c', 'd'],
                                 ['a', 'b', 'a', 'a'],
                                 ['a', 'b', 'c', 'd']];
            const mergedRanges = getMergeRanges(testedArray);
            const expectedRanges = [{s: {r: 1, c: 2}, e:{r: 1,c: 3}}];
            expect(mergedRanges).to.deep.equal(expectedRanges);
        });
        it('merge 2 cells left with a different value in between', () => {
            const testedArray = [['a', 'b', 'c', 'd'],
                                 ['a', 'a', 'b', 'a'],
                                 ['a', 'b', 'c', 'd']];
            const mergedRanges = getMergeRanges(testedArray);
            const expectedRanges = [{s: {r: 1, c: 0}, e:{r: 1,c: 1}}];
            expect(mergedRanges).to.deep.equal(expectedRanges);
        });
        it('2 cells merge', () => {
            const testedArray = [['a', 'b', 'c', 'd'],
                                 ['a', 'a', 'c', 'd'],
                                 ['a', 'b', 'c', 'd']];
            const mergedRanges = getMergeRanges(testedArray);
            const expectedRanges = [{s: {r: 1, c: 0}, e:{r: 1,c: 1}}];
            expect(mergedRanges).to.deep.equal(expectedRanges);
        });
        it('3 cells merge', () => {
            const testedArray = [['a', 'b', 'c', 'd'],
                                 ['a', 'a', 'a', 'd'],
                                 ['a', 'b', 'c', 'd']];
            const mergedRanges = getMergeRanges(testedArray);
            const expectedRanges = [{s: {r: 1, c: 0}, e:{r: 1,c: 2}}];
            expect(mergedRanges).to.deep.equal(expectedRanges);
        });
        it('4 cells merge', () => {
            const testedArray = [['a', 'b', 'c', 'd'],
                                 ['a', 'a', 'a', 'a'],
                                 ['a', 'b', 'c', 'd']];
            const mergedRanges = getMergeRanges(testedArray);
            const expectedRanges = [{s: {r: 1, c: 0}, e:{r: 1,c: 3}}];
            expect(mergedRanges).to.deep.equal(expectedRanges);
        });
        it('2 cells merge, 4 cells merge - same value', () => {
            const testedArray = [['a', 'a', 'c', 'd'],
                                 ['a', 'a', 'a', 'a'],
                                 ['a', 'b', 'c', 'd']];
            const mergedRanges = getMergeRanges(testedArray);
            const expectedRanges = [
                {s: {r: 0, c: 0}, e:{r: 0,c: 1}},
                {s: {r: 1, c: 0}, e:{r: 1,c: 3}}
            ];
            expect(mergedRanges).to.deep.equal(expectedRanges);
        });
        it('2 cells merge, 4 cells merge, 3 cells merge - same value', () => {
            const testedArray = [['a', 'a', 'c', 'd'],
                                 ['a', 'a', 'a', 'a'],
                                 ['a', 'a', 'a', 'd']];
            const mergedRanges = getMergeRanges(testedArray);
            const expectedRanges = [
                {s: {r: 0, c: 0}, e:{r: 0,c: 1}},
                {s: {r: 1, c: 0}, e:{r: 1,c: 3}}, 
                {s: {r: 2, c: 0}, e:{r: 2,c: 2}}
            ];
            expect(mergedRanges).to.deep.equal(expectedRanges);
        });
        it('table with same value', () => {
            const testedArray = [['a', 'a', 'a', 'a'],
                                 ['a', 'a', 'a', 'a'],
                                 ['a', 'a', 'a', 'a']];
            const mergedRanges = getMergeRanges(testedArray);
            const expectedRanges = [
                {s: {r: 0, c: 0}, e:{r: 0,c: 3}},
                {s: {r: 1, c: 0}, e:{r: 1,c: 3}}, 
                {s: {r: 2, c: 0}, e:{r: 2,c: 3}}
            ];
            expect(mergedRanges).to.deep.equal(expectedRanges);
        });
        it('2 cells merge, 4 cells merge, 3 cells merge - same value', () => {
            const testedArray = [['a', 'a', 'c', 'c'],
                                 ['a', 'a', 'a', 'a'],
                                 ['a', 'a', 'a', 'd']];
            const mergedRanges = getMergeRanges(testedArray);
            const expectedRanges = [
                {s: {r: 0, c: 0}, e:{r: 0,c: 1}},
                {s: {r: 0, c: 2}, e:{r: 0, c: 3}},
                {s: {r: 1, c: 0}, e:{r: 1,c: 3}}, 
                {s: {r: 2, c: 0}, e:{r: 2,c: 2}}
            ];
            expect(mergedRanges).to.deep.equal(expectedRanges);
        });
        it('same value for the table', () => {
            const testedArray = [['a', 'a', 'a', 'a'],
                                 ['a', 'a', 'a', 'a'],
                                 ['a', 'a', 'a', 'a']];
            const mergedRanges = getMergeRanges(testedArray);
            const expectedRanges = [
                {s: {r: 0, c: 0}, e:{r: 0,c: 3}},
                {s: {r: 1, c: 0}, e:{r: 1, c: 3}},
                {s: {r: 2, c: 0}, e:{r: 2,c: 3}}
            ];
            expect(mergedRanges).to.deep.equal(expectedRanges);
        });
    });

});
