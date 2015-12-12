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

module powerbi {
    import ArrayExtensions = jsCommon.ArrayExtensions;

    /** Encapsulates the identity of a data scope in a DataView. */
    export interface DataViewScopeIdentity {
        /** Predicate expression that identifies the scope. */
        expr: data.SQExpr;

        /** Key string that identifies the DataViewScopeIdentity to a string, which can be used for equality comparison. */
        key: string;
    }

    export module DataViewScopeIdentity {
        /** Compares the two DataViewScopeIdentity values for equality. */
        export function equals(x: DataViewScopeIdentity, y: DataViewScopeIdentity, ignoreCase?: boolean): boolean {
            // Normalize falsy to null
            x = x || null;
            y = y || null;

            if (x === y)
                return true;

            if (!x !== !y)
                return false;

            debug.assertValue(x, 'x');
            debug.assertValue(y, 'y');

            return data.SQExpr.equals(x.expr, y.expr, ignoreCase);
        }

        export function filterFromIdentity(identities: DataViewScopeIdentity[], isNot?: boolean): data.SemanticFilter {
            if (ArrayExtensions.isUndefinedOrEmpty(identities))
                return;
            
            let exprs: data.SQExpr[] = [];
            for (let identity of identities) {
                exprs.push(identity.expr);
            }

            return filterFromExprs(exprs, isNot);
        }

        export function filterFromExprs(orExprs: data.SQExpr[], isNot?: boolean): data.SemanticFilter {
            if (ArrayExtensions.isUndefinedOrEmpty(orExprs))
                return;

            let resultExpr: data.SQExpr;
            for (let orExpr of orExprs) {
                let inExpr = data.ScopeIdentityExtractor.getInExpr(orExpr);
                if (resultExpr)
                    resultExpr = data.SQExprBuilder.or(resultExpr, inExpr);
                else
                    resultExpr = inExpr || orExpr;
            }
            
            if (resultExpr) {
                if (isNot)
                    resultExpr = powerbi.data.SQExprBuilder.not(resultExpr);
            }

            return powerbi.data.SemanticFilter.fromSQExpr(resultExpr);
        }
    }

    export module data {
        import Lazy = jsCommon.Lazy;

        export function createDataViewScopeIdentity(expr: SQExpr): DataViewScopeIdentity {
            return new DataViewScopeIdentityImpl(expr);
        }

        class DataViewScopeIdentityImpl implements DataViewScopeIdentity {
            private _expr: SQExpr;
            private _key: Lazy<string>;

            public constructor(expr: SQExpr) {
                debug.assertValue(expr, 'expr');

                this._expr = expr;
                this._key = new Lazy(() => SQExprShortSerializer.serialize(expr));
            }

            public get expr(): SQExpr {
                return this._expr;
            }

            public get key(): string {
                return this._key.getValue();
            }
        }
    }
}
