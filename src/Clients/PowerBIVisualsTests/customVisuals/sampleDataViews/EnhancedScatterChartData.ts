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
    import EnhancedScatterChart = powerbi.visuals.samples.EnhancedScatterChart;

    export class EnhancedScatterChartData extends DataViewBuilder {
        public static ColumnCategoryDisplayName: string = "Date";
        public static ColumnSeriesDisplayName: string = "Country";

        public static ColumnCategory: string = EnhancedScatterChart.ColumnCategory;
        public static ColumnX: string = EnhancedScatterChart.ColumnX;
        public static ColumnY: string = EnhancedScatterChart.ColumnY;
        public static ColumnSize: string = EnhancedScatterChart.ColumnSize;
        public static ColumnColorFill: string = EnhancedScatterChart.ColumnColorFill;
        public static ColumnImage: string = EnhancedScatterChart.ColumnImage;
        public static ColumnBackdrop: string = EnhancedScatterChart.ColumnBackdrop;
        public static ColumnRotation: string = EnhancedScatterChart.ColumnRotation;

        public static DefaultSetOfColumns: string[] = [
            EnhancedScatterChartData.ColumnCategoryDisplayName,
            EnhancedScatterChartData.ColumnSeriesDisplayName,
            EnhancedScatterChartData.ColumnX,
            EnhancedScatterChartData.ColumnY,
            EnhancedScatterChartData.ColumnSize
        ];

        public valuesCategory: Date[] = helpers.getDateYearRange(new Date(2016, 0, 1), new Date(2019, 0, 10), 1);

        public valuesSeries: string[] = [
            "Access",
            "OneNote",
            "Outlook"
        ];

        public valuesX: number[] = helpers.getRandomUniqueNumbers(this.valuesCategory.length, 100, 1000);
        public valuesY: number[] = helpers.getRandomUniqueNumbers(this.valuesCategory.length, 100, 1000);
        public valuesSize: number[] = helpers.getRandomUniqueNumbers(this.valuesCategory.length, 10, 20);

        public colorValues: string[] = ["red", "green", "blue"];

        public imageValues: string[] = [
            "https://raw.githubusercontent.com/Microsoft/PowerBI-visuals/resources/images/reports/ImageViewer/Microsoft_Access.png",
            "https://raw.githubusercontent.com/Microsoft/PowerBI-visuals/resources/images/reports/ImageViewer/Microsoft_OneNote.png",
            "https://raw.githubusercontent.com/Microsoft/PowerBI-visuals/resources/images/reports/ImageViewer/Microsoft_Outlook.png"
        ];

        public rotationValues: number[] = helpers.getRandomUniqueNumbers(this.valuesCategory.length, 100, 1000);

        public getDataView(columnNames: string[] = EnhancedScatterChartData.DefaultSetOfColumns): powerbi.DataView {
            return this.createCategoricalDataViewBuilder([
                {
                    source: {
                        displayName: EnhancedScatterChartData.ColumnCategoryDisplayName,
                        roles: { [EnhancedScatterChartData.ColumnCategory]: true },
                        type: ValueType.fromDescriptor({ dateTime: true })
                    },
                    values: this.valuesCategory
                },
                {
                    isGroup: true,
                    source: {
                        displayName: EnhancedScatterChartData.ColumnSeriesDisplayName,
                        type: ValueType.fromDescriptor({ text: true })
                    },
                    values: this.valuesSeries,
                },
                {
                    source: {
                        displayName: EnhancedScatterChartData.ColumnColorFill,
                        roles: { [EnhancedScatterChartData.ColumnColorFill]: true },
                        type: ValueType.fromDescriptor({ text: true })
                    },
                    values: this.colorValues
                },
                {
                    source: {
                        displayName: EnhancedScatterChartData.ColumnImage,
                        roles: { [EnhancedScatterChartData.ColumnImage]: true },
                        type: ValueType.fromDescriptor({ text: true })
                    },
                    values: this.imageValues
                },
                {
                    source: {
                        displayName: EnhancedScatterChartData.ColumnBackdrop,
                        roles: { [EnhancedScatterChartData.ColumnBackdrop]: true },
                        type: ValueType.fromDescriptor({ text: true })
                    },
                    values: this.imageValues
                }
            ], [
                {
                    source: {
                        displayName: EnhancedScatterChartData.ColumnX,
                        format: '#,0.00',
                        isMeasure: true,
                        roles: { [EnhancedScatterChartData.ColumnX]: true },
                    },
                    values: this.valuesX
                },
                {
                    source: {
                        displayName: EnhancedScatterChartData.ColumnY,
                        format: '#,0',
                        isMeasure: true,
                        roles: { [EnhancedScatterChartData.ColumnY]: true },
                    },
                    values: this.valuesY
                },
                {
                    source: {
                        displayName: EnhancedScatterChartData.ColumnSize,
                        format: '#,0',
                        isMeasure: true,
                        roles: { [EnhancedScatterChartData.ColumnSize]: true },
                    },
                    values: this.valuesSize
                },
                {
                    source: {
                        displayName: EnhancedScatterChartData.ColumnRotation,
                        format: '#,0',
                        isMeasure: true,
                        roles: { [EnhancedScatterChartData.ColumnRotation]: true },
                    },
                    values: this.rotationValues
                }
            ], columnNames).build();
        }
    }
}
