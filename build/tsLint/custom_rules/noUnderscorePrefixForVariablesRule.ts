import * as Lint from "../../../node_modules/tslint/lib/lint";
import * as ts from '../../../node_modules/typescript/lib/typescript';

export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING: string = "Underscore prefix is not allowed for variable name: '";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoUnderscorePrefixForVariablesWalker(sourceFile, this.getOptions()));
    }
}

class NoUnderscorePrefixForVariablesWalker extends Lint.RuleWalker {
    public visitVariableDeclaration(node: ts.VariableDeclaration): void {
        this.checkForUnderscorePrefix(node);

        super.visitVariableDeclaration(node);
    }

    public visitPropertyDeclaration(node: ts.PropertyDeclaration): void {
        this.checkForUnderscorePrefix(node);

        super.visitPropertyDeclaration(node);
    }

    private checkForUnderscorePrefix(node: ts.VariableDeclaration|ts.PropertyDeclaration) {
        let variableIdentifier: ts.Identifier = <ts.Identifier> node.name;
        let variableName: string = variableIdentifier.getText();
        const underscorePrefix: string = "_";

        if (variableName.charAt(0) === underscorePrefix) {
            let failureString = Rule.FAILURE_STRING + variableName + "'";
            this.addFailure(this.createFailure(variableIdentifier.getStart(), variableIdentifier.getWidth(), failureString));
        }
    }
}