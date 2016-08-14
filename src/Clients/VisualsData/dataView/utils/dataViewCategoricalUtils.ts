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
    import inheritSingle = Prototype.inheritSingle;

    export module DataViewCategoricalUtils {
        export function getCategoriesDataViewObjects(categories: DataViewCategoryColumn[]): DataViewObjects[] {
            debug.assertValue(categories, 'categories');

            // See comments on setCategoriesDataViewObjects(...)
            return !_.isEmpty(categories) && categories[0].objects; 
        }

        /**
         * In DataViewCategorical.categories, all columns have the same identity array, but any applicable DataViewObjects would be added to the first column only.
         *
         * If prototypeCategories is non-empty and is not an inherited object, returns the inherited version of prototypeCategories that has the objects set on its first column.
         * Else, if prototypeCategories is non-empty and is already an inherited object, returns prototypeCategories that has the objects set on its first column.
         * Else, if prototypeCategories is an empty array, returns undefined.
         *
         * Related code: DataViewTransform.findSelectedCategoricalColumn(...)
         */
        export function setCategoriesDataViewObjects(prototypeCategories: DataViewCategoryColumn[], objects: DataViewObjects[]): DataViewCategoryColumn[] {
            debug.assertValue(prototypeCategories, 'prototypeCategories');
            debug.assertValue(objects, 'objects');

            if (!_.isEmpty(prototypeCategories)) {
                let transformedCategories = inheritSingle(prototypeCategories);
                let firstCategoryColumn = transformedCategories[0] = inheritSingle(transformedCategories[0]);
                firstCategoryColumn.objects = objects;

                return transformedCategories;
            }
        }
    }
} 