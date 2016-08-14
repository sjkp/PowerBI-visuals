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

module jasmine {
    import SQExpr = powerbi.data.SQExpr;

    export interface Matchers {
        /** Performs a deep comparison of all enumerable properties, including those defined by object prototypes. */
        toEqualSQExpr(expected: SQExpr): void;
    }

    beforeEach(() => {
        addMatchers({
            toEqualSQExpr: (util: MatchersUtil, customEqualityTesters: CustomEqualityTester[]): CustomMatcher => {
                return {
                    compare: (actual, expected) => toEqualSQExpr(util, actual, expected),
                };
            }
        });
    });

    function toEqualSQExpr(util: MatchersUtil, actual: any, expected: any): CustomMatcherResult {
        if (SQExpr.equals(actual, expected)) {
            return { pass: true };
        }

        return {
            pass: false,
            message: util.buildFailureMessage('to equal expr', false, actual, expected),
        };
    }
}