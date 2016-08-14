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
        return this.applyWithWalker(new NoDuplicateVariableWalker(sourceFile, this.getOptions()));
    };
    Rule.FAILURE_STRING = "duplicate variable: '";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var NoDuplicateVariableWalker = (function (_super) {
    __extends(NoDuplicateVariableWalker, _super);
    function NoDuplicateVariableWalker() {
        _super.apply(this, arguments);
    }
    NoDuplicateVariableWalker.prototype.createScope = function () {
        return new ScopeInfo();
    };
    NoDuplicateVariableWalker.prototype.visitVariableDeclaration = function (node) {
        var propertyName = node.name;
        var variableName = propertyName.getText();
        var currentScope = this.getCurrentScope();
        // determine if the appropriate bit is set, which indicates this is a "let"
        var declarationIsLet = (Math.floor(node.flags / 16384 /* Let */) % 2) === 1;
        var failureString = Rule.FAILURE_STRING + variableName + "'";
        if (currentScope.varNames.indexOf(variableName) >= 0 && !this.isChildOfForLoop(node)) {
            // if there was a previous var declaration with the same name, this declaration is invalid
            this.addFailure(this.createFailure(propertyName.getStart(), propertyName.getWidth(), failureString));
        }
        else if (!declarationIsLet) {
            if (currentScope.letNames.indexOf(variableName) >= 0) {
                // if we're a var, and someone previously declared a let with the same name, this declaration is invalid
                this.addFailure(this.createFailure(propertyName.getStart(), propertyName.getWidth(), failureString));
            }
            else {
                currentScope.varNames.push(variableName);
            }
        }
        else {
            currentScope.letNames.push(variableName);
        }
        _super.prototype.visitVariableDeclaration.call(this, node);
    };
    NoDuplicateVariableWalker.prototype.isChildOfForLoop = function (node) {
        return node.parent.kind === 199 /* ForStatement */;
    };
    return NoDuplicateVariableWalker;
})(Lint.ScopeAwareRuleWalker);
var ScopeInfo = (function () {
    function ScopeInfo() {
        this.varNames = [];
        this.letNames = [];
    }
    return ScopeInfo;
})();
