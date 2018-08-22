import lexer from 'core/syntax-tree/lexer';
import syntaxer, { ISyntaxTree } from 'core/syntax-tree/syntaxer';

export default class SyntaxTree {
    private syntaxTree: ISyntaxTree;

    constructor(query: string) {
        this.syntaxTree = syntaxer(lexer(query));
    }

    evaluate = (target: any) => {
        const evaluate = this.syntaxTree.lexeme.evaluate;

        return evaluate ?
            evaluate(target, this.syntaxTree) :
            false;
    }

    filter = (targets: any[]) => {
        return targets.filter(this.evaluate);
    }
}