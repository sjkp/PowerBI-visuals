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

    export class MekkoChartData extends DataViewBuilder {
        public static ColumnCategory: string = "Name";
        public static ColumnSeries: string = "Territory";
        public static ColumnY: string = "This Year Sales";
        public static ColumnWidth: string = "Sum Total Units This Year";

        public valuesCaregorySeries: string[][] = [
                ["William", "DE"],
                ["James", "GA"],
                ["Harper", "KY"],
                ["Aiden", "MD"],
                ["Lucas", "NC"],
                ["Daniel", "OH"],
                ["Henry", "PA"],
                ["Olivia", "SC"],
                ["Ella", "TN"],
                ["Carter", "VA"],
                ["Logan", "WV"],
                ["James", "TN"],
                ["Aiden", "DE"],
                ["Daniel", "KY"],
                ["Henry", "SC"],
                ["Olivia", "NC"],
                ["Ella", "VA"],
                ["Logan", "MD"],
        ];
        public valuesY: number[] = helpers.getRandomNumbers(this.valuesCaregorySeries.length, 1000, 100000);
        public valuesWidth: number[] = helpers.getRandomNumbers(this.valuesCaregorySeries.length, 1000, 100000);

        public getDataView(columnNames?: string[]): powerbi.DataView {
            return this.createCategoricalDataViewBuilder([
            {
                source: {
                    displayName: MekkoChartData.ColumnCategory,
                    roles: { Category: true },
                    type: ValueType.fromDescriptor({ text: true })
                },
                values: this.valuesCaregorySeries.map(x => x[0])
            },
            {
                isGroup: true,
                source: { 
                    displayName: MekkoChartData.ColumnSeries,
                    roles: { Series: true },
                    type: ValueType.fromDescriptor({ text: true })
                },
                values: this.valuesCaregorySeries.map(x => x[1]),
            }
            ],[
            {
                source: {
                    displayName: MekkoChartData.ColumnY,
                    format: "\"$\"#,##0;\\(\"$\"#,##0\\)",
                    roles: { Y: true },
                    isMeasure: true,
                    type: ValueType.fromDescriptor({ numeric: true })
                },
                values: this.valuesY
            },
            {
                source: {
                    displayName: MekkoChartData.ColumnWidth,
                    format: "\"$\"#,##0;\\(\"$\"#,##0\\)",
                    roles: { Width: true },
                    isMeasure: true,
                    type: ValueType.fromDescriptor({ numeric: true })
                },
                values: this.valuesWidth
            }], columnNames).build();
        }
    }
}