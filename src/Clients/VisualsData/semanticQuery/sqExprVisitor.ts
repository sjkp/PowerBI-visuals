/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved. 
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *   
 *  The above copyright notice and this permission notice shall be included in 
 *  all copies or substantial portions of the Software.
 *   
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

/// <reference path="../_references.ts"/>

module powerbi.data {

    /** Allows generic traversal and type discovery for a SQExpr tree. */
    export interface ISQExprVisitorWithArg<T, TArg> {
        visitEntity(expr: SQEntityExpr, arg: TArg): T;
        visitColumnRef(expr: SQColumnRefExpr, arg: TArg): T;
        visitMeasureRef(expr: SQMeasureRefExpr, arg: TArg): T;
        visitAggr(expr: SQAggregationExpr, arg: TArg): T;
        visitPercentile(expr: SQPercentileExpr, arg: TArg): T;
        visitHierarchy(expr: SQHierarchyExpr, arg: TArg): T;
        visitHierarchyLevel(expr: SQHierarchyLevelExpr, arg: TArg): T;
        visitPropertyVariationSource(expr: SQPropertyVariationSourceExpr, arg: TArg): T;
        visitSelectRef(expr: SQSelectRefExpr, arg: TArg): T;
        visitAnd(expr: SQAndExpr, arg: TArg): T;
        visitBetween(expr: SQBetweenExpr, arg: TArg): T;
        visitIn(expr: SQInExpr, arg: TArg): T;
        visitOr(expr: SQOrExpr, arg: TArg): T;
        visitCompare(expr: SQCompareExpr, arg: TArg): T;
        visitContains(expr: SQContainsExpr, arg: TArg): T;
        visitExists(expr: SQExistsExpr, arg: TArg): T;
        visitNot(expr: SQNotExpr, arg: TArg): T;
        visitStartsWith(expr: SQStartsWithExpr, arg: TArg): T;
        visitConstant(expr: SQConstantExpr, arg: TArg): T;
        visitDateSpan(expr: SQDateSpanExpr, arg: TArg): T;
        visitDateAdd(expr: SQDateAddExpr, arg: TArg): T;
        visitNow(expr: SQNowExpr, arg: TArg): T;
        visitDefaultValue(expr: SQDefaultValueExpr, arg: TArg): T;
        visitAnyValue(expr: SQAnyValueExpr, arg: TArg): T;
        visitArithmetic(expr: SQArithmeticExpr, arg: TArg): T;
        visitFillRule(expr: SQFillRuleExpr, arg: TArg): T;
        visitResourcePackageItem(expr: SQResourcePackageItemExpr, arg: TArg): T;
        visitScopedEval(expr: SQScopedEvalExpr, arg: TArg): T;
        visitWithRef(expr: SQWithRefExpr, arg: TArg): T;
        visitTransformTableRef(expr: SQTransformTableRefExpr, arg: TArg): T;
        visitTransformOutputRoleRef(expr: SQTransformOutputRoleRefExpr, arg: TArg): T;
    }

    export interface ISQExprVisitor<T> extends ISQExprVisitorWithArg<T, void> {
    }

    /** Default IQueryExprVisitorWithArg implementation that others may derive from. */
    export class DefaultSQExprVisitorWithArg<T, TArg> implements ISQExprVisitorWithArg<T, TArg> {
        public visitEntity(expr: SQEntityExpr, arg: TArg): T {
            return this.visitDefault(expr, arg);
        }

        public visitColumnRef(expr: SQColumnRefExpr, arg: TArg): T {
            return this.visitDefault(expr, arg);
        }

        public visitMeasureRef(expr: SQMeasureRefExpr, arg: TArg): T {
            return this.visitDefault(expr, arg);
        }

        public visitAggr(expr: SQAggregationExpr, arg: TArg): T {
            return this.visitDefault(expr, arg);
        }

        public visitPercentile(expr: SQPercentileExpr, arg: TArg): T {
            return this.visitDefault(expr, arg);
        }

        public visitHierarchy(expr: SQHierarchyExpr, arg: TArg): T {
            return this.visitDefault(expr, arg);
        }

        public visitHierarchyLevel(expr: SQHierarchyLevelExpr, arg: TArg): T {
            return this.visitDefault(expr, arg);
        }

        public visitPropertyVariationSource(expr: SQPropertyVariationSourceExpr, arg: TArg): T {
            return this.visitDefault(expr, arg);
        }

        public visitSelectRef(expr: SQSelectRefExpr, arg: TArg): T {
            return this.visitDefault(expr, arg);
        }

        public visitBetween(expr: SQBetweenExpr, arg: TArg): T {
            return this.visitDefault(expr, arg);
        }

        public visitIn(expr: SQInExpr, arg: TArg): T {
            return this.visitDefault(expr, arg);
        }

        public visitAnd(expr: SQAndExpr, arg: TArg): T {
            return this.visitDefault(expr, arg);
        }

        public visitOr(expr: SQOrExpr, arg: TArg): T {
            return this.visitDefault(expr, arg);
        }

        public visitCompare(expr: SQCompareExpr, arg: TArg): T {
            return this.visitDefault(expr, arg);
        }

        public visitContains(expr: SQContainsExpr, arg: TArg): T {
            return this.visitDefault(expr, arg);
        }

        public visitExists(expr: SQExistsExpr, arg: TArg): T {
            return this.visitDefault(expr, arg);
        }

        public visitNot(expr: SQNotExpr, arg: TArg): T {
            return this.visitDefault(expr, arg);
        }

        public visitStartsWith(expr: SQStartsWithExpr, arg: TArg): T {
            return this.visitDefault(expr, arg);
        }

        public visitConstant(expr: SQConstantExpr, arg: TArg): T {
            return this.visitDefault(expr, arg);
        }

        public visitDateSpan(expr: SQDateSpanExpr, arg: TArg): T {
            return this.visitDefault(expr, arg);
        }

        public visitDateAdd(expr: SQDateAddExpr, arg: TArg): T {
            return this.visitDefault(expr, arg);
        }

        public visitNow(expr: SQNowExpr, arg: TArg): T {
            return this.visitDefault(expr, arg);
        }

        public visitDefaultValue(expr: SQDefaultValueExpr, arg: TArg): T {
            return this.visitDefault(expr, arg);
        }

        public visitAnyValue(expr: SQAnyValueExpr, arg: TArg): T {
            return this.visitDefault(expr, arg);
        }

        public visitArithmetic(expr: SQArithmeticExpr, arg: TArg): T {
            return this.visitDefault(expr, arg);
        }

        public visitFillRule(expr: SQFillRuleExpr, arg: TArg): T {
            return this.visitDefault(expr, arg);
        }

        public visitResourcePackageItem(expr: SQResourcePackageItemExpr, arg: TArg): T {
            return this.visitDefault(expr, arg);
        }

        public visitScopedEval(expr: SQScopedEvalExpr, arg: TArg): T {
            return this.visitDefault(expr, arg);
        }
        
        public visitWithRef(expr: SQWithRefExpr, arg: TArg): T {
            return this.visitDefault(expr, arg);
        }

        public visitTransformTableRef(expr: SQTransformTableRefExpr, arg: TArg): T {
            return this.visitDefault(expr, arg);
        }

        public visitTransformOutputRoleRef(expr: SQTransformOutputRoleRefExpr, arg: TArg): T {
            return this.visitDefault(expr, arg);
        }

        public visitDefault(expr: SQExpr, arg: TArg): T {
            return;
        }
    }

    /** Default ISQExprVisitor implementation that others may derive from. */
    export class DefaultSQExprVisitor<T> extends DefaultSQExprVisitorWithArg<T, void> implements ISQExprVisitor<T> {
    }

    /** Default ISQExprVisitor implementation that implements default traversal and that others may derive from. */
    export class DefaultSQExprVisitorWithTraversal implements ISQExprVisitor<void>, IFillRuleDefinitionVisitor<void, void> {
        public visitEntity(expr: SQEntityExpr): void {
            this.visitDefault(expr);
        }

        public visitColumnRef(expr: SQColumnRefExpr): void {
            expr.source.accept(this);
        }

        public visitMeasureRef(expr: SQMeasureRefExpr): void {
            expr.source.accept(this);
        }

        public visitAggr(expr: SQAggregationExpr): void {
            expr.arg.accept(this);
        } 

        public visitPercentile(expr: SQPercentileExpr): void {
            expr.arg.accept(this);
        }

        public visitHierarchy(expr: SQHierarchyExpr): void {
            expr.arg.accept(this);
        }

        public visitHierarchyLevel(expr: SQHierarchyLevelExpr): void {
            expr.arg.accept(this);
        }

        public visitPropertyVariationSource(expr: SQPropertyVariationSourceExpr): void {
            expr.arg.accept(this);
        }

        public visitSelectRef(expr: SQSelectRefExpr): void {
            this.visitDefault(expr);
        }

        public visitBetween(expr: SQBetweenExpr): void {
            expr.arg.accept(this);
            expr.lower.accept(this);
            expr.upper.accept(this);
        }

        public visitIn(expr: SQInExpr): void {
            let args = expr.args;
            for (let i = 0, len = args.length; i < len; i++)
                args[i].accept(this);

            let values = expr.values;
            for (let i = 0, len = values.length; i < len; i++) {
                let valueTuple = values[i];
                for (let j = 0, jlen = valueTuple.length; j < jlen; j++)
                    valueTuple[j].accept(this);
            }
        }

        public visitAnd(expr: SQAndExpr): void {
            expr.left.accept(this);
            expr.right.accept(this);
        }

        public visitOr(expr: SQOrExpr): void {
            expr.left.accept(this);
            expr.right.accept(this);
        }

        public visitCompare(expr: SQCompareExpr): void {
            expr.left.accept(this);
            expr.right.accept(this);
        }

        public visitContains(expr: SQContainsExpr): void {
            expr.left.accept(this);
            expr.right.accept(this);
        }

        public visitExists(expr: SQExistsExpr): void {
            expr.arg.accept(this);
        }

        public visitNot(expr: SQNotExpr): void {
            expr.arg.accept(this);
        }

        public visitStartsWith(expr: SQStartsWithExpr): void {
            expr.left.accept(this);
            expr.right.accept(this);
        }

        public visitConstant(expr: SQConstantExpr): void {
            this.visitDefault(expr);
        }

        public visitDateSpan(expr: SQDateSpanExpr): void {
            expr.arg.accept(this);
        }

        public visitDateAdd(expr: SQDateAddExpr): void {
            expr.arg.accept(this);
        }

        public visitNow(expr: SQNowExpr): void {
            this.visitDefault(expr);
        }

        public visitDefaultValue(expr: SQDefaultValueExpr): void {
            this.visitDefault(expr);
        }

        public visitAnyValue(expr: SQAnyValueExpr): void {
            this.visitDefault(expr);
        }

        public visitArithmetic(expr: SQArithmeticExpr): void {
            expr.left.accept(this);
            expr.right.accept(this);
        }

        public visitFillRule(expr: SQFillRuleExpr): void {
            expr.input.accept(this);

            let rule = expr.rule,
                gradient2 = rule.linearGradient2,
                gradient3 = rule.linearGradient3;

            if (gradient2) {
                this.visitLinearGradient2(gradient2);
            }

            if (gradient3) {
                this.visitLinearGradient3(gradient3);
            }
        }

        public visitLinearGradient2(gradient2: LinearGradient2Definition): void {
            debug.assertValue(gradient2, 'gradient2');

            this.visitFillRuleStop(gradient2.min);
            this.visitFillRuleStop(gradient2.max);
        }

        public visitLinearGradient3(gradient3: LinearGradient3Definition): void {
            debug.assertValue(gradient3, 'gradient3');

            this.visitFillRuleStop(gradient3.min);
            this.visitFillRuleStop(gradient3.mid);
            this.visitFillRuleStop(gradient3.max);
        }

        public visitResourcePackageItem(expr: SQResourcePackageItemExpr): void {
            this.visitDefault(expr);
        }

        public visitScopedEval(expr: SQScopedEvalExpr): void {
            expr.expression.accept(this);

            for (let scopeExpr of expr.scope) {
                scopeExpr.accept(this);
            }
        }
        
        public visitWithRef(expr: SQWithRefExpr): void {
            this.visitDefault(expr);
        }

        public visitTransformTableRef(expr: SQTransformTableRefExpr): void {
            this.visitDefault(expr);
        }

        public visitTransformOutputRoleRef(expr: SQTransformOutputRoleRefExpr): void {
            this.visitDefault(expr);
        }

        public visitDefault(expr: SQExpr): void {
            return;
        }

        private visitFillRuleStop(stop: RuleColorStopDefinition): void {
            debug.assertValue(stop, 'stop');

            stop.color.accept(this);

            let value = stop.value;
            if (value)
                value.accept(this);
        }
    }
} 