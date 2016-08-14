﻿/*
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

module powerbitests.customVisuals.sampleDataViews {
    import ValueType = powerbi.ValueType;

    export class ProductSalesByDateData extends DataViewBuilder {
        public static ColumnCategory: string = "Date";
        public static ColumnValues1: string = "Product sales 1";
        public static ColumnValues2: string = "Product sales 2";
        public static ColumnValues3: string = "Product sales 3";
        public static ColumnValues4: string = "Product sales 4";

        public valuesDate: Date[] = helpers.getRandomUniqueSortedDates(50, new Date(2014,0,1), new Date(2015,5,10));
        public valuesSales1: number[] = helpers.getRandomNumbers(this.valuesDate.length);
        public valuesSales2: number[] = helpers.getRandomNumbers(this.valuesDate.length);
        public valuesSales3: number[] = helpers.getRandomNumbers(this.valuesDate.length);
        public valuesSales4: number[] = helpers.getRandomNumbers(this.valuesDate.length);

        public getDataView(columnNames?: string[]): powerbi.DataView {
            return this.createCategoricalDataViewBuilder([
                {
                    source: {
                        displayName: ProductSalesByDateData.ColumnCategory,
                        type: ValueType.fromDescriptor({ dateTime: true })
                    },
                    values: this.valuesDate
                }
                ],[
                {
                    source: {
                        displayName: ProductSalesByDateData.ColumnValues1,
                        isMeasure: true,
                        format: "$0,000.00",
                        groupName: "Product",
                        type: ValueType.fromDescriptor({ numeric: true }),
                    },
                    values: this.valuesSales1
                },
                {
                    source: {
                        displayName: ProductSalesByDateData.ColumnValues2,
                        isMeasure: true,
                        format: "$0,000.00",
                        groupName: "Product",
                        type: ValueType.fromDescriptor({ numeric: true }),
                    },
                    values: this.valuesSales1
                },
                {
                    source: {
                        displayName: ProductSalesByDateData.ColumnValues3,
                        isMeasure: true,
                        format: "$0,000.00",
                        groupName: "Product",
                        type: ValueType.fromDescriptor({ numeric: true }),
                    },
                    values: this.valuesSales2
                },
                {
                    source: {
                        displayName: ProductSalesByDateData.ColumnValues4,
                        isMeasure: true,
                        format: "$0,000.00",
                        groupName: "Product",
                        type: ValueType.fromDescriptor({ numeric: true }),
                    },
                    values: this.valuesSales3
                }
                ], columnNames).build();
        }
    }
}
