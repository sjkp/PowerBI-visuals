var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Lint = require("../../../node_modules/tslint/lib/lint");
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        _super.apply(this, arguments);
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new FunctionReturnTypeRequiredWalker(sourceFile, this.getOptions()));
    };
    Rule.FAILURE_STRING = "Explicit return type is required for function: ";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var FunctionReturnTypeRequiredWalker = (function (_super) {
    __extends(FunctionReturnTypeRequiredWalker, _super);
    function FunctionReturnTypeRequiredWalker() {
        _super.apply(this, arguments);
    }
    FunctionReturnTypeRequiredWalker.prototype.visitFunctionDeclaration = function (node) {
        this.checkIfFunctionDeclarationContainsNoExplicitReturnType(node);
        _super.prototype.visitFunctionDeclaration.call(this, node);
    };
    FunctionReturnTypeRequiredWalker.prototype.visitMethodDeclaration = function (node) {
        this.checkIfFunctionDeclarationContainsNoExplicitReturnType(node);
        _super.prototype.visitMethodDeclaration.call(this, node);
    };
    FunctionReturnTypeRequiredWalker.prototype.checkIfFunctionDeclarationContainsNoExplicitReturnType = function (node) {
        if (node.type == null) {
            var functionSign = node.getText();
            var location_1 = (node.parameters != null) ? node.parameters.end : null;
            var failureString = Rule.FAILURE_STRING + functionSign;
            this.addFailure(this.createFailure(location_1, 1, failureString));
        }
    };
    return FunctionReturnTypeRequiredWalker;
})(Lint.RuleWalker);
