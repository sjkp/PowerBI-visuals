import * as Lint from "../../../node_modules/tslint/lib/lint";
import * as ts from '../../../node_modules/typescript/lib/typescript';

export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = "duplicate variable: '";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoDuplicateVariableWalker(sourceFile, this.getOptions()));
    }
}

class NoDuplicateVariableWalker extends Lint.ScopeAwareRuleWalker<ScopeInfo> {
    public createScope(): ScopeInfo {
        return new ScopeInfo();
    }

    public visitVariableDeclaration(node: ts.VariableDeclaration): void {
        var propertyName = node.name;
        var variableName = propertyName.getText();
        var currentScope = this.getCurrentScope();
                
        // determine if the appropriate bit is set, which indicates this is a "let"
        var declarationIsLet = (Math.floor(node.flags / ts.NodeFlags.Let) % 2) === 1;
        
        var failureString = Rule.FAILURE_STRING + variableName + "'";
        if (currentScope.varNames.indexOf(variableName) >= 0 && !this.isChildOfForLoop(node)) {
            // if there was a previous var declaration with the same name, this declaration is invalid
            this.addFailure(this.createFailure(propertyName.getStart(), propertyName.getWidth(), failureString));
        } else if (!declarationIsLet) {
            if (currentScope.letNames.indexOf(variableName) >= 0) {
                // if we're a var, and someone previously declared a let with the same name, this declaration is invalid
                this.addFailure(this.createFailure(propertyName.getStart(), propertyName.getWidth(), failureString));                
            } else {
                currentScope.varNames.push(variableName);
            }
        } else {
            currentScope.letNames.push(variableName);
        }

        super.visitVariableDeclaration(node);
    }

    private isChildOfForLoop(node: ts.VariableDeclaration): boolean {
        return node.parent.kind === ts.SyntaxKind.ForStatement;
    }
    
}

class ScopeInfo {
    public varNames: string[] = [];
    public letNames: string[] = [];
}