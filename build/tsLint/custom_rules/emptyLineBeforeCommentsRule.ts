import * as Lint from "../../../node_modules/tslint/lib/lint";
import * as ts from '../../../node_modules/typescript/lib/typescript';

export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = "Please ensure you leave an empty line before comments.";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new EmptyLineBeforeCommentsWalker(sourceFile, this.getOptions()));
    }
}

class EmptyLineBeforeCommentsWalker extends Lint.RuleWalker {
    public visitSourceFile(node: ts.SourceFile): void {
        this.checkEmptyLineBeforeComments(node);

        super.visitSourceFile(node);
    }

    private checkEmptyLineBeforeComments(node: ts.SourceFile) {
        let olderPreviousToken: ts.SyntaxKind = ts.SyntaxKind.NewLineTrivia;
        let previousToken: ts.SyntaxKind = ts.SyntaxKind.NewLineTrivia;
		
        Lint.scanAllTokens(ts.createScanner(ts.ScriptTarget.Latest, false, ts.LanguageVariant.Standard, node.text), (scanner: ts.Scanner) => {
            let currentToken = scanner.getToken();
            if (currentToken === ts.SyntaxKind.SingleLineCommentTrivia || currentToken === ts.SyntaxKind.MultiLineCommentTrivia) {
                if (previousToken === ts.SyntaxKind.NewLineTrivia
                    && (olderPreviousToken === ts.SyntaxKind.SemicolonToken || olderPreviousToken === ts.SyntaxKind.CloseBraceToken)) {
                    this.addFailure(this.createFailure(scanner.getStartPos(), 1, Rule.FAILURE_STRING));
                }
            }

            if (currentToken !== ts.SyntaxKind.WhitespaceTrivia) {
                olderPreviousToken = previousToken;
                previousToken = currentToken;
            }
        });
    }
}