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

    export class BulletChartData extends SampleDataViews implements ISampleDataViewsMethods {

        public name: string = "BulletChartData";
        public displayName: string = "Revenue Data";

        public visuals: string[] = ['bulletChart'];

        // Total, Net, Gross
        private sampleData = [
            [46000, 35000, 28000], // Values
            [45000, 41000, 32000], // Targets
            [0, 0, 0], // Targets2
            [20000, 20000, 10000], // Min
            [25000, 25000, 15000], // NeedsImprovement
            [30000, 30000, 22000], // Satisfactory
            [40000, 40000, 30000], // Good
            [50000, 45000, 35000], // VeryGood
            [60000, 50000, 40000] // Max
        ];

        private sampleMins: number[] = [20000, 30000, 0, 10000, 25000, 29000, 36000, 45000, 52000];
        private sampleMaxs: number[] = [52000, 40000, 60000, 20000, 28000, 35000, 42000, 50000, 60000];

        public getDataViews(): DataView[] {

            let fieldExpr = powerbi.data.SQExprBuilder.fieldExpr({ column: { schema: 's', entity: "table1", name: "revenue" } });

            let categoryValues = ["Total", "Net", "Gross"];
            let categoryIdentities = categoryValues.map(function (value) {
                let expr = powerbi.data.SQExprBuilder.equal(fieldExpr, powerbi.data.SQExprBuilder.text(value));
                return powerbi.data.createDataViewScopeIdentity(expr);
            });

            // Metadata, describes the data columns, and provides the visual with hints
            // so it can decide how to best represent the data
            let dataViewMetadata: powerbi.DataViewMetadata = {
                columns: [
                    {
                        displayName: 'Metric', queryName: 'Metric', type: powerbi.ValueType.fromDescriptor({ text: true }),
                        roles: { "Category": true }
                    },
                    {
                        displayName: 'Value', queryName: 'Value', isMeasure: true, type: powerbi.ValueType.fromDescriptor({ numeric: true }),
                        roles: { "Value": true }
                    },
                    {
                        displayName: 'TargetValue', queryName: 'TargetValue', isMeasure: true, type: powerbi.ValueType.fromDescriptor({ numeric: true }),
                        roles: { "TargetValue": true }
                    },
                    {
                        displayName: 'TargetValue2', queryName: 'TargetValue2', isMeasure: true, type: powerbi.ValueType.fromDescriptor({ numeric: true }),
                        roles: { "TargetValue2": true }
                    },
                    {
                        displayName: 'Minimum', queryName: 'Minimum', type: powerbi.ValueType.fromDescriptor({ numeric: true }),
                        roles: { "Minimum": true }
                    },
                    {
                        displayName: 'NeedsImprovement', queryName: 'NeedsImprovement', type: powerbi.ValueType.fromDescriptor({ numeric: true }),
                        roles: { "NeedsImprovement": true }
                    },
                    {
                        displayName: 'Satisfactory', queryName: 'Satisfactory', type: powerbi.ValueType.fromDescriptor({ numeric: true }),
                        roles: { "Satisfactory": true }
                    },
                    {
                        displayName: 'Good', queryName: 'Good', type: powerbi.ValueType.fromDescriptor({ numeric: true }),
                        roles: { "Good": true }
                    },
                    {
                        displayName: 'VeryGood', queryName: 'VeryGood', type: powerbi.ValueType.fromDescriptor({ numeric: true }),
                        roles: { "VeryGood": true }
                    },
                    {
                        displayName: 'Maximum', queryName: 'Maximum', type: powerbi.ValueType.fromDescriptor({ numeric: true }),
                        roles: { "Maximum": true }
                    }
                ]
            };

            let columns = [
                { source: dataViewMetadata.columns[1], values: this.sampleData[0] }, // Value
                { source: dataViewMetadata.columns[2], values: this.sampleData[1] }, // Target
                { source: dataViewMetadata.columns[3], values: this.sampleData[2] },
                { source: dataViewMetadata.columns[4], values: this.sampleData[3] },
                { source: dataViewMetadata.columns[5], values: this.sampleData[4] },
                { source: dataViewMetadata.columns[6], values: this.sampleData[5] },
                { source: dataViewMetadata.columns[7], values: this.sampleData[6] },
                { source: dataViewMetadata.columns[8], values: this.sampleData[7] },
                { source: dataViewMetadata.columns[9], values: this.sampleData[8] }
            ];

            let dataValues: DataViewValueColumns = DataViewTransform.createValueColumns(columns);

            return [{
                metadata: dataViewMetadata,
                categorical: {
                    categories: [{
                        source: dataViewMetadata.columns[0],
                        values: categoryValues,
                        identity: categoryIdentities,
                    }],
                    values: dataValues
                }
            }];
        }

        public randomize(): void {

            this.sampleData = this.sampleData.map((item, idx) => {
                return item.map(() => this.getRandomValue(this.sampleMins[idx], this.sampleMaxs[idx]));
            });
        }

    }
}