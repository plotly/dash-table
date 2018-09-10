import * as R from 'ramda';
import React from 'react';

import Logger from 'core/Logger';
import { ILexerResult, ILexemeResult } from 'core/syntax-tree/lexer';

import { ColumnFilter, AdvancedFilter } from 'dash-table/components/Filter';
import { ColumnId, Columns, Filtering, FilteringType, IColumn } from 'dash-table/components/Table/props';
import { LexemeType } from 'core/syntax-tree/lexicon';
import syntaxer, { ISyntaxerResult, ISyntaxTree } from 'core/syntax-tree/syntaxer';

type SetFilter = (filter: string) => void;

export interface IFilterOptions {
    columns: Columns;
    filtering: Filtering;
    filtering_type: FilteringType;
    id: string;
    lexerResult: ILexerResult;
    offset: number;
    setFilter: SetFilter;
}

export default class HeaderFilterFactory {
    private static onChange = (columnId: ColumnId, ops: Map<ColumnId, string>, setFilter: SetFilter, ev: any) => {
        Logger.debug('Filter -- onChange', columnId, ev.target.value && ev.target.value.trim());

        const value = ev.target.value.trim();

        if (value && value.length) {
            ops.set(columnId, value);
        } else {
            ops.delete(columnId);
        }

        setFilter(R.map(
            ([cId, filter]) => `${cId} ${filter}`,
            Array.from(ops.entries())
        ).join(' && '));
    }

    private static readonly handlers = new Map();
    private static getEventHandler = (fn: Function, id: string, columnId: ColumnId, ops: Map<ColumnId, string>, setFilter: SetFilter): any => {
        const fnHandler = (HeaderFilterFactory.handlers.get(fn) || HeaderFilterFactory.handlers.set(fn, new Map()).get(fn));
        const idHandler = (fnHandler.get(id) || fnHandler.set(id, new Map()).get(id));
        const columnIdHandler = (idHandler.get(columnId) || idHandler.set(columnId, new Map()).get(columnId));

        return (
            columnIdHandler.get(setFilter) ||
            (columnIdHandler.set(setFilter, fn.bind(HeaderFilterFactory, columnId, ops, setFilter)).get(setFilter))
        );
    }

    private static respectsBasicSyntax(lexemes: ILexemeResult[]) {
        const allowedLexemeTypes = [
            LexemeType.And,
            LexemeType.BinaryOperator,
            LexemeType.Expression,
            LexemeType.Operand,
            LexemeType.UnaryOperator
        ];

        const allAllowed = R.all(
            item => R.contains(item.lexeme.name, allowedLexemeTypes),
            lexemes
        );

        if (!allAllowed) {
            return false;
        }

        const fields = R.map(
            item => item.value,
            R.filter(
                i => i.lexeme.name === LexemeType.Operand,
                lexemes
            )
        );

        const uniqueFields = R.uniq(fields);

        if (fields.length !== uniqueFields.length) {
            return false;
        }

        return true;
    }

    private static isBasicFilter(
        lexerResult: ILexerResult,
        syntaxerResult: ISyntaxerResult
    ) {
        return lexerResult.valid &&
            syntaxerResult.valid &&
            HeaderFilterFactory.respectsBasicSyntax(lexerResult.lexemes);
    }

    public static createFilters(options: IFilterOptions) {
        const {
            columns,
            filtering,
            filtering_type,
            id,
            lexerResult,
            offset,
            setFilter
        } = options;

        if (!filtering) {
            return [];
        }

        const syntaxerResult = syntaxer(lexerResult);
        const visibleColumns = R.filter(column => !column.hidden, columns);

        const ops = new Map<ColumnId, string>();
        if (HeaderFilterFactory.isBasicFilter(lexerResult, syntaxerResult)) {
            const { tree } = syntaxerResult;
            const toCheck: (ISyntaxTree | undefined)[] = [tree];

            while (toCheck.length) {
                const item = toCheck.pop();
                if (!item) {
                    continue;
                }

                if (item.lexeme.name === LexemeType.UnaryOperator && item.block) {
                    ops.set(item.block.value, item.value);
                } else if (item.lexeme.name === LexemeType.BinaryOperator && item.left && item.right) {
                    ops.set(item.left.value, `${item.value} ${item.right.value}`);
                } else {
                    toCheck.push(item.left);
                    toCheck.push(item.block);
                    toCheck.push(item.right);
                }
            }
        }

        const offsetCells = R.range(0, offset).map(i => (<th key={`offset-${i}`} />));

        const filterCells = filtering_type === FilteringType.Basic ?
            R.addIndex<IColumn, JSX.Element>(R.map)((column, index) => {
                return (<ColumnFilter
                    key={`column-${index + offset}`}
                    classes={[`column-${index + offset}`]}
                    property={column.id}
                    setFilter={this.getEventHandler(this.onChange, id, column.id, ops, setFilter)}
                    value={ops.get(column.id)}
                />);
            }, visibleColumns) :
            [(<AdvancedFilter
                key={`column-${offset}`}
                classes={[]}
                colSpan={visibleColumns.length}
                value=''
                setFilter={() => undefined}
            />)];

        return [R.concat(offsetCells, filterCells)];
    }
}