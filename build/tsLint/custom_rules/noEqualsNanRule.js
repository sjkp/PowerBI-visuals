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
        var nanComparisonWalker = new NaNComparisonWalker(sourceFile, this.getOptions());
        return this.applyWithWalker(nanComparisonWalker);
    };
    Rule.NAN_FAILURE_STRING = "Using equality operators with NAN is wrong, use Number.isNaN instead";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var NaNComparisonWalker = (function (_super) {
    __extends(NaNComparisonWalker, _super);
    function NaNComparisonWalker() {
        _super.apply(this, arguments);
    }
    NaNComparisonWalker.prototype.visitBinaryExpression = function (node) {
        if (this.isEqualsNaNComparison(node)) {
            var position = node.getChildAt(1).getStart();
            this.handleOperatorToken(position, node.operatorToken.kind);
        }
        _super.prototype.visitBinaryExpression.call(this, node);
    };
    NaNComparisonWalker.prototype.handleOperatorToken = function (position, operator) {
        switch (operator) {
            case 30 /* EqualsEqualsToken */:
            case 31 /* ExclamationEqualsToken */:
            case 32 /* EqualsEqualsEqualsToken */:
            case 32 /* EqualsEqualsEqualsToken */:
                this.addFailure(this.createFailure(position, NaNComparisonWalker.COMPARISON_OPERATOR_WIDTH, Rule.NAN_FAILURE_STRING));
                break;
        }
    };
    NaNComparisonWalker.prototype.isEqualsNaNComparison = function (node) {
        return this.isNanKeyword(node.left) ||
            this.isNanKeyword(node.right);
    };
    NaNComparisonWalker.prototype.isNanKeyword = function (node) {
        var nanKeyword = "NaN";
        return node.kind === 69 /* Identifier */ &&
            node.getText() === nanKeyword;
    };
    NaNComparisonWalker.COMPARISON_OPERATOR_WIDTH = 2;
    return NaNComparisonWalker;
})(Lint.RuleWalker);
