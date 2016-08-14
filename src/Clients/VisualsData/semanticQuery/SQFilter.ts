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
    import ArrayExtensions = jsCommon.ArrayExtensions;

    export module SQFilter {
        /**
         * Returns true if leftFilter and rightFilter have the same target and condition.
         */
        export function equals(leftFilter: SQFilter, rightFilter: SQFilter): boolean {
            debug.assertAnyValue(leftFilter, 'leftFilter');
            debug.assertAnyValue(rightFilter, 'rightFilter');
            
            // Normalize falsy to null
            if (!leftFilter) { leftFilter = null; }
            if (!rightFilter) { rightFilter = null; }
            
            if (leftFilter === rightFilter) {
                return true;
            }
            
            if (!!leftFilter !== !!rightFilter) {
                return false;
            }
                      
            if (!targetsEqual(leftFilter, rightFilter)) {
                return false;
            }
            
            return SQExpr.equals(leftFilter.condition, rightFilter.condition);
        }
        
        /**
         * Returns true if leftFilter and rightFilter have the same target.
         */
        export function targetsEqual(leftFilter: SQFilter, rightFilter: SQFilter): boolean {
            debug.assertValue(leftFilter, 'leftFilter');
            debug.assertValue(rightFilter, 'rightFilter');
            
            return ArrayExtensions.sequenceEqual<SQExpr>(leftFilter.target, rightFilter.target, SQExpr.equals);
        }
        
        export function contains(filters: SQFilter[], searchTarget: SQFilter): boolean {
            debug.assertAnyValue(filters, 'filters');
            debug.assertValue(searchTarget, 'searchTarget');
            
            return !_.isEmpty(filters) && 
                _.any(filters, (filter) => equals(filter, searchTarget));
        }
    }
}