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

module powerbi.visuals.sampleDataViews {
    import DataViewTransform = powerbi.data.DataViewTransform;

    export class MapByYearData extends SampleDataViews implements ISampleDataViewsMethods {

        public name: string = "MapByYearData";
        public displayName: string = "Data By Year";

        public visuals: string[] = ['heatMap'];

        private sampleData = [
            [10, 60, 78, 150, 500, 300], //x-coordinates
            [500, 300, 14, 50, 250, 300], //y-coordinates
            [0, 1, 0.5, 1, 0.1, 0.8] //intensity
        ];
        
        private sampleMin: number = 0;
        private sampleMax: number = 600;

        private sampleSingleData: number = 50;

        public getDataViews(): DataView[] {

            var fieldExpr = powerbi.data.SQExprBuilder.fieldExpr({ column: { schema: 's', entity: "table1", name: "year" } });

            var categoryValues = ["1", "2", "3", "4", "5", "6"];
            var categoryIdentities = categoryValues.map(function (value) {
                var expr = powerbi.data.SQExprBuilder.equal(fieldExpr, powerbi.data.SQExprBuilder.text(value));
                return powerbi.data.createDataViewScopeIdentity(expr);
            });
        
            // Metadata, describes the data columns, and provides the visual with hints
            // so it can decide how to best represent the data
            var dataViewMetadata: powerbi.DataViewMetadata = {
                columns: [
                    {
                        displayName: 'Index',
                        queryName: 'Index',
                        type: powerbi.ValueType.fromDescriptor({ text: true })
                    },
                    {
                        displayName: 'X coordinates',
                        isMeasure: true,
                        format: "#",
                        queryName: 'xcoordinates',
                        type: powerbi.ValueType.fromDescriptor({ numeric: true }),
                        objects: { dataPoint: { fill: { solid: { color: 'purple' } } } },
                    },
                    {
                        displayName: 'Y Coordinates',
                        isMeasure: true,
                        format: "#",
                        queryName: 'ycoordinates',
                        type: powerbi.ValueType.fromDescriptor({ numeric: true })
                    },
                    {
                        displayName: 'Intensity',
                        isMeasure: true,
                        format: "#",
                        queryName: 'intensity',
                        type: powerbi.ValueType.fromDescriptor({ numeric: true })
                    }
                ]
            };

            var columns = [
                {
                    source: dataViewMetadata.columns[1],
                    // X coordinates 
                    values: this.sampleData[0],
                },
                {
                    source: dataViewMetadata.columns[2],
                    // Y coordinates 
                    values: this.sampleData[1],
                },
                {
                    source: dataViewMetadata.columns[3],
                    // intensity
                    values: this.sampleData[2],
                }
            ];

            var dataValues: DataViewValueColumns = DataViewTransform.createValueColumns(columns);
            
            var tableDataValues = categoryValues.map(function (year, idx) {
                return [year, columns[0].values[idx], columns[1].values[idx]];
            });

            return [{
                metadata: dataViewMetadata,
                categorical: {
                    categories: [{
                        source: dataViewMetadata.columns[0],
                        values: categoryValues,
                        identity: categoryIdentities,
                    }],
                    values: dataValues
                },
                table: {
                    rows: tableDataValues,
                    columns: dataViewMetadata.columns,
                },
                single: { value: this.sampleSingleData }
            }];
        }

        
        public randomize(): void {

            this.sampleData = this.sampleData.map((item) => {
                return item.map(() => this.getRandomValue(this.sampleMin, this.sampleMax));
            });

            this.sampleSingleData = this.getRandomValue(this.sampleMin, this.sampleMax);
        }
        
    }
}