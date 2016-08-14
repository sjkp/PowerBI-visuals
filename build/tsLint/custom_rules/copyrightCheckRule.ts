import * as Lint from "../../../node_modules/tslint/lib/lint";
import * as ts from '../../../node_modules/typescript/lib/typescript';


export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = "Please ensure this file has the copyright text included at the top";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new CopyrightCheckWalker(sourceFile, this.getOptions()));
    }
}

class CopyrightCheckWalker extends Lint.RuleWalker {
    public visitSourceFile(node: ts.SourceFile): void {
        this.checkCopyrightInclusion(node);

        super.visitSourceFile(node);
    }

    private checkCopyrightInclusion(node: ts.SourceFile): void {
        const copyrightText = "Copyright (c) Microsoft Corporation";
        const copyrightTextSecondVariant = "Copyright (C) Microsoft Corporation";
        const notToCopyright = "Microsoft can use this code but cannot copyright it as its own";
        let isCopyrightExist: boolean = false;

        Lint.scanAllTokens(ts.createScanner(ts.ScriptTarget.Latest, false, ts.LanguageVariant.Standard, node.text), (scanner: ts.Scanner) => {
            let currentToken = scanner.getToken();
            if (currentToken === ts.SyntaxKind.SingleLineCommentTrivia || scanner.getToken() === ts.SyntaxKind.MultiLineCommentTrivia) {
                const commentText = scanner.getTokenText();
                if (commentText.indexOf(copyrightText) !== -1 || commentText.indexOf(copyrightTextSecondVariant) !== -1 || commentText.indexOf(notToCopyright) !== -1) {
                    isCopyrightExist = true;
                    return;
                }
            }
        });

        if (!isCopyrightExist) {
            this.addFailure(this.createFailure(0, 0, Rule.FAILURE_STRING));
        }
    }
}