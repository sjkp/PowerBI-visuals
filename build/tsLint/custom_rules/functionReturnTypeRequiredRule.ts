import * as Lint from "../../../node_modules/tslint/lib/lint";
import * as ts from '../../../node_modules/typescript/lib/typescript';

export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING: string = "Explicit return type is required for function: ";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new FunctionReturnTypeRequiredWalker(sourceFile, this.getOptions()));
    }
}

class FunctionReturnTypeRequiredWalker extends Lint.RuleWalker {

    public visitFunctionDeclaration(node: ts.FunctionDeclaration): void {
        this.checkIfFunctionDeclarationContainsNoExplicitReturnType(node);
              			
        super.visitFunctionDeclaration(node);
    }
    
    public visitMethodDeclaration(node: ts.MethodDeclaration): void {
        this.checkIfFunctionDeclarationContainsNoExplicitReturnType(node);

        super.visitMethodDeclaration(node);
    }

    private checkIfFunctionDeclarationContainsNoExplicitReturnType(node: ts.FunctionDeclaration|ts.MethodDeclaration): void {
        if (node.type == null) {
            let functionSign: string = node.getText();
            const location = (node.parameters != null) ? node.parameters.end : null;
            let failureString = Rule.FAILURE_STRING + functionSign;
            this.addFailure(this.createFailure(location, 1, failureString));
        }
    }
}