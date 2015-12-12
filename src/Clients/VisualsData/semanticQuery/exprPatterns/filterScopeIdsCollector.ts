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

    export interface FilterValueScopeIdsContainer {
            isNot: boolean;
            scopeIds: DataViewScopeIdentity[];
        }

    export module SQExprConverter {
        export function asScopeIdsContainer(filter: SemanticFilter, fieldSQExprs: SQExpr[]): FilterValueScopeIdsContainer {
            debug.assertValue(filter, 'filter');
            debug.assertValue(fieldSQExprs, 'fieldSQExprs');
            debug.assert(fieldSQExprs.length > 0, 'There should be at least 1 field expression.');

            let filterItems = filter.conditions();
            debug.assert(filterItems.length === 1, 'There should be exactly 1 filter expression.');
            let filterItem = filterItems[0];
            if (filterItem) {
                let visitor = new FilterScopeIdsCollectorVisitor(fieldSQExprs);
                if (filterItem.accept(visitor))
                    return visitor.getResult();
            }
        }

        /** Gets a comparand value from the given DataViewScopeIdentity. */
        export function getFirstComparandValue(identity: DataViewScopeIdentity): any {
            debug.assertValue(identity, 'identity');

            let comparandExpr = identity.expr.accept(new FindComparandVisitor());
            if (comparandExpr)
                return comparandExpr.value;
        }
    }

    /** Collect filter values from simple semantic filter that is similar to 'is any of' or 'is not any of', getResult() returns a collection of scopeIds.**/
    class FilterScopeIdsCollectorVisitor extends DefaultSQExprVisitor<boolean>{
        private isRoot: boolean;
        private isNot: boolean;
        private keyExprsCount: number;
        private valueExprs: SQExpr[];
        private fieldExprs: SQExpr[];

        constructor(fieldSQExprs:SQExpr[]) {
            super();
            this.isRoot = true;
            this.isNot = false;
            this.keyExprsCount = null;
            this.valueExprs = [];
            // Need to drop the entitylet before create the scopeIdentity. The ScopeIdentity created on the client is used to
            // compare the ScopeIdentity came from the server. But server doesn't have the entity variable concept, so we will
            // need to drop it in order to use JsonComparer.
            this.fieldExprs = [];
            for (let field of fieldSQExprs) {
                this.fieldExprs.push(SQExprBuilder.removeEntityVariables(field));
            }
        }

        public getResult(): FilterValueScopeIdsContainer {
            debug.assert(this.fieldExprs.length > 0, 'fieldExprs has at least one fieldExpr');            

            let valueExprs = this.valueExprs,
                scopeIds: DataViewScopeIdentity[] = [];
            let valueCount: number = this.keyExprsCount || 1;

            for (let startIndex = 0, endIndex = valueCount, len = valueExprs.length; startIndex < len && endIndex <= len;) {
                let values = valueExprs.slice(startIndex, endIndex);
                scopeIds.push(FilterScopeIdsCollectorVisitor.getScopeIdentity(this.fieldExprs, values));
                startIndex += valueCount;
                endIndex += valueCount;
            }

            return {
                isNot: this.isNot,
                scopeIds: scopeIds,
            };
        }

        private static getScopeIdentity(fieldExprs: SQExpr[], valueExprs: SQExpr[]): DataViewScopeIdentity {
            debug.assert(valueExprs.length > 0, 'valueExprs has at least one valueExpr');
            debug.assert(valueExprs.length === fieldExprs.length, 'fieldExpr and valueExpr count should match');

            let compoundSQExpr: SQExpr;
            for (let i = 0, len = fieldExprs.length; i < len; i++) {
                let equalsExpr = SQExprBuilder.equal(fieldExprs[i], valueExprs[i]);
                if (!compoundSQExpr)
                    compoundSQExpr = equalsExpr;
                else
                    compoundSQExpr = SQExprBuilder.and(compoundSQExpr, equalsExpr);
            }

            return createDataViewScopeIdentity(compoundSQExpr);
        }

        public visitOr(expr: SQOrExpr): boolean {
            if (this.keyExprsCount !== null)
                return this.unsupportedSQExpr();

            this.isRoot = false;
            return expr.left.accept(this) && expr.right.accept(this);
        }

        public visitNot(expr: SQNotExpr): boolean {
            if (!this.isRoot)
                return this.unsupportedSQExpr();

            this.isNot = true;
            return expr.arg.accept(this);
        }

        public visitConstant(expr: SQConstantExpr): boolean {
            if (this.isRoot && expr.type.primitiveType === PrimitiveType.Null)
                return this.unsupportedSQExpr();

            this.valueExprs.push(expr);            
            return true;
        }

        public visitCompare(expr: SQCompareExpr): boolean {
            if (this.keyExprsCount !== null)
                return this.unsupportedSQExpr();

            this.isRoot = false;

            if (expr.kind !== QueryComparisonKind.Equal)
                return this.unsupportedSQExpr();

            return expr.left.accept(this) && expr.right.accept(this);
        }

        public visitIn(expr: SQInExpr): boolean {
            this.keyExprsCount = 0;
            let result: boolean;
            this.isRoot = false;
            for (let arg of expr.args) {
                result = arg.accept(this);
                if (!result)
                    return this.unsupportedSQExpr();

                this.keyExprsCount++;
            }

            if (this.keyExprsCount !== this.fieldExprs.length)
                return this.unsupportedSQExpr();

            let values = expr.values;
            for (let valueTuple of values) {
                let jlen = valueTuple.length;
                debug.assert(jlen === this.keyExprsCount, "keys count and values count should match");

                for (let value of valueTuple) {
                    result = value.accept(this);
                    if (!result)
                        return this.unsupportedSQExpr();
                }
            }

            return result;
        }

        public visitColumnRef(expr: SQColumnRefExpr): boolean {
            if (this.isRoot)
                return this.unsupportedSQExpr();

            let fixedExpr = SQExprBuilder.removeEntityVariables(expr);
            if (this.keyExprsCount !== null)
                return SQExpr.equals(this.fieldExprs[this.keyExprsCount], fixedExpr);

            return SQExpr.equals(this.fieldExprs[0], fixedExpr);
        }

        public visitDefaultValue(expr: SQDefaultValueExpr): boolean {
            if (this.isRoot || this.keyExprsCount !== null)
                return this.unsupportedSQExpr();

            this.valueExprs.push(expr);
            return true;
        }

        public visitAnyValue(expr: SQAnyValueExpr): boolean {
            if (this.isRoot || this.keyExprsCount !== null)
                return this.unsupportedSQExpr();

            this.valueExprs.push(expr);
            return true;
        }

        public visitDefault(expr: SQExpr): boolean {
            return this.unsupportedSQExpr();
        }

        private unsupportedSQExpr(): boolean {
            return false;
        }
    }

    class FindComparandVisitor extends DefaultSQExprVisitor<SQConstantExpr> {
        public visitAnd(expr: SQAndExpr): SQConstantExpr {
            return expr.left.accept(this) || expr.right.accept(this);
        }

        public visitCompare(expr: SQCompareExpr): SQConstantExpr {
            if (expr.kind === QueryComparisonKind.Equal) {
                if (expr.right instanceof SQConstantExpr)
                    return <SQConstantExpr>expr.right;
                if (expr.left instanceof SQConstantExpr)
                    return <SQConstantExpr>expr.left;
            }
        }
    }
}
