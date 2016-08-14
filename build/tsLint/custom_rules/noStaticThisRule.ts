import * as Lint from "../../../node_modules/tslint/lib/lint";
import * as ts from '../../../node_modules/typescript/lib/typescript';

export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING: string = "Using this in static functions is not allowed";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoStaticThisWalker(sourceFile, this.getOptions()));
    }
}

class NoStaticThisWalker extends Lint.RuleWalker {
    public visitModuleDeclaration(node: ts.ModuleDeclaration) {
        if (node.body && node.body.kind === ts.SyntaxKind.ModuleBlock) {
            this.checkModuleBlocks(node);
        }

        super.visitModuleDeclaration(node);
    }

    private checkModuleBlocks(node: ts.ModuleDeclaration) {
        var moduleBlock: ts.Block = <ts.Block>node.body;
        var blockStatementsLength: number = moduleBlock.statements && moduleBlock.statements.length;

        for (var i = 0; i < blockStatementsLength; i++) {
            var statement = moduleBlock.statements[i];

            if (statement.kind === ts.SyntaxKind.FunctionDeclaration) {
                this.processFunctionBody(statement);
            }
        }
    }

    private processFunctionBody(node: ts.Node) {
        var functionBody: string = node.getText();
        var thisKeyword: string = "this.";
        var thisIndex: number = functionBody.indexOf(thisKeyword);

        if (thisIndex >= 0) {
            this.addFailure(this.createFailure(node.getStart(), thisIndex, Rule.FAILURE_STRING));
        }
    }
}