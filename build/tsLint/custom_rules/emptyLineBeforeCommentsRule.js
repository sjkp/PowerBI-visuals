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
        return this.applyWithWalker(new EmptyLineBeforeCommentsWalker(sourceFile, this.getOptions()));
    };
    Rule.FAILURE_STRING = "Please ensure you leave an empty line before comments.";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var EmptyLineBeforeCommentsWalker = (function (_super) {
    __extends(EmptyLineBeforeCommentsWalker, _super);
    function EmptyLineBeforeCommentsWalker() {
        _super.apply(this, arguments);
    }
    EmptyLineBeforeCommentsWalker.prototype.visitSourceFile = function (node) {
        this.checkEmptyLineBeforeComments(node);
        _super.prototype.visitSourceFile.call(this, node);
    };
    EmptyLineBeforeCommentsWalker.prototype.checkEmptyLineBeforeComments = function (node) {
        var _this = this;
        var olderPreviousToken = 4 /* NewLineTrivia */;
        var previousToken = 4 /* NewLineTrivia */;
        Lint.scanAllTokens(ts.createScanner(2 /* Latest */, false, 0 /* Standard */, node.text), function (scanner) {
            var currentToken = scanner.getToken();
            if (currentToken === 2 /* SingleLineCommentTrivia */ || currentToken === 3 /* MultiLineCommentTrivia */) {
                if (previousToken === 4 /* NewLineTrivia */
                    && (olderPreviousToken === 23 /* SemicolonToken */ || olderPreviousToken === 16 /* CloseBraceToken */)) {
                    _this.addFailure(_this.createFailure(scanner.getStartPos(), 1, Rule.FAILURE_STRING));
                }
            }
            if (currentToken !== 5 /* WhitespaceTrivia */) {
                olderPreviousToken = previousToken;
                previousToken = currentToken;
            }
        });
    };
    return EmptyLineBeforeCommentsWalker;
})(Lint.RuleWalker);
