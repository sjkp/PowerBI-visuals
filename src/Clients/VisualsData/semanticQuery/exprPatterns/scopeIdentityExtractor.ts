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
    import ArrayExtensions = jsCommon.ArrayExtensions;

    /** Recognizes DataViewScopeIdentity expression trees to extract comparison keys. */
    export module ScopeIdentityExtractor {
        export function getKeys(expr: SQExpr): SQExpr[] {
            let extractor = new ScopeIdExtractorImpl();
            expr.accept(extractor);

            if (extractor.malformed)
                return null;

            return ArrayExtensions.emptyToNull(extractor.keys);
        }

        export function getInExpr(expr: SQExpr): SQInExpr{
            let extractor = new ScopeIdExtractorImpl();
            expr.accept(extractor);

            if (extractor.malformed)
                return;
            
            let keys = ArrayExtensions.emptyToNull(extractor.keys);
            let keyValues = ArrayExtensions.emptyToNull(extractor.values);

            if (keys && keyValues)
                return data.SQExprBuilder.inExpr(keys, [keyValues]);
        }

        /**
         * Recognizes expressions of the form:
         * 1) Equals(ColRef, Constant)
         * 2) And(Equals(ColRef1, Constant1), Equals(ColRef2, Constant2))
         * or And(And(Equals(ColRef1, Constant1), Equals(ColRef2, Constant2)), Equals(ColRef3, Constant3)) etc..
         */
        class ScopeIdExtractorImpl extends DefaultSQExprVisitor<void> {
            public keys: SQExpr[] = [];
            public values: SQConstantExpr[] = [];
            public malformed: boolean;

            public visitAnd(expr: SQAndExpr): void {
                expr.left.accept(this);
                expr.right.accept(this);
            }

            public visitCompare(expr: SQCompareExpr): void {
                if (expr.kind !== QueryComparisonKind.Equal) {
                    this.visitDefault(expr);
                    return;
                }
                debug.assert(expr.left instanceof SQExpr && expr.right instanceof SQConstantExpr, 'invalid compare expr operands');
                expr.left.accept(this);
                expr.right.accept(this);
            }

            public visitColumnRef(expr: SQColumnRefExpr): void {
                this.keys.push(expr);
            }

            public visitHierarchyLevel(expr: SQHierarchyLevelExpr): void {
                this.keys.push(expr);
            }

            public visitConstant(expr: SQConstantExpr): void {
                this.values.push(expr);
            }

            public visitDefault(expr: SQExpr): void {
                this.malformed = true;
            }
        }
    }
}