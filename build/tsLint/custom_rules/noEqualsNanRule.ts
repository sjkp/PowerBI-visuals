import * as Lint from "../../../node_modules/tslint/lib/lint";
import * as ts from '../../../node_modules/typescript/lib/typescript';

export class Rule extends Lint.Rules.AbstractRule {
    public static NAN_FAILURE_STRING = "Using equality operators with NAN is wrong, use Number.isNaN instead";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        var nanComparisonWalker = new NaNComparisonWalker(sourceFile, this.getOptions());
        return this.applyWithWalker(nanComparisonWalker);
    }
}

class NaNComparisonWalker extends Lint.RuleWalker {
    private static COMPARISON_OPERATOR_WIDTH = 2;

    public visitBinaryExpression(node: ts.BinaryExpression) {
        if (this.isEqualsNaNComparison(node)) {
            var position = node.getChildAt(1).getStart();
            this.handleOperatorToken(position, node.operatorToken.kind);
        }
        super.visitBinaryExpression(node);
    }

    private handleOperatorToken(position: number, operator: ts.SyntaxKind) {
        switch (operator) {
            case ts.SyntaxKind.EqualsEqualsToken:
            case ts.SyntaxKind.ExclamationEqualsToken:
            case ts.SyntaxKind.EqualsEqualsEqualsToken:
            case ts.SyntaxKind.EqualsEqualsEqualsToken:
                this.addFailure(this.createFailure(position, NaNComparisonWalker.COMPARISON_OPERATOR_WIDTH, Rule.NAN_FAILURE_STRING));
                break;
        }
    }

    private isEqualsNaNComparison(node: ts.BinaryExpression): boolean {
        return this.isNanKeyword(node.left) || 
            this.isNanKeyword(node.right);
    }

    private isNanKeyword(node: ts.Node): boolean {
        var nanKeyword = "NaN";

        return node.kind === ts.SyntaxKind.Identifier &&
            node.getText() === nanKeyword;
    }
}