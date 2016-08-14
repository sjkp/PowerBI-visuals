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

module powerbitests.customVisuals.sampleDataViews {
    import ValueType = powerbi.ValueType;

    export class CarLogosData extends DataViewBuilder {
        public static ColumnCategory: string = "Category";
        public static ColumnValues: string = "Values";
        public static ColumnImage: string = "Image";

        public valuesCategory: string[] = ["BMW", "Mercedes", "Honda", "Toyota", "Ferrari"];
        public valuesValue: number[] = helpers.getRandomNumbers(this.valuesCategory.length, 1, 25);
        public valuesImage: string[] = [
                "https://raw.githubusercontent.com/Microsoft/PowerBI-visuals/resources/images/chicletSlicer/bmw.png",
                "https://raw.githubusercontent.com/Microsoft/PowerBI-visuals/resources/images/chicletSlicer/mercedes.png",
                "https://raw.githubusercontent.com/Microsoft/PowerBI-visuals/resources/images/chicletSlicer/honda.png",
                "https://raw.githubusercontent.com/Microsoft/PowerBI-visuals/resources/images/chicletSlicer/toyota.gif",
                "https://raw.githubusercontent.com/Microsoft/PowerBI-visuals/resources/images/chicletSlicer/ferrari.png"
            ];

        public getDataView(columnNames?: string[]): powerbi.DataView {
            return this.createCategoricalDataViewBuilder([
                {
                    source: {
                        displayName: CarLogosData.ColumnCategory,
                        roles: { Category: true },
                        type: this.valuesCategory
                    },
                    values: this.valuesCategory
                },
                {
                    isGroup: true,
                    source: { 
                        displayName: CarLogosData.ColumnImage,
                        roles: { Image: true },
                        type: ValueType.fromDescriptor({ text: true })
                    },
                    values: this.valuesImage
                }
                ],[
                {
                    source: {
                        displayName: CarLogosData.ColumnValues,
                        isMeasure: true,
                        roles: { Values: true },
                        type: ValueType.fromDescriptor({ numeric: true }),
                        objects: { dataPoint: { fill: { solid: { color: "purple" } } } },
                    },
                    values: this.valuesValue
                }], columnNames).build();
        }
    }
}