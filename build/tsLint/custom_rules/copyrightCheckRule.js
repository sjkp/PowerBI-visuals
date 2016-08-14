var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Lint = require("../../../node_modules/tslint/lib/lint");
var ts = require('../../../node_modules/typescript/lib/typescript');
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        _super.apply(this, arguments);
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new CopyrightCheckWalker(sourceFile, this.getOptions()));
    };
    Rule.FAILURE_STRING = "Please ensure this file has the copyright text included at the top";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var CopyrightCheckWalker = (function (_super) {
    __extends(CopyrightCheckWalker, _super);
    function CopyrightCheckWalker() {
        _super.apply(this, arguments);
    }
    CopyrightCheckWalker.prototype.visitSourceFile = function (node) {
        this.checkCopyrightInclusion(node);
        _super.prototype.visitSourceFile.call(this, node);
    };
    CopyrightCheckWalker.prototype.checkCopyrightInclusion = function (node) {
        var copyrightText = "Copyright (c) Microsoft Corporation";
        var copyrightTextSecondVariant = "Copyright (C) Microsoft Corporation";
        var notToCopyright = "Microsoft can use this code but cannot copyright it as its own";
        var isCopyrightExist = false;
        Lint.scanAllTokens(ts.createScanner(2 /* Latest */, false, 0 /* Standard */, node.text), function (scanner) {
            var currentToken = scanner.getToken();
            if (currentToken === 2 /* SingleLineCommentTrivia */ || scanner.getToken() === 3 /* MultiLineCommentTrivia */) {
                var commentText = scanner.getTokenText();
                if (commentText.indexOf(copyrightText) !== -1 || commentText.indexOf(copyrightTextSecondVariant) !== -1 || commentText.indexOf(notToCopyright) !== -1) {
                    isCopyrightExist = true;
                    return;
                }
            }
        });
        if (!isCopyrightExist) {
            this.addFailure(this.createFailure(0, 0, Rule.FAILURE_STRING));
        }
    };
    return CopyrightCheckWalker;
})(Lint.RuleWalker);
