/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 31*  All rights reserved. 
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
    import ArrayExtensions = jsCommon.ArrayExtensions;

    export module SQUtils {
        export function sqSortDefinitionEquals(left: SQSortDefinition, right: SQSortDefinition): boolean {
            if (!left && !right)
                return true;

            if (left && right) {
                return left.direction === right.direction && SQExpr.equals(left.expr, right.expr);
            }

            return false;
        }

        export function namedSQExprEquals(left: NamedSQExpr, right: NamedSQExpr): boolean {
            if (!left && !right)
                return true;

            // ignores name of NamedSQExpr
            if (left && right) {
                return SQExpr.equals(left.expr, right.expr);
            }

            return false;
        }

        export function sqTransformTableColumnsEquals(left: SQTransformTableColumn, right: SQTransformTableColumn): boolean {
            if (!left && !right)
                return true;

            if (left && right) {
                return left.role === right.role && namedSQExprEquals(left.expression, right.expression);
            }

            return false;
        }

        export function sqTransformTableEquals(left: SQTransformTable, right: SQTransformTable): boolean {
            if (!left && !right)
                return true;

            if (left && right) {
                return ArrayExtensions.sequenceEqual(
                    left.columns,
                    right.columns,
                    (left: SQTransformTableColumn, right: SQTransformTableColumn) => sqTransformTableColumnsEquals(left, right));
            }

            return false;
        }

        export function sqTransformInputEquals(left: SQTransformInput, right: SQTransformInput): boolean {
            if (!left && !right)
                return true;

            if (left && right) {
                return ArrayExtensions.sequenceEqual(
                    left.parameters,
                    right.parameters,
                    (left: NamedSQExpr, right: NamedSQExpr) => namedSQExprEquals(left, right))
                    && sqTransformTableEquals(left.table, right.table);
            }

            return false;
        }

        export function sqTransformOutputEquals(left: SQTransformOutput, right: SQTransformOutput): boolean {
            if (!left && !right)
                return true;

            if (left && right) {
                return sqTransformTableEquals(left.table, right.table);
            }

            return false;
        }

        export function sqTransformEquals(left: SQTransform, right: SQTransform): boolean {
            if (!left && !right)
                return true;

            if (left && right) {
                return left.algorithm === right.algorithm &&
                    sqTransformInputEquals(left.input, right.input) &&
                    sqTransformOutputEquals(left.output, right.output);
            }

            return false;
        }
    }
}