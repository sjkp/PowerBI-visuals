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
        return this.applyWithWalker(new NoUnderscorePrefixForVariablesWalker(sourceFile, this.getOptions()));
    };
    Rule.FAILURE_STRING = "Underscore prefix is not allowed for variable name: '";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var NoUnderscorePrefixForVariablesWalker = (function (_super) {
    __extends(NoUnderscorePrefixForVariablesWalker, _super);
    function NoUnderscorePrefixForVariablesWalker() {
        _super.apply(this, arguments);
    }
    NoUnderscorePrefixForVariablesWalker.prototype.visitVariableDeclaration = function (node) {
        this.checkForUnderscorePrefix(node);
        _super.prototype.visitVariableDeclaration.call(this, node);
    };
    NoUnderscorePrefixForVariablesWalker.prototype.visitPropertyDeclaration = function (node) {
        this.checkForUnderscorePrefix(node);
        _super.prototype.visitPropertyDeclaration.call(this, node);
    };
    NoUnderscorePrefixForVariablesWalker.prototype.checkForUnderscorePrefix = function (node) {
        var variableIdentifier = node.name;
        var variableName = variableIdentifier.getText();
        var underscorePrefix = "_";
        if (variableName.charAt(0) === underscorePrefix) {
            var failureString = Rule.FAILURE_STRING + variableName + "'";
            this.addFailure(this.createFailure(variableIdentifier.getStart(), variableIdentifier.getWidth(), failureString));
        }
    };
    return NoUnderscorePrefixForVariablesWalker;
})(Lint.RuleWalker);
