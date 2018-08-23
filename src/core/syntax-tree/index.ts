import lexer from 'core/syntax-tree/lexer';
import syntaxer, { ISyntaxTree } from 'core/syntax-tree/syntaxer';

export default class SyntaxTree {
    private syntaxTree: ISyntaxTree;

    get isValid() {
        return !!this.syntaxTree;
    }

    constructor(query: string) {
        try {
            this.syntaxTree = syntaxer(lexer(query));
        } catch (_) { }
    }

    evaluate = (target: any) => {
        if (!this.syntaxTree) {
            throw new Error();
        }

        const evaluate = this.syntaxTree.lexeme.evaluate;

        return evaluate ?
            evaluate(target, this.syntaxTree) :
            false;
    }

    filter = (targets: any[]) => {
        return targets.filter(this.evaluate);
    }
}