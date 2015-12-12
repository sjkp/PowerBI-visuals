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

/// <reference path="../../_references.ts"/>

module powerbi.data {
    /** Responsible for writing equality comparisons against a field to an SQInExpr. */
    export module EqualsToInRewriter {
        export function run(expr: SQExpr): SQExpr {
            debug.assertValue(expr, 'expr');

            return expr.accept(new Rewriter());
        }

        class Rewriter extends SQExprRewriter {
            private current: InBuilder;

            constructor() {
                super();
            }

            public visitCompare(expr: SQCompareExpr): SQExpr {
                if (expr.kind !== QueryComparisonKind.Equal)
                    return this.visitUnsupported(expr);
                if (!this.isSupported(expr.left) || !this.isSupported(expr.right))
                    return this.visitUnsupported(expr);

                let leftIsComparand = this.isComparand(expr.left);
                let rightIsComparand = this.isComparand(expr.right);
                if (leftIsComparand === rightIsComparand)
                    return this.visitUnsupported(expr);

                let operand: SQExpr = leftIsComparand
                    ? expr.left
                    : expr.right;
                let value: SQExpr = leftIsComparand
                    ? expr.right
                    : expr.left;

                let current = this.current;
                if (!current) {
                    return SQExprBuilder.inExpr([operand], [[value]]);
                }

                current.add(operand, value);

                return expr;
            }

            public visitOr(expr: SQOrExpr): SQExpr {
                if (!this.isSupported(expr.left) || !this.isSupported(expr.right))
                    return this.visitUnsupported(expr);

                let current: InBuilder;
                if (!this.current) {
                    current = this.current = new InBuilder();
                }

                expr.left.accept(this);
                expr.right.accept(this);

                if (current) {
                    this.current = null;
                    return current.complete() || expr;
                }

                return expr;
            }

            public visitAnd(expr: SQAndExpr): SQExpr {
                if (!this.isSupported(expr.left) || !this.isSupported(expr.right))
                    return this.visitUnsupported(expr);

                let current = this.current;
                if (current) {
                    // NOTE: Composite keys are not supported by this algorithm.
                    current.cancel();
                    return expr;
                }

                return super.visitAnd(expr);
            }

            private visitUnsupported(expr: SQExpr): SQExpr {
                let current = this.current;
                if (current)
                    current.cancel();

                return expr;
            }

            private isSupported(expr: SQExpr): boolean {
                debug.assertValue(expr, 'expr');

                return expr instanceof SQCompareExpr
                    || expr instanceof SQColumnRefExpr
                    || expr instanceof SQConstantExpr
                    || expr instanceof SQHierarchyLevelExpr
                    || expr instanceof SQOrExpr
                    || expr instanceof SQAndExpr;
            }

            private isComparand(expr: SQExpr): boolean {
                return expr instanceof SQColumnRefExpr
                    || expr instanceof SQHierarchyLevelExpr;
            }
        }

        class InBuilder {
            private operand: SQExpr;
            private values: SQExpr[];
            private cancelled: boolean;

            public add(operand: SQExpr, value: SQExpr): void {
                debug.assertValue(operand, 'operand');
                debug.assertValue(value, 'value');

                if (this.cancelled)
                    return;

                if (this.operand && !SQExpr.equals(operand, this.operand)) {
                    this.cancel();
                    return;
                }

                this.operand = operand;

                let values = this.values;
                if (!values)
                    values = this.values = [];

                values.push(value);
            }

            public cancel(): void {
                this.cancelled = true;
            }

            public complete(): SQInExpr {
                if (this.cancelled || !this.operand)
                    return;

                return SQExprBuilder.inExpr([this.operand], _.map(this.values, v => [v]));
            }
        }
    }
}