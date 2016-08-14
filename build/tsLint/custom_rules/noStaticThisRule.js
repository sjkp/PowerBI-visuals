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
        return this.applyWithWalker(new NoStaticThisWalker(sourceFile, this.getOptions()));
    };
    Rule.FAILURE_STRING = "Using this in static functions is not allowed";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var NoStaticThisWalker = (function (_super) {
    __extends(NoStaticThisWalker, _super);
    function NoStaticThisWalker() {
        _super.apply(this, arguments);
    }
    NoStaticThisWalker.prototype.visitModuleDeclaration = function (node) {
        if (node.body && node.body.kind === 219 /* ModuleBlock */) {
            this.checkModuleBlocks(node);
        }
        _super.prototype.visitModuleDeclaration.call(this, node);
    };
    NoStaticThisWalker.prototype.checkModuleBlocks = function (node) {
        var moduleBlock = node.body;
        var blockStatementsLength = moduleBlock.statements && moduleBlock.statements.length;
        for (var i = 0; i < blockStatementsLength; i++) {
            var statement = moduleBlock.statements[i];
            if (statement.kind === 213 /* FunctionDeclaration */) {
                this.processFunctionBody(statement);
            }
        }
    };
    NoStaticThisWalker.prototype.processFunctionBody = function (node) {
        var functionBody = node.getText();
        var thisKeyword = "this.";
        var thisIndex = functionBody.indexOf(thisKeyword);
        if (thisIndex >= 0) {
            this.addFailure(this.createFailure(node.getStart(), thisIndex, Rule.FAILURE_STRING));
        }
    };
    return NoStaticThisWalker;
})(Lint.RuleWalker);
