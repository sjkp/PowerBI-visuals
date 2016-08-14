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
    export module DataViewSelfCrossJoin {
        /**
         * Returns a new DataView based on the original, with a single DataViewCategorical category that is "cross joined"
         * to itself as a value grouping.
         * This is the mathematical equivalent of taking an array and turning it into an identity matrix.
         */
        export function apply(dataView: DataView): DataView {
            debug.assertValue(dataView, 'dataView');

            if (!dataView.categorical)
                return;
            let dataViewCategorical = dataView.categorical;
            if (!dataViewCategorical.categories || dataViewCategorical.categories.length !== 1)
                return;
            if (dataViewCategorical.values && dataViewCategorical.values.source)
                return;

            return applyCategorical(dataView.metadata, dataViewCategorical);
        }

        function applyCategorical(dataViewMetadata: DataViewMetadata, dataViewCategorical: DataViewCategorical): DataView {
            debug.assertValue(dataViewMetadata, 'dataViewMetadata');
            debug.assertValue(dataViewCategorical, 'dataViewCategorical');
            debug.assertValue(dataViewCategorical.categories, 'dataViewCategorical.categories');

            let category = dataViewCategorical.categories[0],
                categoryValues = category.values,
                categoryLength = categoryValues.length;

            if (categoryLength === 0)
                return;

            let valuesArray: DataViewValueColumn[] = dataViewCategorical.values
                ? dataViewCategorical.values.grouped()[0].values
                : [];
            let transformedDataView = createCategoricalDataViewBuilder()
                .withCategories(dataViewCategorical.categories)
                .withGroupedValues(createGroupedValues(category, categoryValues, categoryLength, valuesArray))
                .build();

            dataViewMetadata = Prototype.inherit(dataViewMetadata);
            dataViewMetadata.columns = transformedDataView.metadata.columns;

            return {
                metadata: dataViewMetadata,
                categorical: transformedDataView.categorical,
            };
        }

        function createGroupedValues(
            category: DataViewCategoryColumn,
            categoryValues: any[],
            categoryLength: number,
            valuesArray: DataViewValueColumn[]): DataViewBuilderGroupedValuesOptions {
            debug.assertValue(category, 'category');
            debug.assertValue(categoryValues, 'categoryValues');
            debug.assertValue(categoryLength, 'categoryLength');
            debug.assertValue(valuesArray, 'valuesArray');

            let nullValuesArray: any[] = createNullValues(categoryLength),
                valuesArrayLen = valuesArray.length,
                seriesData: DataViewBuilderSeriesData[][] = [];

            for (let i = 0; i < categoryLength; i++) {
                let seriesDataItem: DataViewBuilderSeriesData[] = [];

                for (let j = 0; j < valuesArrayLen; j++) {
                    let originalValueColumn = valuesArray[j],
                        originalHighlightValues = originalValueColumn.highlights;

                    let seriesDataItemCategory: DataViewBuilderSeriesData = {
                        values: inheritArrayWithValue(nullValuesArray, originalValueColumn.values, i),
                    };
                    if (originalHighlightValues)
                        seriesDataItemCategory.highlights = inheritArrayWithValue(nullValuesArray, originalHighlightValues, i);

                    seriesDataItem.push(seriesDataItemCategory);
                }

                seriesData.push(seriesDataItem);
            }

            return {
                groupColumn: {
                    source: category.source,
                    identityFrom: { fields: <SQExpr[]>category.identityFields, identities: category.identity },
                    values: category.values,
                },
                valueColumns: _.map(valuesArray, v => <DataViewBuilderColumnOptions>{ source: v.source }),
                data: seriesData,
            };
        }
    }

    function createNullValues(length: number): any[] {
        debug.assertValue(length, 'length');

        let array = new Array(length);
        for (let i = 0; i < length; i++)
            array[i] = null;
        return array;
    }

    function inheritArrayWithValue(nullValues: any[], original: any[], index: number): any[] {
        let inherited = Prototype.inherit(nullValues);
        inherited[index] = original[index];

        return inherited;
    }
}